import {Link, useNavigate} from "react-router-dom";
import {useState, useEffect} from 'react'
import '../../css/LobbyPage.css';
import Row from '../Row.jsx';

const formatToRow = (word) => {
    let wordArray = word.toUpperCase().padEnd(7, ' ').split('')
    return wordArray.map((letter, i) => ({letter: letter, color: ''}))
}

const LobbyPage = ({socket, onSettingsChange}) => {
    const [rowInput, setRowInput] = useState(5)
    const [colInput, setColInput] = useState(5)
    const [players, setPlayers] = useState([])
    const [isClient, setIsClient] = useState(true)
    const [roomCode, setRoomCode] = useState('')
    let navigate = useNavigate()

    useEffect(() => {
        socket.on('changeCode', (response) => {
            setRoomCode(response)
        })
    
        socket.on('players', (response) => {
            setPlayers(response)
        })
    
        socket.on('checkIfClient', (response) => {
            setIsClient(response)
        })
    
        socket.on('changeRowSelect', (newRow) => {
            setRowInput(newRow)
        })
    
        socket.on('changeColSelect', (newCol) => {
            setColInput(newCol)
        })
    
        socket.on('changeSettings', (settings) => {
            onSettingsChange(settings)
        })

        // socket.on('navigateToGamePage', () => {
        //     navigate('/game')

        // })
        
    }, [])

    const changeRows = (event) => {
        setRowInput(event.target.value)
        socket.emit('newRowSelect', event.target.value)
    }

    const changeCols = (event) => {
        setColInput(event.target.value)
        socket.emit('newColSelect', event.target.value)
    }

    const startGame = (event) => {
        socket.emit('startGame')
    }

    return (
        <div className='lobbyPage'>
            <div className="settings">
                <div className='title'> Settings </div>

                <div className='settingsForm'>
                    <div> Code: </div>
                    {roomCode}
                </div>

                <div className='settingsForm'>
                    Number of Attempts(Rows):
                    <select disabled={isClient} name="rows" className="settingsSelect" value={rowInput} onChange={changeRows} >
                        {Array.from({length: 12}, (_,i) => {return <option key={i}> {i + 5} </option>})}
                    </select>
                </div>

                <div className='settingsForm'>
                    Number of Letters(Columns):
                    <select disabled={isClient} name="columns" className="settingsSelect" value={colInput} onChange={changeCols}>
                        {Array.from({length: 12}, (_,i) => {return <option key={i}> {i + 5} </option>})}
                    </select>
                </div>

                <div className='startButtonContainer'>
                    <Link to='/game' onClick={startGame}> 
                        <button  className='startButton'> Start Game </button>
                    </Link>
                </div>
            </div>

            <div className="playersContainer">
                <div className="playerBoxes">   
                    {players.map((player, i) => {
                        return <Row key={i} row={formatToRow(player.name)}/>
                    })}
                </div>
            </div>
        </div>
    )
}

export default LobbyPage