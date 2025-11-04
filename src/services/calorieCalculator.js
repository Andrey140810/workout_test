// Калькулятор калорий
// Использует формулу Миффлина-Сан Жеора

export function calculateBMR(weight, height, age, gender) {
  // BMR (Basal Metabolic Rate) - базовый метаболизм
  if (gender === 'male') {
    return 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    return 10 * weight + 6.25 * height - 5 * age - 161;
  }
}

export function calculateTDEE(bmr, activityLevel) {
  // TDEE (Total Daily Energy Expenditure) - общий расход энергии
  const multipliers = {
    sedentary: 1.2,           // Сидячий образ жизни
    light: 1.375,             // Легкая активность (1-3 тренировки в неделю)
    moderate: 1.55,           // Умеренная активность (3-5 тренировок в неделю)
    active: 1.725,            // Высокая активность (6-7 тренировок в неделю)
    veryActive: 1.9           // Очень высокая активность (2 тренировки в день)
  };
  
  return bmr * (multipliers[activityLevel] || 1.2);
}

export function calculateCalories(weight, height, age, gender, activityLevel, goal) {
  const bmr = calculateBMR(weight, height, age, gender);
  const tdee = calculateTDEE(bmr, activityLevel);
  
  // Корректировка в зависимости от цели
  const goalMultipliers = {
    loseWeight: 0.85,        // Дефицит 15%
    maintain: 1.0,            // Поддержание веса
    gainWeight: 1.15          // Профицит 15%
  };
  
  const dailyCalories = Math.round(tdee * (goalMultipliers[goal] || 1.0));
  
  // Расчет макронутриентов
  let protein, carbs, fat;
  
  if (goal === 'loseWeight') {
    // Для похудения: больше белка, меньше углеводов
    protein = Math.round(weight * 2.2); // 2.2г белка на кг веса
    fat = Math.round(dailyCalories * 0.25 / 9); // 25% калорий из жиров
    carbs = Math.round((dailyCalories - protein * 4 - fat * 9) / 4);
  } else if (goal === 'gainWeight') {
    // Для набора массы: больше углеводов и белка
    protein = Math.round(weight * 2.0); // 2г белка на кг веса
    fat = Math.round(dailyCalories * 0.25 / 9); // 25% калорий из жиров
    carbs = Math.round((dailyCalories - protein * 4 - fat * 9) / 4);
  } else {
    // Для поддержания: сбалансированное соотношение
    protein = Math.round(weight * 1.8); // 1.8г белка на кг веса
    fat = Math.round(dailyCalories * 0.30 / 9); // 30% калорий из жиров
    carbs = Math.round((dailyCalories - protein * 4 - fat * 9) / 4);
  }
  
  return {
    bmr: Math.round(bmr),
    tdee: Math.round(tdee),
    dailyCalories,
    macros: {
      protein,
      carbs,
      fat,
      proteinCalories: protein * 4,
      carbsCalories: carbs * 4,
      fatCalories: fat * 9
    }
  };
}

export function getActivityLevelDescription(level) {
  const descriptions = {
    sedentary: 'Сидячий образ жизни, минимум физической активности',
    light: 'Легкая активность (1-3 тренировки в неделю)',
    moderate: 'Умеренная активность (3-5 тренировок в неделю)',
    active: 'Высокая активность (6-7 тренировок в неделю)',
    veryActive: 'Очень высокая активность (2 тренировки в день или тяжелая физическая работа)'
  };
  
  return descriptions[level] || '';
}

export function getGoalDescription(goal) {
  const descriptions = {
    loseWeight: 'Похудение (дефицит калорий 15%)',
    maintain: 'Поддержание веса',
    gainWeight: 'Набор массы (профицит калорий 15%)'
  };
  
  return descriptions[goal] || '';
}

