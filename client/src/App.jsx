import { useState, useEffect } from 'react'
import Header from './components/Header.jsx'
import Game from './components/Game.jsx'

function App() {
  const rows = 7
  const columns = 7
  const wordle = "fuzzbox".toUpperCase()
  const [userInput, setUserInput] = useState({key: '', time: 0})

  const pressKey = (event) => {
    setUserInput({key: event.key, time: event.timeStamp})
  } 

  const clickKey = (event) => {
    setUserInput({key: event.target.innerText, time: event.timeStamp})
  }

  useEffect(() => {
    window.addEventListener('keydown', pressKey)

    return () => {
        window.removeEventListener('keydown', pressKey)
    }
  }, [])

  return (
    <div className='App'>
      <Header/>
      <Game input={userInput} 
            rowLength={rows} 
            colLength={columns} 
            wordle={wordle}
            handleKeyClick={clickKey}
      />
    </div>
  )
}

export default App



