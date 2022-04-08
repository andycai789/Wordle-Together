import {Link} from "react-router-dom";
import '../../css/LobbyPage.css';
import Box from '../Box.jsx';
import Row from '../Row.jsx';


const formatToRow = (word) => {
    let wordArray = word.toUpperCase().padEnd(7, ' ').split('')
    return wordArray.map((letter, i) => ({letter: letter, color: ''}))
  }

const LobbyPage = ({socket, onSettingChange}) => {

    let setting = {rows: 3, cols: 7, wordle: 'GRAHAMS', wordList: []}
    let players = ["Ansadf", "Bnasdf", "Cnasdf", "Dnsdf", "Enweqr", "Fnzxcv", "Gnzxcv", "Hnzxcv", "Inzxcv"]

    return (
        <div className='lobbyPage'>

            <div className="settings">
                <div className='title'> Settings </div>

                <div className='settingsForm'>
                    Number of Attempts(Rows):
                    <select name="rows" className="settingsSelect">
                        {Array.from({length: 12}, (_,i) => {return <option> {i + 5} </option>})}
                    </select>
                </div>

                <div className='settingsForm'>
                    <label for="columns">Number of Letters(Columns):</label>
                    <select name="columns" className="settingsSelect">
                        {Array.from({length: 12}, (_,i) => {return <option> {i + 5} </option>})}
                    </select>
                </div>

                <div className='startButtonContainer'>
                    <Link to='/game' onClick={() => onSettingChange(setting)}> 
                        <button className='startButton'> Start Game </button>
                    </Link>
                </div>
            </div>

            <div className="playersContainer">
                <div className="playerBoxes">   
                    {players.map(name => {
                        return <Row row={formatToRow(name)}/>
                    })}
                </div>
            </div>




        </div>
    )
}

export default LobbyPage