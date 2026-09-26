import { useState, useMemo } from 'react';
import { useHabits, getLocalDateString } from '../hooks/useHabits';
import { Plus, Trash2, CheckCircle2, Circle } from 'lucide-react';

export function Habits() {
  const { habits, habitLogs, addHabit, deleteHabit, toggleHabitLog } = useHabits();
  const [newHabit, setNewHabit] = useState('');

  const todayStr = getLocalDateString();

  // Generate an array of the last 30 days (YYYY-MM-DD strings) for the heatmap
  const last30Days = useMemo(() => {
    const dates = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      dates.push(getLocalDateString(d));
    }
    return dates;
  }, []);

  const handleAdd = (e) => {
    e.preventDefault();
    addHabit(newHabit);
    setNewHabit('');
  };

  const isCompleted = (habitId, dateStr) => {
    return habitLogs.some(log => log.habitId === habitId && log.date === dateStr);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
      <header>
        <h1 className="font-serif" style={{ fontSize: '2.5rem', fontWeight: 600, margin: 0, color: '#fff' }}>Habits.</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.5rem' }}>Track daily routines and maintain consistency.</p>
      </header>

      {/* Input Card */}
      <form onSubmit={handleAdd} className="input-card" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <input 
          type="text"
          value={newHabit}
          onChange={(e) => setNewHabit(e.target.value)}
          placeholder="New daily habit..."
          style={{ 
            background: 'transparent', border: 'none', color: '#fff',
            fontSize: '1.1rem', outline: 'none', flex: 1
          }}
        />
        <button 
          type="submit"
          disabled={!newHabit.trim()}
          style={{ 
            background: '#fff', color: '#000', border: 'none', padding: '0.5rem 1rem', 
            borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem',
            fontWeight: 600, fontSize: '0.85rem'
          }}
        >
          <Plus size={16} /> Add
        </button>
      </form>

      {/* Habits Grid */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: '#222', border: '1px solid #222', borderRadius: '8px', overflow: 'hidden' }}>
        {habits.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)', background: '#0a0a0a' }}>
            No habits configured yet.
          </div>
        ) : (
          habits.map(habit => {
            const completedToday = isCompleted(habit.id, todayStr);
            
            return (
              <div key={habit.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.5rem', background: '#0a0a0a' }}>
                
                {/* Habit Info & Today's Toggle */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', width: '250px' }}>
                  <button 
                    onClick={() => toggleHabitLog(habit.id, todayStr)}
                    style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 0, color: completedToday ? '#6e8574' : 'var(--text-secondary)', transition: 'color 0.2s ease' }}
                  >
                    {completedToday ? <CheckCircle2 size={24} /> : <Circle size={24} />}
                  </button>
                  <span style={{ fontSize: '1rem', color: '#fff', fontWeight: 500, opacity: completedToday ? 0.6 : 1, textDecoration: completedToday ? 'line-through' : 'none' }}>
                    {habit.name}
                  </span>
                </div>

                {/* 30-Day Heatmap Grid */}
                <div className="no-scrollbar" style={{ flex: 1, display: 'flex', justifyContent: 'flex-end', gap: '4px', overflowX: 'auto', padding: '0 1rem' }}>
                  {last30Days.map(dateStr => {
                    const done = isCompleted(habit.id, dateStr);
                    return (
                      <div 
                        key={dateStr}
                        title={`${dateStr}: ${done ? 'Completed' : 'Missed'}`}
                        style={{
                          width: '12px', height: '12px', borderRadius: '2px', flexShrink: 0,
                          background: done ? '#6e8574' : '#1a1a1a',
                          border: done ? '1px solid #829c89' : '1px solid #2a2a2a',
                          transition: 'all 0.2s ease'
                        }}
                      />
                    );
                  })}
                </div>

                {/* Actions */}
                <button 
                  onClick={() => deleteHabit(habit.id)}
                  style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '0.5rem', marginLeft: '1rem' }}
                >
                  <Trash2 size={16} />
                </button>

              </div>
            );
          })
        )}
      </div>

    </div>
  );
}