/**
 * Utility functions for token management, validation, and such.
 */

const Utils = {

    /**
     * Store JWT token in localStorage
     */
    setToken(token) {
        localStorage.setItem(CONFIG.TOKEN_KEY, token);
        // Set timestamp for session timeout
        localStorage.setItem('token_timestamp', Date.now());
    },

    /**
     * Get JWT token from localStorage
     */
    getToken() {
        return localStorage.getItem(CONFIG.TOKEN_KEY);
    },

    /**
     * Remove token from localStorage on logout
     */
    removeToken() {
        localStorage.removeItem(CONFIG.TOKEN_KEY);
        localStorage.removeItem(CONFIG.USER_KEY);
        localStorage.removeItem('token_timestamp');
    },

    /**
     * Store user information to localStorage
     */
    setUserInfo(userInfo) {
        localStorage.setItem(CONFIG.USER_KEY, JSON.stringify(userInfo));
    },

    /**
     * Get user information from localStorage
     */
    getUserInfo() {
        const userInfo = localStorage.getItem(CONFIG.USER_KEY);
        return userInfo ? JSON.parse(userInfo) : null;
    },

    /**
     * Check if user is logged in
     * If there's no token in localStorage then return false
     * Else: Check for the time that has elapsed compared to session timeout.
     * Remove token in case of expiry.
     */
    isLoggedIn() {
        const token = this.getToken();
        if (!token) return false;

        // Check if token is expired, i.e., 30 minutes have elapsed
        const timestamp = localStorage.getItem('token_timestamp');
        if (timestamp) {
            const elapsed = Date.now() - parseInt(timestamp);
            if (elapsed > CONFIG.SESSION_TIMEOUT) {
                this.removeToken();
                return false;
            }
        }

        return true;
    },

    /**
     * Get user role
     */
    getUserRole() {
        const userInfo = this.getUserInfo();
        return userInfo ? userInfo.role : null;
    },

    getUserName() {
        const info = this.getUserInfo();
        return info ? (info.name || info.email || 'User') : 'User';
    },


    // Authentication Guard
    // Call at top of every protected page
    requireAuth(requiredRole) {
        if (!this.isLoggedIn()) {
            window.location.href = CONFIG.ROUTES.LOGIN;
            return false;
        }
        if (requiredRole && this.getUserRole() !== requiredRole) {
            this.redirectToDashboard();
            return false;
        }
        return true;
    },

    /**
     * Redirect to appropriate dashboard based on the user role
     * Dummy Dashboards for now; to be implemented in the future.
     */
    redirectToDashboard() {
        const role = this.getUserRole();

        if (role === CONFIG.ROLES.CUSTOMER) {
            window.location.href = '/frontend/pages/customer/dashboard.html';
        } else if (role === CONFIG.ROLES.ORGANIZER) {
            window.location.href = '/frontend/pages/organizer/dashboard.html';
        } else {
            window.location.href = '/frontend/pages/auth/login.html';
        }
    },

    /**
     * Logout user
     * Remove token from localStorage.
     */
    logout() {
        this.removeToken();
        window.location.href = '/frontend/pages/auth/login.html';
    },

    /**
     * Show notification message
     */
    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <span>${message}</span>
            <button onclick="this.parentElement.remove()">&times;</button>
        `;

        // Add to body
        document.body.appendChild(notification);

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
    },

    /**
     * Validate email 
     */
    validateEmail(email) {
        if (!email) {
            return 'Email is required';
        }
        if (!CONFIG.PATTERNS.EMAIL.test(email)) {
            return 'Email must be a valid Gmail address (e.g., user@gmail.com)';
        }
        return null;
    },

    /**
     * Validate phone
     */
    validatePhone(phone) {
        if (!phone) {
            return 'Phone number is required';
        }
        if (!CONFIG.PATTERNS.PHONE.test(phone)) {
            return 'Phone number must be exactly 10 digits';
        }
        return null;
    },

    /**
     * Validate name
     */
    validateName(name) {
        if (!name) {
            return 'Name is required';
        }
        if (!CONFIG.PATTERNS.NAME.test(name)) {
            return 'Name must contain only alphabets and be at least 2 characters';
        }
        return null;
    },

    /**
     * Validate password
     */
    validatePassword(password) {
        if (!password) {
            return 'Password is required';
        }

        if (!CONFIG.PATTERNS.PASSWORD.test(password)) {
            showError("Password must be 8-12 chars, include uppercase & special character.");
            return;
        }

        return null;
    },

    // Organizer specific validators
    validateEventName(name) {
        if (!name) return 'Event name is required.';
        if (name.length < 2) return 'Event name must be at least 2 characters.';
        if (name.length > 200) return 'Event name must not exceed 200 characters.';
        return null;
    },

    validateVenue(venue) {
        if (!venue) return 'Venue is required.';
        if (venue.length < 2) return 'Venue must be at least 2 characters.';
        return null;
    },

    validateFutureDate(dateStr) {
        if (!dateStr) return 'Date is required.';
        var selected = new Date(dateStr);
        var today = new Date();
        today.setHours(0, 0, 0, 0);
        if (selected < today) return 'Date must be today or in the future.';
        return null;
    },

    validateTotalSeats(seats) {
        var n = parseInt(seats, 10);
        if (!seats || isNaN(n)) return 'Total seats is required.';
        if (n < 1) return 'Total seats must be at least 1.';
        if (n > 100000) return 'Total seats cannot exceed 100,000.';
        return null;
    },

    /**
     * Format date for display
     */
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    },

    /**
     * Format date and time
     */
    formatDateTime(dateString) {
        const date = new Date(dateString);
        return date.toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    },

    formatTime(timeStr) {
        if (!timeStr) return '-';
        var parts = String(timeStr).slice(0, 5).split(':');
        if (parts.length < 2) return timeStr;
        var h = parseInt(parts[0], 10);
        var m = parts[1];
        var ampm = h >= 12 ? 'PM' : 'AM';
        h = h % 12 || 12;
        return h + ':' + m + ' ' + ampm;
    },


    // EVENT HELPERS (organizer)
    buildEventDateTime(eventDate, eventTime) {
        if (!eventDate) return null;
        if (eventTime) {
            var datePart = String(eventDate).split('T')[0];
            var timePart = String(eventTime).slice(0, 5);
            var dt = new Date(datePart + 'T' + timePart + ':00');
            return isNaN(dt.getTime()) ? null : dt;
        }
        var d = new Date(eventDate);
        return isNaN(d.getTime()) ? null : d;
    },

    isEventPast(eventDate, eventTime) {
        var dt = this.buildEventDateTime(eventDate, eventTime);
        return dt ? dt < new Date() : false;
    },

    // Returns true if current time is more than 4 hours before event
    canEditEvent(eventDate, eventTime) {
        var dt = this.buildEventDateTime(eventDate, eventTime);
        if (!dt) return false;
        var cutoff = new Date(dt.getTime() - 4 * 60 * 60 * 1000);
        return new Date() < cutoff;
    },

    toDateInput(val) {
        if (!val) return '';
        return String(val).split('T')[0];
    },

    toTimeInput(val) {
        if (!val) return '';
        return String(val).slice(0, 5);
    },


    // HTML Escape
    escHtml(str) {
        if (!str) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }
};

// Utils available globally
window.Utils = Utils;