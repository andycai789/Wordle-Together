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
    
    io.to("room" + socket.id).emit('startGameForPlayers', settings)
    io.to("room" + socket.id).emit('board', board.game.getBoard())
    io.to("room" + socket.id).emit('canType', true)
  })  

  socket.on('key', key => {
    let roomId = playerIDtoRoomID.get(socket.id)
    let game = roomIDToBoard.get(roomId).game

    if (!game.isEndGame()) { 
      let result = game.accept(key)
      console.log(game.getBoard())
      console.log(key)
      console.log(result)

      socket.to("room" + roomId).emit('board', game.getBoard())
    } else {
      console.log("GAME HAS ENDED NO MORE INPUTS")
    }
  })
})

server.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})


