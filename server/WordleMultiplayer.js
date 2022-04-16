const wordGenerator = require('./wordGenerator.js')
const Wordle = require('./wordle.js')

class WordleMultiplayer {
  constructor() {
    this.roomIDtoPlayers = new Map()
    this.roomIDtoGame = new Map()
    this.playerIDtoRoomID = new Map()
  }

  printMaps() {
    console.log("\nRoom ID to Players")
    console.log(this.roomIDtoPlayers)
    console.log("\nRoom ID to Game")
    console.log(this.roomIDtoGame)
    console.log("\nPlayer ID to Room ID")
    console.log(this.playerIDtoRoomID)
  }

  getPlayers(roomID) {
    return this.roomIDtoPlayers.get(roomID)
  }
  
  getGame(roomID) {
    return this.roomIDtoGame.get(roomID)
  }
  
  getRoomID(playerID) {
    return this.playerIDtoRoomID.get(playerID)
  }

  removeRoomID(roomID) {
    this.roomIDtoPlayers.delete(roomID)
    this.roomIDtoGame.delete(roomID)
  }

  removePlayerID(playerID) {
    this.playerIDtoRoomID.delete(playerID)
  }

  belongsToRoom(socket) {
    return this.playerIDtoRoomID.has(socket.id)
  }

  removePlayerFromList(playerID, playerList) {
    const indexOfPlayer = playerList.findIndex(player => player.id === playerID)
    
    return {isLeader: playerList.splice(indexOfPlayer, 1)[0].leader, index: indexOfPlayer}
  }

  removeLobby(roomID, playerID) {
    this.removeRoomID(roomID)
    this.removePlayerID(playerID)
  }

  removePlayer(io, playerID, players, removedPlayerIsLeader) {
    if (removedPlayerIsLeader) {
      io.to(players[0].id).emit('isLeader')
      players[0].leader = true
    }

    const roomID = this.getRoomID(playerID)
    this.removePlayerID(playerID)
    io.to("room" + roomID).emit('players', players)
  }

  handleDCInGame(io, roomID, dcPlayerIndex) {
    const game = this.getGame(roomID)
    const players = this.getPlayers(roomID)

    if (game.wordle.isEndGame()) {
      this.pushLeaderToTop(this.getPlayers(roomID))
      this.emitNavigateToLobby(io, roomID, players)
      game.inLobby = true
    } else if (dcPlayerIndex === 0) {
      io.to("room" + roomID).emit("setCurrentPlayer", players[0].name)
      io.to(players[0].id).emit('canType', game.wordle.getRow(), game.wordle.getCol())
    }
  }

  disconnectPlayer(io, socket) {
    if (!this.belongsToRoom(socket)) {
      console.log(socket.id + " does not belong to any room")
      return
    }

    const roomID = this.getRoomID(socket.id)
    const players = this.getPlayers(roomID)
    const removedPlayer = this.removePlayerFromList(socket.id, players)

    if (players.length === 0) {
      this.removeLobby(roomID, socket.id)
      return
    } 

    this.removePlayer(io, socket.id, players, removedPlayer.isLeader)

    if (!this.getGame(roomID).inLobby) {
      this.handleDCInGame(io, roomID, removedPlayer.index)
    }
  }

  addLeaderToMaps(socket, playerName) {
    this.roomIDtoPlayers.set(socket.id, [{name: playerName, id: socket.id, leader: true}])
    this.roomIDtoGame.set(socket.id, {inLobby: true, rows: 5, cols: 5})
    this.playerIDtoRoomID.set(socket.id, socket.id)
  }

  emitCreateRoom(socket, playerName) {
    this.addLeaderToMaps(socket, playerName)
    socket.join("room" + socket.id)
  }

  emitIfRoomCodeValid(socket, roomID) {
    const isValidID = this.roomIDtoPlayers.has(roomID) && 
                      this.getGame(roomID).inLobby
    socket.emit('validRoomCode', isValidID)
  }

