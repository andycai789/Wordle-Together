import {React, useEffect, useState, useRef} from 'react'
import Box from './Box.jsx';

const Timer = ({maxTime, socket, currentPlayer, getNextPlayer, changeTyping}) => {
    const [playerSeconds, setPlayerSeconds] = useState(maxTime)
    const [timerSeconds, setTimerSeconds] = useState(maxTime + 1)
    const inGame = useRef(true)

    useEffect(() => {
        socket.on('resetTimer', () => {
            setPlayerSeconds(maxTime)
            setTimerSeconds(maxTime + 1)
        })

        socket.on('endGame', () => {
            inGame.current = false
        })
    }, [])

    useEffect(() => {
        if (!inGame.current) {
            return
        }

        const timer = setTimeout(function() {
            if (playerSeconds === 0) {
                changeTyping(false)
            } else {
                setPlayerSeconds(seconds => seconds - 1)
            }

            if (timerSeconds === 0 && currentPlayer.id === socket.id) {
                getNextPlayer()
            } else {
                setTimerSeconds(seconds => seconds - 1)
            }

            console.log("Player: "  + playerSeconds)
            console.log("Timer: " + timerSeconds)
            console.log(socket.id  === currentPlayer.id)

        }, 1000); 

        return () => {
            window.clearTimeout(timer);
        }
    }, [playerSeconds, timerSeconds])

    return (
        <div className="timer">
            <Box color='' letter={Math.floor(playerSeconds / 10)}/>
            <Box color='' letter={playerSeconds % 10}/>
        </div>
    )
}

export default Timer