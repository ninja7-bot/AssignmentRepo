// My Activities page functionality

class MyActivitiesManager {
    constructor() {
        this.api = api;
        this.currentUser = null;

        this.hostingActivities = null;
        this.enrichedRequests = null;
        this.incomingRequests = null;

        this.loadedTabs = new Set();
        this.init();
    }

    async init() {
        if (!requireAuth()) {
            return;
        }

        this.currentUser = UserManager.getUser();
        this.setupTabs();
        await this.loadTab('hosting');

        this.refreshIncomingBadge();
    }

    setupTabs() {
        document.querySelectorAll('.tab-btn').forEach((btn) => {
            btn.addEventListener('click', () => this.switchTab(btn.dataset.tab));
        });
    }

    switchTab(tabName) {
        document.querySelectorAll('.tab-btn').forEach((btn) => {
            btn.classList.toggle('active', btn.dataset.tab === tabName);
        });

        document.querySelectorAll('.tab-content').forEach((section) => {
            section.classList.toggle('hidden', section.id !== `tab-${tabName}`);
        });

        this.loadTab(tabName);
    }

    async loadTab(tabName) {
        if (this.loadedTabs.has(tabName)) return;

        switch (tabName) {
            case 'hosting':
                await this.loadHosting();
                break;
            case 'joined':
                await this.loadJoined();
                break;
            case 'pending':
                await this.loadPending();
                break;
            case 'incoming':
                await this.loadIncoming();
                break;
        }

        this.loadedTabs.add(tabName);
    }


    renderEmptyState(container, message) {
        container.textContent = '';
        const template = document.getElementById('empty-state-template');
        const node = template.content.cloneNode(true);
        node.querySelector('.empty-state-text').textContent = message;
        container.appendChild(node);
    }

    buildActivityCard(activity, { showEdit }) {
        const template = document.getElementById('activity-card-template');
        const card = template.content.cloneNode(true);

        card.querySelector('.activity-title').textContent = activity.title;
        card.querySelector('.activity-date').textContent = `📅 ${formatDate(activity.activity_date)}`;
        card.querySelector('.activity-location').textContent = `📍 ${activity.location}`;

        const statusEl = card.querySelector('.activity-status');
        statusEl.textContent = activity.status;
        statusEl.classList.add(`status-${activity.status}`);

        card.querySelector('.activity-description').textContent = activity.description;
        card.querySelector('.activity-participants').textContent =
            `👥 ${activity.current_participants}/${activity.max_participants} participants`;
        card.querySelector('.activity-category').textContent = `#${activity.category}`;

        const actions = card.querySelector('.card-actions');

        const viewLink = document.createElement('a');
        viewLink.href = `/pages/activity-detail.html?id=${activity.id}`;
        viewLink.className = 'btn btn-secondary';
        viewLink.textContent = 'View Details';
        actions.appendChild(viewLink);

        const editable = !['cancelled', 'completed'].includes(activity.status);
        if (showEdit && editable) {
            const editLink = document.createElement('a');
            editLink.href = `/pages/edit-activity.html?id=${activity.id}`;
            editLink.className = 'btn btn-primary';
            editLink.textContent = 'Edit';
            actions.appendChild(editLink);
        }

        return card;
    }


    async loadHosting() {
        const container = document.getElementById('hosting-container');

        try {
            this.hostingActivities = await this.api.getMyActivities();
            container.textContent = '';

            if (this.hostingActivities.length === 0) {
                this.renderEmptyState(
                    container,
                    "You haven't created any activities yet. Ready to host one?"
                );
                return;
            }

            this.hostingActivities.forEach((activity) => {
                container.appendChild(this.buildActivityCard(activity, { showEdit: true }));
            });
        } catch (error) {
            console.error('Error loading hosted activities:', error);
            showAlert('Error loading your hosted activities', 'error');
        }
    }

    
    async loadJoined() {
        const container = document.getElementById('joined-container');

        try {
            const enriched = await this.getEnrichedRequests();
            container.textContent = '';

            const joined = enriched.filter((r) => r.status === 'approved' && r.activity);

            if (joined.length === 0) {
                this.renderEmptyState(
                    container,
                    "You haven't joined any activities yet. Go discover something fun!"
                );
                return;
            }

            joined.forEach((r) => {
                container.appendChild(this.buildActivityCard(r.activity, { showEdit: false }));
            });
        } catch (error) {
            console.error('Error loading joined activities:', error);
            showAlert('Error loading your joined activities', 'error');
        }
    }


