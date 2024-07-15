import React from 'react';
import { Outlet } from 'react-router-dom'
import NavBar from './Components/NavBar';
import { AuthProvider } from './Contexts/AuthContext'
import './App.css'

function App() {
  return (
    <AuthProvider>
      <NavBar link1='signup' link2='login' />
      <Outlet />
    </AuthProvider>
  )
}

export default App