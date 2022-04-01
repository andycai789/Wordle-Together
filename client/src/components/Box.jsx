import React from 'react'
import '../css/Box.css'

const Box = ({color, letter}) => {
  return (
    <div className={`box ${color === 'empty' ? '' : color}`}>
      {letter}
    </div>
  )
}

export default Box