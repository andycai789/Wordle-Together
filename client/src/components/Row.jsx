import '../css/Row.css'

import React from 'react'
import Box from './Box.jsx'

const Row = ({row}) => {
    return (
        <div className='row'>
            {row.map((col, index) => 
                <Box key={index} color={col.color} letter={col.letter}/>)}
        </div>
    )
}

export default Row