import React, { useState, useEffect} from 'react'
import {Toast} from 'react-bootstrap'
import ToastContainer from 'react-bootstrap/ToastContainer'

const Notification = ({visible, message, position}) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!visible) {
      return 
    }

    setShow(true)
  }, [visible])

  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      className="position-relative"
      style={{minHeight: '75px', color: 'black', textAlign: 'center', fontWeight: 'bold'}}> 

      <ToastContainer style={{width: '200px'}} position={position}>
        <Toast onClose={() => setShow(false)} show={show} delay={3000} autohide>
          <Toast.Body>{message}</Toast.Body>
        </Toast>
      </ToastContainer>
    </div>
  );
}


export default Notification