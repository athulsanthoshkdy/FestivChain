// Function to hide login buttons when user is logged in
function updateNavbarForLoggedInUser() {
    const navbar = document.querySelector('.landing-navbar');
    const authButtons = document.querySelector('.nav-auth-buttons');

    if (currentUser && authButtons) {
        authButtons.style.display = 'none';
    } else if (authButtons) {
        authButtons.style.display = 'flex';
    }
}

// Call this function when user logs in or page loads
