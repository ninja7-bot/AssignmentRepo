// Activities management functionality

class ActivitiesManager {
    constructor() {
        this.api = api;
        this.currentFilters = {};
        this.activities = [];
        this.init();
    }

    async init() {
        if (!requireAuth()) {
            return;
        }

        this.initializeEventListeners();
        this.loadActivities();
    }

    initializeEventListeners() {
        // Create activity form
        const createForm = document.getElementById('create-activity-form');
        if (createForm) {
            createForm.addEventListener('submit', (e) => this.handleCreateActivity(e));

            createForm.title.addEventListener('input', () => {
                this.validateTitle(createForm.title);
            });

            createForm.description.addEventListener('input', () => {
                this.validateDescription(createForm.description);
            });

            createForm.category.addEventListener('change', () => {
                this.validateRequired(
                    createForm.category,
                    'Please select a category'
                );
            });

            createForm.location.addEventListener('input', () => {
                this.validateRequired(
                    createForm.location,
                    'Location is required'
                );
            });

            createForm.activity_date.addEventListener('change', () => {
                this.validateActivityDate(createForm.activity_date);
            });

            createForm.max_participants.addEventListener('input', () => {
                this.validateMaxParticipants(createForm.max_participants);
            });
        }

        const filtersForm = document.getElementById('filters-form');

        if (filtersForm) {
            filtersForm.addEventListener('submit', (e) => this.handleFilters(e));
            filtersForm.addEventListener('reset', (e) => this.handleClearFilters(e));
        }

        // Activity actions
        document.addEventListener('click', (e) => {
            if (e.target.matches('.join-activity-btn')) {
                this.handleJoinActivity(e.target.dataset.activityId);
            }

            if (e.target.matches('.approve-request-btn')) {
                this.handleApproveRequest(e.target.dataset.requestId);
            }

            if (e.target.matches('.reject-request-btn')) {
                this.handleRejectRequest(e.target.requestId);
            }
        });
    }

    showFieldError(field, message) {
        field.classList.add('error');

        let errorElement =
            field.parentElement.querySelector('.error-message');

        if (!errorElement) {
            errorElement = document.createElement('span');
            errorElement.className = 'error-message';
            field.parentElement.appendChild(errorElement);
        }

        errorElement.textContent = message;
    }

    clearFieldError(field) {
        field.classList.remove('error');

        const errorElement =
            field.parentElement.querySelector('.error-message');

        if (errorElement) {
            errorElement.textContent = '';
        }
    }

