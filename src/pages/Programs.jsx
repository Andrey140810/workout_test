import { useParams, Link, useNavigate } from 'react-router-dom';
import { workoutPrograms } from '../data/workoutPrograms';
import { getWorkoutProgram } from '../utils/workoutUtils';
import './Programs.css';

export default function Programs() {
  const { level } = useParams();
  
  if (level && workoutPrograms[level]) {
    return <ProgramDetail level={level} />;
  }

  return (
    <div className="programs-page">
      <div className="programs-header">
        <h1>Программы тренировок</h1>
        <p className="subtitle">Выберите программу по своему уровню подготовки</p>
      </div>

      <div className="programs-grid">
        {Object.entries(workoutPrograms).map(([key, program]) => (
          <Link key={key} to={`/programs/${key}`} className="program-card-large">
            <div className="program-card-header">
              <h2>{program.name}</h2>
              <span className="program-badge">{program.duration}</span>
            </div>
            <p className="program-description">{program.description}</p>
            <div className="program-stats">
              <span>{program.weeks.length} недель</span>
              <span>•</span>
              <span>От начального до продвинутого</span>
            </div>
            <div className="program-arrow">→</div>
          </Link>
        ))}
      </div>
    </div>
  );
}

function ProgramDetail({ level }) {
  const program = getWorkoutProgram(level);
  const navigate = useNavigate();
  
  if (!program) {
    return <div className="programs-page">Программа не найдена</div>;
  }

  const handleStartWorkout = (week, day) => {
    navigate(`/workout/${level}/${week}/${day}`);
  };

  return (
    <div className="program-detail-page">
      <Link to="/programs" className="btn-back">← Назад к программам</Link>
      
      <div className="program-detail-header">
        <h1>{program.name}</h1>
        <p className="subtitle">{program.description}</p>
        <div className="program-meta">
          <span>⏱️ {program.duration}</span>
          <span>📅 {program.weeks.length} недель</span>
        </div>
      </div>

      <div className="weeks-container">
        {program.weeks.map((week) => (
          <div key={week.week} className="week-card">
            <h2 className="week-title">Неделя {week.week}</h2>
            <div className="days-grid">
              {week.days.map((day) => (
                <div key={day.day} className="day-card">
                  <div className="day-header">
                    <h3>День {day.day}</h3>
                    <span className="day-name">{day.name}</span>
                  </div>
                  {day.exercises.length > 0 ? (
                    <>
                      <ul className="day-exercises">
                        {day.exercises.map((exercise, idx) => (
                          <li key={idx}>
                            <span className="exercise-name">{exercise.name}</span>
                            <span className="exercise-reps">
                              {exercise.sets} × {exercise.reps}
                            </span>
                          </li>
                        ))}
                      </ul>
                      <button
                        onClick={() => handleStartWorkout(week.week, day.day)}
                        className="btn-start-workout-day"
                      >
                        Начать тренировку
                      </button>
                    </>
                  ) : (
                    <div className="rest-day-badge">Отдых</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

