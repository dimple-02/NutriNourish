// Get all logs from localStorage
function getAllLogs() {
  const rawData = localStorage.getItem('nutritionLog');
  return rawData ? JSON.parse(rawData) : [];
}

// Initialize charts and data
function initializeDashboard() {
  const logs = getAllLogs();
  const today = new Date();
  const sevenDaysAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
  
  // Filter logs for last 7 days
  const recentLogs = logs.filter(log => {
    const logDate = new Date(log.date);
    return logDate >= sevenDaysAgo && logDate <= today;
  });

  // Group logs by date
  const logsByDate = {};
  recentLogs.forEach(log => {
    const date = log.date;
    if (!logsByDate[date]) {
      logsByDate[date] = [];
    }
    logsByDate[date].push(log);
  });

  // Calculate stats
  calculateStats(logsByDate);
  drawCharts(logsByDate);
  displayDailyBreakdown(logsByDate);
  displayMealHistory(recentLogs);
}

function calculateStats(logsByDate) {
  const dates = Object.keys(logsByDate).sort();
  let totalCalories = 0, totalProtein = 0, totalDays = 0;
  
  dates.forEach(date => {
    const meals = logsByDate[date];
    const dayCalories = meals.reduce((sum, m) => sum + (parseFloat(m.calories) || 0), 0);
    const dayProtein = meals.reduce((sum, m) => sum + (parseFloat(m.protein) || 0), 0);
    
    if (dayCalories > 0 || dayProtein > 0) {
      totalCalories += dayCalories;
      totalProtein += dayProtein;
      totalDays++;
    }
  });

  const avgCalories = totalDays > 0 ? Math.round(totalCalories / totalDays) : 0;
  const avgProtein = totalDays > 0 ? Math.round(totalProtein / totalDays) : 0;

  document.getElementById('avgCalories').textContent = avgCalories + ' cal';
  document.getElementById('avgProtein').textContent = avgProtein + 'g';
  document.getElementById('loggedDays').textContent = totalDays + ' / 7';
  document.getElementById('consistency').textContent = Math.round((totalDays / 7) * 100) + '%';
}

