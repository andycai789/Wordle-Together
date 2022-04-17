import React from 'react'
import {useNavigate} from "react-router-dom";
import {useState, useEffect, useRef} from 'react'
import Game from '../Game.jsx'
import ColoredRow from '../ColoredRow.jsx';
import '../../css/GamePage.css';
import Notification from '../Notification.jsx'

const GamePage = ({socket, settings, permission, getPermission}) => {
    const [userInput, setUserInput] = useState({key: '', time: 0})
    const [currentPlayer, setCurrentPlayer] = useState('')
    const canType = useRef(false)
    const navigate = useNavigate()

    const message = useRef('')
    const [visible, setVisible] = useState(false)

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

    const onMessage = (newMessage) => {
        message.current = newMessage
        setVisible(true)
        setTimeout(() => setVisible(false), 2000)
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

        socket.on('gameResult', (message) => {
            onMessage(message)
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
            <div className='notificationMessage'>
                <Notification visible={visible} message={message.current} position='top-center'/>
            </div>

            <div className="playerTurn">
                <ColoredRow name={currentPlayer} colors={'xxxxxx'}/>
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
                handleMessage={onMessage}
            />
        </div>
    )
}

export default GamePage