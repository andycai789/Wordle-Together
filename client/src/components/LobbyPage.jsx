import React from 'react'
import {Link} from "react-router-dom";
  
const LobbyPage = ({socket, onSettingChange}) => {

    let setting = {rows: 3, cols: 7, wordle: 'GRAHAMS', wordList: []}

    return (
        <div>
            <h1> Settings </h1>
            <h2> Number of rows: min 5</h2>
            <h3> Number of columns: min 5</h3>

            

            <Link to='/game' onClick={() => onSettingChange(setting)}> GO TO GAME </Link>

        </div>
    )
}

export default LobbyPage