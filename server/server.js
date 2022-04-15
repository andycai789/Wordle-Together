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
    wmp.emitCreateRoom(socket, playerName)
    wmp.printMaps()
    console.log(socket.id + " created a room")

  }) 

  socket.on('checkCode', (roomCode) => {
    wmp.emitRoomCode(socket, roomCode)
  })

  socket.on('joinRoom', (player, roomCode) => {
    wmp.emitJoinRoom(io, socket, player, roomCode)
    wmp.printMaps()
    console.log(player.name + " joined " + roomCode)
  })

  socket.on('newRowSelect', (newRow) => {
    wmp.emitNewRow(io, socket, newRow)
  })

  socket.on('newColSelect', (newCol) => {
    wmp.emitNewCol(io, socket, newCol)
  })

  socket.on('startGame', () => {
    wmp.emitStartGame(io, socket)
  })  

  socket.on('key', key => {
    wmp.emitNewKey(socket, key)
  })

  socket.on('nextPlayer', (row, col) => {
    // wmp.emitNextPlayer(io, socket, row, col)
    wmp.printMaps()
  })
})

server.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})


