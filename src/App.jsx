import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { onAuthStateChanged, getRedirectResult } from 'firebase/auth'
import { auth } from './firebase/config'
import Login from './pages/Login'
import Tracker from './pages/Tracker'

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getRedirectResult(auth).catch(console.error)

    const unsub = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
      setLoading(false)
    })
    return () => unsub()
  }, [])

  if (loading) return <div style={{
    minHeight: '100vh', display: 'flex',
    alignItems: 'center', justifyContent: 'center',
    fontSize: '14px', color: '#888'
  }}>Loading...</div>

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
        <Route path="/" element={user ? <Tracker user={user} /> : <Navigate to="/login" />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App