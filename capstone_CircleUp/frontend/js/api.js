// API Service

class ApiService {
    constructor() {
        this.baseURL = API_BASE_URL;
    }

    /**Authentication Headers. */
    getAuthHeaders() {
        const token = TokenManager.getToken();
        return {
            'Content-Type': 'application/json',
            'Authorization': token ? `Bearer ${token}` : ''
        };
    }

    /**Request Utility Function. (Fetch) */
    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const mergedOptions = {
            headers: this.getAuthHeaders(),
            ...options,
            headers: { ...this.getAuthHeaders(), ...options.headers }
        };

        try {
            const response = await fetch(url, mergedOptions);
            let data;
            
            if (response.headers.get('content-type')?.includes('application/json')) {
                data = await response.json();
            } else {
                data = await response.text();
            }

            if (!response.ok) {
                throw new ApiError(data.detail || data.message || data || 'Request failed', response.status, data);
            }

            return data;
        } catch (error) {
            if (error instanceof ApiError) throw error;
            throw new ApiError('Network error', 0, error);
        }
    }

    // --- AUTHENTICATION -------------------------
    /**Send Register request.*/
    async register(userData) {
        return await this.request('/auth/register', {
            method: 'POST',
            body: JSON.stringify(userData)
        });
    }

    /**Send Login Request.*/
    async login(credentials) {
        return await this.request('/auth/login', {
            method: 'POST',
            body: JSON.stringify(credentials)
        });
    }

    // --- USER -------------------------
    /**Get Current User. */
    async getCurrentUser() {
        return await this.request('/users/me');
    }

    /**Update Current User. */
    async updateCurrentUser(userData) {
        return await this.request('/users/me', {
            method: 'PUT',
            body: JSON.stringify(userData)
        });
    }

    /**Delete Current User. */
    async deleteCurrentUser() {
        return await this.request('/users/me', { method: 'DELETE' });
    }

    // --- ACTIVITIES -------------------------
    /**Search Activities. */
    async searchActivities(filters = {}) {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
            if (value) params.append(key, value);
        });
        return await this.request(`/activities/search?${params.toString()}`);
    }

    /**Get Activity by ID. */
    async getActivity(activityId) {
        return await this.request(`/activities/${activityId}`);
    }

    /**Get Activities created by User. */
    async getMyActivities() {
        return await this.request('/activities/mine');
    }

    /**Create a New Activity. */
    async createActivity(activityData) {
        return await this.request('/activities', {
            method: 'POST',
            body: JSON.stringify(activityData)
        });
    }

    /**Update existing activity. */
    async updateActivity(activityId, activityData) {
        return await this.request(`/activities/${activityId}`, {
            method: 'PUT',
            body: JSON.stringify(activityData)
        });
    }

    /**Delete existing activity. */
    async deleteActivity(activityId) {
        return await this.request(`/activities/${activityId}`, {
            method: 'DELETE'
        });
    }

    // --- PARTICIPATION -------------------------
    /**Create Participation Request. */
    async requestParticipation(activityId) {
        return await this.request('/participation/request', {
            method: 'POST',
            body: JSON.stringify({ activity_id: parseInt(activityId, 10) })
        });
    }

    /**Approve Existing Request. */
    async approveParticipation(requestId) {
        return await this.request(`/participation/approve/${requestId}`, {
            method: 'POST'
        });
    }

    /**Reject Existing Request. */
    async rejectParticipation(requestId) {
        return await this.request(`/participation/reject/${requestId}`, {
            method: 'POST'
        });
    }

    /**Get Participation Requests sent by the User. */
    async getMyParticipationRequests() {
        return await this.request('/participation/my-requests');
    }

    /**Get Participation Requests for the Activity. */
    async getActivityRequests(activityId) {
        return await this.request(`/participation/activity/${activityId}/requests`);
    }

    /**Get Activity Contact Details. */
    async getActivityContacts(activityId) {
        return await this.request(`/participation/activity/${activityId}/contacts`);
    }
}

// --- API ERROR -------------------------
class ApiError extends Error {
    constructor(message, status, data) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
        this.data = data;
    }

    isAuthError() { return this.status === 401; }
    isValidationError() { return this.status === 422 || this.status === 400; }
    isNotFoundError() { return this.status === 404; }
}

const api = new ApiService();

window.addEventListener('unhandledrejection', function(event) {
    if (event.reason instanceof ApiError && event.reason.isAuthError()) {
        showAlert('Session expired. Please log in again.', 'warning');
        TokenManager.removeToken();
        UserManager.removeUser();
        setTimeout(() => {
            window.location.href = '/pages/login.html';
        }, 2000);
        event.preventDefault();
    }
});