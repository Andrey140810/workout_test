/**
 * Скрипт для генерации структуры Figma дизайна
 * Этот файл содержит структуру всех компонентов для переноса в Figma
 */

const designStructure = {
  colors: {
    primary: '#40E0D0',
    primaryLight: '#6FE9DD',
    primaryDark: '#2FC4B8',
    secondary: '#708090',
    bgDark: '#2B3A47',
    bgCard: '#3A4A58',
    textPrimary: '#F0F8F7',
    textSecondary: '#D0E8E5',
    textMuted: '#A8C8C4',
  },
  
  typography: {
    fontFamily: 'Inter',
    h1: { size: 40, weight: 700, lineHeight: 48 },
    h2: { size: 28, weight: 700, lineHeight: 36 },
    h3: { size: 20, weight: 600, lineHeight: 28 },
    body: { size: 16, weight: 400, lineHeight: 24 },
    small: { size: 14, weight: 400, lineHeight: 20 },
  },
  
  spacing: {
    containerMaxWidth: 1200,
    padding: 32,
    gap: 24,
    borderRadius: { large: 16, medium: 12, small: 8 },
  },
  
  pages: [
    {
      name: 'Dashboard',
      width: 1440,
      height: 1024,
      elements: [
        {
          type: 'navbar',
          x: 0,
          y: 0,
          width: 1440,
          height: 80,
          backgroundColor: '#3A4A58',
        },
        {
          type: 'header',
          x: 0,
          y: 80,
          width: 1440,
          height: 200,
          text: 'Привет, [Имя]! 👋',
        },
        {
          type: 'statsGrid',
          x: 64,
          y: 312,
          width: 1200,
          height: 150,
          cards: 4,
        },
        {
          type: 'workoutCard',
          x: 64,
          y: 494,
          width: 1200,
          height: 300,
        },
        {
          type: 'programsSection',
          x: 64,
          y: 826,
          width: 1200,
          height: 400,
        },
      ],
    },
  ],
};

// Экспорт для использования в других скриптах
if (typeof module !== 'undefined' && module.exports) {
  module.exports = designStructure;
}

// Вывод структуры в консоль
console.log('Figma Design Structure:');
console.log(JSON.stringify(designStructure, null, 2));

