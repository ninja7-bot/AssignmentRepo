// Edit activity functionality

class EditActivityManager {
    constructor() {
        this.api = api;
        this.activityId = null;
        this.activity = null;
        this.init();
    }

    async init() {
        if (!requireAuth()) return;

        this.activityId = this.getActivityIdFromURL();

        if (!this.activityId) {
            this.showError('Activity ID not found');
            return;
        }

        await this.loadActivity();
        this.initializeEventListeners();
    }

    getActivityIdFromURL() {
        const params = new URLSearchParams(window.location.search);
        return params.get('id');
    }

    async loadActivity() {
        try {
            this.activity = await this.api.getActivity(this.activityId);

            const currentUser = UserManager.getUser();

            if (this.activity.creator_id !== currentUser.id) {
                this.showError(
                    'You are not authorized to edit this activity'
                );
                return;
            }

            if (this.activity.status === "completed" || this.activity.status === "cancelled") {
                this.showError(
                    `This activity is ${this.activity.status} and can no longer be edited.`
                );
                return;
            }

            this.populateForm(this.activity);
            this.showForm();

        } catch (error) {
            console.error('Error loading activity:', error);

            this.showError(
                error.message || 'Failed to load activity'
            );
        }
    }

    populateForm(activity) {
        const form = document.getElementById('edit-activity-form');

        if (!form) return;

        form.title.value = activity.title;
        form.description.value = activity.description;
        form.category.value = activity.category;
        form.location.value = activity.location;
        form.max_participants.value = activity.max_participants;

        form.activity_date.value = activity.activity_date.slice(0, 16);
    }

    initializeEventListeners() {
        const form = document.getElementById('edit-activity-form');

        if (!form) return;

        form.addEventListener(
            'submit',
            (event) => this.handleUpdateActivity(event)
        );

        form.title.addEventListener('input', () => {
            this.validateTitle(form.title);
        });

        form.description.addEventListener('input', () => {
            this.validateDescription(form.description);
        });

        form.category.addEventListener('change', () => {
            this.validateRequired(form.category, 'Please select a category');
        });

        form.location.addEventListener('input', () => {
            this.validateRequired(form.location, 'Location is required');
        });

        form.activity_date.addEventListener('change', () => {
            this.validateActivityDate(form.activity_date);
        });

        form.max_participants.addEventListener('input', () => {
            this.validateMaxParticipants(form.max_participants);
        });
    }

    showFieldError(field, message) {
        field.classList.add('error');

        let errorElement = field.parentElement.querySelector('.error-message');

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

    validateForm(form) {
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

            this.validateMaxParticipants(
                form.max_participants
            )
        ];

        return validations.every(Boolean);
    }

    async handleUpdateActivity(event) {
        event.preventDefault();

        const form = event.target;
        const submitBtn =
            form.querySelector('button[type="submit"]');

        if (!this.validateForm(form)) {
            return;
        }

        const activityDate = `${form.activity_date.value}:00+05:30`;

        const updateData = {
            title: form.title.value.trim(),
            description: form.description.value.trim(),
            category: form.category.value,
            location: form.location.value.trim(),
            activity_date: activityDate,
            max_participants: Number(form.max_participants.value)
        };

        try {
            showLoading(submitBtn, true);

            await this.api.updateActivity(
                this.activityId,
                updateData
            );

            showAlert(
                'Activity updated successfully!',
                'success'
            );

            setTimeout(() => {
                window.location.href =
                    `activity-detail.html?id=${this.activityId}`;
            }, 1500);

        } catch (error) {
            console.error(
                'Activity update failed:',
                error
            );

            showAlert(
                error.message || 'Activity update failed',
                'error'
            );

        } finally {
            showLoading(submitBtn, false);
        }
    }

    showForm() {
        document
            .getElementById('loading')
            .classList.add('hidden');

        document
            .getElementById('edit-form-container')
            .classList.remove('hidden');
    }

    showError(message) {
        document
            .getElementById('loading')
            .classList.add('hidden');

        document
            .getElementById('error-message')
            .textContent = message;

        document
            .getElementById('error-container')
            .classList.remove('hidden');
    }

    goBack() {
        if (this.activityId) {
            window.location.href =
                `activity-detail.html?id=${this.activityId}`;
        } else {
            window.location.href = 'my-activities.html';
        }
    }
}

document.addEventListener('DOMContentLoaded', function () {
    if (
        window.location.pathname.includes('edit-activity.html')
    ) {
        window.editActivityManager =
            new EditActivityManager();
    }
});