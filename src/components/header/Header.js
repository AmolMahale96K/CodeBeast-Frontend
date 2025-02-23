import React from 'react'
import "./header.css"

function Header() {
  return (
    <header>
        <span className='header-text'>CodeBeast</span>
        <div className='header-buttons-div'>
            <button className='header-button'>SignUp</button>
            <button className='header-button'>Login</button>
        </div>
    </header>
  )
}

export default Header
