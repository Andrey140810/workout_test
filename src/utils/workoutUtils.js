import { workoutPrograms } from '../data/workoutPrograms';

/**
 * Получает программу тренировок по уровню
 * @param {string} level - Уровень программы (beginner, intermediate, advanced)
 * @returns {Object} Данные программы
 */
export function getWorkoutProgram(level) {
  return workoutPrograms[level] || workoutPrograms.beginner;
}

/**
 * Получает данные недели из программы
 * @param {string} level - Уровень программы
 * @param {number} week - Номер недели
 * @returns {Object|null} Данные недели или null
 */
export function getWeekData(level, week) {
  const program = getWorkoutProgram(level);
  return program.weeks.find(w => w.week === parseInt(week)) || null;
}

/**
 * Получает данные дня из программы
 * @param {string} level - Уровень программы
 * @param {number} week - Номер недели
 * @param {number} day - Номер дня
 * @returns {Object|null} Данные дня или null
 */
export function getDayData(level, week, day) {
  const weekData = getWeekData(level, week);
  if (!weekData) return null;
  return weekData.days.find(d => d.day === parseInt(day)) || null;
}

/**
 * Получает текущую программу, неделю и день пользователя
 * @param {Object} user - Объект пользователя
 * @returns {Object} Объект с currentProgram, currentWeek, currentDay
 */
export function getUserCurrentWorkout(user) {
  if (!user) return null;
  
  const currentProgram = getWorkoutProgram(user.currentProgram);
  const currentWeek = currentProgram.weeks.find(w => w.week === user.currentWeek) || currentProgram.weeks[0];
  const currentDay = currentWeek.days.find(d => d.day === user.currentDay) || currentWeek.days[0];
  
  return {
    currentProgram,
    currentWeek,
    currentDay
  };
}

/**
 * Форматирует миллисекунды в формат MM:SS
 * @param {number} milliseconds - Время в миллисекундах
 * @returns {string} Отформатированное время (MM:SS)
 */
export function formatTime(milliseconds) {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

/**
 * Форматирует секунды в минуты для отображения
 * @param {number} seconds - Время в секундах
 * @returns {number} Минуты
 */
export function secondsToMinutes(seconds) {
  return Math.floor(seconds / 60);
}

