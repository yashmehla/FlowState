import { useState, useEffect } from 'react';
import { useDashboard } from '../hooks/useDashboard';
import { Link } from 'react-router-dom';
import { AlertCircle, Clock, CheckCircle2, Play, Activity } from 'lucide-react';

export function Dashboard() {
  const { urgentTasks, todayHabits, heatmap } = useDashboard();
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 60000);
    return () => clearInterval(interval);
  }, []);

  const getIntensityColor = (level) => {
    const colors = ['#1a1a1a', 'rgba(255, 255, 255, 0.15)', 'rgba(255, 255, 255, 0.4)', 'rgba(255, 255, 255, 0.7)', '#ffffff'];
    return colors[level] || colors[0];
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', maxWidth: '1000px' }}>
      <header>
        <h1 className="font-serif" style={{ fontSize: '2.5rem', fontWeight: 600, margin: 0, color: '#fff' }}>Dashboard.</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.5rem' }}>Your unified productivity overview.</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        
        {/* Urgency Triage Widget */}
        <div className="panel" style={{ background: '#0a0a0a', border: '1px solid #222', borderRadius: '8px', padding: '1.5rem' }}>
          <h2 style={{ fontSize: '1.1rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
            <AlertCircle size={18} style={{ color: 'var(--text-primary)' }} /> Urgency Triage
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {urgentTasks.length === 0 ? (
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>All caught up. No pending tasks.</span>
            ) : (
              urgentTasks.map(task => {
                const isOverdue = task.deadline && task.deadline < now;
                return (
                  <div key={task.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', paddingBottom: '1rem', borderBottom: '1px solid #1a1a1a' }}>
                    <span style={{ color: '#fff', fontSize: '0.95rem' }}>{task.title}</span>
                    {isOverdue && (
                      <span style={{ background: '#331111', color: '#ff5555', padding: '0.1rem 0.4rem', borderRadius: '4px', fontSize: '0.7rem', fontFamily: 'var(--font-mono)' }}>
                        OVR
                      </span>
                    )}
                  </div>
                );
              })
            )}
          </div>
          <Link to="/tasks" style={{ display: 'block', marginTop: '1.5rem', color: 'var(--text-secondary)', fontSize: '0.85rem', textDecoration: 'none' }}>
            View all tasks &rarr;
          </Link>
        </div>

        {/* Daily Launchpad Widget */}
        <div className="panel" style={{ background: '#0a0a0a', border: '1px solid #222', borderRadius: '8px', padding: '1.5rem' }}>
          <h2 style={{ fontSize: '1.1rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
            <Clock size={18} style={{ color: 'var(--text-primary)' }} /> Daily Launchpad
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
            {todayHabits.length === 0 ? (
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>No habits configured.</span>
            ) : (
              todayHabits.map(habit => (
                <div key={habit.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <CheckCircle2 size={16} style={{ color: habit.isCompleted ? '#ffffff' : '#333' }} />
                  <span style={{ color: habit.isCompleted ? 'var(--text-secondary)' : '#fff', fontSize: '0.95rem', textDecoration: habit.isCompleted ? 'line-through' : 'none' }}>
                    {habit.name}
                  </span>
                </div>
              ))
            )}
          </div>
          <Link to="/pomodoro" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', width: '100%', background: '#fff', color: '#000', padding: '0.75rem', borderRadius: '6px', textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem' }}>
            <Play size={16} /> Start Deep Work
          </Link>
        </div>
      </div>

      {/* Unified Flow Heatmap Widget */}
      <div className="panel" style={{ background: '#0a0a0a', border: '1px solid #222', borderRadius: '8px', padding: '1.5rem' }}>
        <h2 style={{ fontSize: '1.1rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
          <Activity size={18} style={{ color: '#ffffff' }} /> 30-Day Productivity Score
        </h2>
        <div className="no-scrollbar" style={{ display: 'flex', gap: '4px', overflowX: 'auto' }}>
          {heatmap.map((day) => (
            <div 
              key={day.dateStr}
              title={`${day.dateStr}: ${day.pomodoros} Pomodoros, ${day.habits} Habits`}
              style={{
                width: '18px', height: '18px', borderRadius: '3px', flexShrink: 0,
                background: getIntensityColor(day.intensity),
                border: day.intensity > 0 ? `1px solid ${getIntensityColor(day.intensity + 1)}` : '1px solid #222',
                transition: 'all 0.2s ease'
              }}
            />
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '0.5rem', marginTop: '1rem', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
          Less 
          <div style={{ display: 'flex', gap: '2px' }}>
            {[0, 1, 2, 3, 4].map(level => (
              <div key={level} style={{ width: '10px', height: '10px', borderRadius: '2px', background: getIntensityColor(level) }} />
            ))}
          </div>
          More
        </div>
      </div>

    </div>
  );
}