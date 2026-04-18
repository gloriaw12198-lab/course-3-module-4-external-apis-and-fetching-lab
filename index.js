const weatherApi = "https://api.weather.gov/alerts/active?area=";

// -----------------------------
// Safe DOM references (prevents Jest crashes)
// -----------------------------
let input, button, resultsTitle, alertsList, errorMessage;

if (typeof document !== "undefined") {
  input = document.getElementById("state-input");
  button = document.getElementById("fetch-alerts");
  alertsList = document.getElementById("alerts-display");
  errorMessage = document.getElementById("error-message");

  resultsTitle = document.createElement("h2");
  document.body.insertBefore(resultsTitle, alertsList);
}

// -----------------------------
// 1. Fetch Weather Data
// -----------------------------
async function fetchWeatherData(state) {
  if (!state) {
    throw new Error("State is required");
  }

  const response = await fetch(weatherApi + state);

  if (!response.ok) {
    throw new Error("Failed to fetch weather data");
  }

  return await response.json();
}

// -----------------------------
// 2. Display Weather Data
// -----------------------------
function displayWeather(data, state) {
  if (errorMessage) {
    errorMessage.textContent = "";
    errorMessage.style.display = "none";
  }

  if (alertsList) alertsList.innerHTML = "";

  const alerts = data.features || [];

  if (resultsTitle) {
    resultsTitle.textContent =
      `Current watches, warnings, and advisories for ${state}: ${alerts.length}`;
  }

  if (alerts.length === 0 && alertsList) {
    alertsList.innerHTML = "<p>No active alerts found.</p>";
    return;
  }

  alerts.forEach(alert => {
    const div = document.createElement("div");
    div.textContent =
      alert.properties?.headline || "No headline available";
    alertsList.appendChild(div);
  });
}

// -----------------------------
// 3. Display Error
// -----------------------------
function displayError(message) {
  if (resultsTitle) resultsTitle.textContent = "";
  if (alertsList) alertsList.innerHTML = "";

  if (errorMessage) {
    errorMessage.style.display = "block";
    errorMessage.textContent = message;
  }
}

// -----------------------------
// 4. Clear UI
// -----------------------------
function clearUI() {
  if (resultsTitle) resultsTitle.textContent = "";
  if (alertsList) alertsList.innerHTML = "";

  if (errorMessage) {
    errorMessage.textContent = "";
    errorMessage.style.display = "none";
  }
}

// -----------------------------
// 5. Button Click Handler
// -----------------------------
if (typeof document !== "undefined") {
  button.addEventListener("click", async () => {
    const state = input.value.trim();

    clearUI();

    try {
      const data = await fetchWeatherData(state);
      displayWeather(data, state);
    } catch (err) {
      displayError(err.message);
    }

    input.value = "";
  });
}

// -----------------------------
// Export for Jest
// -----------------------------
if (typeof module !== "undefined") {
  module.exports = {
    fetchWeatherData,
    displayWeather,
    displayError,
    clearUI
  };
}