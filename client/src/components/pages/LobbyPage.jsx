import {Link, useNavigate} from "react-router-dom";
import {useState, useEffect} from 'react'
import '../../css/LobbyPage.css';
import ColoredRow from '../ColoredRow.jsx';

const LobbyPage = ({socket, onSettingsChange, permission, getPermission}) => {
    const [rowInput, setRowInput] = useState(5)
    const [colInput, setColInput] = useState(5)
    const [players, setPlayers] = useState([])
    const [isLeader, setIsLeader] = useState(false)
    const [roomCode, setRoomCode] = useState('')
    let navigate = useNavigate()

    const changeRows = (event) => {
        setRowInput(event.target.value)
        socket.emit('newRowSelect', event.target.value)
    }

    const changeCols = (event) => {
        setColInput(event.target.value)
        socket.emit('newColSelect', event.target.value)
    }

    const startGame = (event) => {
        if (isLeader) {
            permission.current = 'game'
            socket.emit('startGame')
        }
    }

    const getPlayerColor = (player) => {
        if (player.leader) {
            return 'yyyyyy'
        } else if (player.id === socket.id) {
            return 'gggggg'
        } else {
            return 'xxxxxx'
        }
    }

    useEffect(() => {
        if (getPermission() !== 'lobby') {
            navigate('/', {replace: true})
            return
        }

        socket.on('isLeader', () => {setIsLeader(true)})
        socket.on('changeCode', (response) => {setRoomCode(response)})
        socket.on('changeRowSelect', (newRow) => {setRowInput(newRow)})
        socket.on('changeColSelect', (newCol) => {setColInput(newCol)})
        socket.on('players', (response) => {setPlayers(response)})

        socket.on('startGameForPlayers', (settings) => {
            onSettingsChange(settings)
            permission.current = 'game'
            navigate('/game', {replace: true})
        })

        socket.emit('initialLobbySettings') 
    }, [])

    return (
        <div className='lobbyPage'>
            <div className="game-settings">
                <div className='game-title'> Settings </div>

                <div className='settingsForm'>
                    <div> Code: </div>
                    {roomCode}
                </div>

                <div className='settingsForm'>
                    Number of Attempts(Rows):
                    <select disabled={!isLeader} className="settingsSelect" value={rowInput} onChange={changeRows} >
                        {Array.from({length: 12}, (_,i) => {return <option key={i}> {i + 5} </option>})}
                    </select>
                </div>

                <div className='settingsForm'>
                    Number of Letters(Columns):
                    <select disabled={!isLeader} className="settingsSelect" value={colInput} onChange={changeCols}>
                        {Array.from({length: 12}, (_,i) => {return <option key={i}> {i + 5} </option>})}
                    </select>
                </div>

                <div className='startButtonContainer'>
                    <Link to={isLeader && '/game'} replace onClick={startGame}> 
                        <button disabled={!isLeader} className='startButton'> Start Game </button>
                    </Link>
                </div>
            </div>

            <div className="playersContainer">
                {players.map((player, i) => {
                    return <ColoredRow key={i} name={player.name} colors={getPlayerColor(player)}/>
                })}
            </div>
        </div>
    )
}

export default LobbyPage