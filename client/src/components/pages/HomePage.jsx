import {useState} from 'react'
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

  return (
    <div className='HomePage' onClick={() => console.log("CLICKED")}>
      <Link className='toCreateLobby' to='/lobby'
        onMouseEnter={() => setCreateLight("gggggg")}
        onMouseLeave={() => setCreateLight("zzzzzz")}>

        <Row row={formatToRow("CREATE", createLight)}/>
        <Row row={formatToRow("ROOM  ", createLight)}/> 
      </Link>


      <Link className='toJoinLobby' to='/lobby'
        onMouseEnter={() => setJoinLight("yyyyyy")}
        onMouseLeave={() => setJoinLight("zzzzzz")}>

        <Row row={formatToRow("JOIN  ", joinLight)}/>
        <Row row={formatToRow("ROOM  ", joinLight)}/> 
      </Link>

      <form className='input'>
        <input className='inputBar' type="text" name="name" />
      </form>
    </div>
  )
}

export default HomePage