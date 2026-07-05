// Navigation management for CircleUp

class NavigationManager {
    constructor() {
        this.init();
    }

    init() {
        this.updateNavigation();
        this.updateUserInfo();
    }

    updateNavigation() {
        const isAuthenticated = TokenManager.isAuthenticated();
        const navContainer = document.querySelector('.nav-links');
        
        if (navContainer) {
            if (isAuthenticated) {
                navContainer.innerHTML = `
                    <li><a href="/pages/dashboard.html">Dashboard</a></li>
                    <li><a href="/pages/discover.html">Discover</a></li>
                    <li><a href="/pages/profile.html">Profile</a></li>
                    <li><a href="#" onclick="logout()">Logout</a></li>
                `;
            } else {
                navContainer.innerHTML = `
                    <li><a href="/pages/login.html">Login</a></li>
                    <li><a href="/pages/register.html">Register</a></li>
                `;
            }
        }
    }

    updateUserInfo() {
        const isAuthenticated = TokenManager.isAuthenticated();
        const user = UserManager.getUser();
        const userInfo = document.getElementById('user-info');
        
        if (userInfo && isAuthenticated && user) {
            userInfo.innerHTML = `Welcome, ${user.name}!`;
        }
    }
}

// Initialize navigation when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    new NavigationManager();
});