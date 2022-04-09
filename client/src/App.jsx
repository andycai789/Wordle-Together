import {io} from 'socket.io-client'
import {useState} from 'react'
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";

import Header from './components/Header.jsx'
import GamePage from './components/pages/GamePage.jsx'
import LobbyPage from './components/pages/LobbyPage.jsx'
import HomePage from './components/pages/HomePage.jsx'

const socket = io()

socket.on('connect', () => {
  console.log(socket.id)
})

function App() {
  const [settings, setSettings] = useState({})

  return (
    <Router>
      <Header/>
      <Routes> 
        <Route path='/' element={<HomePage socket={socket}/>}/>
        <Route path='/lobby' element={<LobbyPage socket={socket} onSettingsChange={setSettings}/>}/>
        <Route path='/game' element={<GamePage socket={socket} settings={settings}/>}/> 
      </Routes>
    </Router>
  )
}

export default App



