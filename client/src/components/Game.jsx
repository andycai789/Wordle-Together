import React, { useState, useEffect, useRef } from 'react'

import Notification from './Notification.jsx'
import Board from './Board.jsx'
import Keyboard from './Keyboard.jsx'
  
const createMxNBoard = (m, n) => {
    return Array.from({length: m}, () => new Array(n).fill(
        {
            color: 'empty',
            letter: ''
        }
    ))
}

const Game = ({input, rowLength, colLength, wordle, handleKeyClick}) => {
    const [board, setBoard] = useState(createMxNBoard(rowLength, colLength))    
    // const [notification, setNotification] = useState({visible: false, message: 'empty'})

    useEffect(() => {

        // if my turn 
        if (inAlphabet(inputKey) && hasEmptyBox()) {
                addKeyToBoard(inputKey)
                moveToNextCol()
            } else if ((inputKey === 'BACKSPACE' || inputKey === 'DELETE') && this.isDeletable()) {
                removePrevKeyFromBoard()
                moveToPrevCol()
            }


        // if not my turn

        fetch('/board')
            .then(response => response.json())
            .then(data => {
                setBoard(data.board)})


    


  


        // const checkWinConditions = (newBoard) => {
        //     if (isWordle(newBoard[row.current], wordle)) {
        //         isEndGame.current = true
        //         setTimeout(() => {
        //             setNotification({visible: true, message: 'YOU WON'})
        //         }, 1500)
        //     } else if (row.current === rowLength - 1){
        //         isEndGame.current = true
        //         setTimeout(() => {
        //             setNotification({visible: true, message: 'YOU LOST'})
        //         }, 1500)
        //     }
        // }
       
    }, [input.time])

    return (
        <div>
            {/* <Notification notification={notification} hidePopUp={hidePopUp}/> */}
            <Board board={board}/>
            <Keyboard board={board} onKeyClick={handleKeyClick}/>
        </div>
    )
}

export default Game