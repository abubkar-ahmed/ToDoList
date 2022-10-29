import React from 'react'
import { Outlet } from 'react-router-dom'
import useAuth from '../hooks/useAuth';
import Main from '../components/pages/Main'

function ProtectedRoutes() {

    const { auth } = useAuth();

  return (
    <>
        {auth.accessToken ? (<Main />) : (<Outlet />)}
    </>
  )
}

export default ProtectedRoutes