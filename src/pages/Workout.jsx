import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../hooks/useAuth';
import { getDayData, formatTime } from '../utils/workoutUtils';
import './Workout.css';

export default function Workout() {
  const { program, week, day } = useParams();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [workoutData, setWorkoutData] = useState(null);
  const [exerciseResults, setExerciseResults] = useState({});
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [startTime] = useState(Date.now());
  // Таймер отдыха между подходами
  const [restTime, setRestTime] = useState(0);
  const [isRestTimerRunning, setIsRestTimerRunning] = useState(false);
  const restTimerIntervalRef = useRef(null);
  const restTimerStartRef = useRef(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWorkoutData();
  }, [program, week, day]);

  // Таймер отдыха между подходами
  useEffect(() => {
    if (isRestTimerRunning) {
      // Если таймер только запускается, устанавливаем начальное время
      if (restTimerStartRef.current === null) {
        restTimerStartRef.current = Date.now();
      }
      
      restTimerIntervalRef.current = setInterval(() => {
        setRestTime(Date.now() - restTimerStartRef.current);
      }, 100);
    } else {
      if (restTimerIntervalRef.current) {
        clearInterval(restTimerIntervalRef.current);
        restTimerIntervalRef.current = null;
      }
    }

    return () => {
      if (restTimerIntervalRef.current) {
        clearInterval(restTimerIntervalRef.current);
        restTimerIntervalRef.current = null;
      }
    };
  }, [isRestTimerRunning]);

  const startRestTimer = () => {
    if (!isRestTimerRunning) {
      // Если таймер был на паузе, продолжаем с того же момента
      // Учитываем уже прошедшее время
      if (restTimerStartRef.current === null) {
        restTimerStartRef.current = Date.now() - restTime;
      }
      setIsRestTimerRunning(true);
    }
  };

  const pauseRestTimer = () => {
    setIsRestTimerRunning(false);
  };

  const resetRestTimer = () => {
    setIsRestTimerRunning(false);
    setRestTime(0);
    restTimerStartRef.current = null;
    if (restTimerIntervalRef.current) {
      clearInterval(restTimerIntervalRef.current);
      restTimerIntervalRef.current = null;
    }
  };

  const loadWorkoutData = () => {
    const dayData = getDayData(program, week, day);
    
    if (dayData && dayData.exercises.length > 0) {
      setWorkoutData(dayData);
      // Инициализация результатов
      const initialResults = {};
      dayData.exercises.forEach((exercise, idx) => {
        initialResults[idx] = exercise.sets ? Array(exercise.sets).fill(null).map(() => ({})) : [{}];
      });
      setExerciseResults(initialResults);
    }
    setLoading(false);
  };

  const handleSetResult = (exerciseIndex, setIndex, value) => {
    setExerciseResults(prev => {
      const newResults = { ...prev };
      if (!newResults[exerciseIndex]) {
        newResults[exerciseIndex] = [];
      }
      const exerciseResults = [...newResults[exerciseIndex]];
      exerciseResults[setIndex] = { ...exerciseResults[setIndex], reps: value };
      newResults[exerciseIndex] = exerciseResults;
      return newResults;
    });
  };

  const handleCompleteWorkout = async () => {
    if (!user || !workoutData) return;

    // Останавливаем таймер отдыха если он запущен
    setIsRestTimerRunning(false);
    if (restTimerIntervalRef.current) {
      clearInterval(restTimerIntervalRef.current);
    }
    
    const duration = Math.floor((Date.now() - startTime) / 1000); // в секундах
    
    const workoutResult = {
      program: {
        level: program,
        week: parseInt(week),
        day: parseInt(day)
      },
      exercises: workoutData.exercises.map((exercise, idx) => ({
        name: exercise.name,
        sets: exerciseResults[idx] || [],
        targetReps: exercise.reps,
        targetSets: exercise.sets
      })),
      duration,
      completed: true
    };

    try {
      await api.saveWorkoutResult(user.id, workoutResult);
      
      // Обновление прогресса пользователя
      const nextDay = (parseInt(day) % 7) + 1;
      const nextWeek = nextDay === 1 ? parseInt(week) + 1 : parseInt(week);
      
      await api.updateUserProgress(user.id, program, nextWeek, nextDay);
      
      navigate('/dashboard');
    } catch (error) {
      console.error('Ошибка сохранения результата:', error);
      alert('Ошибка при сохранении результата тренировки');
    }
  };

  if (authLoading || loading || !workoutData || !user) {
    return <div className="loading">Загрузка...</div>;
  }

  if (workoutData.exercises.length === 0) {
    return (
      <div className="workout-page">
        <div className="rest-day-message">
          <h2>День отдыха</h2>
          <p>Сегодня нет тренировки. Отдохните и восстановитесь! 💆‍♂️</p>
          <button onClick={() => navigate('/dashboard')} className="btn-primary">
            Вернуться на главную
          </button>
        </div>
      </div>
    );
  }

  const currentExercise = workoutData.exercises[currentExerciseIndex];
  const exerciseResult = exerciseResults[currentExerciseIndex] || [];
  const allExercisesCompleted = workoutData.exercises.every((_, idx) => {
    const result = exerciseResults[idx];
    if (!result) return false;
    return result.every(set => set.reps !== null && set.reps !== undefined);
  });

  return (
    <div className="workout-page">
      <div className="workout-header">
        <button onClick={() => navigate('/dashboard')} className="btn-back">
          ← Назад
        </button>
        <div className="workout-header-content">
          <div>
            <h1>{workoutData.name}</h1>
            <div className="workout-progress">
              Упражнение {currentExerciseIndex + 1} из {workoutData.exercises.length}
            </div>
          </div>
        </div>
      </div>

      <div className="exercise-card">
        <div className="exercise-header">
          <h2>{currentExercise.name}</h2>
          <span className="exercise-number">{currentExerciseIndex + 1}/{workoutData.exercises.length}</span>
        </div>
        
        <div className="exercise-info">
          <p className="exercise-description">{currentExercise.description}</p>
          <div className="exercise-target">
            <span>Цель: {currentExercise.sets} подхода по {currentExercise.reps} повторений</span>
            <span>Рекомендуемый отдых: {currentExercise.rest}</span>
          </div>
        </div>

        <div className="rest-timer-section">
          <h3>Таймер</h3>
          <div className="rest-timer-container">
            <div className="rest-timer">
              <span className="timer-icon">⏱️</span>
              <span className="timer-value">{formatTime(restTime)}</span>
            </div>
            <div className="rest-timer-controls">
              {!isRestTimerRunning ? (
                <button 
                  onClick={startRestTimer} 
                  className="timer-btn timer-btn-start"
                  title="Запустить таймер"
                >
                  ▶️ Старт
                </button>
              ) : (
                <button 
                  onClick={pauseRestTimer} 
                  className="timer-btn timer-btn-pause"
                  title="Пауза"
                >
                  ⏸️ Пауза
                </button>
              )}
              <button 
                onClick={resetRestTimer} 
                className="timer-btn timer-btn-reset"
                title="Сбросить"
              >
                ↻ Сброс
              </button>
            </div>
          </div>
        </div>

        <div className="sets-container">
          <h3>Подходы:</h3>
          {Array(currentExercise.sets || 1).fill(null).map((_, setIndex) => {
            const setResult = exerciseResult[setIndex] || {};
            return (
              <div key={setIndex} className="set-row">
                <span className="set-number">Подход {setIndex + 1}</span>
                <input
                  type="number"
                  min="0"
                  placeholder="Повторения"
                  value={setResult.reps || ''}
                  onChange={(e) => handleSetResult(currentExerciseIndex, setIndex, parseInt(e.target.value) || 0)}
                  className="reps-input"
                />
                <span className="set-target">Цель: {currentExercise.reps}</span>
              </div>
            );
          })}
        </div>

        <div className="exercise-navigation">
          {currentExerciseIndex > 0 && (
            <button
              onClick={() => setCurrentExerciseIndex(prev => prev - 1)}
              className="btn-nav"
            >
              ← Предыдущее
            </button>
          )}
          
          {currentExerciseIndex < workoutData.exercises.length - 1 ? (
            <button
              onClick={() => setCurrentExerciseIndex(prev => prev + 1)}
              className="btn-nav btn-nav-primary"
            >
              Следующее →
            </button>
          ) : (
            <button
              onClick={handleCompleteWorkout}
              disabled={!allExercisesCompleted}
              className="btn-complete"
            >
              {allExercisesCompleted ? 'Завершить тренировку ✓' : 'Заполните все подходы'}
            </button>
          )}
        </div>
      </div>

      <div className="exercises-overview">
        <h3>Все упражнения:</h3>
        <div className="exercises-list">
          {workoutData.exercises.map((exercise, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentExerciseIndex(idx)}
              className={`exercise-item ${idx === currentExerciseIndex ? 'active' : ''}`}
            >
              <span>{idx + 1}. {exercise.name}</span>
              {exerciseResults[idx] && exerciseResults[idx].every(set => set.reps) && (
                <span className="checkmark">✓</span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

