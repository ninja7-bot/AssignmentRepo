// Activities management functionality

class ActivitiesManager {
    constructor() {
        this.api = api;
        this.currentFilters = {};
        this.activities = [];
        this.myRequestsMap = new Map();
        this.init();
    }

    // Intialize Activities Manager.
    async init() {
        if (!requireAuth()) {
            return;
        }

        this.initializeEventListeners();
        await this.loadMyRequests();
        this.loadActivities();
    }

    // Load Requests sent by the user.
    async loadMyRequests() {
        try {
            const requests = await this.api.getMyParticipationRequests();
            this.myRequestsMap = new Map(requests.map((r) => [r.activity_id, r.status]));
        } catch (error) {
            console.error('Error loading your participation requests:', error);
        }
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

    // Show Validation Errors in Create Activity Form.
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

    // Clear Field Errors.
    clearFieldError(field) {
        field.classList.remove('error');

        const errorElement =
            field.parentElement.querySelector('.error-message');

        if (errorElement) {
            errorElement.textContent = '';
        }
    }

    /**Field Validations 
        * Title
        * Description
        * Location
        * Activity Datetime
        * Category
        * Max Participants
    */
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

    /**Validate Create Activity Form
        * Validations for the fields.
     */
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
    /**Load All Activities*/
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

    /**Render Activity Cards for each activity. */
    renderActivities(activities) {
        const container = document.getElementById('activities-container');
        if (!container) return;

        container.textContent = '';

        if (activities.length === 0) {
            const emptyTemplate = document.getElementById('no-activities-template');
            container.appendChild(emptyTemplate.content.cloneNode(true));
            return;
        }

        activities.forEach((activity) => {
            container.appendChild(this.buildActivityCard(activity));
        });
    }

    /**Append values to the Activity Card Template. */
    buildActivityCard(activity) {
        const template = document.getElementById('activity-card-template');
        const card = template.content.cloneNode(true);

        card.querySelector('.activity-title').textContent = activity.title;
        card.querySelector('.activity-date').textContent = `📅 ${formatDate(activity.activity_date)}`;
        card.querySelector('.activity-location').textContent = `📍 ${activity.location}`;
        card.querySelector('.activity-creator').textContent = `👤 By ${activity.creator_name}`;

        const statusEl = card.querySelector('.activity-status');
        statusEl.textContent = activity.status;
        statusEl.classList.add(`status-${activity.status}`);

        card.querySelector('.activity-description').textContent = activity.description;
        card.querySelector('.activity-participants').textContent =
            `👥 ${activity.current_participants}/${activity.max_participants} participants`;
        card.querySelector('.activity-category').textContent = `#${activity.category}`;

        const detailsLink = card.querySelector('.view-details-link');
        detailsLink.href = `/pages/activity-detail.html?id=${activity.id}`;
        
        const editLink = card.querySelector('.edit-activity-link');
        editLink.href = `/pages/edit-activity.html?id=${activity.id}`;

        const joinBtn = card.querySelector('.join-activity-btn');
        const isCreator = activity.creator_id === UserManager.getUser().id;
        const myStatus = this.myRequestsMap.get(activity.id);

        if (isCreator) {
            editLink.classList.remove('hidden');
            joinBtn.remove();
        } else if (myStatus === 'pending') {
            joinBtn.textContent = 'Request Pending';
            joinBtn.classList.remove('hidden', 'btn-primary');
            joinBtn.classList.add('status-pending');
            joinBtn.disabled = true;
        } else if (myStatus === 'approved') {
            joinBtn.textContent = "✓ You're In";
            joinBtn.classList.remove('hidden', 'btn-primary');
            joinBtn.classList.add('status-approved');
            joinBtn.disabled = true;
        } else if (myStatus === 'rejected') {
            joinBtn.textContent = 'Request Rejected';
            joinBtn.classList.remove('hidden', 'btn-primary');
            joinBtn.classList.add('status-rejected');
            joinBtn.disabled = true;
        } else if (activity.status === 'open') {
            joinBtn.classList.remove('hidden');
            joinBtn.dataset.activityId = activity.id;
        } else {
            joinBtn.remove();
        }

        return card;
    }

    /**Handle Create Activity. */
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

    /**Handle Discover Page filters. */
    async handleFilters(event) {
        event.preventDefault();

        const formData = new FormData(event.target);
        const filters = {};

        for (let [key, value] of formData.entries()) {
            if (!value) continue;

            if (key === 'date_from' || key === 'date_to') {
                const parsed = new Date(value);
                if (isNaN(parsed.getTime())) {
                    showAlert('Please enter a valid date.', 'error');
                    return;
                }
                filters[key] = parsed.toISOString();
            } else {
                filters[key] = value;
            }
        }

        if (filters.date_from && filters.date_to && filters.date_from > filters.date_to) {
            showAlert('"From Date" must be before "To Date".', 'error');
            return;
        }

        this.currentFilters = filters;
        this.loadActivities(filters);
    }

    /**Clear All Filters. */
    handleClearFilters(event) {
        this.currentFilters = {};
        this.loadActivities();
    }

    /**Handle Join Activity */
    async handleJoinActivity(activityId) {
        const btn = document.querySelector(`.join-activity-btn[data-activity-id="${activityId}"]`);

        try {
            if (btn) showLoading(btn, true);

            await this.api.requestParticipation(activityId);

            showAlert('Participation request sent!', 'success');

            this.myRequestsMap.set(Number(activityId), 'pending');
            this.renderActivities(this.activities);
        } catch (error) {
            console.error('Join request failed:', error);

            if (error instanceof ApiError) {
                // e.g. "You have already requested to join this activity"
                showAlert(error.message || 'Join request failed', 'error');

                await this.loadMyRequests();
                this.renderActivities(this.activities);
            } else {
                showAlert('Connection error. Please try again.', 'error');
            }
        } finally {
            if (btn) showLoading(btn, false);
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