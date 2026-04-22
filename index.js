const API_URL = "https://api.weather.gov/alerts/active?area=";

// -----------------------------
// DOM elements
// -----------------------------
const input = document.getElementById("state-input");
const button = document.getElementById("fetch-alerts");
const alertsDisplay = document.getElementById("alerts-display");
const errorMessage = document.getElementById("error-message");

// -----------------------------
// Fetch Weather Alerts
// -----------------------------
async function fetchWeatherData(state) {
  const response = await fetch(`${API_URL}${state}`);

  if (!response.ok) {
    throw new Error("Network failure");
  }

  return response.json();
}

// -----------------------------
// Display Weather
// -----------------------------
function displayWeather(data) {
  const features = data.features || [];

  alertsDisplay.innerHTML = `
    <h2>Weather Alerts: ${features.length}</h2>
    <ul>
      ${features.map(a => `<li>${a.properties.headline}</li>`).join("")}
    </ul>
  `;
}

// -----------------------------
// Display Error
// -----------------------------
function displayError(message) {
  errorMessage.classList.remove("hidden");
  errorMessage.textContent = message;
}

// -----------------------------
// Clear Input
// -----------------------------
function clearInput() {
  input.value = "";
}

// -----------------------------
// Button Handler
// -----------------------------
button.addEventListener("click", async () => {
  const state = input.value.trim().toUpperCase();

  clearInput();

  try {
    const data = await fetchWeatherData(state);

    displayWeather(data);

    // clear error on success (TEST REQUIREMENT)
    errorMessage.textContent = "";
    errorMessage.classList.add("hidden");

  } catch (error) {
    displayError(error.message);
  }
});