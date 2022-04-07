import React from 'react'
import {useState, useEffect, useRef} from 'react'
import Game from './Game.jsx'

const GamePage = ({socket, settings}) => {
    const [userInput, setUserInput] = useState({key: '', time: 0})
    
    const pressKey = (event) => {
      let key = (event instanceof KeyboardEvent) ? event.key.toUpperCase() : event.target.innerText.toUpperCase()
      socket.emit('key', key)
      setUserInput({key: key, time: event.timeStamp})
    } 
  
    useEffect(() => {
        window.addEventListener('keydown', pressKey)
      return () => {
          window.removeEventListener('keydown', pressKey)
      }
    }, [])

    return (
        <div>
            <Game 
                input={userInput} 
                rowLength={settings.rows} 
                colLength={settings.cols} 
                wordle={settings.wordle}
                wordList={new Set(settings.wordList)}
                handleKeyClick={pressKey}
                socket={socket}/>
        </div>
    )
}

export default GamePage