import Header from './components/Header.jsx'
import GamePage from './components/GamePage.jsx'
import LobbyPage from './components/LobbyPage.jsx'
import HomePage from './components/HomePage.jsx'

import {io} from 'socket.io-client'
import {useState} from 'react'
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";

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

        <Route path='/lobby' element={<LobbyPage onSettingChange={setSettings}/>}/>

        <Route path='/game' element={<GamePage socket={socket} settings={settings}/>}/> 
      </Routes>

    </Router>


  )
}

export default App



