// Get all logs from localStorage
function getAllLogs() {
  // Try to migrate old data if it exists
  const oldData = localStorage.getItem('nutriNourishEntries');
  if (oldData) {
    console.log('Found old storage key, migrating data...');
    try {
      const oldEntries = JSON.parse(oldData);
      const newData = localStorage.getItem('nutritionLog');
      const currentEntries = newData ? JSON.parse(newData) : [];
      
      // Migrate old entries, adding date if missing
      const migratedEntries = oldEntries.map(entry => {
        if (!entry.date) {
          entry.date = new Date().toISOString().split('T')[0];
        }
        if (!entry.name) {
          entry.name = entry.foodItem || 'Unknown';
        }
        return entry;
      });
      
      // Merge with current entries (avoid duplicates by date and name combination)
      const merged = [...migratedEntries, ...currentEntries].filter((item, index, self) =>
        index === self.findIndex((t) => t.date === item.date && t.name === item.name)
      );
      
      localStorage.setItem('nutritionLog', JSON.stringify(merged));
      localStorage.removeItem('nutriNourishEntries'); // Remove old key
      console.log('Data migration complete. Migrated', migratedEntries.length, 'entries');
    } catch (e) {
      console.error('Error during data migration:', e);
    }
  }
  
  const rawData = localStorage.getItem('nutritionLog');
  const logs = rawData ? JSON.parse(rawData) : [];
  console.log('getAllLogs - Retrieved logs:', logs);
  return logs;
}

// Initialize charts and data
function initializeDashboard() {
  console.log('initializeDashboard called');
  const logs = getAllLogs();
  console.log('Total logs:', logs.length);
  
  const today = new Date().toISOString().split('T')[0];
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  
  console.log('Date range:', sevenDaysAgo, 'to', today);
  
  // Filter logs for last 7 days
  const recentLogs = logs.filter(log => {
    const isInRange = log.date && log.date >= sevenDaysAgo && log.date <= today;
    console.log('Filtering log:', log.date, 'result:', isInRange);
    return isInRange;
  });

  console.log('Recent logs after filter:', recentLogs.length);

  // Group logs by date
  const logsByDate = {};
  recentLogs.forEach(log => {
    const date = log.date;
    if (!logsByDate[date]) {
      logsByDate[date] = [];
    }
    logsByDate[date].push(log);
  });
  
  console.log('logsByDate structure:', logsByDate);
  console.log('logsByDate keys:', Object.keys(logsByDate));

  // Calculate stats (always call, even if empty)
  calculateStats(logsByDate);
  drawCharts(logsByDate);
  displayDailyBreakdown(logsByDate);
  displayMealHistory(recentLogs);
}

function calculateStats(logsByDate) {
  const dates = Object.keys(logsByDate).sort();
  let totalCalories = 0, totalProtein = 0, totalDays = 0;
  
  console.log('calculateStats for dates:', dates);
  
  dates.forEach(date => {
    const meals = logsByDate[date];
    const dayCalories = meals.reduce((sum, m) => sum + (parseFloat(m.calories) || 0), 0);
    const dayProtein = meals.reduce((sum, m) => sum + (parseFloat(m.protein) || 0), 0);
    
    console.log(`Date ${date}: cal=${dayCalories}, protein=${dayProtein}`);
    
    if (dayCalories > 0 || dayProtein > 0) {
      totalCalories += dayCalories;
      totalProtein += dayProtein;
      totalDays++;
    }
  });

  const avgCalories = totalDays > 0 ? Math.round(totalCalories / totalDays) : 0;
  const avgProtein = totalDays > 0 ? Math.round(totalProtein / totalDays) : 0;

  console.log('Stats: avgCalories=', avgCalories, 'avgProtein=', avgProtein, 'totalDays=', totalDays);

  document.getElementById('avgCalories').textContent = avgCalories + ' cal';
  document.getElementById('avgProtein').textContent = avgProtein + 'g';
  document.getElementById('loggedDays').textContent = totalDays + ' / 7';
  document.getElementById('consistency').textContent = Math.round((totalDays / 7) * 100) + '%';
}

function drawCharts(logsByDate) {
  try {
    console.log('drawCharts called');
    
    // Check if Chart is available
    if (typeof Chart === 'undefined') {
      console.error('Chart.js library is not loaded!');
      return;
    }
    
    console.log('Chart.js is available:', Chart);
    
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

    console.log('Chart data prepared:', { dates, calorieData });

    // Calorie Chart
    const calorieCanvas = document.getElementById('calorieChart');
    console.log('Calorie canvas element:', calorieCanvas);
    
    if (!calorieCanvas) {
      console.error('calorieChart canvas element not found!');
    } else {
      try {
        const calorieCtx = calorieCanvas.getContext('2d');
        console.log('Calorie canvas context:', calorieCtx);
        
        if (!calorieCtx) {
          console.error('Failed to get 2d context for calorieChart');
        } else {
          // Properly destroy existing chart if it exists
          if (window.calorieChart && typeof window.calorieChart.destroy === 'function') {
            console.log('Destroying existing calorie chart');
            window.calorieChart.destroy();
          }
          
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
          console.log('Calorie chart created successfully');
        }
      } catch (e) {
        console.error('Error creating calorie chart:', e);
      }
    }

    // Macro Chart (Pie)
    const macroCanvas = document.getElementById('macroChart');
    console.log('Macro canvas element:', macroCanvas);
    
    if (!macroCanvas) {
      console.error('macroChart canvas element not found!');
    } else {
      try {
        const macroCtx = macroCanvas.getContext('2d');
        console.log('Macro canvas context:', macroCtx);
        
        if (!macroCtx) {
          console.error('Failed to get 2d context for macroChart');
        } else {
          // Properly destroy existing chart if it exists
          if (window.macroChart && typeof window.macroChart.destroy === 'function') {
            console.log('Destroying existing macro chart');
            window.macroChart.destroy();
          }
          
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
          console.log('Macro chart created successfully');
        }
      } catch (e) {
        console.error('Error creating macro chart:', e);
      }
    }
  } catch (error) {
    console.error('Error in drawCharts:', error);
  }
}

function displayDailyBreakdown(logsByDate) {
  const dates = Object.keys(logsByDate).sort();
  const tbody = document.getElementById('dailyBreakdown');
  
  console.log('displayDailyBreakdown called with dates:', dates);
  
  if (dates.length === 0) {
    console.log('No dates to display');
    tbody.innerHTML = '<tr><td colspan="6" style="padding: 2rem; text-align: center; color: #94a3b8;">No data logged yet. <a href="nutri.html" style="color: var(--brand); font-weight: 600;">Start logging meals →</a></td></tr>';
    return;
  }
  
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
  
  console.log('displayMealHistory called with meals:', meals.length);
  
  if (meals.length === 0) {
    console.log('No meals to display');
    container.innerHTML = '<div class="panel" style="text-align: center; color: #94a3b8;"><p>No meals logged yet.</p><a href="nutri.html" class="btn btn-primary" style="margin-top: 1rem;">Log Your First Meal</a></div>';
    return;
  }
  
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

// Initialize on page load - wait for Chart.js to be available
function waitForChartAndInit() {
  if (typeof Chart === 'undefined') {
    console.log('Waiting for Chart.js to load...');
    setTimeout(waitForChartAndInit, 100);
  } else {
    console.log('Chart.js loaded, initializing dashboard');
    initializeDashboard();
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', waitForChartAndInit);
} else {
  waitForChartAndInit();
}
