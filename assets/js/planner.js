const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const PLAN_STORAGE_KEY = "mealPlan";
const DIET_STORAGE_KEY = "mealDietPreference";

const mealOptions = {
  breakfast: {
    veg: [
      "Paneer paratha with yogurt",
      "Moong dal cheela",
      "Vegetable upma",
      "Overnight oats with berries",
      "Idli with chutney",
      "Poha with peanuts"
    ],
    nonVeg: [
      "Egg omelette with toast",
      "Chicken sausage with oats",
      "Boiled eggs and fruit",
      "Tuna sandwich",
      "Egg bhurji with roti",
      "Greek yogurt with chicken slices"
    ]
  },
  lunch: {
    veg: [
      "Chickpea curry with brown rice",
      "Paneer tikka masala with roti",
      "Tofu stir-fry with vegetables",
      "Rajma with rice",
      "Dal makhani with naan",
      "Vegetable biryani"
    ],
    nonVeg: [
      "Grilled chicken with salad",
      "Fish curry with brown rice",
      "Chicken biryani",
      "Chicken breast with vegetables",
      "Egg curry with roti",
      "Tuna rice bowl"
    ]
  },
  dinner: {
    veg: [
      "Lentil soup with bread",
      "Khichdi with cucumber raita",
      "Mixed veg sabzi with roti",
      "Tofu curry with quinoa",
      "Dal fry with jeera rice",
      "Paneer bhurji with millet roti"
    ],
    nonVeg: [
      "Grilled fish with vegetables",
      "Chicken tikka with roti",
      "Mutton curry with rice",
      "Egg fried rice",
      "Chicken soup with toast",
      "Baked fish with sauteed veggies"
    ]
  },
  snacks: {
    veg: [
      "Fruit bowl",
      "Roasted chana",
      "Mixed nuts",
      "Sprouts salad",
      "Buttermilk",
      "Peanut chikki"
    ],
    nonVeg: [
      "Boiled egg",
      "Chicken salad cup",
      "Tuna crackers",
      "Greek yogurt with egg whites",
      "Chicken soup cup",
      "Egg sandwich"
    ]
  }
};

