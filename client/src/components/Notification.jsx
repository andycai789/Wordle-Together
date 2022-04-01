import React from 'react'

import '../css/Notification.css'

const Notification = ({notification, hidePopUp}) => {
  if (notification.visible) {
    setTimeout(() => hidePopUp(), 1000)
  }

  return (
    <div className='notificationContainer'>
        <div className= {`notification ${notification.visible ? 'visible' : 'hidden'}`}> 
          {notification.message}
        </div>
    </div>
  )
}


export default Notification