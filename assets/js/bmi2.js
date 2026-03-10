const POUNDS_TO_KILOGRAMS = 0.453592;
const INCHES_TO_METERS = 0.0254;

const WEIGHT_INPUT_ID = 'weight';
const HEIGHT_FEET_INPUT_ID = 'heightFeet';
const HEIGHT_INCHES_INPUT_ID = 'heightInches';
const HEIGHT_METERS_INPUT_ID = 'heightMeters';
const RESULT_ID = 'result';
const CALCULATE_BTN_ID = 'calculateBtn';
const HEIGHT_FEET_CONTAINER_ID = 'heightFeetContainer';
const HEIGHT_INCHES_CONTAINER_ID = 'heightInchesContainer';
const HEIGHT_METERS_CONTAINER_ID = 'heightMetersContainer';

function convertWeight(weight, weightUnit) {
    return weightUnit === 'lbs' ? weight * POUNDS_TO_KILOGRAMS : weight;
}

function convertHeight(heightFeet, heightInches) {
    const totalHeightInches = (heightFeet * 12) + heightInches;
    return totalHeightInches * INCHES_TO_METERS;
}

function calculateBMI(weightInKilograms, heightInMeters) {
    return (weightInKilograms / (heightInMeters * heightInMeters)).toFixed(2);
}

function determineBMICategory(bmi) {
    if (bmi < 18.5) return "Underweight";
    if (bmi < 24.9) return "Normal weight";
    if (bmi < 29.9) return "Overweight";
    return "Obesity";
}

function showAlert(message) {
    alert(message);
}

function validateInputs(weight, heightInMeters) {
    if (isNaN(weight) || weight <= 0) {
        showAlert("Please enter a valid weight.");
        return false;
    }
    if (isNaN(heightInMeters) || heightInMeters <= 0) {
        showAlert("Please enter a valid height.");
        return false;
    }
    return true;
}

function handleCalculate() {
    const weight = parseFloat(document.getElementById(WEIGHT_INPUT_ID).value);
    const weightUnit = document.querySelector('input[name="weightUnit"]:checked').value;
    const heightUnit = document.querySelector('input[name="heightUnit"]:checked').value;

    let weightInKilograms = convertWeight(weight, weightUnit);
    let heightInMeters;

    if (heightUnit === 'feet') {
        const heightFeet = parseFloat(document.getElementById(HEIGHT_FEET_INPUT_ID).value) || 0;
        const heightInches = parseFloat(document.getElementById(HEIGHT_INCHES_INPUT_ID).value) || 0;
        heightInMeters = convertHeight(heightFeet, heightInches);
    } else {
        heightInMeters = parseFloat(document.getElementById(HEIGHT_METERS_INPUT_ID).value);
    }

    if (!validateInputs(weightInKilograms, heightInMeters)) return;

    const bmi = calculateBMI(weightInKilograms, heightInMeters);
    const category = determineBMICategory(bmi);

    const result = document.getElementById(RESULT_ID);
    result.textContent = `Your BMI is: ${bmi} - Category: ${category}`;
}

document.getElementById(CALCULATE_BTN_ID).addEventListener('click', handleCalculate);

// Show/hide height input fields based on selected height unit
document.querySelectorAll('input[name="heightUnit"]').forEach((input) => {
    input.addEventListener('change', function() {
        const isFeet = this.value === 'feet';
        document.getElementById(HEIGHT_FEET_CONTAINER_ID).style.display = isFeet ? 'block' : 'none';
        document.getElementById(HEIGHT_INCHES_CONTAINER_ID).style.display = isFeet ? 'block' : 'none';
        document.getElementById(HEIGHT_METERS_CONTAINER_ID).style.display = isFeet ? 'none' : 'block';
    });
});

// Show/hide weight input field based on selected weight unit
document.querySelectorAll('input[name="weightUnit"]').forEach((input) => {
    input.addEventListener('change', function() {
        const weightInput = document.getElementById(WEIGHT_INPUT_ID);
        weightInput.placeholder = this.value === 'lbs' ? "Enter your weight in lbs" : "Enter your weight in kg";
    });
});