const mealTemplates = {
  balanced: {
    veg: {
      Monday: { breakfast: "Paneer paratha with yogurt", lunch: "Chickpea curry with brown rice", dinner: "Lentil soup with bread", snacks: "Fruit bowl" },
      Tuesday: { breakfast: "Moong dal cheela", lunch: "Tofu stir-fry with vegetables", dinner: "Khichdi with cucumber raita", snacks: "Roasted chana" },
      Wednesday: { breakfast: "Overnight oats with berries", lunch: "Rajma with rice", dinner: "Mixed veg sabzi with roti", snacks: "Mixed nuts" },
      Thursday: { breakfast: "Vegetable upma", lunch: "Paneer tikka masala with roti", dinner: "Dal fry with jeera rice", snacks: "Sprouts salad" },
      Friday: { breakfast: "Idli with chutney", lunch: "Vegetable biryani", dinner: "Tofu curry with quinoa", snacks: "Buttermilk" },
      Saturday: { breakfast: "Poha with peanuts", lunch: "Dal makhani with naan", dinner: "Paneer bhurji with millet roti", snacks: "Fruit bowl" },
      Sunday: { breakfast: "Paneer paratha with yogurt", lunch: "Chickpea curry with brown rice", dinner: "Khichdi with cucumber raita", snacks: "Peanut chikki" }
    },
    nonVeg: {
      Monday: { breakfast: "Egg omelette with toast", lunch: "Grilled chicken with salad", dinner: "Chicken tikka with roti", snacks: "Boiled egg" },
      Tuesday: { breakfast: "Boiled eggs and fruit", lunch: "Fish curry with brown rice", dinner: "Grilled fish with vegetables", snacks: "Chicken salad cup" },
      Wednesday: { breakfast: "Egg bhurji with roti", lunch: "Chicken breast with vegetables", dinner: "Egg fried rice", snacks: "Tuna crackers" },
      Thursday: { breakfast: "Tuna sandwich", lunch: "Tuna rice bowl", dinner: "Baked fish with sauteed veggies", snacks: "Boiled egg" },
      Friday: { breakfast: "Chicken sausage with oats", lunch: "Chicken biryani", dinner: "Chicken soup with toast", snacks: "Egg sandwich" },
      Saturday: { breakfast: "Egg omelette with toast", lunch: "Egg curry with roti", dinner: "Mutton curry with rice", snacks: "Greek yogurt with egg whites" },
      Sunday: { breakfast: "Boiled eggs and fruit", lunch: "Fish curry with brown rice", dinner: "Chicken tikka with roti", snacks: "Chicken soup cup" }
    }
  },
  weightLoss: {
    veg: {
      Monday: { breakfast: "Overnight oats with berries", lunch: "Tofu stir-fry with vegetables", dinner: "Lentil soup with bread", snacks: "Sprouts salad" },
      Tuesday: { breakfast: "Moong dal cheela", lunch: "Chickpea curry with brown rice", dinner: "Mixed veg sabzi with roti", snacks: "Roasted chana" },
      Wednesday: { breakfast: "Vegetable upma", lunch: "Rajma with rice", dinner: "Tofu curry with quinoa", snacks: "Fruit bowl" },
      Thursday: { breakfast: "Idli with chutney", lunch: "Paneer tikka masala with roti", dinner: "Khichdi with cucumber raita", snacks: "Buttermilk" },
      Friday: { breakfast: "Poha with peanuts", lunch: "Tofu stir-fry with vegetables", dinner: "Dal fry with jeera rice", snacks: "Mixed nuts" },
      Saturday: { breakfast: "Moong dal cheela", lunch: "Chickpea curry with brown rice", dinner: "Lentil soup with bread", snacks: "Sprouts salad" },
      Sunday: { breakfast: "Overnight oats with berries", lunch: "Paneer tikka masala with roti", dinner: "Mixed veg sabzi with roti", snacks: "Fruit bowl" }
    },
    nonVeg: {
      Monday: { breakfast: "Boiled eggs and fruit", lunch: "Grilled chicken with salad", dinner: "Grilled fish with vegetables", snacks: "Boiled egg" },
      Tuesday: { breakfast: "Egg omelette with toast", lunch: "Chicken breast with vegetables", dinner: "Chicken soup with toast", snacks: "Tuna crackers" },
      Wednesday: { breakfast: "Tuna sandwich", lunch: "Fish curry with brown rice", dinner: "Baked fish with sauteed veggies", snacks: "Chicken salad cup" },
      Thursday: { breakfast: "Egg bhurji with roti", lunch: "Tuna rice bowl", dinner: "Chicken tikka with roti", snacks: "Boiled egg" },
      Friday: { breakfast: "Chicken sausage with oats", lunch: "Grilled chicken with salad", dinner: "Egg fried rice", snacks: "Greek yogurt with egg whites" },
      Saturday: { breakfast: "Boiled eggs and fruit", lunch: "Chicken breast with vegetables", dinner: "Grilled fish with vegetables", snacks: "Chicken soup cup" },
      Sunday: { breakfast: "Egg omelette with toast", lunch: "Tuna rice bowl", dinner: "Chicken soup with toast", snacks: "Egg sandwich" }
    }
  },
  muscleGain: {
    veg: {
      Monday: { breakfast: "Paneer paratha with yogurt", lunch: "Paneer tikka masala with roti", dinner: "Dal fry with jeera rice", snacks: "Mixed nuts" },
      Tuesday: { breakfast: "Poha with peanuts", lunch: "Vegetable biryani", dinner: "Paneer bhurji with millet roti", snacks: "Peanut chikki" },
      Wednesday: { breakfast: "Idli with chutney", lunch: "Dal makhani with naan", dinner: "Tofu curry with quinoa", snacks: "Roasted chana" },
      Thursday: { breakfast: "Moong dal cheela", lunch: "Rajma with rice", dinner: "Khichdi with cucumber raita", snacks: "Mixed nuts" },
      Friday: { breakfast: "Paneer paratha with yogurt", lunch: "Chickpea curry with brown rice", dinner: "Dal fry with jeera rice", snacks: "Peanut chikki" },
      Saturday: { breakfast: "Overnight oats with berries", lunch: "Paneer tikka masala with roti", dinner: "Tofu curry with quinoa", snacks: "Roasted chana" },
      Sunday: { breakfast: "Poha with peanuts", lunch: "Vegetable biryani", dinner: "Paneer bhurji with millet roti", snacks: "Mixed nuts" }
    },
    nonVeg: {
      Monday: { breakfast: "Egg omelette with toast", lunch: "Chicken biryani", dinner: "Chicken tikka with roti", snacks: "Boiled egg" },
      Tuesday: { breakfast: "Egg bhurji with roti", lunch: "Mutton curry with rice", dinner: "Egg fried rice", snacks: "Chicken salad cup" },
      Wednesday: { breakfast: "Chicken sausage with oats", lunch: "Fish curry with brown rice", dinner: "Chicken soup with toast", snacks: "Egg sandwich" },
      Thursday: { breakfast: "Boiled eggs and fruit", lunch: "Chicken breast with vegetables", dinner: "Mutton curry with rice", snacks: "Greek yogurt with egg whites" },
      Friday: { breakfast: "Tuna sandwich", lunch: "Chicken biryani", dinner: "Chicken tikka with roti", snacks: "Boiled egg" },
      Saturday: { breakfast: "Egg omelette with toast", lunch: "Egg curry with roti", dinner: "Egg fried rice", snacks: "Chicken soup cup" },
      Sunday: { breakfast: "Chicken sausage with oats", lunch: "Fish curry with brown rice", dinner: "Chicken tikka with roti", snacks: "Tuna crackers" }
    }
  }
};

