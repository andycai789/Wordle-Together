const wordGenerator = require('./wordGenerator.js')
const Wordle = require('./wordle.js')
const WordleMultiplayer = require('./WordleMultiplayer.js')

const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const { createBrotliCompress } = require('zlib')

const port = process.env.PORT || 5000
const app = express()
const server = http.createServer(app)
const io = socketio(server, {'pingInterval': 2000, 'pingTimeout': 3000})

const wmp = new WordleMultiplayer()

io.on('connection', socket => {
  console.log(socket.id + " connected") 

  socket.on('disconnect', () => {
    console.log(socket.id + " disconnected")
    wmp.disconnectPlayer(io, socket)
    wmp.printMaps()
    // if (game !== undefined && board.curTurn === socket.id) {
    //   io.to("room" + roomId).emit("setCurrentPlayer", players[0].name)
    //   io.to(players[0].id).emit('canType', game.getRow(), game.getCol())
    //   board.curTurn = players[0].id
    // }

    // if (game !== undefined && game.isEndGame()) {
    //   while (!players[0].leader) {
    //     players.push(players.shift())
    //   }

    //   setTimeout( () => {
    //     io.to("room" + roomId).emit('returnToLobby')
    //   }, 1000)

    //   setTimeout( () => {
    //     io.to("room" + roomId).emit('players', players)
    //     io.to("room" + roomId).emit('changeCode', roomId)
    //     io.to(players[0].id).emit('isLeader')
    //   }, 1500)
    // }

  })

  socket.on('createRoom', (playerName) => {
    wmp.createRoom(socket, playerName)
    wmp.printMaps()
    console.log(socket.id + " created a room")

  }) 

  socket.on('checkCode', (roomCode) => {
    wmp.checkRoomCode(socket, roomCode)
  })

  socket.on('joinRoom', (player, roomCode) => {
    wmp.joinRoom(io, socket, player, roomCode)
    wmp.printMaps()
    console.log(player.name + " joined " + roomCode)
  })

  socket.on('newRowSelect', (newRow) => {
    wmp.emitNewRow(newRow)
  })

  socket.on('newColSelect', (newCol) => {
    wmp.emitNewRow(newCol)

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
    board.curTurn = socket.id
    
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
    let board = roomIDToBoard.get(roomId)
    let game = board.game
    let currentPlayer = players.shift()
    let nextPlayer = players.length == 0 ? currentPlayer : players[0]

    if (game.isEndGame()) {
      players.push(currentPlayer)
      printMaps()
      console.log("REACH END GAME")

      while (!players[0].leader) {
        players.push(players.shift())
      }

      setTimeout( () => {
        io.to("room" + roomId).emit('returnToLobby')
      }, 1000)

      setTimeout( () => {
        io.to("room" + roomId).emit('players', players)
        io.to("room" + roomId).emit('changeCode', roomId)
        io.to(players[0].id).emit('isLeader')
      }, 1500)

      return
    }

    io.to(nextPlayer.id).emit('canType', row, col)
    io.to("room" + roomId).emit('setCurrentPlayer', nextPlayer.name)
    board.curTurn = nextPlayer.id
    players.push(currentPlayer)
    printMaps()
  })
})

server.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})


