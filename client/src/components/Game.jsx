import React, { useState, useEffect, useRef } from 'react'

import Notification from './Notification.jsx'
import Board from './Board.jsx'
import Keyboard from './Keyboard.jsx'

const inAlphabet = (key) => {    
    const charCode = key.toUpperCase().charCodeAt(0)
    return (key.length === 1) && (charCode > 64) && (charCode < 91) 
}

const inWordList = (row, wordList) => {
    return wordList.includes(convertRowToString(row).toLowerCase())
}

const isDeletable = (column) => {
    return column > 0
}

const isWordle = (row, wordle) => {
    return convertRowToString(row) === wordle.toUpperCase();
}

const convertRowToString = row => {
    return row.map(col => col.letter).join('')
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

const getMapOfWord = (word) => {
    let map = new Map();
    for (let i = 0; i < word.length; i++) {
        if (!map.has(word[i])) {
            map.set(word[i], {val: 1})
        } else {
            map.get(word[i]).val++
        }
    }
    return map
}
  
const changeColorsInRow = (boardRow, wordle) => {
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
            if (map.has(boardRow[i].letter)) {
                if (map.get(boardRow[i].letter).val > 0) {
                    boardRow[i].color = 'yellow'
                    map.get(boardRow[i].letter).val--
                } 
            }
        }
    }
    
    const setGreyBoxes = (map, boardRow) => {
        for (let i = 0; i < boardRow.length; i++) {
            if (boardRow[i].color === 'empty') {
                boardRow[i].color = 'gray'
            }
        }
    }
  
    let map = getMapOfWord(wordle)
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
            newBoard[row.current][col.current].letter = input.key.toUpperCase()
            col.current += 1
            setBoard(newBoard)
        } else if (input.key === 'Enter' ) {
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
        } else if ((input.key === 'Backspace' || input.key === 'Delete') && isDeletable(col.current)) {
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