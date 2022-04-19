import React from 'react'
import Row from './Row.jsx'

const getColorFromLetter = (color) => {
  if (color === 'GREEN') {
    return 'green'
  } else if (color === 'YELLOW') {
    return 'yellow'
  } else if (color === 'GRAY') {
    return 'gray'
  } else {
    return ''
  }
}

const formatToRow = (word, color) => {
  let wordArray = word.toUpperCase().split('')
  console.log(color)
  color = color.toUpperCase()
  return wordArray.map((letter, i) => ({letter: letter, color: getColorFromLetter(color)}))
}

const ColoredRow = ({name, color}) => {
  return (
    <Row row={formatToRow(name, color)}/>
  )
}

export default ColoredRow