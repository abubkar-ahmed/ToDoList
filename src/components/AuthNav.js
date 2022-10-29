import React from 'react'
import {NavLink} from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import axios from '../api/axios';
import { useNavigate } from 'react-router-dom' ;



function AuthNav() {

  const  {auth , setAuth}  = useAuth();

  const navigate = useNavigate();
  

  const logOut = async () => {
    try{
      await axios.get('/logout').then(res => {
        setAuth({}); 
        navigate('/');
      })
    } catch (err) {
      console.log(err);
      setAuth({});
    }
  }


  
  

  return (
    <>
      {auth.user ? 
      (
        <nav className='logged-in'>
          <p>{auth.user}</p>
          <a href='#' onClick={logOut}>Log Out</a>
        </nav>
      )
      :
      (
        <nav>
        <NavLink to='/register' >Register</NavLink>
        <NavLink to='/login' >Login</NavLink>
        </nav>
      )
      }
    </>
  )
}

export default AuthNav