function drawCharts(logsByDate) {
  // Prepare data for last 7 days
  const dates = [];
  const calorieData = [];
  const proteinData = [];
  const carbsData = [];
  const fatData = [];

  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
    dates.push(dayName);

    const meals = logsByDate[dateStr] || [];
    const cal = meals.reduce((sum, m) => sum + (parseFloat(m.calories) || 0), 0);
    calorieData.push(cal);
    proteinData.push(meals.reduce((sum, m) => sum + (parseFloat(m.protein) || 0), 0));
    carbsData.push(meals.reduce((sum, m) => sum + (parseFloat(m.carbs) || 0), 0));
    fatData.push(meals.reduce((sum, m) => sum + (parseFloat(m.fat) || 0), 0));
  }

  // Calorie Chart
  const calorieCtx = document.getElementById('calorieChart')?.getContext('2d');
  if (calorieCtx && window.calorieChart) {
    window.calorieChart.destroy();
  }
  if (calorieCtx) {
    window.calorieChart = new Chart(calorieCtx, {
      type: 'line',
      data: {
        labels: dates,
        datasets: [{
          label: 'Calories',
          data: calorieData,
          borderColor: '#10b981',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          tension: 0.4,
          fill: true,
          pointRadius: 5,
          pointBackgroundColor: '#10b981'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: { legend: { display: false } },
        scales: {
          y: {
            beginAtZero: true,
            ticks: { callback: v => v + ' cal' }
          }
        }
      }
    });
  }

  // Macro Chart (Pie)
  const macroCtx = document.getElementById('macroChart')?.getContext('2d');
  if (macroCtx && window.macroChart) {
    window.macroChart.destroy();
  }
  if (macroCtx) {
    const avgProtein = Math.round(proteinData.reduce((a, b) => a + b, 0) / 7);
    const avgCarbs = Math.round(carbsData.reduce((a, b) => a + b, 0) / 7);
    const avgFat = Math.round(fatData.reduce((a, b) => a + b, 0) / 7);

    window.macroChart = new Chart(macroCtx, {
      type: 'doughnut',
      data: {
        labels: ['Protein (' + avgProtein + 'g)', 'Carbs (' + avgCarbs + 'g)', 'Fat (' + avgFat + 'g)'],
        datasets: [{
          data: [avgProtein * 4, avgCarbs * 4, avgFat * 9],
          backgroundColor: ['#3b82f6', '#f59e0b', '#ef4444'],
          borderColor: '#fff',
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: { position: 'bottom' }
        }
      }
    });
  }
}

function displayDailyBreakdown(logsByDate) {
  const dates = Object.keys(logsByDate).sort();
  const tbody = document.getElementById('dailyBreakdown');
  
  if (dates.length === 0) return;
  
  tbody.innerHTML = dates.map(date => {
    const meals = logsByDate[date];
    const cal = meals.reduce((sum, m) => sum + (parseFloat(m.calories) || 0), 0);
    const pro = meals.reduce((sum, m) => sum + (parseFloat(m.protein) || 0), 0);
    const carb = meals.reduce((sum, m) => sum + (parseFloat(m.carbs) || 0), 0);
    const fat = meals.reduce((sum, m) => sum + (parseFloat(m.fat) || 0), 0);
    
    const target = 2000;
    let status = cal > 0 ? (Math.abs(cal - target) < 300 ? '✅ On Target' : (cal > target ? '⬆️ Over' : '⬇️ Under')) : '⏳ Pending';
    
    return `
      <tr style="border-bottom: 1px solid #e2e8f0;">
        <td style="padding: 1rem;">${new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</td>
        <td style="padding: 1rem; text-align: center; font-weight: 600;">${Math.round(cal)}</td>
        <td style="padding: 1rem; text-align: center;">${Math.round(pro)}g</td>
        <td style="padding: 1rem; text-align: center;">${Math.round(carb)}g</td>
        <td style="padding: 1rem; text-align: center;">${Math.round(fat)}g</td>
        <td style="padding: 1rem; text-align: center;">${status}</td>
      </tr>
    `;
  }).join('');
}

function displayMealHistory(meals) {
  const container = document.getElementById('mealHistory');
  
  if (meals.length === 0) return;
  
  const recent = meals.slice(-6).reverse();
  container.innerHTML = recent.map(meal => `
    <div class="panel">
      <h4 style="margin-top: 0; margin-bottom: 0.5rem;">${meal.name}</h4>
      <p style="margin: 0.25rem 0; font-size: 0.9rem;">📅 ${new Date(meal.date).toLocaleDateString()}</p>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem; margin-top: 1rem; font-size: 0.85rem;">
        <span>🔥 ${meal.calories} cal</span>
        <span>💪 ${meal.protein}g protein</span>
        <span>🥕 ${meal.carbs}g carbs</span>
        <span>🧈 ${meal.fat}g fat</span>
      </div>
    </div>
  `).join('');
}

// Target settings
function openTargetModal() {
  const targets = JSON.parse(localStorage.getItem('nutritionTargets') || '{"calories": 2000, "protein": 100, "carbs": 275, "fat": 65}');
  document.getElementById('targetCal').value = targets.calories;
  document.getElementById('targetPro').value = targets.protein;
  document.getElementById('targetCarb').value = targets.carbs;
  document.getElementById('targetFat').value = targets.fat;
  document.getElementById('targetModal').style.display = 'flex';
}

function closeTargetModal() {
  document.getElementById('targetModal').style.display = 'none';
}

function saveTargets() {
  const targets = {
    calories: parseInt(document.getElementById('targetCal').value),
    protein: parseInt(document.getElementById('targetPro').value),
    carbs: parseInt(document.getElementById('targetCarb').value),
    fat: parseInt(document.getElementById('targetFat').value)
  };
  localStorage.setItem('nutritionTargets', JSON.stringify(targets));
  closeTargetModal();
  location.reload();
}

// Export report
function downloadReport() {
  const logs = getAllLogs();
  let csvContent = 'Date,Food Name,Calories,Protein(g),Carbs(g),Fat(g)\n';
  
  logs.forEach(log => {
    csvContent += `${log.date},${log.name},${log.calories},${log.protein},${log.carbs},${log.fat}\n`;
  });
  
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'nutrition-report-' + new Date().toISOString().split('T')[0] + '.csv';
  a.click();
}

// Reset data
function resetData() {
  if (confirm('⚠️ Are you sure? This will delete all your logged meals and cannot be undone.')) {
    localStorage.removeItem('nutritionLog');
    localStorage.removeItem('nutritionTargets');
    alert('✅ Data cleared!');
    location.reload();
  }
}

// Event listeners
document.getElementById('editTargetsBtn')?.addEventListener('click', (e) => {
  e.preventDefault();
  openTargetModal();
});

// Initialize on page load
document.addEventListener('DOMContentLoaded', initializeDashboard);
