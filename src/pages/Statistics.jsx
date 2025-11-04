import { useEffect, useState } from 'react';
import { api } from '../services/api';
import { useAuth } from '../hooks/useAuth';
import { secondsToMinutes } from '../utils/workoutUtils';
import './Statistics.css';

export default function Statistics() {
  const { user, loading: authLoading } = useAuth();
  const [stats, setStats] = useState(null);
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadStatistics(user.id);
    }
  }, [user]);

  const loadStatistics = async (userId) => {
    try {
      const [workoutStats, workoutResults] = await Promise.all([
        api.getWorkoutStats(userId),
        api.getWorkoutResults(userId)
      ]);
      
      setStats(workoutStats);
      setWorkouts(workoutResults.reverse()); // Последние тренировки первыми
    } catch (error) {
      console.error('Ошибка загрузки статистики:', error);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading || !user) {
    return <div className="loading">Загрузка...</div>;
  }

  return (
    <div className="statistics-page">
      <div className="statistics-header">
        <h1>Статистика и достижения</h1>
        <p className="subtitle">Отслеживайте свой прогресс</p>
      </div>

      {stats && (
        <>
          <div className="main-stats">
            <div className="stat-box primary">
              <div className="stat-box-icon">🔥</div>
              <div className="stat-box-content">
                <div className="stat-box-value">{stats.streak}</div>
                <div className="stat-box-label">Дней подряд</div>
              </div>
            </div>

            <div className="stat-box">
              <div className="stat-box-icon">💪</div>
              <div className="stat-box-content">
                <div className="stat-box-value">{stats.totalWorkouts}</div>
                <div className="stat-box-label">Всего тренировок</div>
              </div>
            </div>

            <div className="stat-box">
              <div className="stat-box-icon">⏱️</div>
              <div className="stat-box-content">
                <div className="stat-box-value">{secondsToMinutes(stats.totalTime)}</div>
                <div className="stat-box-label">Минут тренировок</div>
              </div>
            </div>

            <div className="stat-box">
              <div className="stat-box-icon">🎯</div>
              <div className="stat-box-content">
                <div className="stat-box-value">{stats.totalExercises}</div>
                <div className="stat-box-label">Упражнений выполнено</div>
              </div>
            </div>
          </div>

          {stats.achievements.length > 0 && (
            <div className="achievements-section">
              <h2>Достижения</h2>
              <div className="achievements-grid">
                {stats.achievements.map((achievement, idx) => (
                  <div key={idx} className="achievement-card">
                    <div className="achievement-icon">{achievement.icon}</div>
                    <div className="achievement-name">{achievement.name}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {stats.weeklyProgress && stats.weeklyProgress.length > 0 && (
            <div className="progress-section">
              <h2>Прогресс за неделю</h2>
              <div className="progress-chart">
                {stats.weeklyProgress.map((day, idx) => (
                  <div key={idx} className="progress-bar-wrapper">
                    <div className="progress-bar-label">
                      {new Date(day.date).toLocaleDateString('ru-RU', { weekday: 'short' })}
                    </div>
                    <div className="progress-bar">
                      <div
                        className="progress-bar-fill"
                        style={{ height: `${Math.min((day.workouts / 3) * 100, 100)}%` }}
                      ></div>
                    </div>
                    <div className="progress-bar-value">{day.workouts}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="workout-history">
            <h2>История тренировок</h2>
            {workouts.length === 0 ? (
              <div className="empty-state">
                <p>У вас пока нет завершенных тренировок</p>
              </div>
            ) : (
              <div className="workouts-list">
                {workouts.map((workout) => (
                  <div key={workout.id} className="workout-history-item">
                    <div className="workout-history-header">
                      <div>
                        <h3>
                          {workout.program?.level === 'beginner' && 'Начальный уровень'}
                          {workout.program?.level === 'intermediate' && 'Средний уровень'}
                          {workout.program?.level === 'advanced' && 'Продвинутый уровень'}
                        </h3>
                        <p className="workout-history-date">
                          {new Date(workout.completedAt).toLocaleDateString('ru-RU', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                      <div className="workout-history-meta">
                        <span>Неделя {workout.program?.week}, День {workout.program?.day}</span>
                        <span>{secondsToMinutes(workout.duration)} мин</span>
                      </div>
                    </div>
                    <div className="workout-history-exercises">
                      <p>Упражнений: {workout.exercises?.length || 0}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

