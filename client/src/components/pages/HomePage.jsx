import {useState, useRef, useEffect} from 'react'
import {Link, useNavigate} from "react-router-dom";
import '../../css/HomePage.css';
import Row from '../Row.jsx'

const getColorFromLetter = (color) => {
  if (color === 'G') {
    return 'green'
  } else if (color === 'Y') {
    return 'yellow'
  } else if (color === 'X') {
    return 'gray'
  } else {
    return ''
  }
}

const formatToRow = (word, color) => {
  let wordArray = word.toUpperCase().split('')
  let c = color.toUpperCase()
  return wordArray.map((letter, i) => ({letter: letter, color: getColorFromLetter(c[i])}))
}

const HomePage = ({socket, permission}) => {
  const [createLight, setCreateLight] = useState("zzzzzz")
  const [joinLight, setJoinLight] = useState("zzzzzz")
  const [validCode, setValidCode] = useState(false)
  const name = useRef('')
  const roomCode = useRef('')
  const navigate = useNavigate()

  const changeName = (event)=>{
    name.current = event.target.value.toUpperCase()
  };

  const changeRoomCode = (event) => {
    roomCode.current = event.target.value
    setValidCode(false)
    socket.emit('checkCode', roomCode.current)
  };

  const createRoom = () => {
    socket.emit('createRoom', name.current)
    permission.current = 'lobby'
  }

  const joinRoom = () => {
    if (validCode) {
      socket.emit('joinRoom', {name: name.current, id: socket.id, leader: false}, roomCode.current)
      permission.current = 'lobby'
    } else {
      console.log("INVALID CODE")
    }
  }

  const handleNameSubmit = (event) => {
    event.preventDefault();
  }

  const handleCodeSubmit = (event) => {
    event.preventDefault();
    if (validCode) {
      joinRoom()
      permission.current ='lobby'
      navigate('/lobby', {replace: true})
    }
  }

  useEffect(() => {
    socket.on('validRoomCode', (response) => {
      setValidCode(response)
    })
  }, [])

  return (
    <div className='HomePage'>
      <div className="nameBox">
        <Row row={formatToRow("NAME", 'zzzzz')}/>
      </div>

      <form className='input' autoComplete="off" onSubmit={handleNameSubmit}>
        <input className='inputBar' id='nameInputBar' type="text" name="name" maxLength="6" onChange={changeName}/>
      </form>

      <Link className='toCreateLobby' to='lobby' replace onClick={createRoom} onMouseEnter={() => setCreateLight("gggggg")} onMouseLeave={() => setCreateLight("zzzzzz")}>
        <Row row={formatToRow("CREATE", createLight)}/>
        <Row row={formatToRow("ROOM  ", createLight)}/> 
      </Link>

      <Link className='toJoinLobby' to={validCode ? '/lobby' : '/'} replace onClick={joinRoom} onMouseEnter={() => setJoinLight("yyyyyy")} onMouseLeave={() => setJoinLight("zzzzzz")}>
        <Row row={formatToRow("JOIN  ", joinLight)}/>
        <Row row={formatToRow("ROOM  ", joinLight)}/> 
      </Link>

      <form className='input' autoComplete="off" onSubmit={handleCodeSubmit}>
        <input className='inputBar' id='codeInputBar' type="text" name="name" onChange={changeRoomCode}/>
      </form>
    </div>
  )
}

export default HomePage