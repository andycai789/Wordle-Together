import {Link} from "react-router-dom";
import {useState, useRef} from 'react'
import '../../css/LobbyPage.css';
import Row from '../Row.jsx';

const formatToRow = (word) => {
    let wordArray = word.toUpperCase().padEnd(7, ' ').split('')
    return wordArray.map((letter, i) => ({letter: letter, color: ''}))
  }

const LobbyPage = ({socket, onSettingsChange}) => {
    let setting = {rows: 3, cols: 7, wordle: 'GRAHAMS', wordList: []}
    let players = ["Ansadf", "Bnasdf", "Cnasdf", "Dnsdf", "Enweqr", "Fnzxcv", "Gnzxcv", "Hnzxcv", "Inzxcv"]
    const rows = useRef(5)
    const cols = useRef(5)

    // socket on new player, add new player name most likely need to use useState to update the page

    const changeRows = (event) => {
        rows.current = event.target.value
    }

    const changeCols = (event) => {
        cols.current = event.target.value
    }

    const startGame = (event) => {
        // if leader allow button presses to startgame
        // emit rows, cols
        // emit to get all settings
        // on sendsettings onSettingsChange(newSettings)
    }

    return (
        <div className='lobbyPage'>
            <div className="settings">
                <div className='title'> Settings </div>

                <div className='settingsForm'>
                    Number of Attempts(Rows):
                    <select name="rows" className="settingsSelect" onChange={changeRows}>
                        {Array.from({length: 12}, (_,i) => {return <option key={i}> {i + 5} </option>})}
                    </select>
                </div>

                <div className='settingsForm'>
                    Number of Letters(Columns):
                    <select name="columns" className="settingsSelect" onChange={changeCols}>
                        {Array.from({length: 12}, (_,i) => {return <option key={i}> {i + 5} </option>})}
                    </select>
                </div>

                <div className='startButtonContainer'>
                    <Link to='/game' onClick={startGame}> 
                        <button className='startButton'> Start Game </button>
                    </Link>
                </div>
            </div>

            <div className="playersContainer">
                <div className="playerBoxes">   
                    {players.map((name, i) => {
                        return <Row key={i} row={formatToRow(name)}/>
                    })}
                </div>
            </div>
        </div>
    )
}

export default LobbyPage