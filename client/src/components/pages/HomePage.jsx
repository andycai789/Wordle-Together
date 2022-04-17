import {useState, useRef, useEffect} from 'react'
import {useNavigate} from "react-router-dom";
import '../../css/HomePage.css';
import ColoredRow from '../ColoredRow.jsx';

const HomePage = ({socket, permission}) => {
  const [createColors, setCreateLight] = useState("zzzzzz")
  const [joinColors, setJoinLight] = useState("zzzzzz")
  const [validCode, setValidCode] = useState(false)
  const name = useRef('')
  const roomCode = useRef('')
  const navigate = useNavigate()

  const changeName = (event)=>{
    name.current = event.target.value.toUpperCase()
  };

  const preventNameSubmit = (event) => {
    event.preventDefault();
  }

  const createRoom = () => {
    socket.emit('createRoom', name.current)
    permission.current = 'lobby'
    navigate('/lobby', {replace: true})
  }






  
  const changeRoomCode = (event) => {
    roomCode.current = event.target.value
    setValidCode(false)
    socket.emit('checkCode', roomCode.current)
  };

  const joinRoom = () => {
    if (validCode) {
      socket.emit('joinRoom', {name: name.current, id: socket.id, leader: false}, roomCode.current)
      permission.current = 'lobby'
    } else {
      console.log("INVALID CODE")
    }
  }

  const handleCodeSubmit = (event) => {
    event.preventDefault()
    joinRoom()
  }







  useEffect(() => {
    socket.on('validRoomCode', (response) => {
      setValidCode(response)
    })
  }, [])

  return (
    <div className='HomePage'>
      <div className="nameBox">
        <ColoredRow name="NAME" colors='zzzz'/>
      </div>

      <form className='input' autoComplete="off" onSubmit={preventNameSubmit}>
        <input className='inputBar' id='nameInputBar' type="text" name="name" maxLength="6" onChange={changeName}/>
      </form>

      <div className='lobbyButtonContainer'>
        <div className='lobbyButton' onClick={createRoom} onMouseEnter={() => setCreateLight("gggggg")} onMouseLeave={() => setCreateLight("zzzzzz")}>
          <ColoredRow name="CREATE" colors={createColors}/>
          <ColoredRow name="ROOM" colors={createColors}/> 
        </div>
      </div>

      <div className='lobbyButtonContainer'> 
        <div className='lobbyButton' onClick={joinRoom} onMouseEnter={() => setJoinLight("yyyyyy")} onMouseLeave={() => setJoinLight("zzzzzz")}>
          <ColoredRow name="JOIN" colors={joinColors}/>
          <ColoredRow name="ROOM" colors={joinColors}/> 
        </div>
      </div>

      <form className='input' autoComplete="off" onSubmit={handleCodeSubmit}>
        <input className='inputBar' id='codeInputBar' type="text" name="name"/>
      </form>
    </div>
  )
}

export default HomePage