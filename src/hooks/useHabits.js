import { useState, useEffect } from 'react'
import { db } from '../firebase/config'
import {
  collection,
  doc,
  onSnapshot,
  addDoc,
  deleteDoc,
  updateDoc,
  setDoc,
  getDoc
} from 'firebase/firestore'

function getToday() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export function useHabits(user) {
  const [habits, setHabits] = useState([])
  const [todayLog, setTodayLog] = useState({})
  const [loading, setLoading] = useState(true)

  const today = getToday()

  //habits collection
  useEffect(() => {
    if (!user) return
    const habitsRef = collection(db, 'users', user.uid, 'habits')
    const unsub = onSnapshot(habitsRef, (snap) => {
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() }))
      setHabits(data)
      setLoading(false)
    })
    return () => unsub()
  }, [user])

  //today's log
  useEffect(() => {
    if (!user) return
    const logRef = doc(db, 'users', user.uid, 'logs', today)
    const unsub = onSnapshot(logRef, (snap) => {
      setTodayLog(snap.exists() ? snap.data() : {})
    })
    return () => unsub()
  }, [user, today])

  async function addHabit(name) {
    if (!name.trim()) return
    const habitsRef = collection(db, 'users', user.uid, 'habits')
    await addDoc(habitsRef, { name, createdAt: today })
  }

  async function deleteHabit(habitId) {
    const habitRef = doc(db, 'users', user.uid, 'habits', habitId)
    await deleteDoc(habitRef)
  }

  async function toggleHabit(habitId) {
    const logRef = doc(db, 'users', user.uid, 'logs', today)
    const current = todayLog[habitId] || false
    await setDoc(logRef, { [habitId]: !current }, { merge: true })
  }

  function getStreak(habitId) {
    return todayLog[habitId] ? 1 : 0
  }

  return { habits, todayLog, loading, addHabit, deleteHabit, toggleHabit, getStreak, today }
}