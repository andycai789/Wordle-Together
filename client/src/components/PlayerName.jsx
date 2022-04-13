import React from 'react'
import Row from './Row.jsx'

const formatToRow = (word) => {
    let wordArray = word.toUpperCase().padEnd(6, ' ').split('')
    return wordArray.map((letter, i) => ({letter: letter, color: ''}))
}

const PlayerName = ({name}) => {
  return (
    <Row row={formatToRow(name)}/>
  )
}

export default PlayerName