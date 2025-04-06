import { getWeather, getForecast } from './api.js';
import { getFavorites, saveFavorites } from './storage.js';

let allTrails = [];

export function loadTrails(trails) {
  allTrails = trails;
  const sortValue = document.getElementById('sort')?.value;
  const difficultyFilter = document.getElementById('difficultyFilter')?.value;
  const sortAsc = document.body.dataset.sortAsc !== 'false'; // default: true

  let filtered = [...trails];

  if (difficultyFilter) {
    filtered = filtered.filter(trail => trail.difficulty === difficultyFilter);
  }

  if (sortValue) {
    filtered.sort((a, b) => {
      let result = 0;
      if (sortValue === 'distance') result = a.length - b.length;
      if (sortValue === 'rating') result = b.rating - a.rating;
      if (sortValue === 'difficulty') result = a.difficulty.localeCompare(b.difficulty);
      return sortAsc ? result : -result;
    });
  }

  window.allTrails = trails;
  renderTrailCards(filtered);
}

function renderTrailCards(trails) {
  const container = document.getElementById('trailsContainer');
  container.innerHTML = '';

  if (trails.length === 0) {
    container.innerHTML = '<p>No trails match your filters.</p>';
    return;
  }

  const favorites = getFavorites();

  trails.forEach(trail => {
    const isFavorite = favorites.some(fav => fav.name === trail.name);

    const card = document.createElement('div');
    card.className = 'trail-card';
    card.innerHTML = `
      <h3>${trail.name}</h3>
      <p><strong>Location:</strong> ${trail.location}</p>
      <p><strong>Length:</strong> ${trail.length} miles</p>
      <p><strong>Difficulty:</strong> ${trail.difficulty}</p>
      <p><strong>Activity:</strong> ${trail.activity}</p>
      <p><strong>Rating:</strong> ${trail.rating} ⭐</p>
      <p><strong>Features:</strong> ${trail.features.join(', ')}</p>
      <button class="save-btn" data-name="${trail.name}">
        ${isFavorite ? '★ Saved' : '☆ Save'}
      </button>
    `;

    container.appendChild(card);
  });

  container.querySelectorAll('.save-btn').forEach(button => {
    button.addEventListener('click', (e) => {
      const trailName = e.target.dataset.name;
      const selectedTrail = allTrails.find(t => t.name === trailName);
      let currentFavorites = getFavorites();
      const exists = currentFavorites.some(fav => fav.name === trailName);

      if (!exists) {
        currentFavorites.push(selectedTrail);
      } else {
        currentFavorites = currentFavorites.filter(fav => fav.name !== trailName);
      }

      saveFavorites(currentFavorites);
      loadTrails(allTrails);
    });
  });
}

export function setupTrailControls() {
  const sortSelect = document.getElementById('sort');
  const difficultySelect = document.getElementById('difficultyFilter');
  const sortDirBtn = document.getElementById('toggleSortDirection');
  const resetBtn = document.getElementById('resetSort');

  if (sortSelect) {
    sortSelect.addEventListener('change', () => loadTrails(allTrails));
  }

  if (difficultySelect) {
    difficultySelect.addEventListener('change', () => loadTrails(allTrails));
  }

  if (sortDirBtn) {
    sortDirBtn.addEventListener('click', () => {
      const current = document.body.dataset.sortAsc !== 'false';
      document.body.dataset.sortAsc = (!current).toString();
      sortDirBtn.textContent = current ? '⬇ Desc' : '⬆ Asc';
      loadTrails(allTrails);
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      document.getElementById('sort').value = '';
      document.getElementById('difficultyFilter').value = '';
      document.body.dataset.sortAsc = 'true';
      if (sortDirBtn) sortDirBtn.textContent = '⬆ Asc';
      loadTrails(allTrails);
    });
  }
}

export function loadFavoritesView() {
  const container = document.getElementById('trailsContainer');
  const favorites = getFavorites();
  container.innerHTML = '<h2>My Favorite Trails</h2>';

  if (favorites.length === 0) {
    container.innerHTML += '<p>No favorites saved yet.</p>';
    return;
  }

  favorites.forEach(trail => {
    const card = document.createElement('div');
    card.className = 'trail-card';
    card.innerHTML = `
      <h3>${trail.name}</h3>
      <p><strong>Location:</strong> ${trail.location}</p>
      <p><strong>Length:</strong> ${trail.length} miles</p>
      <p><strong>Difficulty:</strong> ${trail.difficulty}</p>
      <p><strong>Activity:</strong> ${trail.activity}</p>
      <p><strong>Rating:</strong> ${trail.rating} ⭐</p>
      <p><strong>Features:</strong> ${trail.features.join(', ')}</p>
    `;
    container.appendChild(card);
  });
}

export async function displayWeather(lat = 37.625, lon = -109.478) {
  const currentEl = document.getElementById('currentWeather');
  const forecastEl = document.getElementById('forecast');

  try {
    const weather = await getWeather(lat, lon);
    const forecast = await getForecast(lat, lon);

    currentEl.innerHTML = `
      <p><strong>${weather.name}</strong>: ${weather.weather[0].description}</p>
      <p>Temp: ${weather.main.temp} °F</p>
      <p>Wind: ${weather.wind.speed} mph</p>
    `;

    const forecastDays = forecast.list.filter((_, i) => i % 8 === 0).slice(0, 3);
    forecastEl.innerHTML = forecastDays.map(day => `
      <div>
        <p>${new Date(day.dt_txt).toLocaleDateString()}</p>
        <p>${day.weather[0].description}</p>
        <p>Temp: ${day.main.temp} °F</p>
      </div>
    `).join('');
  } catch (err) {
    currentEl.textContent = 'Error loading weather.';
    forecastEl.textContent = '';
    console.error(err);
  }
}