const nutritionKeywords = {
  protein: ["paneer", "tofu", "chicken", "fish", "egg", "mutton", "dal", "lentil", "chickpea", "rajma", "tuna"],
  grains: ["rice", "roti", "naan", "bread", "oats", "poha", "idli", "biryani", "quinoa"],
  fats: ["butter", "ghee", "nuts", "peanut"],
  veggies: ["vegetable", "salad", "spinach", "cucumber", "sprouts"]
};

function normalizeDietMode(mode) {
  if (mode === "nonVeg" || mode === "both") {
    return mode;
  }
  return "veg";
}

let currentDiet = normalizeDietMode(localStorage.getItem(DIET_STORAGE_KEY));

function emptyWeekPlan() {
  const plan = {};
  days.forEach((day) => {
    plan[day] = { breakfast: "", lunch: "", dinner: "", snacks: "" };
  });
  return plan;
}

function normalizeStoredPlan() {
  const raw = localStorage.getItem(PLAN_STORAGE_KEY);
  if (!raw) {
    return emptyWeekPlan();
  }

  try {
    const parsed = JSON.parse(raw);
    const normalized = emptyWeekPlan();

    days.forEach((day) => {
      const dayPlan = parsed[day] || {};
      normalized[day].breakfast = typeof dayPlan.breakfast === "string" ? dayPlan.breakfast : "";
      normalized[day].lunch = typeof dayPlan.lunch === "string" ? dayPlan.lunch : "";
      normalized[day].dinner = typeof dayPlan.dinner === "string" ? dayPlan.dinner : "";
      normalized[day].snacks = typeof dayPlan.snacks === "string" ? dayPlan.snacks : "";
    });

    return normalized;
  } catch (_error) {
    return emptyWeekPlan();
  }
}

function setDietMode(mode) {
  currentDiet = normalizeDietMode(mode);
  localStorage.setItem(DIET_STORAGE_KEY, currentDiet);

  document.querySelectorAll("[data-diet-toggle]").forEach((button) => {
    const isActive = button.getAttribute("data-diet-toggle") === currentDiet;
    button.classList.toggle("is-active", isActive);
  });

  const modeText = currentDiet === "veg" ? "Veg Only" : currentDiet === "nonVeg" ? "Non-Veg Only" : "Both (Veg + Non-Veg)";
  const hint = document.getElementById("dietModeHint");
  if (hint) {
    if (currentDiet === "both") {
      hint.textContent = "Current mode: Both (Veg + Non-Veg). You can choose either type and options are clearly labeled.";
    } else {
      hint.textContent = `Current mode: ${modeText}. Options and templates show only ${modeText.toLowerCase()} meals.`;
    }
  }

  generateMealTable();
  generateShoppingList();
}

