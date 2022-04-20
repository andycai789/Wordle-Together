import {React, useEffect, useState, useRef} from 'react'
import Box from './Box.jsx';

// the problem is that when you enter a correct word near the end, emitnextplayer is done twice


const Timer = ({socket, currentPlayer, getNextPlayer}) => {
    const [seconds, setSeconds] = useState(10)
    const inGame = useRef(true)

    useEffect(() => {
        socket.on('resetTimer', () => {
            setSeconds(10)
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
            if (seconds === 0 && inGame.current) {
                if (currentPlayer.id === socket.id) {
                    getNextPlayer()
                }
                return
            }

            if (seconds > 0) {
                setSeconds(seconds => seconds - 1)
            }
        }, 1000); 

        return () => {
            window.clearTimeout(timer);
        }
    }, [seconds])

    return (
        <div className="timer">
            <Box color='' letter={Math.floor(seconds / 10)}/>
            <Box color='' letter={seconds % 10}/>
        </div>
    )
}

export default Timer