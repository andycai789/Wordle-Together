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
const wordList = getNLengthWordList(7)
const Wordle = require('./wordle.js')
let wordle = new Wordle(3, 7, 'GRAHAMS', wordList)


// app.use(express.static(__dirname + "/../client/build"));

// app.get('/', (req, res) => {
//   res.redirect('index.html')
// })

app.use(express.json());


app.get('/settings', (req, res) => {
  let settings = {'rows': 3, 'cols': 7, 'wordle': 'GRAHAMS', 'wordList': wordList}
  res.send(settings)
})

app.get('/board', (req, res) => {
  console.log(wordle.getBoard())
  res.send({board: wordle.getBoard()})
})

app.put('/input', (req, res) => {

  if (!wordle.isEndGame()) {
    let inputKey = req.body.key
    let result = wordle.accept(inputKey)
    console.log(wordle.getBoard())
    console.log(inputKey)
    console.log(result)
  } else {
    console.log("GAME HAS ENDED NO MORE INPUTS")
  }

  res.send(JSON.stringify("Received post request"))
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})




