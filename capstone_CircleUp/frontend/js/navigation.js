// Navigation management for CircleUp

class NavigationManager {
    constructor() {
        this.init();
    }

    init() {
        this.redirectIfLandingAndAuthenticated();
        this.updateLogoLink();
        this.updateNavigation();
        this.updateUserInfo();
    }

    redirectIfLandingAndAuthenticated() {
        const path = window.location.pathname;
        const isLandingPage = path === '/' || path === '' || path.endsWith('/index.html');

        if (isLandingPage && TokenManager.isAuthenticated()) {
            window.location.href = HOME_PAGE;
        }
    }

    updateLogoLink() {
        const logo = document.querySelector('.logo');
        if (!logo) return;
        logo.href = TokenManager.isAuthenticated() ? HOME_PAGE : '/';
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
            navContainer.appendChild(this.createNavItem('Discover', '/pages/discover.html'));
            navContainer.appendChild(this.createNavItem('My Activities', '/pages/my-activities.html'));
            navContainer.appendChild(this.createNavItem('Dashboard', '/pages/dashboard.html'));
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
            userInfo.textContent = `Welcome, ${user.name}!`;
        }
    }
}

// Initialize navigation when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    new NavigationManager();
});