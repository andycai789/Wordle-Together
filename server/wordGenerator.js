function randInt(lessThan) {
    return Math.floor(Math.random() * lessThan);
  }
  
function getRandomWord(wordList) {
  return wordList[randInt(wordList.length)].toUpperCase(); 
}
  
function getNLengthWordList(n) {
  const fs = require('fs')
  let rawData = fs.readFileSync(`wordLists/${n}words.json`)
  return JSON.parse(rawData)
}

exports.getRandomWord = getRandomWord
exports.getNLengthWordList = getNLengthWordList