  emitJoinRoom(socket, player, roomID) {
    this.getPlayers(roomID).push(player)
    this.playerIDtoRoomID.set(socket.id, roomID)
    socket.join("room" + roomID)
  }

  emitInitialLobbySettings(io, socket) {
    const roomID = this.getRoomID(socket.id)
    const players = this.getPlayers(roomID)
    socket.emit('changeCode', roomID)
    socket.emit('changeRowSelect', this.getGame(roomID).rows)
    socket.emit('changeColSelect', this.getGame(roomID).cols)
    io.to(players[0].id).emit('isLeader')
    io.to("room" + roomID).emit('players', players)
  }

  emitNewRowFromLeader(io, socket, newRow) {
    const roomID = this.getRoomID(socket.id)
    this.getGame(roomID).rows = parseInt(newRow)
    io.to("room" + roomID).emit('changeRowSelect', newRow)
  }

  emitNewColFromLeader(io, socket, newCol) {
    const roomID = this.getRoomID(socket.id)
    this.getGame(roomID).cols = parseInt(newCol)
    io.to("room" + roomID).emit('changeColSelect', newCol)
  }

  getSettings(roomID) {
    const game = this.getGame(roomID)
    const wordList = wordGenerator.getNLengthWordList(game.cols)
    const word = wordGenerator.getRandomWord(wordList)
    console.log(word)

    return {
      rows: game.rows, 
      cols: game.cols, 
      word: word, 
      wordList: wordList
    }
  }

  getFirstPlayerName(roomID) {
    return this.getPlayers(roomID)[0].name
  }

  createNewWordle(roomID, playerID, settings) {
    const game = this.getGame(roomID)
    game.inLobby = false
    game.wordle = new Wordle(settings)
  }

  emitStartGame(io, socket) {
    const roomID = this.getRoomID(socket.id)
    const settings = this.getSettings(roomID)
    this.createNewWordle(roomID, socket.id, settings)
    io.to("room" + roomID).emit('startGameForPlayers', settings)
  }

  emitInitialGameSettings(io, socket) {
    const roomID = this.getRoomID(socket.id)
    const players = this.getPlayers(roomID)
    const board = this.getGame(roomID).wordle.getBoard()
    io.to("room" + roomID).emit('setCurrentPlayer', this.getFirstPlayerName(roomID))
    io.to("room" + roomID).emit('board', board)
    io.to(players[0].id).emit('canType', 0, 0)
  }

  emitNewKey(socket, key) {
    const roomID = this.getRoomID(socket.id)
    const wordle = this.getGame(roomID).wordle

    if (!wordle.isEndGame()) { 
      let result = wordle.accept(key)
      // console.log(result)
      socket.to("room" + roomID).emit('board', wordle.getBoard())
    }
  }

  pushLeaderToTop(players) {
    while (!players[0].leader) {
      players.push(players.shift())
    }
  }

  emitNavigateToLobby(io, roomID) {
      setTimeout( () => {
        io.to("room" + roomID).emit('returnToLobby')
      }, 1000)
  }

  emitNextPlayerSettings(io, nextPlayer, row, col) {
    const roomID = this.getRoomID(nextPlayer.id)
    io.to(nextPlayer.id).emit('canType', row, col)
    io.to("room" + roomID).emit('setCurrentPlayer', nextPlayer.name)
  }

  emitNextPlayer(io, socket, row, col) {
    const roomID = this.getRoomID(socket.id)
    const players = this.getPlayers(roomID)

    const game = this.getGame(roomID)
    const wordle = game.wordle

    const currentPlayer = players.shift()
    const nextPlayer = players.length == 0 ? currentPlayer : players[0]
    players.push(currentPlayer)

    if (wordle.isEndGame()) {
      this.pushLeaderToTop(players)
      this.emitNavigateToLobby(io, roomID)
      game.inLobby = true

      this.printMaps()
      console.log("REACH END GAME")
      return
    }

    this.emitNextPlayerSettings(io, nextPlayer, row, col)
  }
}

module.exports = WordleMultiplayer