function getOptionLabel(mealType, mealName, dietType) {
  const dietLabel = dietType === "veg" ? "Veg" : "Non-Veg";
  const mealLabel = mealType.charAt(0).toUpperCase() + mealType.slice(1);
  return `${dietLabel} | ${mealLabel}: ${mealName}`;
}

function getMealOptionsForCurrentDiet(mealType) {
  if (currentDiet === "both") {
    const veg = mealOptions[mealType].veg.map((mealName) => ({ mealName, dietType: "veg" }));
    const nonVeg = mealOptions[mealType].nonVeg.map((mealName) => ({ mealName, dietType: "nonVeg" }));
    return [...veg, ...nonVeg];
  }

  return mealOptions[mealType][currentDiet].map((mealName) => ({
    mealName,
    dietType: currentDiet
  }));
}

function createMealSelect(day, mealType, value) {
  const options = getMealOptionsForCurrentDiet(mealType);
  const optionNames = new Set(options.map((option) => option.mealName));
  const select = document.createElement("select");
  select.className = "meal-input";
  select.setAttribute("data-day", day);
  select.setAttribute("data-meal", mealType);
  select.style.width = "100%";
  select.style.padding = "0.5rem";
  select.style.border = "1px solid #cbd5e1";
  select.style.borderRadius = "0.375rem";

  const placeholder = document.createElement("option");
  placeholder.value = "";
  placeholder.textContent = `Select ${mealType}`;
  select.appendChild(placeholder);

  options.forEach(({ mealName, dietType }) => {
    const option = document.createElement("option");
    option.value = mealName;
    option.textContent = getOptionLabel(mealType, mealName, dietType);
    select.appendChild(option);
  });

  if (value && !optionNames.has(value)) {
    const customOption = document.createElement("option");
    customOption.value = value;
    customOption.textContent = `Saved | ${mealType}: ${value}`;
    select.appendChild(customOption);
  }

  select.value = value || "";
  return select;
}

function generateMealTable() {
  const table = document.getElementById("mealPlannerTable");
  if (!table) {
    return;
  }

  const plan = normalizeStoredPlan();
  table.innerHTML = "";

  days.forEach((day) => {
    const tr = document.createElement("tr");
    tr.style.border = "1px solid #e2e8f0";

    const dayCell = document.createElement("td");
    dayCell.style.padding = "1rem";
    dayCell.style.fontWeight = "600";
    dayCell.style.border = "1px solid #e2e8f0";
    dayCell.textContent = day;
    tr.appendChild(dayCell);

    ["breakfast", "lunch", "dinner", "snacks"].forEach((mealType) => {
      const mealCell = document.createElement("td");
      mealCell.style.padding = "0.5rem";
      mealCell.style.border = "1px solid #e2e8f0";

      const select = createMealSelect(day, mealType, plan[day][mealType]);
      select.addEventListener("change", () => {
        savePlanToStorage();
        generateShoppingList();
      });

      mealCell.appendChild(select);
      tr.appendChild(mealCell);
    });

    table.appendChild(tr);
  });
}

function buildTemplatePlan(templateName) {
  if (templateName === "custom") {
    return emptyWeekPlan();
  }

  const template = mealTemplates[templateName];
  if (!template) {
    return emptyWeekPlan();
  }

  if (currentDiet === "both") {
    const mixedPlan = emptyWeekPlan();
    days.forEach((day, index) => {
      const source = index % 2 === 0 ? template.veg : template.nonVeg;
      mixedPlan[day] = JSON.parse(JSON.stringify(source[day] || mixedPlan[day]));
    });
    return mixedPlan;
  }

  if (!template[currentDiet]) {
    return emptyWeekPlan();
  }

  return JSON.parse(JSON.stringify(template[currentDiet]));
}

