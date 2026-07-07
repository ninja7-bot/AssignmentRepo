// Utility functions for the CircleUp app

// Get API base URL
const API_BASE_URL = 'http://localhost:8000';

// Token management
const TokenManager = {
    getToken() {
        return sessionStorage.getItem('circleup_token');
    },

    setToken(token) {
        sessionStorage.setItem('circleup_token', token);
    },

    removeToken() {
        sessionStorage.removeItem('circleup_token');
        sessionStorage.removeItem('circleup_user');
    },

    isAuthenticated() {
        const token = this.getToken();
        if (!token) return false;

        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            const now = Date.now() / 1000;
            return payload.exp > now;
        } catch (error) {
            console.error('Invalid token:', error);
            this.removeToken();
            return false;
        }
    }
};

// User management
const UserManager = {
    getUser() {
        const userStr = sessionStorage.getItem('circleup_user');
        return userStr ? JSON.parse(userStr) : null;
    },

    setUser(user) {
        sessionStorage.setItem('circleup_user', JSON.stringify(user));
    },

    removeUser() {
        sessionStorage.removeItem('circleup_user');
    }
};

// Show alerts
function showAlert(message, type = 'info', duration = 5000) {
    const alertContainer = document.getElementById('alert-container') || createAlertContainer();

    const alertDiv = document.createElement('div');
    alertDiv.className = `notification notification-${type}`;

    const messageSpan = document.createElement('span');
    messageSpan.textContent = message;

    const closeBtn = document.createElement('button');
    closeBtn.type = 'button';
    closeBtn.textContent = '\u00D7';
    closeBtn.addEventListener('click', () => alertDiv.remove());

    alertDiv.appendChild(messageSpan);
    alertDiv.appendChild(closeBtn);
    alertContainer.appendChild(alertDiv);

    // Auto remove after duration
    if (duration > 0) {
        setTimeout(() => {
            if (alertDiv.parentNode) {
                alertDiv.remove();
            }
        }, duration);
    }
}

function createAlertContainer() {
    const container = document.createElement('div');
    container.id = 'alert-container';
    container.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 1000;
        min-width: 300px;
    `;
    
    document.body.appendChild(container);
    return container;
}

// Format date
function formatDate(dateString) {
    const options = { 
        timeZone: 'Asia/Kolkata',
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

// Form validation helpers
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validatePassword(password) {
    return password.length >= 6;
}

// Show/hide loading state
function showLoading(element, show = true) {
    if (show) {
        element.disabled = true;

        if (!element._originalChildren) {
            element._originalChildren = Array.from(element.childNodes);
        }

        element.textContent = '';

        const spinner = document.createElement('span');
        spinner.className = 'loading-spinner';
        element.appendChild(spinner);
        element.appendChild(document.createTextNode(' Loading...'));
    } else {
        element.disabled = false;
        element.textContent = '';

        if (element._originalChildren) {
            element._originalChildren.forEach((node) => element.appendChild(node));
            delete element._originalChildren;
        } else {
            element.textContent = 'Submit';
        }
    }
}

// Redirect if not authenticated
function requireAuth() {
    if (!TokenManager.isAuthenticated()) {
        window.location.href = '/pages/login.html';
        return false;
    }
    return true;
}

// Redirect if already authenticated
function requireGuest() {
    if (TokenManager.isAuthenticated()) {
        window.location.href = '/pages/dashboard.html';
        return false;
    }
    return true;
}

// Logout function
function logout() {
    TokenManager.removeToken();
    UserManager.removeUser();
    showAlert('Logged out successfully', 'info');
    setTimeout(() => {
        window.location.href = '/index.html';
    }, 1000);
}