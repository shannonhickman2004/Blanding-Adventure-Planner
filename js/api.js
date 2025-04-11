const WEATHER_API_KEY = '4c111f4b127e9fa2a81724a328fad4c1';
const WEATHER_BASE_URL = 'https://api.openweathermap.org/data/2.5';

export async function getWeather(lat, lon) {
  const url = `${WEATHER_BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=imperial`;
  const response = await fetch(url);
  if (!response.ok) throw new Error('Weather fetch failed');
  return response.json();
}

export async function getForecast(lat, lon) {
  const url = `${WEATHER_BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=imperial`;
  const response = await fetch(url);
  if (!response.ok) throw new Error('Forecast fetch failed');
  return response.json();
}

export function initMap(lat = 37.625, lon = -109.478, zoom = 9) {
  const mapDiv = document.getElementById('map');
  const map = new google.maps.Map(mapDiv, {
    center: { lat, lng: lon },
    zoom: zoom,
  });

  new google.maps.Marker({
    position: { lat, lng: lon },
    map: map,
    title: 'San Juan County'
  });
}

// 👇 Add this to make the function global so Google Maps can call it
window.initMap = initMap;