function loadTemplate(templateName) {
  const plan = buildTemplatePlan(templateName);
  localStorage.setItem(PLAN_STORAGE_KEY, JSON.stringify(plan));
  generateMealTable();
  generateShoppingList();
}

function getPlan() {
  const plan = emptyWeekPlan();

  days.forEach((day) => {
    ["breakfast", "lunch", "dinner", "snacks"].forEach((mealType) => {
      const input = document.querySelector(`[data-day="${day}"][data-meal="${mealType}"]`);
      plan[day][mealType] = input ? input.value.trim() : "";
    });
  });

  return plan;
}

function savePlanToStorage() {
  const plan = getPlan();
  localStorage.setItem(PLAN_STORAGE_KEY, JSON.stringify(plan));
}

function savePlan() {
  savePlanToStorage();
  alert("✅ Plan saved successfully!");
}

function loadPlan() {
  const saved = localStorage.getItem(PLAN_STORAGE_KEY);
  if (saved) {
    generateMealTable();
    generateShoppingList();
    alert("✅ Plan loaded!");
  } else {
    alert("❌ No saved plan found");
  }
}

function resetPlan() {
  if (confirm("Clear your meal plan?")) {
    localStorage.removeItem(PLAN_STORAGE_KEY);
    generateMealTable();
    generateShoppingList();
  }
}

