import React, { useState, useEffect, useRef } from 'react'

import Notification from './Notification.jsx'
import Board from './Board.jsx'
import Keyboard from './Keyboard.jsx'

const inAlphabet = (key) => {    
    const charCode = key.toUpperCase().charCodeAt(0)
    return (key.length === 1) && (charCode > 64) && (charCode < 91) 
}

const convertBoardRowToString = boardRow => {
    return boardRow.map(col => col.letter).join('')
}

const inWordList = (boardRow, wordList) => {
    return wordList.includes(convertBoardRowToString(boardRow).toLowerCase())
}

const isWordle = (boardRow, wordle) => {
    return convertBoardRowToString(boardRow) === wordle.toUpperCase();
}

const isDeletable = (column) => {
    return column > 0
}
  
const hasFilledRow = (column, maxColumn) => {
    return column === maxColumn
}
  
const hasEmptyBox = (column, maxColumn) => {
    return column < maxColumn
}

const createMxNBoard = (m, n) => {
    return Array.from({length: m}, () => new Array(n).fill(
        {
            color: 'empty',
            letter: ''
        }
    ))
}

const setGreenBoxes = (map, boardRow, wordle) => {
    for (let i = 0; i < boardRow.length; i++) {        
        if (boardRow[i].letter === wordle[i]) {
            boardRow[i].color = 'green'
            map.get(boardRow[i].letter).val--
        } 
    }
}

const setYellowBoxes = (map, boardRow) => {
    for (let i = 0; i < boardRow.length; i++) {
        if (boardRow[i].color !== 'green' && map.has(boardRow[i].letter) && map.get(boardRow[i].letter).val > 0) {
            boardRow[i].color = 'yellow'
            map.get(boardRow[i].letter).val--
        }
    }
}

const setGreyBoxes = (boardRow) => {
    for (let i = 0; i < boardRow.length; i++) {
        if (boardRow[i].color === 'empty') {
            boardRow[i].color = 'gray'
        }
    }
}

const changeColorsInRow = (boardRow, wordle) => {
    let map = new Map();
    for (let i = 0; i < wordle.length; i++) {
        if (!map.has(wordle[i])) {
            map.set(wordle[i], {val: 1})
        } else {
            map.get(wordle[i]).val++
        }
    }
    setGreenBoxes(map, boardRow, wordle)
    setYellowBoxes(map, boardRow)
    setGreyBoxes(map, boardRow)
}
  
const Game = ({input, rowLength, colLength, wordle, handleKeyClick, wordList}) => {
    const [board, setBoard] = useState(createMxNBoard(rowLength, colLength))    
    const [notification, setNotification] = useState({visible: false, message: 'empty'})
    const row = useRef(0)
    const col = useRef(0)
    const isEndGame = useRef(false)

    const hidePopUp = () => {
        setNotification({visible: false, message: notification.message})
    }

    useEffect(() => {
        const checkWinConditions = (newBoard) => {
            if (isWordle(newBoard[row.current], wordle)) {
                isEndGame.current = true
                setTimeout(() => {
                    setNotification({visible: true, message: 'YOU WON'})
                }, 1500)
            } else if (row.current === rowLength - 1){
                isEndGame.current = true
                setTimeout(() => {
                    setNotification({visible: true, message: 'YOU LOST'})
                }, 1500)
            }
        }

        const newBoard = JSON.parse(JSON.stringify(board))

        if (isEndGame.current){
            setNotification({visible: true, message: 'GAME FINISHED'})
            return
        }

        if (inAlphabet(input.key) && hasEmptyBox(col.current, colLength)) {
            newBoard[row.current][col.current].letter = input.key
            col.current += 1
            setBoard(newBoard)
        } else if (input.key === 'ENTER') {
            if (!hasFilledRow(col.current, colLength)) {
                setNotification({visible: true, message: 'Not enough letters'})
                return
            }

            if (!inWordList(newBoard[row.current], wordList)) {
                setNotification({visible: true, message: 'Not in word list'})
                return 
            }

            changeColorsInRow(newBoard[row.current], wordle)
            checkWinConditions(newBoard)
            row.current += 1
            col.current = 0
            setBoard(newBoard)
        } else if ((input.key === 'BACKSPACE' || input.key === 'DELETE') && isDeletable(col.current)) {
            newBoard[row.current][col.current - 1].letter = ''
            col.current -= 1
            setBoard(newBoard)
        }
    }, [input.time])

    return (
        <div>
            <Notification notification={notification} hidePopUp={hidePopUp}/>
            <Board board={board}/>
            <Keyboard board={board} onKeyClick={handleKeyClick}/>
        </div>
    )
}

export default Game


// fetch('/board')
// .then(response => response.json())
// .then(data => {
//     setBoard(data.board)})