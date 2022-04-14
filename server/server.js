const wordGenerator = require('./wordGenerator.js')
const Wordle = require('./wordle.js')

const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')

const port = process.env.PORT || 5000
const app = express()
const server = http.createServer(app)
const io = socketio(server)

const roomIDToPlayers = new Map()
const roomIDToBoard = new Map()
const playerIDtoRoomID = new Map()

function printMaps() {
  console.log("\nRoom ID to Players")
  console.log(roomIDToPlayers)
  console.log("\nRoom ID to Board")
  console.log(roomIDToBoard)
  console.log("\nPlayer ID to Room ID")
  console.log(playerIDtoRoomID)
}

io.on('connection', socket => {
  console.log(socket.id + " connected") 
  
  socket.on('disconnect', () => {
    console.log(socket.id + " disconnected")
    const roomId = playerIDtoRoomID.get(socket.id)

    if (roomId === undefined) {
      console.log(socket.id + " NOT IN ANYTHING YET")
      return
    }

    const players = roomIDToPlayers.get(roomId)
    const indexOfPlayer = players.findIndex(player => player.id === socket.id)
    const player = players.splice(indexOfPlayer, 1)[0]

    if (player.leader) {
      if (players.length === 0) {
        roomIDToPlayers.delete(socket.id)
        roomIDToBoard.delete(socket.id)
        playerIDtoRoomID.delete(socket.id)
        printMaps()
      } 
      else {
        players[0].leader = true
        playerIDtoRoomID.delete(socket.id)
        io.to(players[0].id).emit('isLeader')
        io.to("room" + roomId).emit('players', players)
        printMaps()
      }
    } else {
      playerIDtoRoomID.delete(socket.id)
      io.to("room" + roomId).emit('players', players)
      printMaps()
    }
  })

  socket.on('createRoom', (playerName) => {
    roomIDToPlayers.set(socket.id, [{name: playerName, id: socket.id, leader: true}])
    roomIDToBoard.set(socket.id, {rows: 5, cols: 5})
    playerIDtoRoomID.set(socket.id, socket.id)

    socket.join("room" + socket.id)
    socket.emit('isLeader')
    socket.emit('changeCode', socket.id)
    socket.emit('players', roomIDToPlayers.get(socket.id))

    printMaps()
    console.log(socket.id + " created a room")
  }) 

  socket.on('checkCode', (roomCode) => {
    socket.emit('validRoomCode', roomIDToPlayers.has(roomCode))
  })

  socket.on('joinRoom', (player, roomCode) => {
    roomIDToPlayers.get(roomCode).push(player)
    playerIDtoRoomID.set(socket.id, roomCode)
    socket.join("room" + roomCode)
    socket.emit('changeCode', roomCode)
    socket.emit('changeRowSelect', roomIDToBoard.get(roomCode).rows)
    socket.emit('changeColSelect', roomIDToBoard.get(roomCode).cols)
    
    io.to("room" + roomCode).emit('players', roomIDToPlayers.get(roomCode))

    printMaps()
    console.log(player.name + " joined " + roomCode)
  })

  socket.on('newRowSelect', (newRow) => {
    const roomId = playerIDtoRoomID.get(socket.id)
    roomIDToBoard.get(roomId).rows = parseInt(newRow)
    io.to("room" + roomId).emit('changeRowSelect', newRow)
  })

  socket.on('newColSelect', (newCol) => {
    const roomId = playerIDtoRoomID.get(socket.id)
    roomIDToBoard.get(roomId).cols = parseInt(newCol)
    io.to("room" + roomId).emit('changeColSelect', newCol)
  })

  socket.on('startGame', () => {
    let roomId = playerIDtoRoomID.get(socket.id)
    let name = roomIDToPlayers.get(roomId)[0].name
    let board = roomIDToBoard.get(roomId)
    let wordList = wordGenerator.getNLengthWordList(board.cols)
    let wordle = wordGenerator.getRandomWordle(wordList)
    let settings = {
      rows: board.rows, 
      cols: board.cols, 
      wordle: wordle, 
      wordList: wordList
    }

    console.log(wordle)
    
    board.game = new Wordle(settings)
    board.nextTurn = socket.id
    
    io.to("room" + roomId).emit('startGameForPlayers', settings)
    io.to("room" + roomId).emit('board', board.game.getBoard())
    io.to("room" + roomId).emit('setCurrentPlayer', name)
    io.to(socket.id).emit('canType', 0, 0)
  })  

  socket.on('key', key => {
    let roomId = playerIDtoRoomID.get(socket.id)
    let game = roomIDToBoard.get(roomId).game

    if (!game.isEndGame()) { 
      let result = game.accept(key)
      socket.to("room" + roomId).emit('board', game.getBoard())
    }
  })

  socket.on('nextPlayer', (row, col) => {
    let roomId = playerIDtoRoomID.get(socket.id)
    let players = roomIDToPlayers.get(roomId)
    let game = roomIDToBoard.get(roomId).game
    let currentPlayer = players.shift()
    let nextPlayer = players.length == 0 ? currentPlayer : players[0]

    if (game.isEndGame()) {
      console.log("REACH END GAME")
      // notify returning to lobby
      // clean up game for next round
      return
    }

    if (players.length == 0) {
      io.to(nextPlayer.id).emit('canType', row, col)
    } else {
      socket.to(nextPlayer.id).emit('canType', row, col)
    }

    io.to("room" + roomId).emit('setCurrentPlayer', nextPlayer.name)
    players.push(currentPlayer)
  })
})

server.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})


