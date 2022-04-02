import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import reportWebVitals from './reportWebVitals'

function randInt(lessThan) {
  return Math.floor(Math.random() * lessThan);
}

function getRandomNLetterWordle(wordList) {
  return wordList[randInt(wordList.length)].toUpperCase(); 
}

let wordleLength = 5
let randomWord = require('random-words')
let filteredWordList = randomWord.wordList.filter(word => word.length === wordleLength)
let wordle = getRandomNLetterWordle(filteredWordList)

ReactDOM.render(
  <React.StrictMode>
    <App rows={5} columns={5} wordle={wordle} wordList={randomWord.wordList}/>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
