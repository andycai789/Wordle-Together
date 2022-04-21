import {useState, useRef, useEffect} from 'react'
import {useNavigate, useParams} from "react-router-dom";
import '../../css/HomePage.css';
import ColoredRow from '../ColoredRow.jsx';
import Notification from '../Notification.jsx'

const HomePage = ({socket, permission}) => {
  const [createColor, setCreateLight] = useState("none")
  const [joinColor, setJoinLight] = useState("none")
  const name = useRef('')
  const roomCode = useRef('')
  const navigate = useNavigate()

  const allowSubmit = useRef(true)
  const message = useRef('')
  const [visible, setVisible] = useState(false)

  const {code} = useParams()

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
    if (!allowSubmit.current) {
      return
    }

    if (name.current === '') {
      name.current = '------'
    }

    allowSubmit.current = false;
    socket.emit('checkCode', {name: name.current, id: socket.id, leader: false}, roomCode.current)
  }

  const handleSubmitCode = (event) => {
    event.preventDefault()
    submitCode()
  }

  useEffect(() => {
    if (code !== undefined) {
      roomCode.current = code
    }

    socket.on('disconnect', () => {
      navigate('/', {replace: true})
    })

    socket.on('validCode', () => {
      permission.current = 'lobby'
      navigate('/lobby', {replace: true})
      allowSubmit.current = true
    })

    socket.on('invalidCode', () => {
      message.current = 'Please enter a valid code.'
      setVisible(true)
      setTimeout(() => setVisible(false), 3000)
      allowSubmit.current = true
    })

    socket.on('alreadyInGame', () => {
      message.current = 'Game in progress.'
      setVisible(true)
      setTimeout(() => setVisible(false), 3000)
      allowSubmit.current = true
    })
  }, [])

  return (
    <div className='HomePage'>
      <div className="nameBox">
        <ColoredRow name="NAME" color='z'/>
      </div>

      <form className='input' autoComplete="off" onSubmit={preventNameSubmit}>
        <input className='inputBar' id='nameInputBar' type="text" name="name" maxLength="16" onChange={changeName}/>
      </form>

      {!code && 
        <div className='lobbyButtonContainer'>
          <div className='lobbyButton' onClick={createRoom} onMouseEnter={() => setCreateLight("yellow")} onMouseLeave={() => setCreateLight("none")}>
            <ColoredRow name="CREATE" color={createColor}/>
            <ColoredRow name="-ROOM-" color={createColor}/> 
          </div>
        </div>
      }
      
      {code && 
        <div className='lobbyButtonContainer'> 
          <div className='lobbyButton' onClick={submitCode} onMouseEnter={() => setJoinLight("green")} onMouseLeave={() => setJoinLight("none")}>
            <ColoredRow name="JOIN" color={joinColor}/>
            <ColoredRow name="ROOM" color={joinColor}/> 
          </div>
        </div>
      }

      {code && 
        <div>
          <form className='input' autoComplete="off" onSubmit={handleSubmitCode} onChange={changeRoomCode}>
            <input className='inputBar' defaultValue={code} id='codeInputBar' type="text" name="name"/>
          </form>
        </div>
      }

      <div style={{marginTop: '20px'}}>
        <Notification visible={visible} message={message.current} position='middle-center'/>
      </div>

    </div>
  )
}

export default HomePage