import { useState } from 'react'
import { signOut } from 'firebase/auth'
import { auth } from '../firebase/config'
import { useHabits } from '../hooks/useHabits'
import Heatmap from '../components/Heatmap'

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
  const { habits, todayLog, allLogs, loading, addHabit, deleteHabit, toggleHabit, getStreak } = useHabits(user)
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

  if (loading) return (
    <div style={{
      minHeight: '100vh', display: 'flex',
      alignItems: 'center', justifyContent: 'center',
      fontSize: '14px', color: '#888'
    }}>
      Loading...
    </div>
  )

  return (
    <div style={{
      minHeight: '100vh',
      width: '100%',
      background: allComplete ? '#d4edda' : '#f8d7da',
      transition: 'background 0.6s ease',
      display: 'flex',
      justifyContent: 'center',
      padding: '2rem 1.25rem',
      boxSizing: 'border-box',
      overflowX: 'hidden',
    }}>
      <div style={{ width: '100%', maxWidth: '520px', boxSizing: 'border-box' }}>

        {/* header */}
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          alignItems: 'flex-start', marginBottom: '2rem', gap: '12px'
        }}>
          <div>
            <div style={{
              fontSize: '12px', color: '#888', textTransform: 'uppercase',
              letterSpacing: '0.1em', marginBottom: '4px'
            }}>
              {date.day}
            </div>
            <div style={{ fontSize: '26px', fontWeight: '600', color: '#1a1a1a' }}>
              {date.full}
            </div>
          </div>
          <button onClick={handleSignOut} style={{
            background: 'rgba(255,255,255,0.6)', border: '1px solid rgba(0,0,0,0.1)',
            borderRadius: '8px', padding: '7px 14px', fontSize: '13px',
            cursor: 'pointer', color: '#555', marginTop: '4px'
          }}>
            Sign out
          </button>
        </div>

        {/* progress */}
        <div style={{
          background: 'rgba(255,255,255,0.6)', border: '1px solid rgba(0,0,0,0.08)',
          borderRadius: '10px', padding: '12px 16px', marginBottom: '1.5rem',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center'
        }}>
          <span style={{ fontSize: '13px', color: '#666' }}>Today's progress</span>
          <span style={{ fontSize: '13px', fontWeight: '600', color: '#1a1a1a' }}>
            {done} / {total} complete
          </span>
        </div>

        {/* section label */}
        <div style={{
          fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase',
          color: '#999', marginBottom: '10px', fontWeight: '500'
        }}>
          Habits
        </div>

        {/* empty state */}
        {habits.length === 0 && (
          <div style={{
            fontSize: '14px', color: '#999', marginBottom: '1rem',
            padding: '20px', textAlign: 'center',
            background: 'rgba(255,255,255,0.4)', borderRadius: '10px'
          }}>
            No habits yet — add one below.
          </div>
        )}

        {/* habit items */}
        {habits.map(habit => {
          const checked = !!todayLog[habit.id]
          const streak = getStreak(habit.id)
          return (
            <div key={habit.id} style={{
              display: 'flex', alignItems: 'center', gap: '12px',
              background: 'rgba(255,255,255,0.7)', border: '1px solid rgba(0,0,0,0.07)',
              borderRadius: '10px', padding: '12px 14px', marginBottom: '8px'
            }}>
              {/* checkbox */}
              <div
                onClick={() => toggleHabit(habit.id)}
                style={{
                  width: '22px', height: '22px', borderRadius: '50%', flexShrink: 0,
                  border: checked ? 'none' : '1.5px solid #ccc',
                  background: checked ? '#2d6a4f' : 'transparent',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'background 0.15s'
                }}
              >
                {checked && (
                  <svg width="11" height="11" viewBox="0 0 10 10" fill="none">
                    <path d="M2 5l2.5 2.5L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </div>

              {/* name */}
              <span style={{
                flex: 1, fontSize: '15px',
                textDecoration: checked ? 'line-through' : 'none',
                color: checked ? '#aaa' : '#1a1a1a'
              }}>
                {habit.name}
              </span>

              {/* streak */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: '3px',
                fontSize: '13px', color: streak > 0 ? '#e07b00' : '#bbb',
                fontWeight: streak > 0 ? '600' : '400'
              }}>
                <span style={{ fontSize: '14px' }}>🔥</span>
                <span>{streak}</span>
              </div>

              {/* delete */}
              <button
                onClick={() => deleteHabit(habit.id)}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  fontSize: '18px', color: '#ccc', padding: '0 2px', lineHeight: 1,
                  transition: 'color 0.15s'
                }}
                onMouseEnter={e => e.target.style.color = '#e24b4a'}
                onMouseLeave={e => e.target.style.color = '#ccc'}
              >
                ×
              </button>
            </div>
          )
        })}

        {/* add habit */}
        <div style={{ display: 'flex', gap: '8px', margin: '12px 0 2.5rem' }}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAdd()}
            placeholder="Add a habit..."
            maxLength={60}
            style={{
              flex: 1, height: '38px', fontSize: '14px', padding: '0 14px',
              border: '1px solid rgba(0,0,0,0.12)', borderRadius: '10px',
              background: 'rgba(255,255,255,0.7)', outline: 'none', color: '#1a1a1a'
            }}
          />
          <button onClick={handleAdd} style={{
            height: '38px', padding: '0 16px', fontSize: '13px', fontWeight: '500',
            border: '1px solid rgba(0,0,0,0.12)', borderRadius: '10px',
            background: 'rgba(255,255,255,0.7)', cursor: 'pointer', color: '#1a1a1a'
          }}>
            Add
          </button>
        </div>

        {/* heatmap */}
        <Heatmap allLogs={allLogs} habits={habits} />

      </div>
    </div>
  )
}

export default Tracker