// Mock API для работы с данными
// В реальном приложении здесь будут запросы к бэкенду

// Симуляция задержки сети
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Хранилище данных (в реальном приложении это будет бэкенд)
const storage = {
  users: JSON.parse(localStorage.getItem('workout_users') || '[]'),
  workouts: JSON.parse(localStorage.getItem('workout_data') || '[]'),
  currentUser: null
};

const saveUsers = () => {
  localStorage.setItem('workout_users', JSON.stringify(storage.users));
};

const saveWorkouts = () => {
  localStorage.setItem('workout_data', JSON.stringify(storage.workouts));
};

// Вспомогательные функции для статистики
function calculateStreak(workouts) {
  if (workouts.length === 0) return 0;
  
  const sortedWorkouts = workouts
    .map(w => new Date(w.completedAt))
    .sort((a, b) => b - a);
  
  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  let checkDate = new Date(today);
  
  for (const workoutDate of sortedWorkouts) {
    workoutDate.setHours(0, 0, 0, 0);
    
    if (workoutDate.getTime() === checkDate.getTime()) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else if (workoutDate < checkDate) {
      break;
    }
  }
  
  return streak;
}

function getCompletedPrograms(workouts) {
  const programs = {};
  workouts.forEach(w => {
    if (w.program && w.program.week && w.program.day) {
      const key = `${w.program.level}_${w.program.week}_${w.program.day}`;
      if (!programs[key]) {
        programs[key] = {
          level: w.program.level,
          week: w.program.week,
          day: w.program.day,
          completed: true
        };
      }
    }
  });
  return Object.values(programs);
}

function getAchievements(workouts) {
  const achievements = [];
  const streak = calculateStreak(workouts);
  
  if (workouts.length >= 1) {
    achievements.push({ id: 'first_workout', name: 'Первая тренировка', icon: '🎯' });
  }
  if (workouts.length >= 10) {
    achievements.push({ id: '10_workouts', name: '10 тренировок', icon: '🔥' });
  }
  if (workouts.length >= 50) {
    achievements.push({ id: '50_workouts', name: '50 тренировок', icon: '💪' });
  }
  if (workouts.length >= 100) {
    achievements.push({ id: '100_workouts', name: '100 тренировок', icon: '👑' });
  }
  if (streak >= 7) {
    achievements.push({ id: 'week_streak', name: 'Неделя подряд', icon: '📅' });
  }
  if (streak >= 30) {
    achievements.push({ id: 'month_streak', name: 'Месяц подряд', icon: '⭐' });
  }
  
  return achievements;
}

function getWeeklyProgress(workouts) {
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    date.setHours(0, 0, 0, 0);
    return { date, count: 0 };
  }).reverse();
  
  workouts.forEach(w => {
    const workoutDate = new Date(w.completedAt);
    workoutDate.setHours(0, 0, 0, 0);
    
    const dayIndex = last7Days.findIndex(d => d.date.getTime() === workoutDate.getTime());
    if (dayIndex !== -1) {
      last7Days[dayIndex].count++;
    }
  });
  
  return last7Days.map(d => ({
    date: d.date.toISOString().split('T')[0],
    workouts: d.count
  }));
}

function getMonthlyProgress(workouts) {
  const last30Days = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    date.setHours(0, 0, 0, 0);
    return { date, count: 0 };
  }).reverse();
  
  workouts.forEach(w => {
    const workoutDate = new Date(w.completedAt);
    workoutDate.setHours(0, 0, 0, 0);
    
    const dayIndex = last30Days.findIndex(d => d.date.getTime() === workoutDate.getTime());
    if (dayIndex !== -1) {
      last30Days[dayIndex].count++;
    }
  });
  
  return last30Days.map(d => ({
    date: d.date.toISOString().split('T')[0],
    workouts: d.count
  }));
}

export const api = {
  // Авторизация
  async register(email, password, name) {
    await delay(500);
    
    if (storage.users.find(u => u.email === email)) {
      throw new Error('Пользователь с таким email уже существует');
    }
    
    const newUser = {
      id: Date.now().toString(),
      email,
      password, // В реальном приложении пароль должен быть захеширован
      name,
      createdAt: new Date().toISOString(),
      currentProgram: 'beginner',
      currentWeek: 1,
      currentDay: 1,
      startDate: new Date().toISOString()
    };
    
    storage.users.push(newUser);
    saveUsers();
    
    const { password: _, ...user } = newUser;
    return user;
  },

  async login(email, password) {
    await delay(500);
    
    const user = storage.users.find(u => u.email === email && u.password === password);
    
    if (!user) {
      throw new Error('Неверный email или пароль');
    }
    
    const { password: _, ...userWithoutPassword } = user;
    storage.currentUser = userWithoutPassword;
    localStorage.setItem('current_user', JSON.stringify(userWithoutPassword));
    
    // Отправляем событие для обновления состояния пользователя в App
    window.dispatchEvent(new Event('user-updated'));
    
    return userWithoutPassword;
  },

  async logout() {
    await delay(200);
    storage.currentUser = null;
    localStorage.removeItem('current_user');
    // Отправляем событие для обновления состояния пользователя в App
    window.dispatchEvent(new Event('user-updated'));
  },

  getCurrentUser() {
    const user = localStorage.getItem('current_user');
    return user ? JSON.parse(user) : null;
  },

  // Тренировки
  async saveWorkoutResult(userId, workoutData) {
    await delay(300);
    
    const result = {
      id: Date.now().toString(),
      userId,
      ...workoutData,
      completedAt: new Date().toISOString()
    };
    
    storage.workouts.push(result);
    saveWorkouts();
    
    return result;
  },

  async getWorkoutResults(userId) {
    await delay(300);
    return storage.workouts.filter(w => w.userId === userId);
  },

  async getWorkoutStats(userId) {
    await delay(300);
    const workouts = storage.workouts.filter(w => w.userId === userId);
    
    const stats = {
      totalWorkouts: workouts.length,
      totalExercises: workouts.reduce((sum, w) => sum + (w.exercises?.length || 0), 0),
      totalTime: workouts.reduce((sum, w) => sum + (w.duration || 0), 0),
      streak: calculateStreak(workouts),
      completedPrograms: getCompletedPrograms(workouts),
      achievements: getAchievements(workouts),
      weeklyProgress: getWeeklyProgress(workouts),
      monthlyProgress: getMonthlyProgress(workouts)
    };
    
    return stats;
  },

  async updateUserProgress(userId, program, week, day) {
    await delay(200);
    const user = storage.users.find(u => u.id === userId);
    if (user) {
      user.currentProgram = program;
      user.currentWeek = week;
      user.currentDay = day;
      saveUsers();
      
      const { password: _, ...userWithoutPassword } = user;
      localStorage.setItem('current_user', JSON.stringify(userWithoutPassword));
      return userWithoutPassword;
    }
    throw new Error('Пользователь не найден');
  }
};
