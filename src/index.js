import './style.css';

const searchLocationButton = document.querySelector('#search-location-button');
const unitGroupInput = document.querySelector('#unit-group-input');
let weatherData = null;

searchLocationButton.addEventListener('click', async (e) => {
  weatherData = await handleSearch(e);

  updatePage(verifyUnitGroup());

  updateWeatherImage(weatherData.conditions);
});

unitGroupInput.addEventListener('change', () => {
  updatePage(verifyUnitGroup());
});

function updateWeatherImage(conditions) {
  // fetch image matching weather conditions
  const conditionsElement = document.querySelector('#condition-icon');

  getWeatherImage(conditions)
    .then(url => {
      conditionsElement.src = url;
    })
    .catch(() => {
      conditionsElement.src = 'fallback.gif';
    })
}

async function handleSearch(e) {
  e.preventDefault();
  const locationInput = document.querySelector('#location-input');

  const requestedLocation = locationInput.value;
  // unitGroupInput == checked or not, used to display temperature in degrees Celsius (metric) or Fahrenheit (us)
  const unitGroup = unitGroupInput.checked ? 'metric' : 'us';

  const weatherData = await getLocationWeather(requestedLocation, unitGroup);
  return weatherData;
}

function verifyUnitGroup() {
  return unitGroupInput.checked ? 'metric' : 'us';
}

// dynamically convert temperature units fahrenheit to celsius without needing to send a fetch
// request each time.
function convertToCelsius(value) {
  return (value - 32) * 5/9; //F --> C
}

function updatePage(unitGroup) {
  const data = weatherData;

  const dataEntries = Object.entries(data);
  const temperatureKeys = ['temp', 'tempmax', 'tempmin', 'feelslike'];

  const infoElements = {
    tempmax: document.querySelector('#tempmax-display'),
    temp: document.querySelector('#tempcurrent-display'),
    tempmin: document.querySelector('#tempmin-display'),
    feelslike: document.querySelector('#feelslike-display'),
    humidity: document.querySelector('#humidity-display'),
    uvindex: document.querySelector('#uvindex-display'),
    description: document.querySelector('#description-text')
  }

  for (const [key, value] of dataEntries) {
    let displayValue = value;

    if (temperatureKeys.includes(key)) {
      // if unitGroup == 'metric', convert value to metric standard and add '°C' at the end of the value,
      // else don't change value and add '°F' at the end.
      displayValue = unitGroup === 'metric'
        ? convertToCelsius(value).toFixed(1) + '°C'
        : value.toFixed(1) + '°F';
    }

    if (infoElements[key]) {
      infoElements[key].textContent = displayValue;
    }
  }
}

// send fetch request, store relevant data in object and return
async function getLocationWeather(location) {
  try {
    const response = await fetch(
    `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?unitGroup=us&key=UTGL3EQS224TNQQLB7945JMTV&contentType=json`
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
      conditions: currentDay.conditions,
      description: currentDay.description
    };

  } catch (error) {
    return error;
  }
}

function getWeatherImage(weatherCondition) {
  return new Promise((resolve, reject) => {
    fetch(`https://api.giphy.com/v1/gifs/translate?api_key=85S1yMpVZP1LmcTu2olC6svArEPFvTs5&s=${weatherCondition}`)
      .then(response => {
        if (!response.ok) {
          reject(`Giphy fetch failed: ${response.status}`);
          return;
        }

        return response.json();
      })
      .then(data => {
        const imageUrl = data.data.images.original.url;
        resolve(imageUrl);
      })
      .catch(error => {
        console.error(error);
        reject(error);
      });
  });
}
