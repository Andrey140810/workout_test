import { useState } from 'react';
import { calculateCalories, getActivityLevelDescription, getGoalDescription } from '../services/calorieCalculator';
import { getMealPlan, recipes } from '../data/recipes';
import './Nutrition.css';

export default function Nutrition() {
  const [showCalculator, setShowCalculator] = useState(false);
  const [calculatorResult, setCalculatorResult] = useState(null);
  const [mealsPerDay, setMealsPerDay] = useState(4);
  const [selectedMealPlan, setSelectedMealPlan] = useState(null);
  const [selectedMealType, setSelectedMealType] = useState(null);

  // Данные для калькулятора
  const [calcData, setCalcData] = useState({
    weight: '',
    height: '',
    age: '',
    gender: 'male',
    activityLevel: 'moderate',
    goal: 'maintain'
  });

  const handleCalculate = (e) => {
    e.preventDefault();
    
    const weight = parseFloat(calcData.weight);
    const height = parseFloat(calcData.height);
    const age = parseInt(calcData.age);

    if (!weight || !height || !age || weight <= 0 || height <= 0 || age <= 0) {
      alert('Пожалуйста, заполните все поля корректно');
      return;
    }

    const result = calculateCalories(
      weight,
      height,
      age,
      calcData.gender,
      calcData.activityLevel,
      calcData.goal
    );

    setCalculatorResult(result);
    generateMealPlan(result.dailyCalories);
  };

  const generateMealPlan = (targetCalories) => {
    const mealPlan = getMealPlan(mealsPerDay);
    
    // Распределение калорий по приемам пищи (процентное соотношение)
    const calorieDistribution = {
      3: { breakfast: 0.35, lunch: 0.40, dinner: 0.25 },
      4: { breakfast: 0.30, secondBreakfast: 0.15, lunch: 0.35, dinner: 0.20 },
      5: { breakfast: 0.25, secondBreakfast: 0.15, lunch: 0.30, snack: 0.10, dinner: 0.20 }
    };
    
    const distribution = calorieDistribution[mealsPerDay];
    const deviation = 0.15; // 15% отклонение
    
    // Генерация примерного плана питания с учетом калорийности
    const plan = mealPlan.map(meal => {
      const mealType = meal.type;
      const targetMealCalories = targetCalories * (distribution[mealType] || 0.3);
      
      // Выбираем рецепты, которые подходят по калориям
      const suitableRecipes = meal.recipes.filter(r => {
        const minCalories = targetMealCalories * (1 - deviation);
        const maxCalories = targetMealCalories * (1 + deviation);
        return r.calories >= minCalories && r.calories <= maxCalories;
      });
      
      let selectedRecipe;
      if (suitableRecipes.length > 0) {
        // Выбираем случайный из подходящих
        selectedRecipe = suitableRecipes[Math.floor(Math.random() * suitableRecipes.length)];
      } else {
        // Если нет подходящих по калориям, берем ближайший
        selectedRecipe = meal.recipes.reduce((closest, current) => {
          const currentDiff = Math.abs(current.calories - targetMealCalories);
          const closestDiff = Math.abs(closest.calories - targetMealCalories);
          return currentDiff < closestDiff ? current : closest;
        });
      }
      
      return {
        ...selectedRecipe,
        mealType: mealType,
        targetCalories: Math.round(targetMealCalories)
      };
    });

    const totalCalories = plan.reduce((sum, meal) => sum + meal.calories, 0);
    const totalProtein = plan.reduce((sum, meal) => sum + meal.protein, 0);
    const totalCarbs = plan.reduce((sum, meal) => sum + meal.carbs, 0);
    const totalFat = plan.reduce((sum, meal) => sum + meal.fat, 0);

    setSelectedMealPlan({
      meals: plan,
      totalCalories: totalCalories,
      totalProtein: totalProtein,
      totalCarbs: totalCarbs,
      totalFat: totalFat,
      targetCalories: targetCalories,
      difference: totalCalories - targetCalories
    });
  };

  return (
    <div className="nutrition-page">
      <div className="nutrition-header">
        <h1>Правильное питание</h1>
        <p className="subtitle">Калькулятор калорий и рецепты для спортсменов</p>
      </div>

      <div className="nutrition-tabs">
        <button
          className={`tab-button ${!showCalculator ? 'active' : ''}`}
          onClick={() => setShowCalculator(false)}
        >
          Рецепты
        </button>
        <button
          className={`tab-button ${showCalculator ? 'active' : ''}`}
          onClick={() => setShowCalculator(true)}
        >
          Калькулятор калорий
        </button>
      </div>

      {showCalculator ? (
        <div className="calculator-section">
          <div className="calculator-card">
            <h2>Калькулятор калорий</h2>
            <p className="calculator-description">
              Рассчитайте вашу суточную норму калорий и макронутриентов
            </p>

            <form onSubmit={handleCalculate} className="calculator-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="weight">Вес (кг)</label>
                  <input
                    type="number"
                    id="weight"
                    value={calcData.weight}
                    onChange={(e) => setCalcData({ ...calcData, weight: e.target.value })}
                    required
                    min="1"
                    step="0.1"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="height">Рост (см)</label>
                  <input
                    type="number"
                    id="height"
                    value={calcData.height}
                    onChange={(e) => setCalcData({ ...calcData, height: e.target.value })}
                    required
                    min="1"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="age">Возраст</label>
                  <input
                    type="number"
                    id="age"
                    value={calcData.age}
                    onChange={(e) => setCalcData({ ...calcData, age: e.target.value })}
                    required
                    min="1"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="gender">Пол</label>
                  <select
                    id="gender"
                    value={calcData.gender}
                    onChange={(e) => setCalcData({ ...calcData, gender: e.target.value })}
                  >
                    <option value="male">Мужской</option>
                    <option value="female">Женский</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="activityLevel">Уровень активности</label>
                  <select
                    id="activityLevel"
                    value={calcData.activityLevel}
                    onChange={(e) => setCalcData({ ...calcData, activityLevel: e.target.value })}
                  >
                    <option value="sedentary">Сидячий образ жизни</option>
                    <option value="light">Легкая активность (1-3 тренировки/нед)</option>
                    <option value="moderate">Умеренная активность (3-5 тренировок/нед)</option>
                    <option value="active">Высокая активность (6-7 тренировок/нед)</option>
                    <option value="veryActive">Очень высокая активность</option>
                  </select>
                  <small>{getActivityLevelDescription(calcData.activityLevel)}</small>
                </div>

                <div className="form-group">
                  <label htmlFor="goal">Цель</label>
                  <select
                    id="goal"
                    value={calcData.goal}
                    onChange={(e) => setCalcData({ ...calcData, goal: e.target.value })}
                  >
                    <option value="loseWeight">Похудение</option>
                    <option value="maintain">Поддержание веса</option>
                    <option value="gainWeight">Набор массы</option>
                  </select>
                  <small>{getGoalDescription(calcData.goal)}</small>
                </div>
              </div>

              <button type="submit" className="btn-calculate">
                Рассчитать
              </button>
            </form>

            {calculatorResult && (
              <div className="calculator-results">
                <h3>Результаты расчета</h3>
                <div className="results-grid">
                  <div className="result-item">
                    <div className="result-label">BMR (базовый метаболизм)</div>
                    <div className="result-value">{calculatorResult.bmr} ккал</div>
                  </div>
                  <div className="result-item">
                    <div className="result-label">TDEE (общий расход)</div>
                    <div className="result-value">{calculatorResult.tdee} ккал</div>
                  </div>
                  <div className="result-item highlight">
                    <div className="result-label">Суточная норма калорий</div>
                    <div className="result-value">{calculatorResult.dailyCalories} ккал</div>
                  </div>
                </div>

                <div className="macros-section">
                  <h4>Макронутриенты</h4>
                  <div className="macros-grid">
                    <div className="macro-item protein">
                      <div className="macro-icon">💪</div>
                      <div className="macro-content">
                        <div className="macro-name">Белки</div>
                        <div className="macro-value">{calculatorResult.macros.protein}г</div>
                        <div className="macro-calories">{calculatorResult.macros.proteinCalories} ккал</div>
                      </div>
                    </div>
                    <div className="macro-item carbs">
                      <div className="macro-icon">🌾</div>
                      <div className="macro-content">
                        <div className="macro-name">Углеводы</div>
                        <div className="macro-value">{calculatorResult.macros.carbs}г</div>
                        <div className="macro-calories">{calculatorResult.macros.carbsCalories} ккал</div>
                      </div>
                    </div>
                    <div className="macro-item fat">
                      <div className="macro-icon">🥑</div>
                      <div className="macro-content">
                        <div className="macro-name">Жиры</div>
                        <div className="macro-value">{calculatorResult.macros.fat}г</div>
                        <div className="macro-calories">{calculatorResult.macros.fatCalories} ккал</div>
                      </div>
                    </div>
                  </div>
                </div>

                {selectedMealPlan && (
                  <div className="meal-plan-suggestion">
                    <h4>Примерный план питания ({mealsPerDay} приема пищи)</h4>
                    <div className="meals-per-day-selector">
                      <button
                        className={mealsPerDay === 3 ? 'active' : ''}
                        onClick={() => {
                          setMealsPerDay(3);
                          generateMealPlan(calculatorResult.dailyCalories);
                        }}
                      >
                        3 раза
                      </button>
                      <button
                        className={mealsPerDay === 4 ? 'active' : ''}
                        onClick={() => {
                          setMealsPerDay(4);
                          generateMealPlan(calculatorResult.dailyCalories);
                        }}
                      >
                        4 раза
                      </button>
                      <button
                        className={mealsPerDay === 5 ? 'active' : ''}
                        onClick={() => {
                          setMealsPerDay(5);
                          generateMealPlan(calculatorResult.dailyCalories);
                        }}
                      >
                        5 раз
                      </button>
                    </div>

                    <div className="meal-plan-summary">
                      <div className="summary-item">
                        <span>Цель:</span>
                        <strong>{selectedMealPlan.targetCalories} ккал</strong>
                      </div>
                      <div className="summary-item">
                        <span>Всего:</span>
                        <strong className={selectedMealPlan.difference > 50 ? 'warning' : ''}>
                          {selectedMealPlan.totalCalories} ккал
                        </strong>
                      </div>
                      <div className="summary-item">
                        <span>Белки:</span>
                        <strong>{selectedMealPlan.totalProtein}г</strong>
                      </div>
                      <div className="summary-item">
                        <span>Углеводы:</span>
                        <strong>{selectedMealPlan.totalCarbs}г</strong>
                      </div>
                      <div className="summary-item">
                        <span>Жиры:</span>
                        <strong>{selectedMealPlan.totalFat}г</strong>
                      </div>
                    </div>

                    <div className="meal-plan-details">
                      <h5>Ваш дневной рацион:</h5>
                      <div className="daily-meals-list">
                        {selectedMealPlan.meals.map((meal, idx) => {
                          const mealNames = {
                            breakfast: 'Завтрак',
                            secondBreakfast: 'Второй завтрак',
                            lunch: 'Обед',
                            snack: 'Полдник',
                            dinner: 'Ужин'
                          };
                          return (
                            <div key={idx} className="daily-meal-item">
                              <div className="daily-meal-header">
                                <span className="meal-time">{mealNames[meal.mealType]}</span>
                                <span className="meal-target">Цель: ~{meal.targetCalories} ккал</span>
                              </div>
                              <div className="daily-meal-content">
                                <div className="daily-meal-name">
                                  <span className="meal-icon">{meal.image}</span>
                                  <strong>{meal.name}</strong>
                                </div>
                                <div className="daily-meal-info">
                                  <span>🔥 {meal.calories} ккал</span>
                                  <span>Б: {meal.protein}г</span>
                                  <span>У: {meal.carbs}г</span>
                                  <span>Ж: {meal.fat}г</span>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      ) : (
        <RecipesView 
          mealsPerDay={mealsPerDay} 
          setMealsPerDay={setMealsPerDay}
          selectedMealType={selectedMealType}
          setSelectedMealType={setSelectedMealType}
        />
      )}
    </div>
  );
}

function RecipesView({ mealsPerDay, setMealsPerDay, selectedMealType, setSelectedMealType }) {
  const mealPlan = getMealPlan(mealsPerDay);
  const mealNames = {
    breakfast: 'Завтрак',
    secondBreakfast: 'Второй завтрак',
    lunch: 'Обед',
    snack: 'Полдник',
    dinner: 'Ужин'
  };

  const handleShowMore = (mealType) => {
    setSelectedMealType(mealType);
    // Прокрутка к началу раздела рецептов
    setTimeout(() => {
      const element = document.getElementById(`meal-type-${mealType}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  // Если выбран конкретный тип питания, показываем все рецепты этого типа
  if (selectedMealType) {
    const selectedMeal = mealPlan.find(m => m.type === selectedMealType);
    if (!selectedMeal) return null;

    return (
      <div className="recipes-section">
        <div className="recipes-header">
          <div className="recipes-header-left">
            <button 
              className="btn-back-recipes"
              onClick={() => setSelectedMealType(null)}
            >
              ← Назад ко всем рецептам
            </button>
            <h2>Рецепты: {mealNames[selectedMealType]}</h2>
          </div>
          <div className="meals-selector">
            <span>Приемов пищи в день:</span>
            <button
              className={mealsPerDay === 3 ? 'active' : ''}
              onClick={() => {
                setMealsPerDay(3);
                setSelectedMealType(null);
              }}
            >
              3
            </button>
            <button
              className={mealsPerDay === 4 ? 'active' : ''}
              onClick={() => {
                setMealsPerDay(4);
                setSelectedMealType(null);
              }}
            >
              4
            </button>
            <button
              className={mealsPerDay === 5 ? 'active' : ''}
              onClick={() => {
                setMealsPerDay(5);
                setSelectedMealType(null);
              }}
            >
              5
            </button>
          </div>
        </div>

        <div id={`meal-type-${selectedMealType}`} className="meal-category-full">
          <h3 className="meal-category-title">
            <span className="meal-icon">🍽️</span>
            {mealNames[selectedMealType]}
          </h3>
          <div className="recipes-list">
            {selectedMeal.recipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Обычный режим - показываем по 3 рецепта в каждом разделе
  return (
    <div className="recipes-section">
      <div className="recipes-header">
        <h2>Рецепты</h2>
        <div className="meals-selector">
          <span>Приемов пищи в день:</span>
          <button
            className={mealsPerDay === 3 ? 'active' : ''}
            onClick={() => setMealsPerDay(3)}
          >
            3
          </button>
          <button
            className={mealsPerDay === 4 ? 'active' : ''}
            onClick={() => setMealsPerDay(4)}
          >
            4
          </button>
          <button
            className={mealsPerDay === 5 ? 'active' : ''}
            onClick={() => setMealsPerDay(5)}
          >
            5
          </button>
        </div>
      </div>

      <div className="recipes-grid">
        {mealPlan.map((meal, idx) => {
          const displayedRecipes = meal.recipes.slice(0, 3);
          const remainingCount = meal.recipes.length - 3;
          
          return (
            <div key={idx} className="meal-category">
              <h3 className="meal-category-title">
                <span className="meal-icon">🍽️</span>
                {mealNames[meal.type]}
              </h3>
              <div className="recipes-list">
                {displayedRecipes.map((recipe) => (
                  <RecipeCard key={recipe.id} recipe={recipe} />
                ))}
                {remainingCount > 0 && (
                  <button 
                    className="btn-show-more"
                    onClick={() => handleShowMore(meal.type)}
                  >
                    Показать все рецепты ({meal.recipes.length})
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function RecipeCard({ recipe }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="recipe-card" onClick={() => setExpanded(!expanded)}>
      <div className="recipe-header">
        <div className="recipe-title-row">
          <span className="recipe-icon">{recipe.image}</span>
          <h4>{recipe.name}</h4>
        </div>
        <button className="expand-btn">{expanded ? '−' : '+'}</button>
      </div>
      
      <div className="recipe-info">
        <div className="recipe-stats">
          <span>🔥 {recipe.calories} ккал</span>
          <span>⏱️ {recipe.time}</span>
        </div>
        <div className="recipe-macros">
          <span>Б: {recipe.protein}г</span>
          <span>У: {recipe.carbs}г</span>
          <span>Ж: {recipe.fat}г</span>
        </div>
      </div>

      {expanded && (
        <div className="recipe-details">
          <div className="recipe-ingredients">
            <h5>Ингредиенты:</h5>
            <ul>
              {recipe.ingredients.map((ingredient, idx) => (
                <li key={idx}>{ingredient}</li>
              ))}
            </ul>
          </div>
          <div className="recipe-instructions">
            <h5>Приготовление:</h5>
            <p>{recipe.instructions}</p>
          </div>
        </div>
      )}
    </div>
  );
}

