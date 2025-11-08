import sharp from 'sharp';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { mkdir } from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const outputDir = join(__dirname, '..', 'public', 'images', 'workout');

// Цвета для разных типов изображений
const colors = {
  dashboard: ['#1e3a8a', '#3b82f6'], // Синие оттенки
  beginner: ['#059669', '#10b981'], // Зеленые оттенки
  intermediate: ['#d97706', '#f59e0b'], // Оранжевые оттенки
  advanced: ['#dc2626', '#ef4444'], // Красные оттенки
  exercise: ['#7c3aed', '#a855f7'], // Фиолетовые оттенки
  workout: ['#0891b2', '#06b6d4'], // Голубые оттенки
  stats: ['#64748b', '#94a3b8'], // Серые оттенки
};

async function createGradientImage(width, height, color1, color2, filename) {
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${color1};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${color2};stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#grad)" />
      <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="24" fill="white" text-anchor="middle" dominant-baseline="middle" opacity="0.3">WORKOUT</text>
    </svg>
  `;

  await sharp(Buffer.from(svg))
    .jpeg({ quality: 90 })
    .toFile(join(outputDir, filename));
  
  console.log(`Created: ${filename}`);
}

async function generateImages() {
  try {
    await mkdir(outputDir, { recursive: true });
    console.log('Generating workout images...\n');

    // Dashboard images
    await createGradientImage(1200, 600, colors.dashboard[0], colors.dashboard[1], 'dashboard-hero.jpg');
    await createGradientImage(1200, 800, colors.dashboard[0], colors.dashboard[1], 'dashboard-background.jpg');

    // Program images
    await createGradientImage(800, 600, colors.beginner[0], colors.beginner[1], 'beginner-program.jpg');
    await createGradientImage(800, 600, colors.intermediate[0], colors.intermediate[1], 'intermediate-program.jpg');
    await createGradientImage(800, 600, colors.advanced[0], colors.advanced[1], 'advanced-program.jpg');

    // Exercise images
    await createGradientImage(600, 600, colors.exercise[0], colors.exercise[1], 'pullups.jpg');
    await createGradientImage(600, 600, colors.exercise[0], colors.exercise[1], 'pushups.jpg');
    await createGradientImage(600, 600, colors.exercise[0], colors.exercise[1], 'dips.jpg');
    await createGradientImage(600, 600, colors.exercise[0], colors.exercise[1], 'muscle-ups.jpg');
    await createGradientImage(600, 600, colors.exercise[0], colors.exercise[1], 'handstand.jpg');
    await createGradientImage(600, 600, colors.exercise[0], colors.exercise[1], 'planche.jpg');

    // Workout images
    for (let i = 1; i <= 10; i++) {
      await createGradientImage(800, 600, colors.workout[0], colors.workout[1], `workout${i}.jpg`);
    }

    // Stats images
    await createGradientImage(800, 600, colors.stats[0], colors.stats[1], 'stats.jpg');
    await createGradientImage(600, 600, colors.stats[0], colors.stats[1], 'achievement.jpg');

    console.log('\n✅ All images generated successfully!');
  } catch (error) {
    console.error('Error generating images:', error);
    process.exit(1);
  }
}

generateImages();

