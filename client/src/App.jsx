import { useState, useEffect } from 'react'
import Header from './components/Header.jsx'
import Game from './components/Game.jsx'

function App({rows, columns, wordle, wordList}) {
  const [userInput, setUserInput] = useState({key: '', time: 0})

  const pressKey = (event) => {
    fetch('/input', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({key: event.key.toUpperCase()}),
    })
    setUserInput({key: event.key.toUpperCase(), time: event.timeStamp})
  } 

  const clickKey = (event) => {
    fetch('/input', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({key: event.target.innerText.toUpperCase()}),
    })

    setUserInput({key: event.target.innerText.toUpperCase(), time: event.timeStamp})
  }

  useEffect(() => {
    console.log(wordle)

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
            wordList={wordList}/>
    </div>
  )
}

export default App



