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
            // Placeholder for now - will be implemented in Week 2
            document.getElementById('created-count').textContent = '0';
            document.getElementById('joined-count').textContent = '0';
            document.getElementById('pending-count').textContent = '0';
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