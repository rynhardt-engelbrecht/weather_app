const visualCrossingKey = 'UTGL3EQS224TNQQLB7945JMTV';

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
