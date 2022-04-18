const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const WordleMultiplayer = require('./WordleMultiplayer.js')

const port = process.env.PORT || 5000
const app = express()
const server = http.createServer(app)
const io = socketio(server, {'pingInterval': 2000, 'pingTimeout': 3000})

const wmp = new WordleMultiplayer()

io.on('connection', socket => {
  console.log(socket.id + " connected") 

  socket.on('disconnect', () => {``
    console.log(socket.id + " disconnected")
    wmp.disconnectPlayer(io, socket)
    wmp.printMaps()
  })

  socket.on('createRoom', (playerName) => {
    wmp.emitCreateRoom(socket, playerName)
    wmp.printMaps()
    console.log(socket.id + " created a room")
  }) 

  socket.on('checkCode', (player, roomID) => {
    wmp.emitCodeResult(socket, player, roomID)
    wmp.printMaps()
  })

  socket.on('initialLobbySettings', () => {
    wmp.emitInitialLobbySettings(io, socket)
  })

  socket.on('newRowSelect', (newRow) => {
    wmp.emitNewRowFromLeader(io, socket, newRow)
  })

  socket.on('newColSelect', (newCol) => {
    wmp.emitNewColFromLeader(io, socket, newCol)
  })

  socket.on('startGame', () => {
    wmp.emitStartGame(io, socket)
  })  

  socket.on('initialGameSettings', () => {
    wmp.emitInitialGameSettings(io, socket)
  })

  socket.on('key', key => {
    wmp.emitNewKey(socket, key)
  })

  socket.on('nextPlayer', (row, col) => {
    wmp.emitNextPlayer(io, socket, row, col)
  })
})

server.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})


