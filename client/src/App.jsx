import { useState, useEffect } from 'react'
import Header from './components/Header.jsx'
import Game from './components/Game.jsx'

import {io} from 'socket.io-client'

const socket = io()

socket.on('connect', () => {
  console.log(socket.id)
})



function App({rows, columns, wordle, wordList}) {
  const [userInput, setUserInput] = useState({key: '', time: 0})

  const pressKey = (event) => {
    let key = (event instanceof KeyboardEvent) ? event.key.toUpperCase() : event.target.innerText.toUpperCase()
    socket.emit('key', key)
    setUserInput({key: key, time: event.timeStamp})
  } 

  useEffect(() => {
    console.log(wordle)

    window.addEventListener('keydown', pressKey)

    return () => {
        window.removeEventListener('keydown', pressKey)
    }
  }, [])

  return (
    <div className='App'>
      <Header/>
      <Game input={userInput} 
            rowLength={rows} 
            colLength={columns} 
            wordle={wordle}
            handleKeyClick={pressKey}
            wordList={wordList}
            socket={socket}/>
    </div>
  )
}

export default App



