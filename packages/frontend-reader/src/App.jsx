import React from 'react';
import { Outlet } from 'react-router-dom'
import NavBar from './Components/NavBar';
import './App.css'

function App() {
  return (
    <>
      <NavBar link1='signup' link2='login' />
      <Outlet />
    </>
  )
}

export default App