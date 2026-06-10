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
            const text = await response.text();

            let data;

            try {
                data = JSON.parse(text);        // try parsing JSON
            } catch {
                data = text;                    // fallback to plain text
            }
            
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


    // Events Service

    /**
     * Fetches all events
     */
    async getEvents() {
        const url = CONFIG.EVENT_SERVICE_URL + CONFIG.ENDPOINTS.EVENTS;
        return this.request(url, 'GET', null, false);
    },

    /**
     * Fetches event by id
     */
    async getEventById(id) {
        const url = CONFIG.EVENT_SERVICE_URL + CONFIG.ENDPOINTS.EVENT_BY_ID + id;
        return this.request(url, 'GET', null, false);
    },

    /**
     * Organizer's events (organizer)
     */
    async getMyEvents() {
        const url = CONFIG.EVENT_SERVICE_URL + CONFIG.ENDPOINTS.MY_EVENTS;
        return this.request(url, 'GET', null, true);
    },

    /**
     * Create Event (organizer)
     */
    async createEvent(eventData) {
        const url = CONFIG.EVENT_SERVICE_URL + CONFIG.ENDPOINTS.EVENTS;
        return this.request(url, 'POST', eventData, true);
    },

    /**
     * Update Event (organizer)
     */
    async updateEvent(id, eventUpdatedData) {
        const url = CONFIG.EVENT_SERVICE_URL + CONFIG.ENDPOINTS.EVENT_BY_ID + id;
        return this.request(url, 'PUT', eventUpdatedData, true);
    },

    /**
     * Cancel Event (organizer)
     */
    async cancelEvent(id) {
        const url = CONFIG.EVENT_SERVICE_URL + CONFIG.ENDPOINTS.EVENT_BY_ID + id;
        return this.request(url, 'DELETE', null, true);
    },

    /**
     * Create Booking (customer)
     */
    createBooking(bookingInfo) {
        var url = CONFIG.EVENT_SERVICE_URL + CONFIG.ENDPOINTS.BOOKINGS;
        return this.request(url, 'POST', bookingInfo, true);
    },

    /**
     * Get User Bookings (customer)
     */
    getMyBookings() {
        var url = CONFIG.EVENT_SERVICE_URL + CONFIG.ENDPOINTS.MY_BOOKINGS;
        return this.request(url, 'GET', null, true);
    },

    /**
     * Get Event Bookings (organizer)
     */
    getBookingsByEvent(eventId) {
        var url = CONFIG.EVENT_SERVICE_URL + CONFIG.ENDPOINTS.BOOKINGS_BY_EVENT + eventId;
        return this.request(url, 'GET', null, true);
    },

    /**
     * Cancel Booking (customer)
     */
    cancelBooking(bookingId) {
        var url = CONFIG.EVENT_SERVICE_URL + CONFIG.ENDPOINTS.CANCEL_BOOKING + bookingId + '/cancel';
        return this.request(url, 'PATCH', null, true);
    }
};

// Make API available globally
window.API = API;