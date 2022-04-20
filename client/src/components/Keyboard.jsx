import '../css/Keyboard.css';
import { useState, useEffect } from 'react'

const getRowLength = board => board.length

const getColLength = board => board[0].length

const getKeyboard = () => {
    const qwerty = [['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'], 
                    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'], 
                    ['Z', 'X', 'C', 'V', 'B', 'N', 'M']]

    let keyboard = new Array(qwerty.length);

    for (let i = 0; i < keyboard.length; i++) {
        keyboard[i] = qwerty[i].map(letter => ({color: 'grey', letter: letter}))
    }

    return keyboard
}

const getLetterColorMap = (board) => {
    let map = new Map()

    for (let row = 0; row < getRowLength(board); row++) {
        for (let col = 0; col < getColLength(board); col++) {
            let letter = board[row][col].letter
            let color = board[row][col].color

            if (!map.has(letter)) {
                if (color !== 'empty') {
                    map.set(letter, color)
                } 
            } else {
                if (color === 'green') {
                    map.set(letter, color)
                }
            }
        }
    }
    return map
}

const changeKeyboardColors = (board, keyboard) => {
    let letterColorMap = getLetterColorMap(board)

    for (let row = 0; row < getRowLength(keyboard); row++) {
        for (let col = 0; col < keyboard[row].length; col++) {
            let letter = keyboard[row][col].letter

            if (letterColorMap.has(letter)) {
                keyboard[row][col].color = letterColorMap.get(letter)
            }

        }
    }
    return keyboard
}

const getBackgroundColor = (color) => {
    if (color === 'green') {
        return '#538d4e'
    } else if (color === 'yellow') {
        return '#b59f3b'
    } else if (color === 'gray') {
        return '#3a3a3c'
    } else {
        return '#818384'
    }
}

const handleFocus = (event) => {
    event.preventDefault()
}

const Keyboard = ({board, onKeyClick}) => {
    const [keyboard, setKeyboard] = useState(getKeyboard())

    useEffect( () => {
        const newKeyboard = JSON.parse(JSON.stringify(keyboard))
        setKeyboard(changeKeyboardColors(board, newKeyboard))
    }, [board])

    return (
        <div className='keyboard'>
            <div className='keyboard-row'>{keyboard[0].map((k, index) => <button tabIndex="-1" style={{ backgroundColor: getBackgroundColor(k.color)}} key={index} onFocus={handleFocus} onClick={onKeyClick}> {k.letter} </button>)}</div>
            <div className='keyboard-row-middle'>{keyboard[1].map((k, index) => <button tabIndex="-1" style={{ backgroundColor: getBackgroundColor(k.color)}} key={index} onClick={onKeyClick}> {k.letter} </button>)}</div>
            <div className='keyboard-row'>
                <button className='action' tabIndex="-1" onClick={onKeyClick}>Enter</button>
                {keyboard[2].map((k, index) => <button style={{ backgroundColor: getBackgroundColor(k.color)}} key={index} onClick={onKeyClick}> {k.letter} </button>)}
                <button className='action' tabIndex="-1" onClick={onKeyClick}>Delete</button>
            </div>
        </div>
    );

}

export default Keyboard;