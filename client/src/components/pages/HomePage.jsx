import {useState, useRef, useEffect} from 'react'
import {useNavigate} from "react-router-dom";
import '../../css/HomePage.css';
import ColoredRow from '../ColoredRow.jsx';
import Notification from '../Notification.jsx'

const HomePage = ({socket, permission}) => {
  const [createColors, setCreateLight] = useState("zzzzzz")
  const [joinColors, setJoinLight] = useState("zzzzzz")
  const name = useRef('')
  const roomCode = useRef('')
  const navigate = useNavigate()

  const message = useRef('')
  const [visible, setVisible] = useState(false)


  const changeName = (event)=>{
    name.current = event.target.value.toUpperCase().padEnd(6, '-')
  };

  const preventNameSubmit = (event) => {
    event.preventDefault();
  }

  const createRoom = () => {
    if (name.current === '') {
      name.current = '------'
    }

    socket.emit('createRoom', name.current)
    permission.current = 'lobby'
    navigate('/lobby', {replace: true})
  }

  const changeRoomCode = (event) => {
    roomCode.current = event.target.value
  }

  const submitCode = () => {
    if (name.current === '') {
      name.current = '------'
    }

    socket.emit('checkCode', {name: name.current, id: socket.id, leader: false}, roomCode.current)
  }

  const handleSubmitCode = (event) => {
    event.preventDefault()
    submitCode()
  }

  useEffect(() => {
    socket.on('validCode', () => {
      permission.current = 'lobby'
      navigate('/lobby', {replace: true})
    })

    socket.on('invalidCode', () => {
      message.current = 'Please enter a valid code.'
      setVisible(true)
      setTimeout(() => setVisible(false), 3000)
    })

    socket.on('alreadyInGame', () => {
      message.current = 'Game in progress.'
      setVisible(true)
      setTimeout(() => setVisible(false), 3000)
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
        <div className='lobbyButton' onClick={createRoom} onMouseEnter={() => setCreateLight("yyyyyy")} onMouseLeave={() => setCreateLight("zzzzzz")}>
          <ColoredRow name="CREATE" colors={createColors}/>
          <ColoredRow name="ROOM" colors={createColors}/> 
        </div>
      </div>

      <div className='lobbyButtonContainer'> 
        <div className='lobbyButton' onClick={submitCode} onMouseEnter={() => setJoinLight("gggggg")} onMouseLeave={() => setJoinLight("zzzzzz")}>
          <ColoredRow name="JOIN" colors={joinColors}/>
          <ColoredRow name="ROOM" colors={joinColors}/> 
        </div>
      </div>

      <div>
        <form className='input' autoComplete="off" onSubmit={handleSubmitCode} onChange={changeRoomCode}>
          <input className='inputBar' id='codeInputBar' type="text" name="name"/>
        </form>
      </div>

      <Notification visible={visible} message={message.current} position='middle-center'/>
    </div>
  )
}

export default HomePage