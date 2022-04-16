import React from 'react'
import {useNavigate} from "react-router-dom";
import {useState, useEffect, useRef} from 'react'
import Game from '../Game.jsx'
import PlayerName from '../PlayerName.jsx'
import '../../css/GamePage.css';

const GamePage = ({socket, settings, permission, getPermission}) => {
    const [userInput, setUserInput] = useState({key: '', time: 0})
    const canType = useRef(false)
    const [currentPlayer, setCurrentPlayer] = useState('')
    const navigate = useNavigate()

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
        if (getPermission() !== 'game') {
            navigate('/', {replace: true})
            return
        }

        window.addEventListener('keydown', pressKey)
        socket.on('setCurrentPlayer', (name) => {
            setCurrentPlayer(name)
        })

        socket.on('returnToLobby', () => {
            permission.current = 'lobby'
            navigate('/lobby', {replace: true})
        })

        socket.emit('initialGameSettings')

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
                word={settings.word}
                wordList={new Set(settings.wordList)}
                handleKeyClick={pressKey}
                socket={socket}
                changeTyping={changeTyping}
            />
        </div>
    )
}

export default GamePage