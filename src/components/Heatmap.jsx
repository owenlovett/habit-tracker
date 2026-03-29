function Heatmap({ allLogs, habits }) {
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
  const colors = ['#e8e8e8','#C0DD97','#97C459','#639922','#3B6D11']

  const today = new Date()
  const days = []

  for (let i = 90; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
    const log = allLogs[key] || {}
    const total = habits.length
    const done = habits.filter(h => log[h.id] === true).length
    const ratio = total > 0 ? done / total : 0
    const colorIdx = ratio === 0 ? 0 : ratio < 0.25 ? 1 : ratio < 0.5 ? 2 : ratio < 1 ? 3 : 4
    days.push({ key, date: d, color: colors[colorIdx], done, total })
  }

  // group into weeks (columns of 7)
  const weeks = []
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7))
  }

  return (
    <div>
      <div style={{
        fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase',
        color: '#999', marginBottom: '10px', fontWeight: '500'
      }}>
        Activity — past 91 days
      </div>

      <div style={{
        background: 'rgba(255,255,255,0.5)',
        border: '1px solid rgba(0,0,0,0.07)',
        borderRadius: '10px',
        padding: '14px'
      }}>
        {/* month labels row */}
        <div style={{ display: 'flex', gap: '3px', marginBottom: '4px' }}>
          {weeks.map((week, wi) => {
            const hasFirst = week.find(d => d.date.getDate() === 1)
            return (
                <div key={wi} style={{ flex: '1', fontSize: '9px', color: '#aaa', textAlign: 'center' }}>
                    {hasFirst ? months[hasFirst.date.getMonth()] : ''}
                </div>
            )
          })}
        </div>

        {/* grid: columns = weeks, rows = days of week */}
        <div style={{ display: 'flex', gap: '3px' }}>
          {weeks.map((week, wi) => (
            <div key={wi} style={{ flex: '1', display: 'flex', flexDirection: 'column', gap: '3px' }}>
              {week.map((day, di) => (
                <div
                  key={di}
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
          ))}
        </div>

        {/* legend */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '10px' }}>
          <span style={{ fontSize: '10px', color: '#bbb' }}>Less</span>
          {colors.map((c, i) => (
            <div key={i} style={{ width: '11px', height: '11px', borderRadius: '2px', background: c }} />
          ))}
          <span style={{ fontSize: '10px', color: '#bbb' }}>More</span>
        </div>
      </div>
    </div>
  )
}

export default Heatmap