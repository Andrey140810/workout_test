import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../hooks/useAuth';
import { getUserCurrentWorkout, secondsToMinutes } from '../utils/workoutUtils';
import { workoutPrograms } from '../data/workoutPrograms';
import './Dashboard.css';

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadStats(user.id);
    }
  }, [user]);

  const loadStats = async (userId) => {
    try {
      const workoutStats = await api.getWorkoutStats(userId);
      setStats(workoutStats);
    } catch (error) {
      console.error('Ошибка загрузки статистики:', error);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading || !user) {
    return <div className="loading">Загрузка...</div>;
  }

  const { currentProgram, currentDay } = getUserCurrentWorkout(user);

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Привет, {user.name}! 👋</h1>
        <p className="dashboard-subtitle">Готовы к тренировке?</p>
      </div>

      {stats && (
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">🔥</div>
            <div className="stat-content">
              <div className="stat-value">{stats.streak}</div>
              <div className="stat-label">Дней подряд</div>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">💪</div>
            <div className="stat-content">
              <div className="stat-value">{stats.totalWorkouts}</div>
              <div className="stat-label">Тренировок</div>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">⏱️</div>
            <div className="stat-content">
              <div className="stat-value">{secondsToMinutes(stats.totalTime)}</div>
              <div className="stat-label">Минут</div>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">🎯</div>
            <div className="stat-content">
              <div className="stat-value">{stats.achievements.length}</div>
              <div className="stat-label">Достижений</div>
            </div>
          </div>
        </div>
      )}

      <div className="current-workout-card">
        <div className="workout-card-header">
          <h2>Текущая тренировка</h2>
          <span className="workout-badge">{currentProgram.name}</span>
        </div>
        
        <div className="workout-info">
          <div className="workout-info-item">
            <span className="info-label">Неделя:</span>
            <span className="info-value">{user.currentWeek}</span>
          </div>
          <div className="workout-info-item">
            <span className="info-label">День:</span>
            <span className="info-value">{user.currentDay}</span>
          </div>
          <div className="workout-info-item">
            <span className="info-label">Тип:</span>
            <span className="info-value">{currentDay.name}</span>
          </div>
        </div>

        {currentDay.exercises.length > 0 ? (
          <>
            <div className="exercises-preview">
              <h3>Упражнения:</h3>
              <ul className="exercises-list">
                {currentDay.exercises.slice(0, 3).map((exercise, idx) => (
                  <li key={idx}>{exercise.name}</li>
                ))}
                {currentDay.exercises.length > 3 && (
                  <li>+{currentDay.exercises.length - 3} еще</li>
                )}
              </ul>
            </div>

            <Link to={`/workout/${user.currentProgram}/${user.currentWeek}/${user.currentDay}`} className="btn-start-workout">
              Начать тренировку
            </Link>
          </>
        ) : (
          <div className="rest-day">
            <p>Сегодня день отдыха! Отдохните и восстановитесь 💆‍♂️</p>
          </div>
        )}
      </div>

      <div className="programs-section">
        <h2>Программы тренировок</h2>
        <div className="programs-grid">
          {Object.entries(workoutPrograms).map(([key, program]) => (
            <Link key={key} to={`/programs/${key}`} className="program-card">
              <h3>{program.name}</h3>
              <p>{program.description}</p>
              <div className="program-meta">
                <span>⏱️ {program.duration}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

