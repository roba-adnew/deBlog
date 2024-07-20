import React from 'react'
import { Outlet } from 'react-router-dom'
import { AuthProvider } from '../../shared/Contexts/AuthContext'
import NavBar from '../../shared/Components/NavBar'
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