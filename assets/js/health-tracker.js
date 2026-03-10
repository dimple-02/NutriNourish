// Water tracking functions
function addWater(amount) {
  const today = new Date().toISOString().split('T')[0];
  let waterData = JSON.parse(localStorage.getItem('waterLog') || '{}');
  
  if (!waterData[today]) {
    waterData[today] = { entries: [], total: 0 };
  }
  
  waterData[today].entries.push({
    amount: typeof amount === 'number' ? amount : 250,
    time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  });
  
  waterData[today].total = waterData[today].entries.reduce((sum, e) => sum + e.amount, 0);
  localStorage.setItem('waterLog', JSON.stringify(waterData));
  
  updateWaterDisplay();
}

function addCustomWater() {
  const amount = parseInt(document.getElementById('customWaterAmount').value);
  if (amount && amount > 0) {
    addWater(amount);
    document.getElementById('customWaterAmount').value = '';
  } else {
    alert('Please enter a valid amount');
  }
}

function updateWaterDisplay() {
  const today = new Date().toISOString().split('T')[0];
  const waterData = JSON.parse(localStorage.getItem('waterLog') || '{}');
  const todayData = waterData[today] || { entries: [], total: 0 };
  const goal = JSON.parse(localStorage.getItem('waterGoal') || '{}').daily || 2000;

  // Update consumed amount
  document.getElementById('waterConsumed').textContent = todayData.total;
  document.getElementById('waterGoal').textContent = goal;

  // Update progress bar
  const percent = Math.min((todayData.total / goal) * 100, 100);
  document.getElementById('waterProgress').style.width = percent + '%';
  document.getElementById('waterPercent').textContent = Math.round(percent) + '%';

  // Update log
  const logList = document.getElementById('waterLog');
  if (todayData.entries.length === 0) {
    logList.innerHTML = '<li style="color: #94a3b8;">No water logged yet</li>';
  } else {
    logList.innerHTML = todayData.entries
      .map((entry, idx) => `<li style="padding: 0.5rem; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #e2e8f0;">
        <span>${entry.time} - ${entry.amount} ml</span>
        <button onclick="removeWaterEntry(${idx})" style="background: #fee2e2; color: #991b1b; border: none; padding: 0.25rem 0.75rem; border-radius: 0.25rem; cursor: pointer; font-size: 0.85rem;">Remove</button>
      </li>`)
      .join('');
  }

  // Update weekly stats
  updateWeeklyWaterStats();
}

function updateWeeklyWaterStats() {
  const waterData = JSON.parse(localStorage.getItem('waterLog') || '{}');
  let totalWeek = 0, days = 0;

  for (let i = 0; i < 7; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const weekData = waterData[dateStr];
    const element = document.querySelector(`.weekly-water[data-day="${6 - i}"]`);
    
    if (weekData && element) {
      element.textContent = weekData.total + ' ml';
      totalWeek += weekData.total;
      days++;
    }
  }

  document.getElementById('avgWater').textContent = days > 0 ? Math.round(totalWeek / days) + ' ml' : '-';
}

function removeWaterEntry(index) {
  const today = new Date().toISOString().split('T')[0];
  let waterData = JSON.parse(localStorage.getItem('waterLog') || '{}');
  
  if (waterData[today]) {
    waterData[today].entries.splice(index, 1);
    waterData[today].total = waterData[today].entries.reduce((sum, e) => sum + e.amount, 0);
    localStorage.setItem('waterLog', JSON.stringify(waterData));
    updateWaterDisplay();
  }
}

function openWaterSettings() {
  const goal = JSON.parse(localStorage.getItem('waterGoal') || '{}').daily || 2000;
  document.getElementById('newWaterGoal').value = goal;
  document.getElementById('waterSettingsModal').style.display = 'flex';
}

function closeWaterSettings() {
  document.getElementById('waterSettingsModal').style.display = 'none';
}

function saveWaterGoal() {
  const goal = parseInt(document.getElementById('newWaterGoal').value);
  if (goal && goal > 0) {
    localStorage.setItem('waterGoal', JSON.stringify({ daily: goal }));
    closeWaterSettings();
    updateWaterDisplay();
    alert('✅ Water goal updated!');
  }
}

