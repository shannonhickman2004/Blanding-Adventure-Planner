import { loadTrails, displayWeather, setupTrailControls } from './ui.js';

document.addEventListener('DOMContentLoaded', () => {
    let currentActivity = ''; // ✅ Tracks which activity is currently selected

    fetch('js/trails.json')
        .then(res => res.json())
        .then(trails => {
            loadTrails(trails);
            console.log('Loaded trails:', trails);

            setupTrailControls();
            window.allTrails = trails;

            // ✅ Activity filter button toggle logic
            document.querySelectorAll('[data-activity]').forEach(button => {
                button.addEventListener('click', () => {
                    const type = button.getAttribute('data-activity');

                    // Remove .active from all buttons (for styling reset)
                    document.querySelectorAll('[data-activity]').forEach(btn => btn.classList.remove('active'));

                    if (currentActivity === type) {
                        // 🔄 If the same button is clicked again, clear the filter
                        currentActivity = '';
                        loadTrails(window.allTrails);
                    } else {
                        // ✅ Apply filter for new activity type
                        currentActivity = type;
                        const filtered = window.allTrails.filter(t =>
                            t.activity?.toLowerCase() === type.toLowerCase()
                        );
                        loadTrails(filtered);

                        // Highlight the active button
                        button.classList.add('active');
                    }
                });
            });
        })
        .catch(err => {
            console.error('Failed to load local trails:', err);
        });

    // 🌤️ Load default weather data
    displayWeather();

    // 🌙 Dark mode setup
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

import { loadFavoritesView } from './ui.js';

document.getElementById('viewFavoritesBtn').addEventListener('click', () => {
  loadFavoritesView();
});