    validateTitle(field) {
        const value = field.value.trim();
        const titleRegex = /^[A-Za-z0-9\s.,!?'-]+$/;

        if (!value) {
            this.showFieldError(field, 'Title is required');
            return false;
        }

        if (value.length < 3) {
            this.showFieldError(
                field,
                'Title must be at least 3 characters'
            );
            return false;
        }

        if (value.length > 200) {
            this.showFieldError(
                field,
                'Title cannot exceed 200 characters'
            );
            return false;
        }

        if (!titleRegex.test(value)) {
            this.showFieldError(
                field,
                'Title contains invalid characters'
            );
            return false;
        }

        this.clearFieldError(field);
        return true;
    }

    validateDescription(field) {
        const value = field.value.trim();

        if (!value) {
            this.showFieldError(field, 'Description is required');
            return false;
        }

        if (value.length < 10) {
            this.showFieldError(
                field,
                'Description must be at least 10 characters'
            );
            return false;
        }

        if (value.length > 500) {
            this.showFieldError(
                field,
                'Description cannot exceed 500 characters'
            );
            return false;
        }

        this.clearFieldError(field);
        return true;
    }

    validateRequired(field, message) {
        if (!field.value.trim()) {
            this.showFieldError(field, message);
            return false;
        }

        this.clearFieldError(field);
        return true;
    }

    getCurrentISTDateTime() {
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

    validateActivityDate(field) {
        if (!field.value) {
            this.showFieldError(
                field,
                'Activity date and time are required'
            );
            return false;
        }

        const selectedDateTime = field.value;
        const currentDateTime = this.getCurrentISTDateTime();

        if (selectedDateTime <= currentDateTime) {
            this.showFieldError(
                field,
                'Activity must be scheduled for a future date'
            );
            return false;
        }

        this.clearFieldError(field);
        return true;
    }

    validateMaxParticipants(field) {
        const value = Number(field.value);

        if (!field.value) {
            this.showFieldError(
                field,
                'Maximum participants is required'
            );
            return false;
        }

        if (!Number.isInteger(value) || value <= 0) {
            this.showFieldError(
                field,
                'Maximum participants must be greater than zero'
            );
            return false;
        }

        this.clearFieldError(field);
        return true;
    }

    validateCreateForm(form) {
        const validations = [
            this.validateTitle(form.title),
            this.validateDescription(form.description),
            this.validateRequired(
                form.category,
                'Please select a category'
            ),
            this.validateRequired(
                form.location,
                'Location is required'
            ),
            this.validateActivityDate(form.activity_date),
            this.validateMaxParticipants(form.max_participants)
        ];

        return validations.every(Boolean);
    }

    async loadActivities(filters = {}) {
        try {
            const queryParams = new URLSearchParams();

            Object.entries(filters).forEach(([key, value]) => {
                if (value) queryParams.append(key, value);
            });

            const activities = await this.api.request(`/activities?${queryParams.toString()}`);
            this.activities = activities;
            this.renderActivities(activities);
        } catch (error) {
            console.error('Error loading activities:', error);
            showAlert('Error loading activities', 'error');
        }
    }

    renderActivities(activities) {
        const container = document.getElementById('activities-container');

        if (!container) return;

        if (activities.length === 0) {
            container.innerHTML = `
                <div class="text-center">
                    <p>No activities found. Try adjusting your filters or create a new activity!</p>
                </div>
            `;
            return;
        }

        container.innerHTML = activities.map(activity => this.renderActivityCard(activity)).join('');
    }

    renderActivityCard(activity) {
        const statusClass = `status-${activity.status}`;
        const canJoin = activity.status === 'open' && activity.creator_id !== UserManager.getUser().id;

        return `
            <div class="activity-card">
                <div class="activity-header">
                    <div>
                        <h3 class="activity-title">${activity.title}</h3>
                        <div class="activity-meta">
                            <span>📅 ${formatDate(activity.activity_date)}</span><br>
                            <span>📍 ${activity.location}</span><br>
                            <span>👤 By ${activity.creator_name}</span>
                        </div>
                    </div>
                    <span class="activity-status ${statusClass}">${activity.status}</span>
                </div>

                <p class="activity-description">${activity.description}</p>

                <div class="participants-info">
                    <span>👥 ${activity.current_participants}/${activity.max_participants} participants</span>
                    <span class="activity-category">#${activity.category}</span>
                </div>

                <div class="activity-actions mt-1">
                    <a href="/pages/activity-detail.html?id=${activity.id}" class="btn btn-secondary">View Details</a>
                    ${canJoin ? `<button class="btn btn-primary join-activity-btn" data-activity-id="${activity.id}">Request to Join</button>` : ''}
                </div>
            </div>
        `;
    }

    async handleCreateActivity(event) {
        event.preventDefault();

        const form = event.target;
        const submitBtn = form.querySelector('button[type="submit"]');

        if (!this.validateCreateForm(form)) {
            return;
        }

        const activityData = {
            title: form.title.value.trim(),
            description: form.description.value.trim(),
            category: form.category.value,
            location: form.location.value.trim(),
            activity_date: `${form.activity_date.value}:00+05:30`,
            max_participants: Number(form.max_participants.value)
        };

        try {
            showLoading(submitBtn, true);

            await this.api.request('/activities/', {
                method: 'POST',
                body: JSON.stringify(activityData)
            });

            showAlert('Activity created successfully!', 'success');
            form.reset();
            this.loadActivities(this.currentFilters);
        } catch (error) {
            console.error('Activity creation failed:', error);

            if (error instanceof ApiError) {
                showAlert(
                    error.message || 'Activity creation failed',
                    'error'
                );
            } else {
                showAlert(
                    'Connection error. Please try again.',
                    'error'
                );
            }
        } finally {
            showLoading(submitBtn, false);
        }
    }

    async handleFilters(event) {
        event.preventDefault();

        const formData = new FormData(event.target);
        const filters = {};

        for (let [key, value] of formData.entries()) {
            if (value) filters[key] = value;
        }

        this.currentFilters = filters;
        this.loadActivities(filters);
    }

    handleClearFilters(event) {
        this.currentFilters = {};
        this.loadActivities();
    }

    async handleJoinActivity(activityId) {
        try {
            await this.api.request('/participation/request', {
                method: 'POST',
                body: JSON.stringify({ activity_id: parseInt(activityId) })
            });

            showAlert('Participation request sent!', 'success');
            this.loadActivities(this.currentFilters);
        } catch (error) {
            console.error('Join request failed:', error);

            if (error instanceof ApiError) {
                showAlert(error.message || 'Join request failed', 'error');
            } else {
                showAlert('Connection error. Please try again.', 'error');
            }
        }
    }

    async handleApproveRequest(requestId) {
        try {
            await this.api.request(`/participation/${requestId}/approve`, {
                    method: 'PUT'
            });

            showAlert('Request approved!', 'success');
            this.loadActivityRequests();
        } catch (error) {
            console.error('Approve request failed:', error);
            showAlert(error.message || 'Approve request failed', 'error');
        }
    }

    async handleRejectRequest(requestId) {
        try {
            await this.api.request(`/participation/${requestId}/reject`, {
                    method: 'PUT'
            });

            showAlert('Request rejected', 'info');
            this.loadActivityRequests();
        } catch (error) {
            console.error('Reject request failed:', error);
            showAlert(error.message || 'Reject request failed', 'error');
        }
    }
}

// Initialize activities manager when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('activities.html') || 
        window.location.pathname.includes('discover.html') ||
        window.location.pathname.includes('create-activity.html')) {
        new ActivitiesManager();
    }
});