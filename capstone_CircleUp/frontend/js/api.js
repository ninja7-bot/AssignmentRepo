// API service for CircleUp application

class ApiService {
    constructor() {
        this.baseURL = API_BASE_URL;
    }

    getAuthHeaders() {
        const token = TokenManager.getToken();
        return {
            'Content-Type': 'application/json',
            'Authorization': token ? `Bearer ${token}` : ''
        };
    }

    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        
        const defaultOptions = {
            headers: this.getAuthHeaders()
        };

        const mergedOptions = {
            ...defaultOptions,
            ...options,
            headers: {
                ...defaultOptions.headers,
                ...options.headers
            }
        };

        try {
            const response = await fetch(url, mergedOptions);
            
            let data;
            const contentType = response.headers.get('content-type');
            
            if (contentType && contentType.includes('application/json')) {
                data = await response.json();
            } else {
                data = await response.text();
            }

            if (!response.ok) {
                throw new ApiError(data.detail || data || 'Request failed', response.status, data);
            }

            return data;
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }
            
            console.error('API request failed:', error);
            throw new ApiError('Network error occurred', 0, error);
        }
    }

    // Authentication endpoints
    async register(userData) {
        return await this.request('/auth/register', {
            method: 'POST',
            body: JSON.stringify(userData)
        });
    }

    async login(credentials) {
        return await this.request('/auth/login', {
            method: 'POST',
            body: JSON.stringify(credentials)
        });
    }

    async logout() {
        return await this.request('/auth/logout', {
            method: 'POST'
        });
    }

    // User endpoints
    async getCurrentUser() {
        return await this.request('/users/me');
    }

    async updateCurrentUser(userData) {
        return await this.request('/users/me', {
            method: 'PUT',
            body: JSON.stringify(userData)
        });
    }

    async getUser(userId) {
        return await this.request(`/users/${userId}`);
    }
}

// Custom error class for API errors
class ApiError extends Error {
    constructor(message, status, data) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
        this.data = data;
    }

    isAuthError() {
        return this.status === 401;
    }

    isValidationError() {
        return this.status === 422;
    }

    isNotFoundError() {
        return this.status === 404;
    }
}

// Create global API instance
const api = new ApiService();

// Global error handler for API errors
window.addEventListener('unhandledrejection', function(event) {
    if (event.reason instanceof ApiError) {
        console.error('Unhandled API error:', event.reason);
        
        if (event.reason.isAuthError()) {
            showAlert('Session expired. Please log in again.', 'warning');
            TokenManager.removeToken();
            UserManager.removeUser();
            setTimeout(() => {
                window.location.href = '/pages/login.html';
            }, 2000);
        } else {
            showAlert(event.reason.message || 'An error occurred', 'error');
        }
        
        event.preventDefault();
    }
});