import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout';
import { Dashboard } from './pages/Dashboard';
import { Tasks } from './pages/Tasks';
import { Notes } from './pages/Notes';
import { Pomodoro } from './pages/Pomodoro';
import { Habits } from './pages/Habits';

// Helper to generate a unique client ID and persist it in localStorage
const getClientId = () => {
  let clientId = localStorage.getItem('flowstate_client_id');
  if (!clientId) {
    // Generate a random ID using crypto if available, or fallback
    clientId = window.crypto && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 15);
    localStorage.setItem('flowstate_client_id', clientId);
  }
  return clientId;
};

export default function App() {
  
  useEffect(() => {
    const pingTelemetry = async () => {
      try {
        const payload = {
          clientId: getClientId(),
          appVersion: '1.0.0', 
          platform: 'windows', // We can dynamically fetch this using Tauri APIs later
          event: 'app_open'
        };

        // Fire and forget - doesn't block the UI
        fetch('http://localhost:5000/api/telemetry/ping', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        }).catch(err => console.log('Telemetry server might be offline:', err.message));
        
      } catch (err) {
        console.error('Error constructing telemetry payload:', err);
      }
    };

    pingTelemetry();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="tasks" element={<Tasks />} />
          <Route path="habits" element={<Habits />} />
          <Route path="pomodoro" element={<Pomodoro />} />
          <Route path="notes" element={<Notes />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}