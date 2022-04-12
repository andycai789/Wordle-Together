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

// app.use(express.static(__dirname + "/../client/build"));
// app.use(express.json())

const roomIDToPlayers = new Map()
const roomIDToBoard = new Map()
const playerIDtoRoomID = new Map()

io.on('connection', socket => {
  console.log(socket.id + " connected") 

  socket.on('createRoom', (playerName) => {
    roomIDToPlayers.set(socket.id, [{name: playerName, id: socket.id}])
    roomIDToBoard.set(socket.id, {rows: 5, cols: 5})
    playerIDtoRoomID.set(socket.id, socket.id)

    socket.join("room" + socket.id)
    socket.emit('isLeader')
    socket.emit('changeCode', socket.id)
    socket.emit('players', roomIDToPlayers.get(socket.id))

    console.log(socket.id + " created a room")
    console.log(roomIDToPlayers)
  }) 

  socket.on('checkCode', (roomCode) => {
    socket.emit('validRoomCode', roomIDToPlayers.has(roomCode))
  })

  socket.on('joinRoom', (player, roomCode) => {
    roomIDToPlayers.get(roomCode).push(player)
    playerIDtoRoomID.set(socket.id, roomCode)
    socket.join("room" + roomCode)
    socket.emit('changeCode', roomCode)
    
    io.to("room" + roomCode).emit('changeRowSelect', roomIDToBoard.get(roomCode).rows)
    io.to("room" + roomCode).emit('changeColSelect', roomIDToBoard.get(roomCode).cols)
    io.to("room" + roomCode).emit('players', roomIDToPlayers.get(roomCode))

    console.log(player.name + " joined " + roomCode)
    console.log(roomIDToPlayers)
    console.log(roomIDToBoard)
  })

  socket.on('newRowSelect', (newRow) => {
    roomIDToBoard.get(socket.id).rows = parseInt(newRow)
    io.to("room" + socket.id).emit('changeRowSelect', newRow)
  })

  socket.on('newColSelect', (newCol) => {
    roomIDToBoard.get(socket.id).cols = parseInt(newCol)
    io.to("room" + socket.id).emit('changeColSelect', newCol)
  })

  socket.on('startGame', () => {
    let name = roomIDToPlayers.get(socket.id)[0].name
    let board = roomIDToBoard.get(socket.id)
    let wordList = wordGenerator.getNLengthWordList(board.cols)
    let wordle = wordGenerator.getRandomWordle(wordList)
    let settings = {
      rows: board.rows, 
      cols: board.cols, 
      wordle: wordle, 
      wordList: wordList
    }

    board.game = new Wordle(settings)
    board.nextTurn = socket.id
    
    io.to("room" + socket.id).emit('startGameForPlayers', settings)
    io.to("room" + socket.id).emit('board', board.game.getBoard())
    io.to(socket.id).emit('canType', 0, 0)
    io.to("room" + socket.id).emit('setCurrentPlayer', name)
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

    console.log("NOT END GAME")

    if (players.length == 0) {
      io.to(nextPlayer.id).emit('canType', row, col)
    } else {
      socket.to(nextPlayer.id).emit('canType', row, col)
    }

    io.to("room" + roomId).emit('setCurrentPlayer', nextPlayer.name)
    console.log(nextPlayer.name)
    players.push(currentPlayer)
  })

})

server.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})


