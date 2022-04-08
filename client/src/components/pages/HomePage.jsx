import {useState, useRef} from 'react'
import {Link} from "react-router-dom";
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

const HomePage = ({socket}) => {
  const [createLight, setCreateLight] = useState("zzzzzz")
  const [joinLight, setJoinLight] = useState("zzzzzz")
  const name = useRef('')
  const roomCode = useRef('')
  const validCode = useRef(false)

  const changeName = (event)=>{
    name.current = event.target.value.toUpperCase()
  };

  const changeRoomCode = (event) => {
    roomCode.current = event.target.value.toUpperCase()
  };

  const createRoom = (event) => {
    // emit to server my name, and to create room

    console.log("CREATED ROOM")
  }

  const joinRoom = (event) => {
    // emit to server the server code
    // on true code, set to true

    console.log("JOINED ROOM")
  }

  return (
    <div className='HomePage'>

      <div className="nameBox">
        <Row row={formatToRow("NAME", 'zzzzz')}/>
      </div>

      <form className='input'>
        <input className='inputBar' type="text" name="name" maxLength="7" onChange={changeName}/>
      </form>

      <Link className='toCreateLobby' to='/lobby' onClick={createRoom} onMouseEnter={() => setCreateLight("gggggg")} onMouseLeave={() => setCreateLight("zzzzzz")}>
        <Row row={formatToRow("CREATE", createLight)}/>
        <Row row={formatToRow("ROOM  ", createLight)}/> 
      </Link>

      <Link className='toJoinLobby' to={validCode.current ? '/lobby' : '/'} onClick={joinRoom} onMouseEnter={() => setJoinLight("yyyyyy")} onMouseLeave={() => setJoinLight("zzzzzz")}>
        <Row row={formatToRow("JOIN  ", joinLight)}/>
        <Row row={formatToRow("ROOM  ", joinLight)}/> 
      </Link>

      <form className='input'>
        <input className='inputBar' type="text" name="name" onChange={changeRoomCode}/>
      </form>
    </div>
  )
}

export default HomePage