function capitalize(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

function scoreMealNutrition(mealText) {
  const text = mealText.toLowerCase();
  let calories = 120;
  let protein = 4;
  let carbs = 10;
  let fat = 3;

  if (nutritionKeywords.protein.some((key) => text.includes(key))) {
    calories += 170;
    protein += 18;
    fat += 6;
  }
  if (nutritionKeywords.grains.some((key) => text.includes(key))) {
    calories += 180;
    carbs += 28;
    protein += 4;
  }
  if (nutritionKeywords.fats.some((key) => text.includes(key))) {
    calories += 90;
    fat += 9;
  }
  if (nutritionKeywords.veggies.some((key) => text.includes(key))) {
    calories += 35;
    carbs += 6;
    protein += 2;
  }

  return { calories, protein, carbs, fat };
}

function updateNutritionEstimate(plan) {
  let totalCalories = 0;
  let totalProtein = 0;
  let totalCarbs = 0;
  let totalFat = 0;
  let countedDays = 0;

  days.forEach((day) => {
    const meals = Object.values(plan[day]);
    const nonEmptyMeals = meals.filter((meal) => meal.trim().length > 0);

    if (nonEmptyMeals.length === 0) {
      return;
    }

    countedDays += 1;
    nonEmptyMeals.forEach((meal) => {
      const nutrition = scoreMealNutrition(meal);
      totalCalories += nutrition.calories;
      totalProtein += nutrition.protein;
      totalCarbs += nutrition.carbs;
      totalFat += nutrition.fat;
    });
  });

  const divisor = countedDays || 1;
  document.getElementById("totalCal").textContent = `${Math.round(totalCalories / divisor)} kcal/day`;
  document.getElementById("totalPro").textContent = `${Math.round(totalProtein / divisor)} g/day`;
  document.getElementById("totalCarb").textContent = `${Math.round(totalCarbs / divisor)} g/day`;
  document.getElementById("totalFat").textContent = `${Math.round(totalFat / divisor)} g/day`;
}

function updateShoppingUI(ingredients) {
  const updateList = (id, items) => {
    const el = document.getElementById(id);
    if (!el) {
      return;
    }

    if (items.size === 0) {
      el.innerHTML = '<li style="color: #94a3b8;">No items</li>';
      return;
    }

    el.innerHTML = Array.from(items)
      .sort()
      .map((item) => `<li style="padding: 0.5rem 0; display: flex; align-items: center;"><input type="checkbox" style="margin-right: 0.5rem;"> ${item}</li>`)
      .join("");
  };

  updateList("shoppingVeggies", ingredients.veggies);
  updateList("shoppingProtein", ingredients.protein);
  updateList("shoppingGrains", ingredients.grains);
  updateList("shoppingCondiments", ingredients.condiments);
}

function generateShoppingList() {
  const plan = getPlan();
  const ingredients = {
    veggies: new Set(),
    protein: new Set(),
    grains: new Set(),
    condiments: new Set()
  };

  const ingredientMaps = {
    veggies: ["spinach", "cucumber", "tomato", "potato", "carrot", "broccoli", "onion", "garlic", "ginger", "lettuce", "bell pepper", "cabbage", "eggplant", "peas", "beans", "mushroom", "vegetable", "salad", "sprouts"],
    protein: ["paneer", "chicken", "fish", "egg", "tofu", "dal", "lentil", "chickpea", "chana", "rajma", "mutton", "curd", "yogurt", "milk", "cheese", "tuna"],
    grains: ["rice", "bread", "roti", "naan", "paratha", "poha", "dosa", "idli", "oats", "quinoa", "biryani"],
    condiments: ["curry", "sauce", "oil", "ghee", "butter", "spice", "chutney", "masala", "salt", "pepper"]
  };

  Object.values(plan).forEach((dayPlan) => {
    Object.values(dayPlan).forEach((meal) => {
      if (!meal) {
        return;
      }
      const lower = meal.toLowerCase();
      Object.entries(ingredientMaps).forEach(([category, keywords]) => {
        keywords.forEach((keyword) => {
          if (lower.includes(keyword)) {
            ingredients[category].add(capitalize(keyword));
          }
        });
      });
    });
  });

  updateShoppingUI(ingredients);
  updateNutritionEstimate(plan);
}

function printShoppingList() {
  window.print();
}

function exportShoppingList() {
  const dietLabel = currentDiet === "veg" ? "Veg" : currentDiet === "nonVeg" ? "Non-Veg" : "Both (Veg + Non-Veg)";
  let text = `SHOPPING LIST (${dietLabel})\n`;
  text += `${new Date().toLocaleDateString()}\n\n`;
  text += "🥬 VEGETABLES & PRODUCE\n";
  document.querySelectorAll("#shoppingVeggies li").forEach((li) => {
    text += `☐ ${li.textContent.trim()}\n`;
  });
  text += "\n🍗 PROTEINS & DAIRY\n";
  document.querySelectorAll("#shoppingProtein li").forEach((li) => {
    text += `☐ ${li.textContent.trim()}\n`;
  });
  text += "\n🌾 GRAINS & PANTRY\n";
  document.querySelectorAll("#shoppingGrains li").forEach((li) => {
    text += `☐ ${li.textContent.trim()}\n`;
  });
  text += "\n🧂 CONDIMENTS & SPICES\n";
  document.querySelectorAll("#shoppingCondiments li").forEach((li) => {
    text += `☐ ${li.textContent.trim()}\n`;
  });

  const blob = new Blob([text], { type: "text/plain" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `shopping-list-${new Date().toISOString().split("T")[0]}.txt`;
  a.click();
}

function copyToClipboard() {
  const allItems = Array.from(document.querySelectorAll("#shoppingVeggies li, #shoppingProtein li, #shoppingGrains li, #shoppingCondiments li"));
  const dietLabel = currentDiet === "veg" ? "Veg" : currentDiet === "nonVeg" ? "Non-Veg" : "Both (Veg + Non-Veg)";
  const text = [
    `SHOPPING LIST (${dietLabel})`,
    ...allItems.map((li) => `• ${li.textContent.trim()}`)
  ].join("\n");

  navigator.clipboard.writeText(text).then(() => {
    alert("✅ Shopping list copied to clipboard!");
  });
}

window.loadTemplate = loadTemplate;
window.savePlan = savePlan;
window.loadPlan = loadPlan;
window.resetPlan = resetPlan;
window.printShoppingList = printShoppingList;
window.exportShoppingList = exportShoppingList;
window.copyToClipboard = copyToClipboard;

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("[data-diet-toggle]").forEach((button) => {
    button.addEventListener("click", () => {
      const mode = button.getAttribute("data-diet-toggle") || "veg";
      setDietMode(mode);
    });
  });

  setDietMode(currentDiet);
});
