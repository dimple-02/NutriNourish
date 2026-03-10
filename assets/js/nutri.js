const NUTRITION_STORAGE_KEY = 'nutriNourishEntries';
const nutritionForm = document.getElementById('nutritionForm');
const tableBody = document.getElementById('nutritionTableBody');

let entries = [];

function renderTotals() {
    const totals = entries.reduce(
        (acc, entry) => {
            acc.calories += entry.calories;
            acc.protein += entry.protein;
            acc.carbs += entry.carbs;
            acc.fat += entry.fat;
            return acc;
        },
        { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );

    document.getElementById('totalCalories').textContent = totals.calories;
    document.getElementById('totalProtein').textContent = totals.protein;
    document.getElementById('totalCarbs').textContent = totals.carbs;
    document.getElementById('totalFat').textContent = totals.fat;
}

function saveEntries() {
    localStorage.setItem(NUTRITION_STORAGE_KEY, JSON.stringify(entries));
}

function deleteEntry(index) {
    entries.splice(index, 1);
    saveEntries();
    renderTable();
}

function buildCell(row, value) {
    row.insertCell().textContent = value;
}

function renderTable() {
    tableBody.innerHTML = '';

    entries.forEach((entry, index) => {
        const row = tableBody.insertRow();
        buildCell(row, entry.meal);
        buildCell(row, entry.foodItem);
        buildCell(row, entry.servingSize);
        buildCell(row, entry.calories);
        buildCell(row, entry.protein);
        buildCell(row, entry.carbs);
        buildCell(row, entry.fat);

        const actionCell = row.insertCell();
        const deleteButton = document.createElement('button');
        deleteButton.type = 'button';
        deleteButton.textContent = 'Remove';
        deleteButton.addEventListener('click', () => deleteEntry(index));
        actionCell.appendChild(deleteButton);
    });

    renderTotals();
}

function parseNumberInput(id) {
    return Number(document.getElementById(id).value);
}

function isValidEntry(entry) {
    const numericFields = [entry.calories, entry.protein, entry.carbs, entry.fat];
    return entry.meal && entry.foodItem && entry.servingSize && numericFields.every((value) => Number.isFinite(value) && value >= 0);
}

nutritionForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const entry = {
        meal: document.getElementById('meal').value.trim(),
        foodItem: document.getElementById('foodItem').value.trim(),
        servingSize: document.getElementById('servingSize').value.trim(),
        calories: parseNumberInput('calories'),
        protein: parseNumberInput('protein'),
        carbs: parseNumberInput('carbs'),
        fat: parseNumberInput('fat')
    };

    if (!isValidEntry(entry)) {
        alert('Please complete all fields with valid non-negative values.');
        return;
    }

    entries.push(entry);
    saveEntries();
    renderTable();
    nutritionForm.reset();
});

function restoreEntries() {
    const storedEntries = localStorage.getItem(NUTRITION_STORAGE_KEY);
    if (!storedEntries) {
        return;
    }

    try {
        const parsedEntries = JSON.parse(storedEntries);
        if (Array.isArray(parsedEntries)) {
            entries = parsedEntries.filter(isValidEntry);
        }
    } catch (_) {
        entries = [];
    }

    renderTable();
}

restoreEntries();