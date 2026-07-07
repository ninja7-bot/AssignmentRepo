// Navigation management for CircleUp

class NavigationManager {
    constructor() {
        this.init();
    }

    init() {
        this.updateNavigation();
        this.updateUserInfo();
    }

    createNavItem(text, href, onClick) {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.textContent = text;
        a.href = href;
        if (onClick) {
            a.addEventListener('click', (e) => {
                e.preventDefault();
                onClick();
            });
        }
        li.appendChild(a);
        return li;
    }

    updateNavigation() {
        const isAuthenticated = TokenManager.isAuthenticated();
        const navContainer = document.querySelector('.nav-links');

        if (!navContainer) return;

        navContainer.textContent = '';

        if (isAuthenticated) {
            navContainer.appendChild(this.createNavItem('Dashboard', '/pages/dashboard.html'));
            navContainer.appendChild(this.createNavItem('Discover', '/pages/discover.html'));
            navContainer.appendChild(this.createNavItem('Profile', '/pages/profile.html'));
            navContainer.appendChild(this.createNavItem('Logout', '#', logout));
        } else {
            navContainer.appendChild(this.createNavItem('Login', '/pages/login.html'));
            navContainer.appendChild(this.createNavItem('Register', '/pages/register.html'));
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