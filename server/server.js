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

const roomMap = new Map()
const boardMap = new Map()

io.on('connection', socket => {
  console.log(socket.id + " connected") 

  socket.on('createRoom', (playerName) => {
    roomMap.set(socket.id, [{name: playerName, id: socket.id}])
    boardMap.set(socket.id, {rows: 5, cols: 5})

    socket.emit('isLeader')
    socket.emit('changeCode', socket.id)
    socket.emit('players', roomMap.get(socket.id))

    console.log(socket.id + " created a room")
    console.log(roomMap)
  }) 

  socket.on('checkCode', (roomCode) => {
    socket.emit('validRoomCode', roomMap.has(roomCode))
  })

  socket.on('joinRoom', (player, roomCode) => {
    roomMap.get(roomCode).push(player)
    socket.join(roomCode)
    socket.emit('changeCode', roomCode)
    
    io.to(roomCode).emit('changeRowSelect', boardMap.get(roomCode).rows)
    io.to(roomCode).emit('changeColSelect', boardMap.get(roomCode).cols)
    io.to(roomCode).emit('players', roomMap.get(roomCode))

    console.log(player.name + " joined " + roomCode)
    console.log(roomMap)
    console.log(boardMap)
  })

  socket.on('newRowSelect', (newRow) => {
    boardMap.get(socket.id).rows = parseInt(newRow)
    io.to(socket.id).emit('changeRowSelect', newRow)
  })

  socket.on('newColSelect', (newCol) => {
    boardMap.get(socket.id).cols = parseInt(newCol)
    io.to(socket.id).emit('changeColSelect', newCol)
  })

  socket.on('startGame', () => {
    let board = boardMap.get(socket.id)
    let wordList = wordGenerator.getNLengthWordList(board.cols)
    let wordle = wordGenerator.getRandomWordle(wordList)
    let settings = {
      rows: board.rows, 
      cols: board.cols, 
      wordle: wordle, 
      wordList: wordList
    }

    board.game = new Wordle(settings)
    
    io.to(socket.id).emit('startGameForPlayers', settings)
    io.to(socket.id).emit('board', board.game.getBoard())
  })  

  // socket.on('key', key => {
  //   if (!game.isEndGame()) { 
  //     let result = game.accept(key)
  //     console.log(game.getBoard())
  //     console.log(key)
  //     console.log(result)

  //     socket.broadcast.emit('board', game.getBoard())

  //   } else {
  //     console.log("GAME HAS ENDED NO MORE INPUTS")
  //   }
  // })

  // socket.on('onGamePage', (x) => {
  //   console.log(x)
  //   socket.emit('settings', 
  //     {rows: 3, cols: 7, wordle: 'GRAHAMS', wordList: wordList})
  // })

})

server.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})


