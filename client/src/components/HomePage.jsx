import React from 'react'
import {Link} from "react-router-dom";

const HomePage = ({socket}) => {
  return (
    <div className="HomePage">
      <h1> HOMEPAGE </h1>

      <Link to='/lobby'> GO TO LOBBY PAGE </Link>


    </div>

  )
}

export default HomePage