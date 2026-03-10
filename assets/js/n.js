const FOOD_LOG_KEY = 'nutriNourishFoodLog';
const foodForm = document.getElementById('food-form');
const foodList = document.getElementById('food-list');
const totalCaloriesElement = document.getElementById('total-calories');

let foodLog = [];

function persistFoodLog() {
    localStorage.setItem(FOOD_LOG_KEY, JSON.stringify(foodLog));
}

function renderFoodLog() {
    foodList.innerHTML = '';
    let totalCalories = 0;

    foodLog.forEach((entry, index) => {
        const foodItem = document.createElement('li');
        const label = document.createElement('span');
        const removeButton = document.createElement('button');

        label.textContent = `${entry.name} - ${entry.calories} kcal`;
        removeButton.className = 'remove-btn';
        removeButton.type = 'button';
        removeButton.textContent = 'Remove';
        removeButton.addEventListener('click', () => {
            foodLog.splice(index, 1);
            persistFoodLog();
            renderFoodLog();
        });

        foodItem.appendChild(label);
        foodItem.appendChild(removeButton);
        foodList.appendChild(foodItem);

        totalCalories += entry.calories;
    });

    totalCaloriesElement.textContent = totalCalories;
}

function restoreFoodLog() {
    const storedLog = localStorage.getItem(FOOD_LOG_KEY);
    if (!storedLog) {
        return;
    }

    try {
        const parsed = JSON.parse(storedLog);
        if (Array.isArray(parsed)) {
            foodLog = parsed.filter((entry) => (
                entry && typeof entry.name === 'string' && Number.isFinite(entry.calories) && entry.calories > 0
            ));
        }
    } catch (_) {
        foodLog = [];
    }
}

foodForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const foodName = document.getElementById('food-name').value.trim();
    const calories = Number(document.getElementById('calories').value);

    if (!foodName || !Number.isFinite(calories) || calories <= 0) {
        alert('Please enter a food name and calories greater than 0.');
        return;
    }

    foodLog.push({ name: foodName, calories });
    persistFoodLog();
    renderFoodLog();
    foodForm.reset();
});

restoreFoodLog();
renderFoodLog();
