class WordleMultiplayer {
  constructor() {
    this.roomIDtoPlayers = new Map()
    this.roomIDtoBoard = new Map()
    this.playerIDtoRoomID = new Map()
    this.x = 0;
  }

  printMaps() {
    console.log("\nRoom ID to Players")
    console.log(this.roomIDtoPlayers)
    console.log("\nRoom ID to Board")
    console.log(this.roomIDtoBoard)
    console.log("\nPlayer ID to Room ID")
    console.log(this.playerIDtoRoomID)
  }

  getPlayers(roomID) {
    return this.roomIDtoPlayers.get(roomID)
  }
  
  getBoard(roomID) {
    return this.roomIDtoBoard.get(roomID)
  }
  
  getRoomID(playerID) {
    return this.playerIDtoRoomID.get(playerID)
  }

  removeRoomID(roomID) {
    this.roomIDtoPlayers.delete(roomID)
    this.roomIDtoBoard.delete(roomID)
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
    const board = this.getBoard(roomID)
    const game = board.game

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
    this.roomIDtoBoard.set(socket.id, {rows: 5, cols: 5})
    this.playerIDtoRoomID.set(socket.id, socket.id)
  }

  emitLeaderSettings(socket) {
    socket.join("room" + socket.id)
    socket.emit('isLeader')
    socket.emit('changeCode', socket.id)
    socket.emit('players', this.getPlayers(socket.id))
  }

  createRoom(socket, playerName) {
    this.addLeaderToMaps(socket, playerName)
    this.emitLeaderSettings(socket)
  }

  checkRoomCode(socket, roomCode) {
    socket.emit('validRoomCode', this.roomIDtoPlayers.has(roomCode))
  }

  emitPlayerSettings(socket, roomCode) {
    socket.join("room" + roomCode)
    socket.emit('changeCode', roomCode)
    socket.emit('changeRowSelect', this.getBoard(roomCode).rows)
    socket.emit('changeColSelect', this.getBoard(roomCode).cols)
  }

  joinRoom(io, socket, player, roomCode) {
    this.getPlayers(roomCode).push(player)
    this.playerIDtoRoomID.set(socket.id, roomCode)
    this.emitPlayerSettings(socket, roomCode)
    io.to("room" + roomCode).emit('players', this.getPlayers(roomCode))
  }

  emitNewRow(newRow) {
    const roomId = playerIDtoRoomID.get(socket.id)
    roomIDToBoard.get(roomId).rows = parseInt(newRow)
    io.to("room" + roomId).emit('changeRowSelect', newRow)
  }

  emitNewCol(newCol) {
    const roomId = playerIDtoRoomID.get(socket.id)
    roomIDToBoard.get(roomId).cols = parseInt(newCol)
    io.to("room" + roomId).emit('changeColSelect', newCol)
  }


}

module.exports = WordleMultiplayer