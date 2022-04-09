const wordGenerator = require('./wordGenerator.js')
const Wordle = require('./wordle.js')

// const wordList = wordGenerator.getNLengthWordList(7)
// let game = new Wordle(3, 7, 'GRAHAMS', wordList)

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

io.on('connection', socket => {
  console.log(socket.id + " connected") 

  socket.on('createRoom', (playerName) => {
    console.log(socket.id + " created a room")
    socket.join(socket.id)

    if (!roomMap.has(socket.id)) {
      roomMap.set(socket.id, [{name: playerName, id: socket.id}])
    }

    socket.emit('checkIfClient', false)
    socket.emit('players', roomMap.get(socket.id))

    console.log(roomMap)
  }) 

  socket.on('checkCode', (roomCode) => {
    console.log(socket.id)
    socket.emit('validRoomCode', roomMap.has(roomCode))
  })

  socket.on('joinRoom', (player, roomCode) => {
    console.log(player.name + " is trying to join the room")
    socket.join(roomCode)

    if (roomMap.has(roomCode)) {
      roomMap.get(roomCode).push(player)
    }

    socket.emit('changeCode', roomCode)
    io.to(roomCode).emit('players', roomMap.get(roomCode))

    console.log(roomMap)
  })

  socket.on('newRowSelect', (newRow) => {
    io.to(socket.id).emit('changeRowSelect', newRow)
  })

  socket.on('newColSelect', (newCol) => {
    io.to(socket.id).emit('changeColSelect', newCol)
  })

  socket.on('startGame', (rowInput, colInput) => {
    let wordList = wordGenerator.getNLengthWordList(colInput)
    let wordle = wordGenerator.getRandomWordle(wordList)

    let settings = {
      rows: parseInt(rowInput), 
      cols: parseInt(colInput), 
      wordle: wordle, 
      wordList: wordList
    }
    io.to(socket.id).emit('changeSettings', settings)
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


