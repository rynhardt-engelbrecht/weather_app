const visualCrossingKey = 'UTGL3EQS224TNQQLB7945JMTV';

async function getLocationWeather(location, unitGroup) {
  try {
    const response = await fetch(
    `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?unitGroup=${unitGroup}&key=${visualCrossingKey}&contentType=json`
    );
    const weatherData = await response.json();

    console.log(weatherData);
  } catch (error) {
    console.log(error);
  }
}

// getLocationWeather('pretoria', 'metric');
