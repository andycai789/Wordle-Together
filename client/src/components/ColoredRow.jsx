import React from 'react'
import Row from './Row.jsx'

const getColorFromLetter = (color) => {
  if (color === 'G') {
    return 'green'
  } else if (color === 'Y') {
    return 'yellow'
  } else if (color === 'X') {
    return 'gray'
  } else {
    return ''
  }
}

const formatToRow = (word, colors) => {
  let wordArray = word.toUpperCase().split('')
  colors = colors.toUpperCase()
  return wordArray.map((letter, i) => ({letter: letter, color: getColorFromLetter(colors[i])}))
}

const ColoredRow = ({name, colors}) => {
  return (
    <Row row={formatToRow(name, colors)}/>
  )
}

export default ColoredRow