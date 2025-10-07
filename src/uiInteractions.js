import { getLocationWeather, getWeatherImage } from './requestHandlers';

export function showHideLoading() {
  const loadingIcon = document.querySelector('#loading-icon');

  const computedStyle = window.getComputedStyle(loadingIcon);
  const loadingIconDisplay = computedStyle.display;

  if (loadingIconDisplay === 'block') {
    loadingIcon.style.setProperty('display', 'none');
  } else {
    loadingIcon.style.setProperty('display', 'block');
  }
}

export function updateWeatherImage(data) {
  // fetch image matching weather conditions
  const image = document.querySelector('#condition-icon');
  const container = document.querySelector('#condition-icon-container');

  const images = require.context('./images', false, /\.png$/);
  const icon = data.icon
    .split('-')
    .slice(0, 2)
    .join('-') + '.png';

  image.src = images(`./${icon}`);


  getWeatherImage(data.conditions)
    .then(url => {
      container.style.setProperty('--bg-image', `url(${url})`);
    })
    .catch(() => {
      container.style.setProperty('--bg-image', 'fallback.gif');
    });
}

export async function handleSearch(location) {
  const weatherData = await getLocationWeather(location);

  return weatherData;
}

// dynamically convert temperature units fahrenheit to celsius without needing to send a fetch
// request each time.
function convertToCelsius(value) {
  return (value - 32) * 5/9; //F --> C
}

export function updatePage(data, unitGroup) {
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
