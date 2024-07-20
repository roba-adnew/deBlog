import React from 'react'
import { Outlet } from 'react-router-dom'
import NavBar from '../../shared/Components/NavBar'
import { AuthProvider } from '../../shared/Contexts/AuthContext'
import './App.css'

function App() {
  return (
    <AuthProvider>
      <NavBar />
      <Outlet />
    </AuthProvider>
  )
}

export default App