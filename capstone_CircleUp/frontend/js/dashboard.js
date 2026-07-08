// Dashboard functionality for CircleUp

class DashboardManager {
    constructor() {
        this.init();
    }

    async init() {
        if (!requireAuth()) {
            return;
        }

        this.loadUserInfo();
        this.loadDashboardStats();
    }

    loadUserInfo() {
        try {
            const user = UserManager.getUser();
            if (user) {
                const userInfoElement = document.getElementById('user-info');
                if (userInfoElement) {
                    userInfoElement.textContent = `Welcome back, ${user.name}!`;
                }
            }
        } catch (error) {
            console.error('Error loading user info:', error);
        }
    }

    async loadDashboardStats() {
        try {
            const [hosting, requests] = await Promise.all([
                api.getMyActivities(),
                api.getMyParticipationRequests()
            ]);

            const joinedCount = requests.filter((r) => r.status === 'approved').length;
            const pendingCount = requests.filter((r) => r.status === 'pending').length;

            document.getElementById('created-count').textContent = hosting.length;
            document.getElementById('joined-count').textContent = joinedCount;
            document.getElementById('pending-count').textContent = pendingCount;
        } catch (error) {
            console.error('Error loading dashboard stats:', error);
            showAlert('Error loading dashboard data', 'error');
        }
    }
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('dashboard.html')) {
        new DashboardManager();
    }
});