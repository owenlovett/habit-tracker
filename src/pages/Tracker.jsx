import { useState } from 'react'
import { signOut } from 'firebase/auth'
import { auth } from '../firebase/config'
import { useHabits } from '../hooks/useHabits'

function getDisplayDate() {
  const d = new Date()
  const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']
  const months = ['January','February','March','April','May','June','July','August','September','October','November','December']
  return {
    day: days[d.getDay()],
    full: `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`
  }
}

function Tracker({ user }) {
  const { habits, todayLog, loading, addHabit, deleteHabit, toggleHabit } = useHabits(user)
  const [input, setInput] = useState('')
  const date = getDisplayDate()

  const total = habits.length
  const done = habits.filter(h => todayLog[h.id]).length
  const allComplete = total > 0 && done === total

  function handleAdd() {
    if (!input.trim()) return
    addHabit(input.trim())
    setInput('')
  }

  function handleSignOut() {
    signOut(auth)
  }

  if (loading) return <div style={{ padding: '2rem' }}>Loading...</div>

  return (
    <div style={{
      minHeight: '100vh',
      background: allComplete ? '#EAF3DE' : '#FCEBEB',
      transition: 'background 0.6s ease',
      padding: '2rem 1.5rem',
      maxWidth: '480px',
      margin: '0 auto'
    }}>

      {/* header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
        <div>
          <div style={{ fontSize: '13px', color: '#888', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '2px' }}>
            {date.day}
          </div>
          <div style={{ fontSize: '22px', fontWeight: '500' }}>
            {date.full}
          </div>
        </div>
        <button onClick={handleSignOut} style={{
          background: 'none', border: '0.5px solid #ccc', borderRadius: '8px',
          padding: '6px 12px', fontSize: '13px', cursor: 'pointer', color: '#666'
        }}>
          Sign out
        </button>
      </div>

      {/* progress bar */}
      <div style={{
        background: 'white', border: '0.5px solid #e0e0e0', borderRadius: '8px',
        padding: '10px 14px', marginBottom: '1.5rem',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center'
      }}>
        <span style={{ fontSize: '13px', color: '#888' }}>Today's progress</span>
        <span style={{ fontSize: '13px', fontWeight: '500' }}>{done} / {total} complete</span>
      </div>

      {/* habits */}
      <div style={{ fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#aaa', marginBottom: '10px' }}>
        Habits
      </div>

      {habits.length === 0 && (
        <div style={{ fontSize: '14px', color: '#aaa', marginBottom: '1rem' }}>
          No habits yet — add one below.
        </div>
      )}

      {habits.map(habit => {
        const checked = !!todayLog[habit.id]
        return (
          <div key={habit.id} style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            background: 'white', border: '0.5px solid #e0e0e0', borderRadius: '8px',
            padding: '10px 12px', marginBottom: '6px'
          }}>
            {/* checkbox */}
            <div
              onClick={() => toggleHabit(habit.id)}
              style={{
                width: '20px', height: '20px', borderRadius: '50%', flexShrink: 0,
                border: checked ? 'none' : '1.5px solid #ccc',
                background: checked ? '#3B6D11' : 'transparent',
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}
            >
              {checked && (
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path d="M2 5l2.5 2.5L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </div>

            {/* name */}
            <span style={{
              flex: 1, fontSize: '14px',
              textDecoration: checked ? 'line-through' : 'none',
              color: checked ? '#aaa' : '#222'
            }}>
              {habit.name}
            </span>

            {/* streak */}
            <span style={{ fontSize: '13px', color: '#888' }}>
              🔥 {checked ? 1 : 0}
            </span>

            {/* delete */}
            <button
              onClick={() => deleteHabit(habit.id)}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                fontSize: '16px', color: '#ccc', padding: '2px 4px', lineHeight: 1
              }}
            >
              ×
            </button>
          </div>
        )
      })}

      {/* add habit */}
      <div style={{ display: 'flex', gap: '8px', marginTop: '10px', marginBottom: '2rem' }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleAdd()}
          placeholder="Add a habit..."
          maxLength={60}
          style={{
            flex: 1, height: '36px', fontSize: '14px', padding: '0 12px',
            border: '0.5px solid #ccc', borderRadius: '8px', outline: 'none'
          }}
        />
        <button onClick={handleAdd} style={{
          height: '36px', padding: '0 14px', fontSize: '13px',
          border: '0.5px solid #ccc', borderRadius: '8px',
          background: 'white', cursor: 'pointer'
        }}>
          Add
        </button>
      </div>

    </div>
  )
}

export default Tracker