    async loadPending() {
        const container = document.getElementById('pending-requests-container');

        try {
            const enriched = await this.getEnrichedRequests();
            container.textContent = '';

            const sent = enriched
                .filter((r) => r.status === 'pending' || r.status === 'rejected')
                .sort((a, b) => new Date(b.requested_at) - new Date(a.requested_at));

            if (sent.length === 0) {
                this.renderEmptyState(container, "You don't have any outstanding requests.");
                return;
            }

            const template = document.getElementById('sent-request-item-template');

            sent.forEach((r) => {
                const item = template.content.cloneNode(true);

                item.querySelector('.sent-request-title').textContent =
                    r.activity ? r.activity.title : `Activity #${r.activity_id}`;
                item.querySelector('.request-date').textContent =
                    `Requested on ${formatDate(r.requested_at)}`;

                const badge = item.querySelector('.sent-status-badge');
                badge.textContent = r.status;
                badge.classList.add(`status-${r.status}`);

                const viewLink = item.querySelector('.view-link');
                viewLink.href = `/pages/activity-detail.html?id=${r.activity_id}`;

                container.appendChild(item);
            });
        } catch (error) {
            console.error('Error loading sent requests:', error);
            showAlert('Error loading your requests', 'error');
        }
    }


    async loadIncoming() {
        const container = document.getElementById('incoming-requests-container');

        try {
            const requests = await this.getIncomingRequests();
            container.textContent = '';

            if (requests.length === 0) {
                this.renderEmptyState(container, 'No one is waiting on your approval right now.');
                this.updateIncomingBadge(0);
                return;
            }

            const template = document.getElementById('incoming-request-item-template');

            requests.forEach((request) => {
                const item = template.content.cloneNode(true);

                item.querySelector('.request-user').textContent = request.user_name;
                item.querySelector('.request-activity-title').textContent =
                    `for "${request.activity_title}"`;
                item.querySelector('.request-date').textContent =
                    `Requested on ${formatDate(request.requested_at)}`;

                item.querySelector('.approve-btn').addEventListener('click', () => {
                    this.respondToRequest(request.id, 'approve');
                });
                item.querySelector('.reject-btn').addEventListener('click', () => {
                    this.respondToRequest(request.id, 'reject');
                });

                container.appendChild(item);
            });

            this.updateIncomingBadge(requests.length);
        } catch (error) {
            console.error('Error loading incoming requests:', error);
            showAlert('Error loading incoming requests', 'error');
        }
    }

    async respondToRequest(requestId, action) {
        try {
            if (action === 'approve') {
                await this.api.approveParticipation(requestId);
                showAlert('Request approved!', 'success');
            } else {
                await this.api.rejectParticipation(requestId);
                showAlert('Request rejected', 'info');
            }

            this.incomingRequests = null;
            this.hostingActivities = null;
            this.loadedTabs.delete('incoming');
            this.loadedTabs.delete('hosting');

            await this.loadIncoming();

            if (!document.getElementById('tab-hosting').classList.contains('hidden')) {
                await this.loadTab('hosting');
            }
        } catch (error) {
            console.error('Error responding to request:', error);
            showAlert(error.message || 'Failed to update request', 'error');
        }
    }

    async getEnrichedRequests() {
        if (this.enrichedRequests) return this.enrichedRequests;

        const requests = await this.api.getMyParticipationRequests();

        this.enrichedRequests = await Promise.all(
            requests.map(async (r) => {
                try {
                    const activity = await this.api.getActivity(r.activity_id);
                    return { ...r, activity };
                } catch (error) {
                    return { ...r, activity: null };
                }
            })
        );

        return this.enrichedRequests;
    }

    async getIncomingRequests() {
        if (this.incomingRequests) return this.incomingRequests;

        const hosted = this.hostingActivities || (await this.api.getMyActivities());
        this.hostingActivities = hosted;

        const perActivity = await Promise.all(
            hosted.map((activity) =>
                this.api.getActivityRequests(activity.id).catch(() => [])
            )
        );

        this.incomingRequests = perActivity
            .flat()
            .filter((r) => r.status === 'pending')
            .sort((a, b) => new Date(a.requested_at) - new Date(b.requested_at));

        return this.incomingRequests;
    }

    updateIncomingBadge(count) {
        const badge = document.getElementById('incoming-badge');
        if (!badge) return;

        if (count > 0) {
            badge.textContent = String(count);
            badge.classList.remove('hidden');
        } else {
            badge.classList.add('hidden');
        }
    }

    async refreshIncomingBadge() {
        try {
            const requests = await this.getIncomingRequests();
            this.updateIncomingBadge(requests.length);
        } catch (error) {
            console.error('Error checking incoming requests:', error);
        }
    }
}

document.addEventListener('DOMContentLoaded', function () {
    if (window.location.pathname.includes('my-activities.html')) {
        new MyActivitiesManager();
    }
});
