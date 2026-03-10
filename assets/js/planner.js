const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const mealTemplates = {
  balanced: {
    Monday: { breakfast: 'Paneer paratha with yogurt', lunch: 'Chickpea & spinach curry with brown rice', dinner: 'Grilled chicken tikka with roti' },
    Tuesday: { breakfast: 'Moong dal cheela with cucumber', lunch: 'Tofu stir-fry with vegetables', dinner: 'Rajma (kidney beans) with brown rice' },
    Wednesday: { breakfast: 'Overnight oats with berries', lunch: 'Dal makhani with naan', dinner: 'Fish curry with brown rice' },
    Thursday: { breakfast: 'Vegetable upma', lunch: 'Chole bhature', dinner: 'Lentil soup with bread' },
    Friday: { breakfast: 'Dosa with sambar', lunch: 'Paneer tikka masala with rice', dinner: 'Vegetable biryani' },
    Saturday: { breakfast: 'Puri with aloo sabzi', lunch: 'Tandoori chicken with salad', dinner: 'Khichdi with cucumber raita' },
    Sunday: { breakfast: 'Idli with coconut chutney', lunch: 'Hyderabadi biryani', dinner: 'Light sabzi with roti' }
  },
  weightLoss: {
    Monday: { breakfast: 'Greek yogurt with berries', lunch: 'Grilled fish with steamed veggies', dinner: 'Tofu stir-fry with brown rice' },
    Tuesday: { breakfast: 'Egg white omelette', lunch: 'Chicken salad', dinner: 'Dal soup' },
    Wednesday: { breakfast: 'Moong dal cheela', lunch: 'Grilled paneer with salad', dinner: 'Fish tikka' },
    Thursday: { breakfast: 'Sprouts salad', lunch: 'Chicken breast with vegetables', dinner: 'Lentil dal' },
    Friday: { breakfast: 'Vegetable smoothie', lunch: 'Tuna salad', dinner: 'Grilled vegetables with paneer' },
    Saturday: { breakfast: 'Protein pancakes', lunch: 'Grilled chicken with brown rice', dinner: 'Dal with roti' },
    Sunday: { breakfast: 'Yogurt parfait', lunch: 'Baked fish with vegetables', dinner: 'Vegetable soup' }
  },
  muscleGain: {
    Monday: { breakfast: 'Paneer paratha with milk', lunch: 'Chicken biryani', dinner: 'Lentil dal with rice' },
    Tuesday: { breakfast: 'Egg fried rice', lunch: 'Paneer tikka masala with naan', dinner: 'Dal makhani with bread' },
    Wednesday: { breakfast: 'Dosa with dal curry', lunch: 'Chicken keema with rice', dinner: 'Chickpea curry' },
    Thursday: { breakfast: 'Puri with potato', lunch: 'Tandoori chicken with rice', dinner: 'Rajma with bread' },
    Friday: { breakfast: 'Cheese omelette', lunch: 'Fish curry with rice', dinner: 'Dal fry with roti' },
    Saturday: { breakfast: 'Paneer sandwich', lunch: 'Mutton curry with rice', dinner: 'Lentil soup with bread' },
    Sunday: { breakfast: 'Paratha with butter', lunch: 'Biryani', dinner: 'Dal makhani' }
  }
};

function generateMealTable() {
  const table = document.getElementById('mealPlannerTable');
  const plan = JSON.parse(localStorage.getItem('mealPlan') || '{}');
  
  const html = days.map(day => `
    <tr style="border: 1px solid #e2e8f0;">
      <td style="padding: 1rem; font-weight: 600; border: 1px solid #e2e8f0;">${day}</td>
      <td style="padding: 0.5rem; border: 1px solid #e2e8f0;">
        <input type="text" class="meal-input" data-day="${day}" data-meal="breakfast" 
               value="${plan[day]?.breakfast || ''}" placeholder="Breakfast" style="width: 100%; padding: 0.5rem; border: 1px solid #cbd5e1; border-radius: 0.375rem;">
      </td>
      <td style="padding: 0.5rem; border: 1px solid #e2e8f0;">
        <input type="text" class="meal-input" data-day="${day}" data-meal="lunch" 
               value="${plan[day]?.lunch || ''}" placeholder="Lunch" style="width: 100%; padding: 0.5rem; border: 1px solid #cbd5e1; border-radius: 0.375rem;">
      </td>
      <td style="padding: 0.5rem; border: 1px solid #e2e8f0;">
        <input type="text" class="meal-input" data-day="${day}" data-meal="dinner" 
               value="${plan[day]?.dinner || ''}" placeholder="Dinner" style="width: 100%; padding: 0.5rem; border: 1px solid #cbd5e1; border-radius: 0.375rem;">
      </td>
      <td style="padding: 0.5rem; border: 1px solid #e2e8f0;">
        <input type="text" class="meal-input" data-day="${day}" data-meal="snacks" 
               value="${plan[day]?.snacks || ''}" placeholder="Snacks" style="width: 100%; padding: 0.5rem; border: 1px solid #cbd5e1; border-radius: 0.375rem;">
      </td>
    </tr>
  `).join('');
  
  table.innerHTML = html;
  
  // Add change listeners
  document.querySelectorAll('.meal-input').forEach(input => {
    input.addEventListener('change', generateShoppingList);
  });
}

function loadTemplate(template) {
  const plan = mealTemplates[template] || {};
  localStorage.setItem('mealPlan', JSON.stringify(plan));
  generateMealTable();
  generateShoppingList();
}

