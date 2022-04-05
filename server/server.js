function randInt(lessThan) {
  return Math.floor(Math.random() * lessThan);
}

function getRandomWordle(wordList) {
  return wordList[randInt(wordList.length)].toUpperCase(); 
}

function getNLengthWordList(n) {
  const fs = require('fs')
  let rawData = fs.readFileSync(`wordLists/${n}words.json`)
  return JSON.parse(rawData)
}

const path = require('path');
const express = require('express');
const app = express();
const port = 5000;
const Wordle = require('./wordle.js')
let wordle = new Wordle(7, 7, 'GRAHAMS')


// app.use(express.static(__dirname + "/../client/build"));

// app.get('/', (req, res) => {
//   res.redirect('index.html')
// })

app.use(express.json());


app.get('/settings', (req, res) => {
  let wordList = getNLengthWordList(7)
  res.send({rows: 7, cols: 7, wordle: 'GRAHAMS'})
})

app.get('/board', (req, res) => {
  console.log(wordle.getBoard())
  res.send({board: wordle.getBoard()})
})

app.put('/input', (req, res) => {
  let inputKey = req.body.key
  console.log(inputKey)
  console.log("PRESSED")
  let result = wordle.accept(inputKey)
  res.send(JSON.stringify("Received post request"))
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})




