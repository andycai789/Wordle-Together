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

exports.getRandomWordle = getRandomWordle
exports.getNLengthWordList = getNLengthWordList