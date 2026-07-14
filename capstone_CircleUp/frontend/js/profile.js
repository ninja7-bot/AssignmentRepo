// Profile management functionality

class ProfileManager {
    constructor() {
        this.api = api;
        this.originalUser = {};
        this.init();
    }

    async init() {
        if (!requireAuth()) {
            return;
        }

        await this.loadUserProfile();
        this.initializeEventListeners();
    }

    /**Load User Profile from backend. */
    async loadUserProfile() {
        try {
            const user = await this.api.getCurrentUser();

            this.originalUser = { ...user };

            await this.populateForm(user);
        } catch (error) {
            console.error('Error loading profile:', error);
            showAlert('Error loading profile', 'error');
        }
    }

    /**Populate the Profile Page. */
    async populateForm(user) {
        const form = document.getElementById('profile-form');

        if (form) {
            form.name.value = user.name || '';
            form.email.value = user.email || '';
            form.phone_number.value = user.phone_number || '';

            await populateCityDropdown(form.city, user.city);

            form.bio.value = user.bio || '';
        }
    }

    // --- INITIALIZATION -------------------------
    initializeEventListeners() {
        const form = document.getElementById('profile-form');

        if (form) {
            form.addEventListener('submit', (e) => this.handleUpdateProfile(e));
            this.initializeLiveValidation();
        }

        const deleteBtn = document.getElementById('delete-account-btn');

        if (deleteBtn) {
            deleteBtn.addEventListener('click', (e) => this.handleDeleteAccount(e));
        }
    }

    /** Live Validation */
    initializeLiveValidation() {
        const fields = {
            name: {
                validator: ValidationRules.name,
                errorId: "nameError"
            },
            email: {
                validator: ValidationRules.email,
                errorId: "emailError"
            },
            phone_number: {
                validator: ValidationRules.phoneNumber,
                errorId: "phoneError"
            },
            bio: {
                validator: ValidationRules.bio,
                errorId: "bioError"
            }
        };

        Object.entries(fields).forEach(([fieldName, config]) => {

            const input = document.getElementById(fieldName);

            if (!input) return;

            input.addEventListener("input", () => {

                const originalValue =
                    String(this.originalUser[fieldName] ?? "").trim();

                // Field unchanged → clear error
                if (input.value.trim() === originalValue) {
                    setFieldErrorById(fieldName, config.errorId, "");
                    return;
                }

                // Validate changed value
                const result = config.validator(input.value);

                setFieldErrorById(
                    fieldName,
                    config.errorId,
                    result.valid ? "" : result.message
                );

            });

        });
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
            phone_number: formData.get('phone_number'),
            city: formData.get('city') || null,
            bio: formData.get('bio') || null
        };

        const validations = [];

        if (updateData.name !== this.originalUser.name)
            validations.push(ValidationRules.name(updateData.name).valid);

        if (updateData.email !== this.originalUser.email)
            validations.push(ValidationRules.email(updateData.email).valid);

        if ((updateData.phone_number || "") !== (this.originalUser.phone_number || ""))
            validations.push(
                ValidationRules.phoneNumber(updateData.phone_number || "").valid
            );

        if ((updateData.bio || "") !== (this.originalUser.bio || ""))
            validations.push(
                ValidationRules.bio(updateData.bio || "").valid
            );

        if (validations.includes(false))
            return;

        try {
            showLoading(submitBtn, true);

            const updatedUser = await this.api.updateCurrentUser(updateData);

            UserManager.setUser(updatedUser);

            // Update original values after successful save
            this.originalUser = { ...updatedUser };

            showAlert('Profile updated successfully!', 'success');

        } catch (error) {
            console.error('Profile update failed:', error);

            if (error instanceof ApiError) {

                if (error.status === 409 && error.message.includes('Email already registered')) {
                    showAlert('This email is already taken by another user.', 'error');

                } else if (error.status === 409 && error.message.includes('Phone number already registered')) {
                    showAlert('This phone number is already taken by another user.', 'error');

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
            await this.api.deleteCurrentUser();

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
document.addEventListener('DOMContentLoaded', function () {
    if (window.location.pathname.includes('profile.html')) {
        new ProfileManager();
    }
});