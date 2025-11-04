// Программа тренировок Street Workout на 3 месяца
// Разбита по неделям и дням

export const workoutPrograms = {
  beginner: {
    name: "Начальный уровень",
    description: "Программа для новичков в стрит воркауте",
    duration: "12 недель",
    weeks: [
      // Неделя 1
      {
        week: 1,
        days: [
          {
            day: 1,
            name: "Верхняя часть тела",
            exercises: [
              { name: "Отжимания", sets: 3, reps: "8-10", rest: "60 сек", description: "Классические отжимания от пола" },
              { name: "Подтягивания (с резинкой)", sets: 3, reps: "5-8", rest: "90 сек", description: "С помощью резинки для облегчения" },
              { name: "Отжимания на брусьях (с ногами)", sets: 3, reps: "6-8", rest: "60 сек", description: "С упором ног для облегчения" },
              { name: "Планка", sets: 3, reps: "30 сек", rest: "45 сек", description: "Удержание планки" }
            ]
          },
          {
            day: 2,
            name: "Отдых",
            exercises: []
          },
          {
            day: 3,
            name: "Ноги и кора",
            exercises: [
              { name: "Приседания", sets: 3, reps: "15-20", rest: "60 сек", description: "Классические приседания" },
              { name: "Выпады", sets: 3, reps: "12-15 (каждая нога)", rest: "60 сек", description: "Поочередно на каждую ногу" },
              { name: "Подъемы на носки", sets: 3, reps: "20-25", rest: "45 сек", description: "На икроножные мышцы" },
              { name: "Планка", sets: 3, reps: "30 сек", rest: "45 сек", description: "Удержание планки" },
              { name: "Подъемы ног лежа", sets: 3, reps: "12-15", rest: "45 сек", description: "Для пресса" }
            ]
          },
          {
            day: 4,
            name: "Отдых",
            exercises: []
          },
          {
            day: 5,
            name: "Верхняя часть тела",
            exercises: [
              { name: "Отжимания", sets: 3, reps: "8-10", rest: "60 сек", description: "Классические отжимания от пола" },
              { name: "Подтягивания (с резинкой)", sets: 3, reps: "5-8", rest: "90 сек", description: "С помощью резинки для облегчения" },
              { name: "Отжимания на брусьях (с ногами)", sets: 3, reps: "6-8", rest: "60 сек", description: "С упором ног для облегчения" },
              { name: "Планка", sets: 3, reps: "30 сек", rest: "45 сек", description: "Удержание планки" }
            ]
          },
          {
            day: 6,
            name: "Кардио",
            exercises: [
              { name: "Берпи", sets: 3, reps: "8-10", rest: "60 сек", description: "Полное упражнение берпи" },
              { name: "Прыжки в планке", sets: 3, reps: "10-12", rest: "45 сек", description: "Прыжки ногами в планке" },
              { name: "Бег на месте", sets: 3, reps: "30 сек", rest: "30 сек", description: "Высокая интенсивность" }
            ]
          },
          {
            day: 7,
            name: "Отдых",
            exercises: []
          }
        ]
      },
      // Неделя 2
      {
        week: 2,
        days: [
          {
            day: 1,
            name: "Верхняя часть тела",
            exercises: [
              { name: "Отжимания", sets: 3, reps: "10-12", rest: "60 сек", description: "Классические отжимания от пола" },
              { name: "Подтягивания (с резинкой)", sets: 3, reps: "6-9", rest: "90 сек", description: "С помощью резинки для облегчения" },
              { name: "Отжимания на брусьях (с ногами)", sets: 3, reps: "7-9", rest: "60 сек", description: "С упором ног для облегчения" },
              { name: "Планка", sets: 3, reps: "35 сек", rest: "45 сек", description: "Удержание планки" }
            ]
          },
          {
            day: 2,
            name: "Отдых",
            exercises: []
          },
          {
            day: 3,
            name: "Ноги и кора",
            exercises: [
              { name: "Приседания", sets: 3, reps: "18-22", rest: "60 сек", description: "Классические приседания" },
              { name: "Выпады", sets: 3, reps: "14-16 (каждая нога)", rest: "60 сек", description: "Поочередно на каждую ногу" },
              { name: "Подъемы на носки", sets: 3, reps: "22-27", rest: "45 сек", description: "На икроножные мышцы" },
              { name: "Планка", sets: 3, reps: "35 сек", rest: "45 сек", description: "Удержание планки" },
              { name: "Подъемы ног лежа", sets: 3, reps: "14-17", rest: "45 сек", description: "Для пресса" }
            ]
          },
          {
            day: 4,
            name: "Отдых",
            exercises: []
          },
          {
            day: 5,
            name: "Верхняя часть тела",
            exercises: [
              { name: "Отжимания", sets: 3, reps: "10-12", rest: "60 сек", description: "Классические отжимания от пола" },
              { name: "Подтягивания (с резинкой)", sets: 3, reps: "6-9", rest: "90 сек", description: "С помощью резинки для облегчения" },
              { name: "Отжимания на брусьях (с ногами)", sets: 3, reps: "7-9", rest: "60 сек", description: "С упором ног для облегчения" },
              { name: "Планка", sets: 3, reps: "35 сек", rest: "45 сек", description: "Удержание планки" }
            ]
          },
          {
            day: 6,
            name: "Кардио",
            exercises: [
              { name: "Берпи", sets: 3, reps: "10-12", rest: "60 сек", description: "Полное упражнение берпи" },
              { name: "Прыжки в планке", sets: 3, reps: "12-14", rest: "45 сек", description: "Прыжки ногами в планке" },
              { name: "Бег на месте", sets: 3, reps: "35 сек", rest: "30 сек", description: "Высокая интенсивность" }
            ]
          },
          {
            day: 7,
            name: "Отдых",
            exercises: []
          }
        ]
      }
    ]
  },
  intermediate: {
    name: "Средний уровень",
    description: "Программа для тех, кто уже освоил базовые упражнения",
    duration: "12 недель",
    weeks: [
      {
        week: 1,
        days: [
          {
            day: 1,
            name: "Тяга",
            exercises: [
              { name: "Подтягивания", sets: 4, reps: "8-12", rest: "90 сек", description: "Классические подтягивания" },
              { name: "Подтягивания широким хватом", sets: 3, reps: "6-10", rest: "120 сек", description: "Широкий хват для широчайших" },
              { name: "Австралийские подтягивания", sets: 3, reps: "12-15", rest: "60 сек", description: "Горизонтальные подтягивания" },
              { name: "Обратные отжимания", sets: 3, reps: "8-12", rest: "90 сек", description: "На брусьях или скамье" }
            ]
          },
          {
            day: 2,
            name: "Отдых",
            exercises: []
          },
          {
            day: 3,
            name: "Жим",
            exercises: [
              { name: "Отжимания", sets: 4, reps: "15-20", rest: "60 сек", description: "Классические отжимания" },
              { name: "Отжимания на брусьях", sets: 4, reps: "10-15", rest: "90 сек", description: "Без помощи ног" },
              { name: "Отжимания с наклоном", sets: 3, reps: "12-15", rest: "60 сек", description: "Ноги выше уровня тела" },
              { name: "Алмазные отжимания", sets: 3, reps: "8-12", rest: "60 сек", description: "Узкий хват для трицепсов" }
            ]
          },
          {
            day: 4,
            name: "Отдых",
            exercises: []
          },
          {
            day: 5,
            name: "Ноги и кора",
            exercises: [
              { name: "Приседания с прыжком", sets: 3, reps: "12-15", rest: "60 сек", description: "Взрывные приседания" },
              { name: "Болгарские приседания", sets: 3, reps: "12-15 (каждая нога)", rest: "60 сек", description: "Односторонняя нагрузка" },
              { name: "Подъемы на носки", sets: 4, reps: "25-30", rest: "45 сек", description: "На икроножные" },
              { name: "Планка", sets: 3, reps: "60 сек", rest: "45 сек", description: "Удержание планки" },
              { name: "Велосипед", sets: 3, reps: "20-25 (каждая сторона)", rest: "45 сек", description: "Для пресса" },
              { name: "V-подъемы", sets: 3, reps: "12-15", rest: "45 сек", description: "Для пресса" }
            ]
          },
          {
            day: 6,
            name: "HIIT",
            exercises: [
              { name: "Берпи", sets: 4, reps: "12-15", rest: "45 сек", description: "Полное упражнение" },
              { name: "Прыжки в планке", sets: 4, reps: "15-20", rest: "30 сек", description: "Быстро и интенсивно" },
              { name: "Медвежья походка", sets: 3, reps: "30 сек", rest: "30 сек", description: "Кардио упражнение" },
              { name: "Бег на месте", sets: 3, reps: "45 сек", rest: "30 сек", description: "Высокая интенсивность" }
            ]
          },
          {
            day: 7,
            name: "Отдых",
            exercises: []
          }
        ]
      }
    ]
  },
  advanced: {
    name: "Продвинутый уровень",
    description: "Для опытных спортсменов, изучающих сложные элементы",
    duration: "12 недель",
    weeks: [
      {
        week: 1,
        days: [
          {
            day: 1,
            name: "Сложные элементы",
            exercises: [
              { name: "Подтягивания", sets: 4, reps: "15-20", rest: "120 сек", description: "Максимальное количество" },
              { name: "Подтягивания с весом", sets: 3, reps: "5-8", rest: "180 сек", description: "С дополнительным весом" },
              { name: "Отжимания на брусьях с весом", sets: 3, reps: "8-12", rest: "120 сек", description: "С дополнительным весом" },
              { name: "Флажок (тренировка)", sets: 3, reps: "10-15 сек", rest: "120 сек", description: "Удержание флажка" },
              { name: "Стойка на руках у стены", sets: 3, reps: "20-30 сек", rest: "120 сек", description: "Тренировка баланса" }
            ]
          },
          {
            day: 2,
            name: "Отдых",
            exercises: []
          },
          {
            day: 3,
            name: "Сила и мощь",
            exercises: [
              { name: "Взрывные отжимания", sets: 4, reps: "10-15", rest: "90 сек", description: "С хлопком в ладоши" },
              { name: "Пистолетики", sets: 3, reps: "5-8 (каждая нога)", rest: "120 сек", description: "Приседания на одной ноге" },
              { name: "Подъемы ног в висе", sets: 4, reps: "12-15", rest: "90 сек", description: "На турнике" },
              { name: "Планка на одной руке", sets: 3, reps: "20-30 сек (каждая сторона)", rest: "60 сек", description: "Усложненная планка" },
              { name: "L-sit", sets: 3, reps: "15-20 сек", rest: "90 сек", description: "Удержание L-позиции" }
            ]
          },
          {
            day: 4,
            name: "Отдых",
            exercises: []
          },
          {
            day: 5,
            name: "Комбинации",
            exercises: [
              { name: "Подтягивания", sets: 4, reps: "15-20", rest: "120 сек", description: "Максимальное количество" },
              { name: "Отжимания на брусьях", sets: 4, reps: "15-20", rest: "90 сек", description: "Без помощи ног" },
              { name: "Мускулистый подъем", sets: 3, reps: "5-8", rest: "180 сек", description: "Сложный элемент" },
              { name: "Флажок (прогрессия)", sets: 4, reps: "15-25 сек", rest: "120 сек", description: "Удержание флажка" },
              { name: "Стойка на руках у стены", sets: 3, reps: "30-45 сек", rest: "120 сек", description: "Тренировка баланса" }
            ]
          },
          {
            day: 6,
            name: "Выносливость",
            exercises: [
              { name: "Подтягивания на выносливость", sets: 5, reps: "10-15", rest: "60 сек", description: "Короткий отдых" },
              { name: "Отжимания на выносливость", sets: 5, reps: "20-25", rest: "60 сек", description: "Короткий отдых" },
              { name: "Круговая тренировка", sets: 4, reps: "20 мин", rest: "2 мин", description: "Комплексная тренировка" }
            ]
          },
          {
            day: 7,
            name: "Отдых",
            exercises: []
          }
        ]
      }
    ]
  }
};

// Программы по месяцам (комбинируют уровни)
export const monthlyPrograms = {
  month1: {
    name: "Месяц 1: Основы",
    level: "beginner",
    weeks: [1, 2, 3, 4],
    description: "Освоение базовых упражнений и техники"
  },
  month2: {
    name: "Месяц 2: Прогресс",
    level: "intermediate",
    weeks: [1, 2, 3, 4],
    description: "Увеличение нагрузки и сложности упражнений"
  },
  month3: {
    name: "Месяц 3: Мастерство",
    level: "advanced",
    weeks: [1, 2, 3, 4],
    description: "Изучение сложных элементов и максимальная нагрузка"
  }
};

