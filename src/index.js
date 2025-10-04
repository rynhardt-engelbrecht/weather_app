import './style.css';

const visualCrossingKey = 'UTGL3EQS224TNQQLB7945JMTV';
const searchLocationButton = document.querySelector('#search-location-button');
const unitGroupInput = document.querySelector('#unit-group-input');

searchLocationButton.addEventListener('click', handleSearch);

function handleSearch(e) {
  e.preventDefault();
  const locationInput = document.querySelector('#location-input');

  const requestedLocation = locationInput.value;
  // unitGroupInput == checked or not, used to display temperature in degrees Celsius (metric) or Fahrenheit (us)
  const unitGroup = unitGroupInput.checked ? 'metric' : 'us';

  const weatherData = getLocationWeather(requestedLocation, unitGroup);
}

async function getLocationWeather(location, unitGroup) {
  try {
    const response = await fetch(
    `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?unitGroup=${unitGroup}&key=${visualCrossingKey}&contentType=json`
    );
    const rawWeatherData = await response.json();
    const currentDay = rawWeatherData.days[0];

    return {
      tempmax: currentDay.tempmax,
      temp: rawWeatherData.currentConditions.temp,
      tempmin: currentDay.tempmin,
      feelslike: rawWeatherData.currentConditions.feelslike,
      humidity: rawWeatherData.currentConditions.humidity,
      uvindex: rawWeatherData.currentConditions.uvindex,
      condition: currentDay.condition,
      description: currentDay.description
    };

  } catch (error) {
    return error;
  }
}

// getLocationWeather('pretoria', 'metric');
