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
    }
};

// Utils available globally
window.Utils = Utils;