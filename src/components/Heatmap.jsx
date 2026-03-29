function Heatmap({ allLogs, habits }) {
  const cells = 91
  const today = new Date()
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
  const colors = ['#e8e8e8','#C0DD97','#97C459','#639922','#3B6D11']

  const days = []
  for (let i = cells - 1; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
    const log = allLogs[key] || {}
    const total = habits.length
    const done = habits.filter(h => log[h.id] === true).length
    const ratio = total > 0 ? done / total : 0
    const colorIdx = ratio === 0 ? 0 : ratio < 0.25 ? 1 : ratio < 0.5 ? 2 : ratio < 1 ? 3 : 4
    days.push({ key, date: d, color: colors[colorIdx], ratio, done, total })
  }

  return (
    <div>
      <div style={{
        fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase',
        color: '#aaa', marginBottom: '10px'
      }}>
        Activity — past 91 days
      </div>

      {/* month labels */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(13, 1fr)', gap: '3px', marginBottom: '3px' }}>
        {days.map((day, i) => {
          const showMonth = day.date.getDate() <= 7
          return (
            <div key={i} style={{ fontSize: '10px', color: '#bbb', textAlign: 'center' }}>
              {showMonth ? months[day.date.getMonth()] : ''}
            </div>
          )
        })}
      </div>

      {/* cells */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(13, 1fr)', gap: '3px' }}>
        {days.map((day, i) => (
          <div
            key={i}
            title={`${months[day.date.getMonth()]} ${day.date.getDate()} — ${day.done}/${day.total} habits`}
            style={{
              aspectRatio: '1',
              borderRadius: '2px',
              background: day.color,
              cursor: 'default'
            }}
          />
        ))}
      </div>

      {/* legend */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '8px' }}>
        <span style={{ fontSize: '11px', color: '#bbb' }}>Less</span>
        {colors.map((c, i) => (
          <div key={i} style={{ width: '12px', height: '12px', borderRadius: '2px', background: c }} />
        ))}
        <span style={{ fontSize: '11px', color: '#bbb' }}>More</span>
      </div>
    </div>
  )
}

export default Heatmap