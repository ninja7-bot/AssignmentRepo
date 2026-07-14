// Utility functions for the CircleUp app

// Get API base URL
const API_BASE_URL = 'http://localhost:8000';

const HOME_PAGE = '/pages/discover.html';

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
const ValidationRules = {
    required(value, message = 'This field is required.') {
        return value.trim() ? { valid: true } : { valid: false, message };
    },

    name(value) {
        value = value.trim();
        if (!value) return { valid: false, message: 'Name is required.' };
        if (value.length < 3) return { valid: false, message: 'Name must be at least 3 characters.' };
        if (!/^[A-Za-z\s]+$/.test(value)) return { valid: false, message: 'Name must contain alphabets only.' };
        return { valid: true };
    },

    email(value) {
        value = value.trim();
        if (!value) return { valid: false, message: 'Email is required.' };
        if (!/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(value)) {
            return { valid: false, message: 'Please enter a valid gmail address.' };
        }
        return { valid: true };
    },

    phoneNumber(value) {
        value = value.trim();
        if (!value) return { valid: false, message: 'Phone number is required.' };
        if (!/^[6-9]\d{9}$/.test(value)) {
            return { valid: false, message: 'Please enter a valid 10-digit Indian phone number.' };
        }
        return { valid: true };
    },

    password(value) {
        value = value.trim();
        const checks = [
            { test: !value, message: 'Password is required.' },
            { test: value.length < 8, message: 'Password must be at least 8 characters.' },
            { test: !/[A-Z]/.test(value), message: 'Password must contain at least one uppercase letter.' },
            { test: !/[a-z]/.test(value), message: 'Password must contain at least one lowercase letter.' },
            { test: !/[0-9]/.test(value), message: 'Password must contain at least one number.' },
            { test: !/[!@#$%^&*(),.?":{}|<>]/.test(value), message: 'Password must contain at least one special character.' }
        ];
        const failed = checks.find((check) => check.test);
        return failed ? { valid: false, message: failed.message } : { valid: true };
    },

    confirmPassword(value, passwordValue) {
        value = value.trim();
        if (!value) return { valid: false, message: 'Please confirm your password.' };
        if (value !== (passwordValue || '').trim()) return { valid: false, message: 'Passwords do not match.' };
        return { valid: true };
    },

    bio(value) {
        value = value.trim();
        if (value.length > 500) return { valid: false, message: 'Bio must not exceed 500 characters.' };
        return { valid: true };
    },

    title(value) {
        value = value.trim();
        const titleRegex = /^[A-Za-z0-9\s.,!?'-]+$/;
        if (!value) return { valid: false, message: 'Title is required' };
        if (value.length < 3) return { valid: false, message: 'Title must be at least 3 characters' };
        if (value.length > 200) return { valid: false, message: 'Title cannot exceed 200 characters' };
        if (!titleRegex.test(value)) return { valid: false, message: 'Title contains invalid characters' };
        return { valid: true };
    },

    description(value) {
        value = value.trim();
        if (!value) return { valid: false, message: 'Description is required' };
        if (value.length < 10) return { valid: false, message: 'Description must be at least 10 characters' };
        if (value.length > 500) return { valid: false, message: 'Description cannot exceed 500 characters' };
        return { valid: true };
    },

    activityDate(value) {
        if (!value) return { valid: false, message: 'Activity date and time are required' };
        if (value <= getCurrentISTDateTime()) {
            return { valid: false, message: 'Activity must be scheduled for a future date' };
        }
        return { valid: true };
    },

    maxParticipants(value, minParticipants = 0) {
        const numeric = Number(value);
        if (!value) return { valid: false, message: 'Maximum participants is required' };
        if (!Number.isInteger(numeric) || numeric <= 0) {
            return { valid: false, message: 'Maximum participants must be greater than zero' };
        }
        if (numeric < minParticipants) {
            return {
                valid: false,
                message: `Cannot be less than the current number of participants (${minParticipants})`
            };
        }
        return { valid: true };
    }
};

// DateTime
function getCurrentISTDateTime() {
    const now = new Date();
    const istOffsetMilliseconds = 5.5 * 60 * 60 * 1000;
    const ist = new Date(now.getTime() + istOffsetMilliseconds);

    const year = ist.getUTCFullYear();
    const month = String(ist.getUTCMonth() + 1).padStart(2, '0');
    const day = String(ist.getUTCDate()).padStart(2, '0');
    const hours = String(ist.getUTCHours()).padStart(2, '0');
    const minutes = String(ist.getUTCMinutes()).padStart(2, '0');

    return `${year}-${month}-${day}T${hours}:${minutes}`;
}

// Error Message Handler
function showFieldError(field, message) {
    field.classList.add('error');

    let errorElement = field.parentElement.querySelector('.error-message');
    if (!errorElement) {
        errorElement = document.createElement('span');
        errorElement.className = 'error-message';
        field.parentElement.appendChild(errorElement);
    }

    errorElement.textContent = message;
}

function clearFieldError(field) {
    field.classList.remove('error');

    const errorElement = field.parentElement.querySelector('.error-message');
    if (errorElement) {
        errorElement.textContent = '';
    }
}

// Set field error by ID.
function setFieldErrorById(fieldId, errorId, message) {
    const field = document.getElementById(fieldId);
    const error = document.getElementById(errorId);

    if (error) error.textContent = message || '';
    if (field) field.classList.remove('error');
}

// Dynamic City Dropdown
async function populateCityDropdown(selectElement, selectedValue = '') {
    if (!selectElement) return;

    try {
        const { cities } = await api.getCities();

        selectElement.querySelectorAll('option:not([value=""])').forEach((option) => option.remove());

        cities.forEach((city) => {
            const option = document.createElement('option');
            option.value = city;
            option.textContent = city;
            selectElement.appendChild(option);
        });

        if (selectedValue) {
            selectElement.value = selectedValue;
        }
    } catch (error) {
        console.error('Error loading cities:', error);
        showAlert('Could not load city list. Please try again later.', 'error');
    }
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
        window.location.href = HOME_PAGE;
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