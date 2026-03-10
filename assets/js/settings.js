// Initialize settings on load
document.addEventListener('DOMContentLoaded', () => {
  loadSettings();
  applyTheme();
  loadProfile();
  loadFavorites();
  document.getElementById('lastUpdate').textContent = new Date().toLocaleDateString();
});

// Theme Management
function applyTheme() {
  const settings = JSON.parse(localStorage.getItem('appSettings') || '{}');
  const theme = settings.theme || 'system';
  const colorScheme = settings.colorScheme || 'brand';

  document.getElementById('themeLight').checked = theme === 'light';
  document.getElementById('themeDark').checked = theme === 'dark';
  document.getElementById('themeSystem').checked = theme === 'system';

  const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  if (isDark) {
    document.documentElement.style.setProperty('--bg', '#0f172a');
    document.documentElement.style.setProperty('--text', '#f1f5f9');
    document.documentElement.style.setProperty('--text-secondary', '#cbd5e1');
    document.documentElement.style.setProperty('--border', '#1e293b');
    document.documentElement.style.setProperty('--surface', '#1e293b');
    document.body.style.background = '#0f172a';
    document.body.style.color = '#f1f5f9';
  } else {
    document.documentElement.style.setProperty('--bg', '#ffffff');
    document.documentElement.style.setProperty('--text', '#0f172a');
    document.documentElement.style.setProperty('--text-secondary', '#64748b');
    document.documentElement.style.setProperty('--border', '#e2e8f0');
    document.documentElement.style.setProperty('--surface', '#f8fafc');
    document.body.style.background = '#ffffff';
    document.body.style.color = '#0f172a';
  }

  // Apply color scheme
  applyColorScheme(colorScheme);

  // Add event listeners for theme changes
  document.querySelectorAll('input[name="theme"]').forEach(radio => {
    radio.addEventListener('change', (e) => {
      settings.theme = e.target.value;
      localStorage.setItem('appSettings', JSON.stringify(settings));
      applyTheme();
    });
  });
}

function applyColorScheme(scheme) {
  const colorSchemes = {
    brand: { primary: '#0f766e', light: '#f0fdfa', rgb: '15, 118, 110' },
    accent: { primary: '#ea580c', light: '#fff7ed', rgb: '234, 88, 12' },
    purple: { primary: '#7c3aed', light: '#faf5ff', rgb: '124, 58, 237' },
    blue: { primary: '#0284c7', light: '#f0f9ff', rgb: '2, 132, 199' },
    pink: { primary: '#ec4899', light: '#fdf2f8', rgb: '236, 72, 153' },
    green: { primary: '#16a34a', light: '#f0fdf4', rgb: '22, 163, 74' }
  };

  const scheme_data = colorSchemes[scheme] || colorSchemes.brand;
  document.documentElement.style.setProperty('--brand', scheme_data.primary);
  document.documentElement.style.setProperty('--brand-light', scheme_data.light);

  // Mark selected color button
  document.querySelectorAll('.color-btn').forEach(btn => {
    btn.style.borderColor = btn.dataset.color === scheme ? scheme_data.primary : 'transparent';
  });
}

function setColorScheme(scheme) {
  const settings = JSON.parse(localStorage.getItem('appSettings') || '{}');
  settings.colorScheme = scheme;
  localStorage.setItem('appSettings', JSON.stringify(settings));
  applyColorScheme(scheme);
}

// Load and Save Settings
function loadSettings() {
  const settings = JSON.parse(localStorage.getItem('appSettings') || '{}');
  
  document.getElementById('waterReminder').checked = settings.waterReminder !== false;
  document.getElementById('mealReminder').checked = settings.mealReminder !== false;
  document.getElementById('exerciseReminder').checked = settings.exerciseReminder !== false;
  document.getElementById('dailySummary').checked = settings.dailySummary !== false;
}

function saveAllSettings() {
  const settings = {
    theme: document.querySelector('input[name="theme"]:checked').value,
    colorScheme: localStorage.getItem('appSettings') ? JSON.parse(localStorage.getItem('appSettings')).colorScheme : 'brand',
    waterReminder: document.getElementById('waterReminder').checked,
    mealReminder: document.getElementById('mealReminder').checked,
    exerciseReminder: document.getElementById('exerciseReminder').checked,
    dailySummary: document.getElementById('dailySummary').checked
  };

  localStorage.setItem('appSettings', JSON.stringify(settings));
  alert('✅ All settings saved!');
}

// Profile Management
function loadProfile() {
  const profile = JSON.parse(localStorage.getItem('userProfile') || '{}');
  
  document.getElementById('userName').value = profile.name || '';
  document.getElementById('userAge').value = profile.age || '';
  document.getElementById('userGender').value = profile.gender || '';
  document.getElementById('userWeight').value = profile.weight || '';
  document.getElementById('userHeight').value = profile.height || '';
  document.getElementById('userGoal').value = profile.goal || '';
}

function saveProfile() {
  const profile = {
    name: document.getElementById('userName').value,
    age: document.getElementById('userAge').value,
    gender: document.getElementById('userGender').value,
    weight: document.getElementById('userWeight').value,
    height: document.getElementById('userHeight').value,
    goal: document.getElementById('userGoal').value
  };

  localStorage.setItem('userProfile', JSON.stringify(profile));
  alert('✅ Profile saved!');
}

