const wordGenerator = require('./wordGenerator.js')
const Wordle = require('./wordle.js')

const wordList = wordGenerator.getNLengthWordList(7)
let game = new Wordle(3, 7, 'GRAHAMS', wordList)

const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')

const port = process.env.PORT || 5000
const app = express()
const server = http.createServer(app)
const io = socketio(server)

// app.use(express.static(__dirname + "/../client/build"));
app.use(express.json())

// app.get('/', (req, res) => {
//   res.redirect('index.html')
// })

app.get('/settings', (req, res) => {
  let settings = {'rows': 3, 'cols': 7, 'wordle': 'GRAHAMS', 'wordList': wordList}
  res.send(settings)
})

io.on('connection', socket => {
  console.log("SERVER")
  console.log(socket.id)

  socket.on('key', key => {
    if (!game.isEndGame()) {
      let result = game.accept(key)
      console.log(game.getBoard())
      console.log(key)
      console.log(result)

      socket.broadcast.emit('board', game.getBoard())

    } else {
      console.log("GAME HAS ENDED NO MORE INPUTS")
    }
  })
})

server.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
