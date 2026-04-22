/**
 * API Service for making HTTP requests to the backend.
 */

const API = {
    
    /**
     * GET request fetch wrapper
     */
    async request(url, method = 'GET', body = null, requiresAuth = false) {
        const headers = {
            'Content-Type': 'application/json'
        };
        
        // Add Authorization header if required
        if (requiresAuth) {
            const token = Utils.getToken();
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }
        }
        
        const options = {
            method,
            headers
        };
        
        // Add body for POST, PUT, PATCH
        if (body && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
            options.body = JSON.stringify(body);
        }
        
        try {
            const response = await fetch(url, options);
            
            // Handle 401 Unauthorized: When token gets expired.
            if (response.status === 401) {
                Utils.showNotification('Session expired. Please login again.', 'error');
                Utils.logout();
                return null;
            }
            
            // Parse response
            const data = await response.json();
            
            // Return data with status
            return {
                success: response.ok,
                status: response.status,
                data: data
            };
            
        } catch (error) {
            console.error('API Error:', error);
            Utils.showNotification('Network error. Please check your connection.', 'error');
            return {
                success: false,
                status: 0,
                error: error.message
            };
        }
    },
    
    /**
     * Register new user
     */
    async register(userData) {
        const url = CONFIG.USER_SERVICE_URL + CONFIG.ENDPOINTS.REGISTER;
        return await this.request(url, 'POST', userData, false);
    },
    
    /**
     * Login user
     */
    async login(credentials) {
        const url = CONFIG.USER_SERVICE_URL + CONFIG.ENDPOINTS.LOGIN;
        return await this.request(url, 'POST', credentials, false);
    },
    
    // Future Implementation

    /**
     * Get all events
     * Create event (organizer only)
     * Get user's bookings
     * Create booking
     */
};

// Make API available globally
window.API = API;