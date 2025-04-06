import { loadFavoritesView } from './ui.js';

window.addEventListener('DOMContentLoaded', () => {
    loadFavoritesView();

    // Hide the "View Favorites" link if we're already on the favorites page
    const favoritesLink = document.querySelector('footer a[href="favorites.html"]');
    if (favoritesLink) {
        favoritesLink.style.display = 'none';
    }
});