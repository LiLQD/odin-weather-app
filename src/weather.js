const visualCrossingAPI = 'ZLMBP57GJMXTH6LGSTF397UWW';

export async function getWeatherData(address) {
  try {
    let weatherData = await fetch(
      `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${address}?unitGroup=us&key=${visualCrossingAPI}&contentType=json`
    );
    const weatherDataJson = await weatherData.json();
    console.log(weatherDataJson);
    return weatherDataJson;
  } catch (err) {
    console.error(err);
  }
}
