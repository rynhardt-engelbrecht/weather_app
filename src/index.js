import './style.css';
import { showHideLoading, updateWeatherImage, handleSearch, updatePage } from './uiInteractions';


const searchLocationButton = document.querySelector('#search-location-button');
const unitGroupInput = document.querySelector('#unit-group-input');

searchLocationButton.addEventListener('click', (event) => {
  event.preventDefault();
  showHideLoading();

  const locationInput = document.querySelector('#location-input');

  handleSearch(locationInput.value)
    .then((weatherData) => {
      console.log(weatherData);
      updatePage(verifyUnitGroup());

      return `${weatherData.conditions.replace(/ /g, '-')}-weather`
    })
    .then(updateWeatherImage)
    .then(showHideLoading);
});

unitGroupInput.addEventListener('change', () => {
  updatePage(verifyUnitGroup());
});


function verifyUnitGroup() {
  return unitGroupInput.checked ? 'metric' : 'us';
}