// Favorites Management
function addFavorite() {
  const name = document.getElementById('favoriteName').value;
  const calories = parseFloat(document.getElementById('favoriteCalories').value) || 0;
  const protein = parseFloat(document.getElementById('favoriteProtein').value) || 0;
  const carbs = parseFloat(document.getElementById('favoriteCarbs').value) || 0;
  const fat = parseFloat(document.getElementById('favoriteFat').value) || 0;

  if (!name || (calories === 0 && protein === 0 && carbs === 0 && fat === 0)) {
    alert('Please fill in meal name and at least one macro value');
    return;
  }

  let favorites = JSON.parse(localStorage.getItem('favoriteMeals') || '[]');
  
  favorites.push({
    id: Date.now(),
    name,
    calories,
    protein,
    carbs,
    fat,
    saved: new Date().toLocaleDateString()
  });

  localStorage.setItem('favoriteMeals', JSON.stringify(favorites));

  // Clear form
  document.getElementById('favoriteName').value = '';
  document.getElementById('favoriteCalories').value = '';
  document.getElementById('favoriteProtein').value = '';
  document.getElementById('favoriteCarbs').value = '';
  document.getElementById('favoriteFat').value = '';

  loadFavorites();
  alert('✅ Favorite meal added!');
}

function loadFavorites() {
  const favorites = JSON.parse(localStorage.getItem('favoriteMeals') || '[]');
  const container = document.getElementById('favoritesList');

  if (favorites.length === 0) {
    container.innerHTML = '<p style="color: #94a3b8;">No favorites yet. Create one above!</p>';
    return;
  }

  container.innerHTML = favorites.map((meal, idx) => `
    <div style="background: #f8fafc; padding: 1rem; border-radius: 0.375rem; border-left: 4px solid var(--brand); display: flex; justify-content: space-between; align-items: center;">
      <div style="flex: 1;">
        <h5 style="margin: 0 0 0.25rem 0;">⭐ ${meal.name}</h5>
        <p style="margin: 0; font-size: 0.85rem; color: #64748b;">
          ${meal.calories} cal | ${meal.protein}g protein | ${meal.carbs}g carbs | ${meal.fat}g fat
        </p>
      </div>
      <div style="display: flex; gap: 0.5rem;">
        <button onclick="addFavoriteMealToTracker(${meal.id})" style="background: var(--brand); color: white; border: none; padding: 0.5rem 1rem; border-radius: 0.25rem; cursor: pointer; font-size: 0.85rem;">Add to Log</button>
        <button onclick="deleteFavorite(${meal.id})" style="background: #fee2e2; color: #991b1b; border: none; padding: 0.5rem 1rem; border-radius: 0.25rem; cursor: pointer; font-size: 0.85rem;">Delete</button>
      </div>
    </div>
  `).join('');
}

function deleteFavorite(id) {
  if (confirm('Delete this favorite?')) {
    let favorites = JSON.parse(localStorage.getItem('favoriteMeals') || '[]');
    favorites = favorites.filter(m => m.id !== id);
    localStorage.setItem('favoriteMeals', JSON.stringify(favorites));
    loadFavorites();
  }
}

function addFavoriteMealToTracker(id) {
  const favorites = JSON.parse(localStorage.getItem('favoriteMeals') || '[]');
  const meal = favorites.find(m => m.id === id);

  if (!meal) return;

  // Add to nutrition log
  const today = new Date().toISOString().split('T')[0];
  let logs = JSON.parse(localStorage.getItem('nutritionLog') || '[]');

  logs.push({
    date: today,
    name: meal.name,
    calories: meal.calories,
    protein: meal.protein,
    carbs: meal.carbs,
    fat: meal.fat
  });

  localStorage.setItem('nutritionLog', JSON.stringify(logs));
  alert('✅ Meal added to today\'s log!');
}

// Data Export & Import
function exportAllData() {
  const data = {
    profile: JSON.parse(localStorage.getItem('userProfile') || '{}'),
    nutritionLog: JSON.parse(localStorage.getItem('nutritionLog') || '[]'),
    waterLog: JSON.parse(localStorage.getItem('waterLog') || '{}'),
    exerciseLog: JSON.parse(localStorage.getItem('exerciseLog') || '{}'),
    mealPlan: JSON.parse(localStorage.getItem('mealPlan') || '{}'),
    favorites: JSON.parse(localStorage.getItem('favoriteMeals') || '[]'),
    settings: JSON.parse(localStorage.getItem('appSettings') || '{}'),
    exportDate: new Date().toISOString()
  };

  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'nutriNourish-backup-' + new Date().toISOString().split('T')[0] + '.json';
  a.click();

  alert('✅ All your data has been exported!');
}

function deleteAllData() {
  if (confirm('⚠️ This will delete ALL your data permanently. Are you sure?')) {
    if (confirm('This action cannot be undone. Type "DELETE" to confirm:')) {
      localStorage.clear();
      alert('✅ All data cleared!');
      location.reload();
    }
  }
}
