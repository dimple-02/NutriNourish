const POUNDS_TO_KILOGRAMS = 0.453592;
const INCHES_TO_METERS = 0.0254;

function calculateBMI(weightKg, heightMeters) {
  return (weightKg / (heightMeters * heightMeters)).toFixed(2);
}

function getBMICategory(bmi) {
  if (bmi < 18.5) return "Underweight";
  if (bmi < 25) return "Normal weight";
  if (bmi < 30) return "Overweight";
  return "Obesity";
}

function updateHeightInputs() {
  const heightUnit = document.querySelector('input[name="heightUnit"]:checked').value;
  const isFeet = heightUnit === "feet";

  document.getElementById("heightFeetContainer").style.display = isFeet ? "block" : "none";
  document.getElementById("heightInchesContainer").style.display = isFeet ? "block" : "none";
  document.getElementById("heightMetersContainer").style.display = isFeet ? "none" : "block";
}

function updateWeightPlaceholder() {
  const weightUnit = document.querySelector('input[name="weightUnit"]:checked').value;
  const weightInput = document.getElementById("weight");
  weightInput.placeholder = weightUnit === "lbs" ? "Enter your weight in lbs" : "Enter your weight in kg";
}

function parseHeightInMeters() {
  const heightUnit = document.querySelector('input[name="heightUnit"]:checked').value;
  if (heightUnit === "meters") {
    return Number(document.getElementById("heightMeters").value);
  }

  const feet = Number(document.getElementById("heightFeet").value) || 0;
  const inches = Number(document.getElementById("heightInches").value) || 0;
  return ((feet * 12) + inches) * INCHES_TO_METERS;
}

function handleCalculate() {
  const weight = Number(document.getElementById("weight").value);
  const weightUnit = document.querySelector('input[name="weightUnit"]:checked').value;
  const resultElement = document.getElementById("result");

  const weightKg = weightUnit === "lbs" ? weight * POUNDS_TO_KILOGRAMS : weight;
  const heightMeters = parseHeightInMeters();

  if (!Number.isFinite(weightKg) || weightKg <= 0) {
    resultElement.textContent = "Please enter a valid weight.";
    return;
  }

  if (!Number.isFinite(heightMeters) || heightMeters <= 0) {
    resultElement.textContent = "Please enter a valid height.";
    return;
  }

  const bmiValue = Number(calculateBMI(weightKg, heightMeters));
  resultElement.textContent = `Your BMI is ${bmiValue} (${getBMICategory(bmiValue)}).`;
}

document.getElementById("calculateBtn").addEventListener("click", handleCalculate);
document.querySelectorAll('input[name="heightUnit"]').forEach((input) => {
  input.addEventListener("change", updateHeightInputs);
});
document.querySelectorAll('input[name="weightUnit"]').forEach((input) => {
  input.addEventListener("change", updateWeightPlaceholder);
});

updateHeightInputs();
updateWeightPlaceholder();