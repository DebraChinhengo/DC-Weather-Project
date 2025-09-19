// Format date and time using local device time
function formatDate(date) {
  let minutes = date.getMinutes();
  let hours = date.getHours();
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = days[date.getDay()];
  if (hours < 10) hours = `0${hours}`;
  if (minutes < 10) minutes = `0${minutes}`;
  return `${day} ${hours}:${minutes}`;
}

// Display current weather
function showTemperature(response) {
  let temperatureElement = document.querySelector("#temperature");
  let cityElement = document.querySelector("#city");
  let descriptionElement = document.querySelector("#description");
  let humidityElement = document.querySelector("#humidity");
  let windSpeedElement = document.querySelector("#windSpeed");
  let timeElement = document.querySelector("#time");
  let iconElement = document.querySelector("#icon");

  let date = new Date(response.data.time * 1000);

  cityElement.innerHTML = response.data.city;
  descriptionElement.innerHTML = response.data.condition.description;
  temperatureElement.innerHTML = Math.round(response.data.temperature.current);
  humidityElement.innerHTML = `${response.data.temperature.humidity}%`;
  windSpeedElement.innerHTML = `${Math.round(response.data.wind.speed)} km/h`;
  timeElement.innerHTML = formatDate(date);

  iconElement.setAttribute(
    "src",
    `http://shecodes-assets.s3.amazonaws.com/api/weather/icons/${response.data.condition.icon}.png`
  );
  iconElement.setAttribute("alt", response.data.condition.description);
}

// Display 5-day forecast
function displayForecast(response) {
  let forecastElement = document.querySelector("#forecast");
  forecastElement.innerHTML = "";

  let forecastDays = response.data.daily;

  for (let i = 1; i <= 5; i++) {
    let day = forecastDays[i];
    let date = new Date(day.time * 1000);
    let dayName = date.toLocaleDateString("en-US", { weekday: "short" });

    forecastElement.innerHTML += `
      <div class="weather-forecast-day">
        <div class="weather-forecast-date">${dayName}</div>
        <div class="weather-forecast-icon">
          <img src="http://shecodes-assets.s3.amazonaws.com/api/weather/icons/${
            day.condition.icon
          }.png" alt="${day.condition.description}" />
        </div>
        <div class="weather-forecast-temperatures">
          <strong>${Math.round(day.temperature.maximum)}°</strong> ${Math.round(
      day.temperature.minimum
    )}°
        </div>
      </div>
    `;
  }
}

// Fetch forecast data
function getForecast(city) {
  let apiKey = "28534ee264320foa541da835at649b33";
  let apiUrl = `https://api.shecodes.io/weather/v1/forecast?query=${city}&key=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayForecast);
}

// Fetch current weather and forecast
function searchCity(city) {
  let apiKey = "28534ee264320foa541da835at649b33";
  let apiUrl = `https://api.shecodes.io/weather/v1/current?query=${city}&key=${apiKey}&units=metric`;
  axios.get(apiUrl).then(showTemperature);
  getForecast(city);
}

// Handle form submission
function handleSearchFormSubmit(event) {
  event.preventDefault();
  let searchInput = document.querySelector("#search-form-input");
  searchCity(searchInput.value);
}

// Event listener
let searchFormElement = document.querySelector("#search-form");
searchFormElement.addEventListener("submit", handleSearchFormSubmit);

// Default city on load
searchCity("Kampala");