function generateShoppingList() {
  const plan = getPlan();
  const ingredients = {
    veggies: new Set(),
    protein: new Set(),
    grains: new Set(),
    condiments: new Set()
  };

  // Extract ingredients from meal descriptions
  const ingredientMaps = {
    veggies: ['spinach', 'cucumber', 'tomato', 'potato', 'carrot', 'broccoli', 'onion', 'garlic', 'ginger', 'lettuce', 'bell pepper', 'cabbage', 'eggplant', 'ladyfinger', 'peas', 'beans', 'mushroom', 'veggies', 'vegetables', 'salad', 'sprouts'],
    protein: ['paneer', 'chicken', 'fish', 'egg', 'tofu', 'dal', 'lentil', 'chickpea', 'chana', 'beans', 'rajma', 'mutton', 'curd', 'yogurt', 'milk', 'cheese', 'meat'],
    grains: ['rice', 'bread', 'roti', 'naan', 'paratha', 'puri', 'dosa', 'idli', 'oats', 'wheat', 'flour', 'biryani'],
    condiments: ['curry', 'sauce', 'oil', 'ghee', 'butter', 'spice', 'chutney', 'masala', 'salt', 'pepper']
  };

  // Scan all meals for ingredients
  Object.values(plan).forEach(day => {
    Object.values(day).forEach(meal => {
      if (meal) {
        const lower = meal.toLowerCase();
        Object.entries(ingredientMaps).forEach(([category, keywords]) => {
          keywords.forEach(keyword => {
            if (lower.includes(keyword)) {
              if (category === 'veggies' && !lower.includes('spinach powder')) ingredients.veggies.add(capitalize(keyword));
              if (category === 'protein') ingredients.protein.add(capitalize(keyword));
              if (category === 'grains') ingredients.grains.add(capitalize(keyword));
              if (category === 'condiments') ingredients.condiments.add(capitalize(keyword));
            }
          });
        });
      }
    });
  });

  // Display shopping lists
  updateShoppingUI(ingredients);
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function updateShoppingUI(ingredients) {
  const updateList = (id, items) => {
    const el = document.getElementById(id);
    if (items.size === 0) {
      el.innerHTML = '<li style="color: #94a3b8;">No items</li>';
    } else {
      el.innerHTML = Array.from(items)
        .sort()
        .map(item => `<li style="padding: 0.5rem 0; display: flex; align-items: center;"><input type="checkbox" style="margin-right: 0.5rem;"> ${item}</li>`)
        .join('');
    }
  };

  updateList('shoppingVeggies', ingredients.veggies);
  updateList('shoppingProtein', ingredients.protein);
  updateList('shoppingGrains', ingredients.grains);
  updateList('shoppingCondiments', ingredients.condiments);
}

function getPlan() {
  const plan = {};
  days.forEach(day => {
    plan[day] = {
      breakfast: document.querySelector(`input[data-day="${day}"][data-meal="breakfast"]`)?.value || '',
      lunch: document.querySelector(`input[data-day="${day}"][data-meal="lunch"]`)?.value || '',
      dinner: document.querySelector(`input[data-day="${day}"][data-meal="dinner"]`)?.value || '',
      snacks: document.querySelector(`input[data-day="${day}"][data-meal="snacks"]`)?.value || ''
    };
  });
  return plan;
}

function savePlan() {
  const plan = getPlan();
  localStorage.setItem('mealPlan', JSON.stringify(plan));
  alert('✅ Plan saved successfully!');
}

function loadPlan() {
  const saved = localStorage.getItem('mealPlan');
  if (saved) {
    generateMealTable();
    generateShoppingList();
    alert('✅ Plan loaded!');
  } else {
    alert('❌ No saved plan found');
  }
}

function resetPlan() {
  if (confirm('Clear your meal plan?')) {
    localStorage.removeItem('mealPlan');
    generateMealTable();
    generateShoppingList();
  }
}

function printShoppingList() {
  window.print();
}

function exportShoppingList() {
  let text = 'SHOPPING LIST\n' + new Date().toLocaleDateString() + '\n\n';
  text += '🥬 VEGETABLES & PRODUCE\n';
  document.querySelectorAll('#shoppingVeggies li').forEach(li => {
    text += '☐ ' + li.textContent.trim() + '\n';
  });
  text += '\n🍗 PROTEINS & DAIRY\n';
  document.querySelectorAll('#shoppingProtein li').forEach(li => {
    text += '☐ ' + li.textContent.trim() + '\n';
  });
  text += '\n🌾 GRAINS & PANTRY\n';
  document.querySelectorAll('#shoppingGrains li').forEach(li => {
    text += '☐ ' + li.textContent.trim() + '\n';
  });
  text += '\n🧂 CONDIMENTS & SPICES\n';
  document.querySelectorAll('#shoppingCondiments li').forEach(li => {
    text += '☐ ' + li.textContent.trim() + '\n';
  });

  const blob = new Blob([text], { type: 'text/plain' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'shopping-list-' + new Date().toISOString().split('T')[0] + '.txt';
  a.click();
}

function copyToClipboard() {
  let text = 'SHOPPING LIST\n';
  text += document.querySelectorAll('#shoppingVeggies li, #shoppingProtein li, #shoppingGrains li, #shoppingCondiments li')
    .map(li => '• ' + li.textContent.trim())
    .join('\n');
  
  navigator.clipboard.writeText(text).then(() => {
    alert('✅ Shopping list copied to clipboard!');
  });
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  generateMealTable();
  // Auto-load saved plan if exists
  if (localStorage.getItem('mealPlan')) {
    generateMealTable();
    generateShoppingList();
  }
});
