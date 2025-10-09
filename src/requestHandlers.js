// send fetch request, store relevant data in object and return
export async function getLocationWeather(location) {
  try {
    const response = await fetch(
    `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?unitGroup=us&key=UTGL3EQS224TNQQLB7945JMTV&contentType=json`
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`HTTP Error! Status: ${response.status}, Details: ${JSON.stringify(errorData)}`)
    }

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
      description: currentDay.description,
      icon: currentDay.icon
    };

  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
}

export function getWeatherImage(weatherCondition) {
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
