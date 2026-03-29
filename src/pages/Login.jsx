import { signInWithPopup } from 'firebase/auth'
import { auth, provider } from '../firebase/config'

function Login() {
  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, provider)
    } catch (error) {
      console.error('Login failed:', error)
    }
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      gap: '1rem'
    }}>
      <h1>Habit Tracker</h1>
      <p>Sign in to track your habits</p>
      <button onClick={handleGoogleSignIn}>
        Sign in with Google
      </button>
    </div>
  )
}

export default Login