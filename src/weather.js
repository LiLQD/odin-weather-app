const visualCrossingAPI = 'ZLMBP57GJMXTH6LGSTF397UWW';
export let currentWeatherData =
  JSON.parse(localStorage.getItem('weatherData')) || undefined;
export async function updateWeatherData(address) {
  let weatherData = await fetch(
    `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${address}?unitGroup=us&key=${visualCrossingAPI}&contentType=json`
  );
  const raw = await weatherData.json();
  const weatherDataJson = processWeatherData(raw);
  localStorage.setItem('weatherData', JSON.stringify(weatherDataJson));
  currentWeatherData = weatherDataJson;
}

function processWeatherData(raw) {
  const today = raw.days[0];
  return {
    city: raw.resolvedAddress,
    tempF: Math.round(today.temp),
    feelsLikeF: Math.round(today.feelslike),
    condition: today.conditions,
    humidity: Math.round(today.humidity),
    windMph: Math.round(today.windspeed),
    uvIndex: today.uvindex,
    icon: today.icon,
    forecast: raw.days.slice(1, 6).map((d) => ({
      day: new Date(d.datetime)
        .toLocaleDateString('en-US', { weekday: 'long' })
        .toUpperCase(),
      icon: d.icon,
      highF: Math.round(d.tempmax),
      lowF: Math.round(d.tempmin),
    })),
  };
}

export function convertToC(temp) {
  const result = Math.round((temp - 32) / 1.8);
  return result;
}
