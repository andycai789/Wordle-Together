import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import reportWebVitals from './reportWebVitals'

async function startWordleWithFriends() {
  let response = await fetch('/settings')
  let settings = await response.json()
  
  ReactDOM.render(
    <React.StrictMode>
      <App rows={settings.rows} columns={settings.cols} wordle={settings.wordle} wordList={settings.wordList}/>
    </React.StrictMode>,
    document.getElementById('root')
  );
} 

startWordleWithFriends()

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();