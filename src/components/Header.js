import React from 'react'
import sun from '../images/icon-sun.svg' ;
import moon from '../images/icon-moon.svg' ;
import {NavLink} from 'react-router-dom';

function Header(props) {
  return (
    <header className='header'>
        <NavLink to='/'><h1>TODO</h1></NavLink>
        {props.darkAndLight === 'dark' ? (
          <img src={sun} alt='mood-img' onClick={props.setDarkAndLight}/>
          ) :(
            <img src={moon} alt='mood-img' onClick={props.setDarkAndLight}/>
          )
        }
        
    </header>
  )
}

export default Header