// Exercise tracking functions
function addExercise() {
  const type = document.getElementById('exerciseType').value;
  const duration = parseInt(document.getElementById('exerciseDuration').value);
  const intensity = document.getElementById('exerciseIntensity').value;
  const notes = document.getElementById('exerciseNotes').value;

  if (!type || !duration) {
    alert('Please fill all required fields');
    return;
  }

  const today = new Date().toISOString().split('T')[0];
  let exerciseData = JSON.parse(localStorage.getItem('exerciseLog') || '{}');

  if (!exerciseData[today]) {
    exerciseData[today] = [];
  }

  // Calculate calories burned (rough estimate)
  const calorieFactors = {
    cardio: { light: 5, moderate: 8, intense: 12 },
    strength: { light: 3, moderate: 6, intense: 10 },
    yoga: { light: 2, moderate: 4, intense: 6 },
    sports: { light: 6, moderate: 9, intense: 13 },
    walks: { light: 3, moderate: 5, intense: 8 },
    other: { light: 4, moderate: 6, intense: 9 }
  };

  const caloriesPerMin = calorieFactors[type]?.[intensity] || 5;
  const caloriesBurned = duration * caloriesPerMin;

  exerciseData[today].push({
    type,
    duration,
    intensity,
    notes,
    caloriesBurned,
    time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    timestamp: new Date().toISOString()
  });

  localStorage.setItem('exerciseLog', JSON.stringify(exerciseData));

  // Clear form
  document.getElementById('exerciseType').value = '';
  document.getElementById('exerciseDuration').value = '';
  document.getElementById('exerciseIntensity').value = 'moderate';
  document.getElementById('exerciseNotes').value = '';

  updateExerciseDisplay();
  alert('✅ Exercise logged!');
}

function updateExerciseDisplay() {
  const today = new Date().toISOString().split('T')[0];
  const exerciseData = JSON.parse(localStorage.getItem('exerciseLog') || '{}');
  const todayExercises = exerciseData[today] || [];

  // Calculate totals
  const totalTime = todayExercises.reduce((sum, e) => sum + e.duration, 0);
  const totalCals = todayExercises.reduce((sum, e) => sum + e.caloriesBurned, 0);

  document.getElementById('totalTime').textContent = totalTime;
  document.getElementById('calBurned').textContent = totalCals;

  // Update exercise log
  const logList = document.getElementById('exerciseLog');
  if (todayExercises.length === 0) {
    logList.innerHTML = '<li style="color: #94a3b8;">No exercises logged yet</li>';
  } else {
    logList.innerHTML = todayExercises
      .map((ex, idx) => {
        const icons = { cardio: '🏃', strength: '🏋️', yoga: '🧘', sports: '⚽', walks: '🚶', other: '📌' };
        return `<li style="padding: 0.75rem; margin-bottom: 0.5rem; background: #f8fafc; border-radius: 0.375rem;">
          <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 0.5rem;">
            <div>
              <strong>${icons[ex.type]} ${ex.type.charAt(0).toUpperCase() + ex.type.slice(1)}</strong>
              <p style="margin: 0.25rem 0 0 0; font-size: 0.85rem; color: #64748b;">${ex.time} • ${ex.duration} min • ${ex.caloriesBurned} cal</p>
              ${ex.notes ? `<p style="margin: 0.5rem 0 0 0; font-size: 0.85rem; color: #64748b;">📝 ${ex.notes}</p>` : ''}
            </div>
            <button onclick="removeExercise(${idx})" style="background: #fee2e2; color: #991b1b; border: none; padding: 0.25rem 0.75rem; border-radius: 0.25rem; cursor: pointer; font-size: 0.75rem;">✕</button>
          </div>
        </li>`;
      })
      .join('');
  }

  updateWeeklyExerciseStats();
}

function updateWeeklyExerciseStats() {
  const exerciseData = JSON.parse(localStorage.getItem('exerciseLog') || '{}');
  let weekWorkouts = 0, weekTime = 0, weekCals = 0;

  for (let i = 0; i < 7; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const dayExercises = exerciseData[dateStr] || [];

    if (dayExercises.length > 0) {
      weekWorkouts += dayExercises.length;
      weekTime += dayExercises.reduce((sum, e) => sum + e.duration, 0);
      weekCals += dayExercises.reduce((sum, e) => sum + e.caloriesBurned, 0);
    }
  }

  document.getElementById('weekWorkouts').textContent = weekWorkouts;
  document.getElementById('weekCalories').textContent = weekCals;
  document.getElementById('avgDuration').textContent = weekWorkouts > 0 ? Math.round(weekTime / weekWorkouts) + ' min' : '-';
}

function removeExercise(index) {
  const today = new Date().toISOString().split('T')[0];
  let exerciseData = JSON.parse(localStorage.getItem('exerciseLog') || '{}');

  if (exerciseData[today]) {
    exerciseData[today].splice(index, 1);
    localStorage.setItem('exerciseLog', JSON.stringify(exerciseData));
    updateExerciseDisplay();
  }
}

function resetHealthData() {
  if (confirm('⚠️ Clear all water and exercise data?')) {
    localStorage.removeItem('waterLog');
    localStorage.removeItem('exerciseLog');
    localStorage.removeItem('waterGoal');
    alert('✅ Health data cleared!');
    location.reload();
  }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  updateWaterDisplay();
  updateExerciseDisplay();
});
