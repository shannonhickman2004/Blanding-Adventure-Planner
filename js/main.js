import { loadTrails, displayWeather, setupTrailControls } from './ui.js';

let originalTrails = []; // 🔁 Keep unfiltered reference

document.addEventListener('DOMContentLoaded', () => {
    let currentActivity = ''; // ✅ Tracks which activity is currently selected

    fetch('js/trails.json')
        .then(res => res.json())
        .then(trails => {
            originalTrails = [...trails];
            window.allTrails = [...trails];
            loadTrails(trails);
            console.log('Loaded trails:', trails);

            setupTrailControls();

            // ✅ Hook up View Favorites button under nav
            const favoritesBtn = document.getElementById('viewFavoritesBtn');
            if (favoritesBtn) {
                favoritesBtn.addEventListener('click', () => {
                    import('./ui.js').then(module => {
                        module.loadFavoritesView();
                    });
                });
            }

            // ✅ Activity filter button toggle logic
            document.querySelectorAll('[data-activity]').forEach(button => {
                button.addEventListener('click', () => {
                    const type = button.getAttribute('data-activity');

                    // Remove .active from all buttons (for styling reset)
                    document.querySelectorAll('[data-activity]').forEach(btn => btn.classList.remove('active'));

                    if (currentActivity === type) {
                        // 🔄 If the same button is clicked again, clear the filter
                        currentActivity = '';
                        window.allTrails = [...originalTrails];
                        loadTrails(originalTrails);
                    } else {
                        // ✅ Apply filter for new activity type
                        currentActivity = type;
                        const filtered = originalTrails.filter(t =>
                            t.activity?.toLowerCase() === type.toLowerCase()
                        );
                        window.allTrails = [...filtered];
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

// 🌐 Wait for Google Maps to load before calling initMap
function waitForGoogleMaps(callback) {
    if (window.google && window.google.maps) {
        callback();
    } else {
        setTimeout(() => waitForGoogleMaps(callback), 100);
    }
}

waitForGoogleMaps(() => {
    import('./api.js').then(module => {
        module.initMap(); // ✅ Calls your existing exported initMap()
    });
});
