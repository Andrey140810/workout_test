import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { api } from './services/api';
import Navbar from './components/Layout/Navbar';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Dashboard from './pages/Dashboard';
import Workout from './pages/Workout';
import Statistics from './pages/Statistics';
import Programs from './pages/Programs';
import Nutrition from './pages/Nutrition';
import './App.css';

function PrivateRoute({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = api.getCurrentUser();
    setUser(currentUser);
    setLoading(false);
  }, []);

  if (loading) {
    return <div className="loading">Загрузка...</div>;
  }

  return user ? children : <Navigate to="/login" />;
}

function AppContent() {
  const [user, setUser] = useState(null);
  const location = useLocation();

  // Обновляем состояние пользователя при изменении маршрута
  useEffect(() => {
    const currentUser = api.getCurrentUser();
    setUser(currentUser);
  }, [location.pathname]);

  // Слушаем изменения в localStorage для обновления состояния пользователя
  useEffect(() => {
    const handleStorageChange = () => {
      const currentUser = api.getCurrentUser();
      setUser(currentUser);
    };

    // Слушаем события storage (работает между вкладками)
    window.addEventListener('storage', handleStorageChange);
    
    // Слушаем кастомное событие для обновления в той же вкладке
    window.addEventListener('user-updated', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('user-updated', handleStorageChange);
    };
  }, []);

  return (
    <div className="app">
      {user && <Navbar user={user} />}
      <main className="main-content">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/workout/:program/:week/:day"
            element={
              <PrivateRoute>
                <Workout />
              </PrivateRoute>
            }
          />
          <Route
            path="/statistics"
            element={
              <PrivateRoute>
                <Statistics />
              </PrivateRoute>
            }
          />
          <Route
            path="/programs/:level?"
            element={
              <PrivateRoute>
                <Programs />
              </PrivateRoute>
            }
          />
          <Route
            path="/nutrition"
            element={
              <PrivateRoute>
                <Nutrition />
              </PrivateRoute>
            }
          />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <Router basename="/workout_test">
      <AppContent />
    </Router>
  );
}

export default App;
