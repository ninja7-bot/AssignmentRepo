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
        }

        // Filters form
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
        const formData = new FormData(form);

        const localActivityDate = formData.get('activity_date');

        if (!localActivityDate) {
            showAlert('Please select an activity date and time.', 'error');
            return;
        }

        const activityDate = new Date(localActivityDate);

        if (isNaN(activityDate.getTime())) {
            showAlert('Please enter a valid activity date and time.', 'error');
            return;
        }

        if (activityDate <= new Date()) {
            showAlert('Activity must be scheduled for a future date and time.', 'error');
            return;
        }

        const activityData = {
            title: formData.get('title'),
            description: formData.get('description'),
            category: formData.get('category'),
            location: formData.get('location'),

            // Local browser time -> timezone-aware UTC ISO string
            activity_date: activityDate.toISOString(),

            max_participants: parseInt(
                formData.get('max_participants'),
                10
            )
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