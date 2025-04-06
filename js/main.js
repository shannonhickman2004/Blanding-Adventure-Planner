import { loadTrails, displayWeather, setupTrailControls } from './ui.js';

document.addEventListener('DOMContentLoaded', () => {
  fetch('js/trails.json')
    .then(res => res.json())
    .then(trails => {
      loadTrails(trails);
      console.log('Loaded trails:', trails);

      setupTrailControls();
      window.allTrails = trails;

      document.querySelectorAll('[data-activity]').forEach(button => {
        button.addEventListener('click', () => {
          const type = button.getAttribute('data-activity');
          const filtered = window.allTrails.filter(t =>
            t.activity?.toLowerCase() === type.toLowerCase()
          );
          loadTrails(filtered);
        });
      });
    })
    .catch(err => {
      console.error('Failed to load local trails:', err);
    });

  displayWeather();

  const toggleBtn = document.getElementById('toggleDarkMode');
  if (localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark-mode');
  }
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      document.body.classList.toggle('dark-mode');
      const isDark = document.body.classList.contains('dark-mode');
      localStorage.setItem('darkMode', isDark);
    });
  }
});
