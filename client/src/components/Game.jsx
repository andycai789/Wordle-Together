import React, { useState, useEffect, useRef } from 'react'

import Board from './Board.jsx'
import Keyboard from './Keyboard.jsx'

const getDefaultBoxValues = () => {
    return {
        color: 'empty',
        letter: ''
    }
}

const createMxNBoard = (m, n) => {
    return Array(m).fill().map(()=>Array(n).fill().map(() => getDefaultBoxValues()))
}

const convertBoardRowToString = (boardRow) => {
    return boardRow.map(col => col.letter).join('')
}

const inAlphabet = (key) => {    
    const charCode = key.toUpperCase().charCodeAt(0)
    return (key.length === 1) && (charCode > 64) && (charCode < 91) 
}

const inWordList = (boardRow, wordList) => {
    return wordList.has(convertBoardRowToString(boardRow).toLowerCase())
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

const isWord = (boardRow, word) => {
    return convertBoardRowToString(boardRow) === word.toUpperCase();
}

const isPastMaxRow = (curRow, maxRow) => {
    return curRow === maxRow
}

const setGreenBoxes = (map, boardRow, word) => {
    for (let i = 0; i < boardRow.length; i++) {        
        if (boardRow[i].letter === word[i]) {
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

const changeColorsInRow = (boardRow, word) => {
    let map = new Map();
    for (let i = 0; i < word.length; i++) {
        if (!map.has(word[i])) {
            map.set(word[i], {val: 1})
        } else {
            map.get(word[i]).val++
        }
    }
    setGreenBoxes(map, boardRow, word)
    setYellowBoxes(map, boardRow)
    setGreyBoxes(boardRow)
}

const Game = ({input, rowLength, colLength, word, handleKeyClick, wordList, socket, changeTyping}) => {
    const [board, setBoard] = useState(createMxNBoard(5, 5))
    const row = useRef(0)
    const col = useRef(0)
    const isEndGame = useRef(false)

    const checkWinConditions = (newBoard) => {
        if (isWord(newBoard[row.current], word) || isPastMaxRow(row.current, rowLength - 1)) {
            isEndGame.current = true
        }
    }

    useEffect(() => {
        socket.on('board', board => {
            setBoard(board)
        })

        socket.on('canType', (newRow, newCol) => {
            row.current = newRow
            col.current = newCol
            changeTyping(true)
        })
    }, [])

    useEffect(() => {
        const newBoard = JSON.parse(JSON.stringify(board))

        if (inAlphabet(input.key) && hasEmptyBox(col.current, colLength)) {
            newBoard[row.current][col.current].letter = input.key
            col.current += 1
            setBoard(newBoard)
        } else if (input.key === 'ENTER') {
            if (!hasFilledRow(col.current, colLength)) {
                return
            }

            if (!inWordList(newBoard[row.current], wordList)) {
                return 
            }

            changeColorsInRow(newBoard[row.current], word)
            checkWinConditions(newBoard)
            row.current += 1
            col.current = 0
            setBoard(newBoard)

            changeTyping(false)
            socket.emit('nextPlayer', row.current, col.current)
        } else if ((input.key === 'BACKSPACE' || input.key === 'DELETE') && isDeletable(col.current)) {
            newBoard[row.current][col.current - 1].letter = ''
            col.current -= 1
            setBoard(newBoard)
        }
    }, [input.time])

    return (
        <div className='boards'>
            <Board board={board}/>
            <Keyboard board={board} onKeyClick={handleKeyClick}/>
        </div>
    )
}

export default Game
