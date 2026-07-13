// Profile management functionality

class ProfileManager {
    constructor() {
        this.api = api;
        this.init();
    }

    async init() {
        if (!requireAuth()) {
            return;
        }

        this.loadUserProfile();
        this.initializeEventListeners();
    }

    /**Load User Profile from backend. */
    async loadUserProfile() {
        try {
            const user = await this.api.getCurrentUser();
            this.populateForm(user);
        } catch (error) {
            console.error('Error loading profile:', error);
            showAlert('Error loading profile', 'error');
        }
    }

    /**Populate the Profile Page. */
    populateForm(user) {
        const form = document.getElementById('profile-form');
        if (form) {
            form.name.value = user.name || '';
            form.email.value = user.email || '';
            form.phone_number.value = user.phone_number || '';
            form.city.value = user.city || '';
            form.bio.value = user.bio || '';
        }
    }

    // --- INITIALIZATION -------------------------
    initializeEventListeners() {
        const form = document.getElementById('profile-form');
        if (form) {
            form.addEventListener('submit', (e) => this.handleUpdateProfile(e));
        }

        const deleteBtn = document.getElementById('delete-account-btn');
        if (deleteBtn) {
            deleteBtn.addEventListener('click', (e) => this.handleDeleteAccount(e));
        }
    }

    /**Update User Profile Request directed to backend. */
    async handleUpdateProfile(event) {
        event.preventDefault();
        
        const form = event.target;
        const submitBtn = form.querySelector('button[type="submit"]');
        const formData = new FormData(form);
        
        const updateData = {
            name: formData.get('name'),
            email: formData.get('email'),
            phone_number: formData.get('phone_number') || null,
            city: formData.get('city') || null,
            bio: formData.get('bio') || null
        };

        try {
            showLoading(submitBtn, true);
            
            const updatedUser = await this.api.updateCurrentUser(updateData);
            UserManager.setUser(updatedUser);
            
            showAlert('Profile updated successfully!', 'success');
        } catch (error) {
            console.error('Profile update failed:', error);
            
            if (error instanceof ApiError) {
                if (error.status === 400 && error.message.includes('Email already registered')) {
                    showAlert('This email is already taken by another user.', 'error');
                } else {
                    showAlert(error.message || 'Profile update failed', 'error');
                }
            } else {
                showAlert('Connection error. Please try again.', 'error');
            }
        } finally {
            showLoading(submitBtn, false);
        }
    }

    /**Delete the User's Account directed to backend. */
    async handleDeleteAccount(event) {
        event.preventDefault();
        
        if (!confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
            return;
        }

        try {
            await this.api.request('/users/me', { method: 'DELETE' });
            
            TokenManager.removeToken();
            UserManager.removeUser();
            
            showAlert('Account deleted successfully', 'info');
            
            setTimeout(() => {
                window.location.href = '/index.html';
            }, 2000);
        } catch (error) {
            console.error('Account deletion failed:', error);
            showAlert('Failed to delete account', 'error');
        }
    }
}

// Initialize profile manager when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('profile.html')) {
        new ProfileManager();
    }
});