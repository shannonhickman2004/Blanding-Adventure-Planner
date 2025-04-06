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

export async function getTrailsFromTrailAPI(lat = 37.625, lon = -109.478) {
  const url = `https://trailapi-trailapi.p.rapidapi.com/trails/?lat=${lat}&lon=${lon}`;

  const options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': 'eade94fd49msh96179ea5983fe88p1b7d39jsnec78efe2fb89',
      'X-RapidAPI-Host': 'trailapi-trailapi.p.rapidapi.com'
    }
  };

  const response = await fetch(url, options);
  if (!response.ok) throw new Error('TrailAPI fetch failed');
  const data = await response.json();

  return data.data || [];
}

// Make initMap globally visible for Google Maps callback
window.initMap = initMap;
