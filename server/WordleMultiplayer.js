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

    return playerList.splice(indexOfPlayer, 1)[0]
  }

  removeLobby(roomID, playerID) {
    this.removeRoomID(roomID)
    this.removePlayerID(playerID)
  }

  removeLeader(io, playerID, players) {
    players[0].leader = true
    io.to(players[0].id).emit('isLeader')
    this.removePlayer(io, playerID, players)
  }

  removePlayer(io, playerID, players) {
    const roomID = this.getRoomID(playerID)
    this.removePlayerID(playerID)
    io.to("room" + roomID).emit('players', players)
  }

  disconnectPlayer(io, socket) {
    if (!this.belongsToRoom(socket)) {
      console.log(socket.id + " does not belong to any room")
      return
    }

    const roomID = this.getRoomID(socket.id)
    const players = this.getPlayers(roomID)
    const player = this.removePlayerFromList(socket.id, players)
    const game = this.getGame(roomID)
    const wordle = game.wordle

    if (player.leader) {
      if (players.length === 0) {
        this.removeLobby(roomID, socket.id)
        return
      } 
      else {
        this.removeLeader(io, socket.id, players)
      }
    } 
    else {
      this.removePlayer(io, socket.id, players)
    }

  }

  addLeaderToMaps(socket, playerName) {
    this.roomIDtoPlayers.set(socket.id, [{name: playerName, id: socket.id, leader: true}])
    this.roomIDtoGame.set(socket.id, {rows: 5, cols: 5})
    this.playerIDtoRoomID.set(socket.id, socket.id)
  }

  emitLeaderSettings(socket) {
    socket.join("room" + socket.id)
    socket.emit('isLeader')
    socket.emit('changeCode', socket.id)
    socket.emit('players', this.getPlayers(socket.id))
  }

  emitCreateRoom(socket, playerName) {
    this.addLeaderToMaps(socket, playerName)
    this.emitLeaderSettings(socket)
  }

  emitRoomCode(socket, roomCode) {
    socket.emit('validRoomCode', this.roomIDtoPlayers.has(roomCode))
  }

  emitPlayerSettings(socket, roomCode) {
    socket.join("room" + roomCode)
    socket.emit('changeCode', roomCode)
    socket.emit('changeRowSelect', this.getGame(roomCode).rows)
    socket.emit('changeColSelect', this.getGame(roomCode).cols)
  }

  emitJoinRoom(io, socket, player, roomCode) {
    this.getPlayers(roomCode).push(player)
    this.playerIDtoRoomID.set(socket.id, roomCode)
    this.emitPlayerSettings(socket, roomCode)
    io.to("room" + roomCode).emit('players', this.getPlayers(roomCode))
  }

  emitNewRow(io, socket, newRow) {
    const roomID = this.getRoomID(socket.id)
    this.getGame(roomID).rows = parseInt(newRow)
    io.to("room" + roomID).emit('changeRowSelect', newRow)
  }

  emitNewCol(io, socket, newCol) {
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
    game.wordle = new Wordle(settings)
    game.curTurn = playerID
  }

  emitGameSettings(io, socket, roomID, settings) {
    const board = this.getGame(roomID).wordle.getBoard()
    io.to("room" + roomID).emit('startGameForPlayers', settings)
    io.to("room" + roomID).emit('board', board)
    io.to("room" + roomID).emit('setCurrentPlayer', this.getFirstPlayerName(roomID))
    io.to(socket.id).emit('canType', 0, 0)
  }

  emitStartGame(io, socket) {
    const roomID = this.getRoomID(socket.id)
    const settings = this.getSettings(roomID)
    this.createNewWordle(roomID, socket.id, settings)
    this.emitGameSettings(io, socket, roomID, settings)
  }

  emitNewKey(socket, key) {
    const roomID = this.getRoomID(socket.id)
    const wordle = this.getGame(roomID).wordle

    if (!wordle.isEndGame()) { 
      let result = wordle.accept(key)
      socket.to("room" + roomID).emit('board', wordle.getBoard())
    }
  }

  emitNextPlayer(io, socket, row, col) {
    const roomID = this.getRoomID(socket.id)
    const players = this.getPlayers(roomID)

    const game = roomIDToGame.get(roomID)
    const wordle = game.wordle

    const currentPlayer = players.shift()
    const nextPlayer = players.length == 0 ? currentPlayer : players[0]

    if (game.isEndGame()) {
      players.push(currentPlayer)
      printMaps()
      console.log("REACH END GAME")

      while (!players[0].leader) {
        players.push(players.shift())
      }

      // setTimeout( () => {
      //   io.to("room" + roomId).emit('returnToLobby')
      // }, 1000)

      // setTimeout( () => {
      //   io.to("room" + roomId).emit('players', players)
      //   io.to("room" + roomId).emit('changeCode', roomId)
      //   io.to(players[0].id).emit('isLeader')
      // }, 1500)

      return
    }

    io.to(nextPlayer.id).emit('canType', row, col)
    io.to("room" + roomId).emit('setCurrentPlayer', nextPlayer.name)
    game.curTurn = nextPlayer.id
    players.push(currentPlayer)
  }

  emitNextPlayerSettings() {

  }



}

module.exports = WordleMultiplayer