import './style.css';
import { showHideLoading, updateWeatherImage, handleSearch, updatePage } from './uiInteractions';


const searchLocationButton = document.querySelector('#search-location-button');
const unitGroupInputContainer = document.querySelector('#unit-group-input-container');
const unitGroupInput = document.querySelector('#unit-group-input');
let weatherData = null;

searchLocationButton.addEventListener('click', (event) => {
  event.preventDefault();

  const locationInput = document.querySelector('#location-input');
  const weatherDisplay = document.querySelector('#weather-info-display-container');
  weatherDisplay.style.setProperty('display', 'block');

  showHideLoading();

  handleSearch(locationInput.value)
    .then((data) => {
      weatherData = data;
      updatePage(weatherData, verifyUnitGroup());

      return data;
    })
    .then(updateWeatherImage)
    .then(showHideLoading);
});

unitGroupInputContainer.addEventListener('click', () => {
  unitGroupInput.checked = !unitGroupInput.checked;

  if (weatherData) {
    updatePage(weatherData, verifyUnitGroup());
  }
});


function verifyUnitGroup() {
  return unitGroupInput.checked ? 'metric' : 'us';
}


