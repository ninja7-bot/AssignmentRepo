// Activity detail page functionality

class ActivityDetailManager {
    constructor() {
        this.api = api;
        this.activityId = null;
        this.currentUser = null;
        this.activity = null;
        this.myRequestStatus = null; // null | 'pending' | 'approved' | 'rejected'
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

            if (!this.isCreator()) {
                await this.loadMyRequestStatus();
            }

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
        actionsContainer.textContent = '';

        const addButton = (text, className, onClick, disabled = false) => {
            const btn = document.createElement(disabled ? 'span' : 'button');
            if (!disabled) btn.type = 'button';
            btn.className = className;
            btn.textContent = text;
            if (disabled) {
                btn.setAttribute('disabled', '');
            } else {
                btn.addEventListener('click', onClick);
            }
            actionsContainer.appendChild(btn);
        };

        if (this.isCreator() && this.activity.status !== "completed" &&  this.activity.status !== "cancelled" ) {
            addButton('Edit Activity', 'btn btn-primary', () => this.editActivity());
            addButton('Cancel Activity', 'btn btn-danger', () => this.cancelActivity());
        } else if (this.myRequestStatus === 'pending') {
            addButton('Request Pending', 'btn btn-secondary', null, true);
        } else if (this.myRequestStatus === 'approved') {
            addButton("✓ You're In", 'btn btn-success', null, true);
        } else if (this.myRequestStatus === 'rejected') {
            addButton('Request Rejected', 'btn btn-danger', null, true);
        } else if (this.canJoin()) {
            addButton('Request to Join', 'btn btn-success', () => this.requestToJoin());
        } else if (this.activity.status === 'full') {
            addButton('Activity Full', 'btn btn-secondary', null, true);
        } else if (this.activity.status === 'cancelled') {
            addButton('Activity Cancelled', 'btn btn-danger', null, true);
        } else if (this.activity.status === 'completed') {
            addButton('Activity Completed', 'btn btn-secondary', null, true);
        }

        const backLink = document.createElement('a');
        backLink.href = '/pages/discover.html';
        backLink.className = 'btn btn-secondary';
        backLink.textContent = 'Back to Activities';
        actionsContainer.appendChild(backLink);
    }

    async loadMyRequestStatus() {
        try {
            const myRequests = await this.api.getMyParticipationRequests();
            const mine = myRequests.find(
                (r) => r.activity_id === Number(this.activityId)
            );
            this.myRequestStatus = mine ? mine.status : null;
        } catch (error) {
            console.error('Error loading participation status:', error);
            this.myRequestStatus = null;
        }
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
        container.textContent = '';

        const pending = requests.filter((request) => request.status === 'pending');

        if (pending.length === 0) {
            const emptyTemplate = document.getElementById('no-requests-template');
            container.appendChild(emptyTemplate.content.cloneNode(true));
        } else {
            const template = document.getElementById('request-item-template');

            pending.forEach((request) => {
                const item = template.content.cloneNode(true);

                item.querySelector('.request-user').textContent = request.user_name;
                item.querySelector('.request-date').textContent =
                    `Requested on ${formatDate(request.requested_at)}`;

                item.querySelector('.approve-btn').addEventListener('click', () => {
                    this.approveRequest(request.id);
                });
                item.querySelector('.reject-btn').addEventListener('click', () => {
                    this.rejectRequest(request.id);
                });

                container.appendChild(item);
            });
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
        container.textContent = '';

        const template = document.getElementById('contact-item-template');

        contacts.forEach((contact) => {
            const item = template.content.cloneNode(true);
            item.querySelector('.contact-name').textContent = contact.name;

            const detailsEl = item.querySelector('.contact-details');
            if (contact.phone_number) {
                detailsEl.appendChild(document.createTextNode(`📱 ${contact.phone_number}`));
            }
            if (contact.phone_number && contact.email) {
                detailsEl.appendChild(document.createElement('br'));
            }
            if (contact.email) {
                detailsEl.appendChild(document.createTextNode(`📧 ${contact.email}`));
            }

            container.appendChild(item);
        });

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
        return this.isCreator() || this.myRequestStatus === 'approved';
    }

    async requestToJoin() {
        try {
            await this.api.requestParticipation(this.activityId);
            showAlert('Participation request sent!', 'success');
            this.myRequestStatus = 'pending';
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