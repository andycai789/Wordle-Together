import {io} from 'socket.io-client'
import {useState, useEffect, useRef} from 'react'
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";

import Header from './components/Header.jsx'
import GamePage from './components/pages/GamePage.jsx'
import LobbyPage from './components/pages/LobbyPage.jsx'
import HomePage from './components/pages/HomePage.jsx'

const socket = io()

function App() {
  const [settings, setSettings] = useState({})
  const permission = useRef('home')

  const getPermission = () => {
    return permission.current
  }

  useEffect( () => {
    socket.on('connect', () => {
      console.log(socket.id)
    })
    return () => {
      socket.emit('disconnect');
      socket.disconnect(true);    
    }
  }, [])

  return (
    <Router>
      <Header/>
      <Routes> 
        <Route path='/' element={<HomePage socket={socket} permission={permission}/>}/>
        <Route path='/lobby' element={<LobbyPage socket={socket} permission={permission} getPermission={getPermission} onSettingsChange={setSettings}/>}/>
        <Route path='/game' element={<GamePage socket={socket} permission={permission} getPermission={getPermission} settings={settings}/>}/> 
      </Routes>
    </Router>
  )
}

export default App



