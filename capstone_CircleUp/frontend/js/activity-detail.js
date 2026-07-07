// Activity detail page functionality

class ActivityDetailManager {
    constructor() {
        this.api = api;
        this.activityId = null;
        this.currentUser = null;
        this.activity = null;
        this.init();
    }

    async init() {
        if (!requireAuth()) {
            return;
        }

        this.currentUser = UserManager.getUser();
        this.activityId = this.getActivityIdFromURL();

        if (!this.activityId) {
            this.showError("Activity not found");
            return;
        }

        await this.loadActivity();
        this.setupEventListeners();
    }

    getActivityIdFromURL() {
        const params = new URLSearchParams(window.location.search);
        return params.get('id');
    }

    async loadActivity() {
        try {
            document.getElementById('loading').classList.remove('hidden');
            
            this.activity = await this.api.getActivity(this.activityId);
            this.renderActivity();
            
            // Load additional data based on user role
            if (this.isCreator()) {
                await this.loadParticipationRequests();
            }
            
            if (this.canViewContacts()) {
                await this.loadContacts();
            }
            
            document.getElementById('loading').classList.add('hidden');
            document.getElementById('activity-detail').classList.remove('hidden');
            
        } catch (error) {
            console.error('Error loading activity:', error);
            document.getElementById('loading').classList.add('hidden');
            this.showError(error.message || 'Failed to load activity');
        }
    }

    renderActivity() {
        // Basic info
        document.getElementById('activity-title').textContent = this.activity.title;
        document.getElementById('activity-date').textContent = formatDate(this.activity.activity_date);
        document.getElementById('activity-location').textContent = this.activity.location;
        document.getElementById('activity-organizer').textContent = this.activity.creator_name;
        document.getElementById('activity-participants').textContent = 
            `${this.activity.current_participants}/${this.activity.max_participants}`;
        document.getElementById('activity-description-text').textContent = this.activity.description;

        // Status
        const statusElement = document.getElementById('activity-status');
        statusElement.textContent = this.activity.status;
        statusElement.className = `activity-status status-${this.activity.status}`;

        // Category
        document.getElementById('activity-category').textContent = `#${this.activity.category}`;

        // Actions
        this.renderActions();
    }

    renderActions() {
        const actionsContainer = document.getElementById('activity-actions');
        let actions = '';

        if (this.isCreator() && this.activity.status !== 'completed' && this.activity.status !== 'cancelled') {
            actions += `
                <button class="btn btn-primary" onclick="activityDetailManager.editActivity()">Edit Activity</button>
                <button class="btn btn-danger" onclick="activityDetailManager.cancelActivity()">Cancel Activity</button>
            `;
        } else if (this.canJoin()) {
            actions += `
                <button class="btn btn-success" onclick="activityDetailManager.requestToJoin()">Request to Join</button>
            `;
        } else if (this.activity.status === 'full') {
            actions += `<span class="btn btn-secondary" disabled>Activity Full</span>`;
        } else if (this.activity.status === 'cancelled') {
            actions += `<span class="btn btn-danger" disabled>Activity Cancelled</span>`;
        } else if (this.activity.status === 'completed') {
            actions += `<span class="btn btn-secondary" disabled>Activity Completed</span>`;
        }

        actions += `<a href="/pages/discover.html" class="btn btn-secondary">Back to Activities</a>`;
        
        actionsContainer.innerHTML = actions;
    }

    async loadParticipationRequests() {
        try {
            const requests = await this.api.getActivityRequests(this.activityId);
            this.renderParticipationRequests(requests);
        } catch (error) {
            console.error('Error loading requests:', error);
        }
    }

    renderParticipationRequests(requests) {
        const section = document.getElementById('participation-requests-section');
        const container = document.getElementById('participation-requests');

        if (requests.length === 0) {
            container.innerHTML = '<p>No pending participation requests.</p>';
        } else {
            container.innerHTML = requests
                .filter(request => request.status === 'pending')
                .map(request => `
                    <div class="request-item">
                        <div class="request-info">
                            <div class="request-user">${request.user_name}</div>
                            <div class="request-date">Requested on ${formatDate(request.requested_at)}</div>
                        </div>
                        <div class="request-actions">
                            <button class="btn btn-success" onclick="activityDetailManager.approveRequest(${request.id})">
                                Approve
                            </button>
                            <button class="btn btn-danger" onclick="activityDetailManager.rejectRequest(${request.id})">
                                Reject
                            </button>
                        </div>
                    </div>
                `).join('');
        }

        section.classList.remove('hidden');
    }

    async loadContacts() {
        try {
            const contacts = await this.api.getActivityContacts(this.activityId);
            this.renderContacts(contacts);
        } catch (error) {
            // User might not have permission yet
            console.log('Cannot load contacts:', error.message);
        }
    }

    renderContacts(contacts) {
        const section = document.getElementById('contacts-section');
        const container = document.getElementById('contacts-list');

        container.innerHTML = contacts.map(contact => `
            <div class="contact-item">
                <div class="contact-name">${contact.name}</div>
                <div class="contact-details">
                    ${contact.phone_number ? `📱 ${contact.phone_number}` : ''}
                    ${contact.email ? `📧 ${contact.email}` : ''}
                </div>
            </div>
        `).join('');

        section.classList.remove('hidden');
    }

    setupEventListeners() {
        // Event listeners are handled via onclick attributes in the HTML
    }

    isCreator() {
        return this.activity && this.currentUser && this.activity.creator_id === this.currentUser.id;
    }

    canJoin() {
        return this.activity && 
               this.activity.status === 'open' && 
               !this.isCreator() &&
               this.activity.current_participants < this.activity.max_participants;
    }

    canViewContacts() {
        // User can view contacts if they're the creator or an approved participant
        return this.isCreator(); // Additional logic for participants would go here
    }

    async requestToJoin() {
        try {
            await this.api.requestParticipation(this.activityId);
            showAlert('Participation request sent!', 'success');
            this.renderActions(); // Update UI
        } catch (error) {
            showAlert(error.message || 'Failed to request participation', 'error');
        }
    }

    async approveRequest(requestId) {
        try {
            await this.api.approveParticipation(requestId);
            showAlert('Request approved!', 'success');
            await this.loadActivity(); // Reload to update participant count
            await this.loadParticipationRequests(); // Reload requests
        } catch (error) {
            showAlert(error.message || 'Failed to approve request', 'error');
        }
    }

    async rejectRequest(requestId) {
        try {
            await this.api.rejectParticipation(requestId);
            showAlert('Request rejected', 'info');
            await this.loadParticipationRequests(); // Reload requests
        } catch (error) {
            showAlert(error.message || 'Failed to reject request', 'error');
        }
    }

    editActivity() {
        window.location.href = `/pages/edit-activity.html?id=${this.activityId}`;
    }

    async cancelActivity() {
        if (!confirm('Are you sure you want to cancel this activity? This cannot be undone.')) {
            return;
        }

        try {
            await this.api.deleteActivity(this.activityId);
            showAlert('Activity cancelled successfully', 'success');
            setTimeout(() => {
                window.location.href = '/pages/discover.html';
            }, 2000);
        } catch (error) {
            showAlert(error.message || 'Failed to cancel activity', 'error');
        }
    }

    showError(message) {
        document.getElementById('loading').classList.add('hidden');
        document.getElementById('activity-detail').classList.add('hidden');
        document.getElementById('error-text').textContent = message;
        document.getElementById('error-message').classList.remove('hidden');
    }
}

// Initialize when DOM loads
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('activity-detail.html')) {
        window.activityDetailManager = new ActivityDetailManager();
    }
});