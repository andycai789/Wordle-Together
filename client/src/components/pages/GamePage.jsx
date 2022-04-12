import React from 'react'
import {useState, useEffect, useRef} from 'react'
import Game from '../Game.jsx'
import PlayerName from '../PlayerName.jsx'
import '../../css/GamePage.css';

const GamePage = ({socket, settings}) => {
    const [userInput, setUserInput] = useState({key: '', time: 0})
    const canType = useRef(false)
    const [currentPlayer, setCurrentPlayer] = useState('')

    const pressKey = (event) => {
        if (canType.current) {
            let key = (event instanceof KeyboardEvent) ? event.key.toUpperCase() : event.target.innerText.toUpperCase()
            socket.emit('key', key)
            setUserInput({key: key, time: event.timeStamp})
        }
    }

    const changeTyping = (status) => {
        canType.current = status
    }

    useEffect(() => {
        window.addEventListener('keydown', pressKey)
        socket.on('setCurrentPlayer', (name) => {
            setCurrentPlayer(name)
        })
      return () => {
            window.removeEventListener('keydown', pressKey)
      }
    }, [])

    return (
        <div className="gamePage">
            <div className="playerTurn">
                <PlayerName name={currentPlayer}/>
            </div>

            <Game 
                input={userInput} 
                rowLength={settings.rows} 
                colLength={settings.cols} 
                wordle={settings.wordle}
                wordList={new Set(settings.wordList)}
                handleKeyClick={pressKey}
                socket={socket}
                changeTyping={changeTyping}/>
        </div>
    )
}

export default GamePage