// Live weather from Open-Meteo (free, no API key needed).
const CODES = {
  0: 'Clear Sky', 1: 'Mainly Clear', 2: 'Partly Cloudy', 3: 'Overcast',
  45: 'Fog', 48: 'Freezing Fog',
  51: 'Light Drizzle', 53: 'Drizzle', 55: 'Heavy Drizzle',
  61: 'Light Rain', 63: 'Rain', 65: 'Heavy Rain',
  80: 'Rain Showers', 81: 'Heavy Showers', 82: 'Violent Showers',
  95: 'Thunderstorm', 96: 'Thunderstorm, Hail', 99: 'Severe Thunderstorm',
};

export async function fetchWeather(lat, lon, signal) {
  const url =
    'https://api.open-meteo.com/v1/forecast' +
    `?latitude=${lat}&longitude=${lon}` +
    '&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code' +
    '&timezone=auto';

  const res = await fetch(url, { signal });
  if (!res.ok) throw new Error('Weather service returned an error (' + res.status + ').');

  const data = await res.json();
  const c = data.current;
  if (!c) throw new Error('No weather data came back for this location.');

  return {
    temperature: Math.round(c.temperature_2m),
    humidity: Math.round(c.relative_humidity_2m),
    windSpeed: c.wind_speed_10m,
    condition: CODES[c.weather_code] || 'Unknown',
  };
}
