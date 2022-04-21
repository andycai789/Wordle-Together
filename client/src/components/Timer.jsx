import {React, useEffect, useState, useRef} from 'react'
import Box from './Box.jsx';

const Timer = ({maxTime, socket, currentPlayer, getNextPlayer, changeTyping, alreadyEmit}) => {
    const [playerSeconds, setPlayerSeconds] = useState(maxTime)
    const [timerSeconds, setTimerSeconds] = useState(maxTime + 1)
    const inGame = useRef(true)
    const runOnce = useRef(true)

    useEffect(() => {
        socket.on('resetTimer', () => {
            setPlayerSeconds(maxTime)
            setTimerSeconds(maxTime + 1)
            runOnce.current = true
        })

        socket.on('endGame', () => {
            inGame.current = false
        })
    }, [])

    useEffect(() => {
        if (!inGame.current) {
            return
        }

        const timer = setTimeout(() => {
            if (playerSeconds === 0 ) {
                if (runOnce.current) {
                    changeTyping(false)
                    runOnce.current = false
                }
            } else {
                setPlayerSeconds(seconds => seconds - 1)
            }

            if (timerSeconds === 0) {
                if (!alreadyEmit && currentPlayer.id === socket.id) {
                    getNextPlayer()
                }
            } else {
                setTimerSeconds(seconds => seconds - 1)
            }
        }, 1000); 

        return () => {
            window.clearTimeout(timer);
        }
    }, [timerSeconds])

    return (
        <div className="timer">
            <Box color='' letter={Math.floor(playerSeconds / 10)}/>
            <Box color='' letter={playerSeconds % 10}/>
        </div>
    )
}

export default Timer