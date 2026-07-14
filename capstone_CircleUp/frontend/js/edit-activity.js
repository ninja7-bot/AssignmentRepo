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

    /**Util Function to get Activity ID from URL. */
    getActivityIdFromURL() {
        const params = new URLSearchParams(window.location.search);
        return params.get('id');
    }

    /**Load Activity from Backend. */
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

            await this.populateForm(this.activity);
            this.showForm();

        } catch (error) {
            console.error('Error loading activity:', error);

            this.showError(
                error.message || 'Failed to load activity'
            );
        }
    }

    /**Populate the Activity Details to the Page. */
    async populateForm(activity) {
        const form = document.getElementById('edit-activity-form');

        if (!form) return;
        
        form.title.value = activity.title;
        form.description.value = activity.description;
        form.category.value = activity.category;
        await populateCityDropdown(form.location, activity.location);
        form.max_participants.value = activity.max_participants;
        form.max_participants.min = activity.current_participants || 1;
        form.activity_date.value = activity.activity_date.slice(0, 16);
    }

    // --- INITIALIZE EVENT LISTENERS -------------------------
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

    // --- VALIDATIONS -------------------------
    validateTitle(field) {
        const result = ValidationRules.title(field.value);
        if (!result.valid) {
            showFieldError(field, result.message);
            return false;
        }
        clearFieldError(field);
        return true;
    }

    validateDescription(field) {
        const result = ValidationRules.description(field.value);
        if (!result.valid) {
            showFieldError(field, result.message);
            return false;
        }
        clearFieldError(field);
        return true;
    }

    validateRequired(field, message) {
        const result = ValidationRules.required(field.value, message);
        if (!result.valid) {
            showFieldError(field, result.message);
            return false;
        }
        clearFieldError(field);
        return true;
    }

    validateActivityDate(field) {
        const result = ValidationRules.activityDate(field.value);
        if (!result.valid) {
            showFieldError(field, result.message);
            return false;
        }
        clearFieldError(field);
        return true;
    }

    validateMaxParticipants(field) {
        const currentParticipants = this.activity ? this.activity.current_participants : 0;
        const result = ValidationRules.maxParticipants(field.value, currentParticipants);
        if (!result.valid) {
            showFieldError(field, result.message);
            return false;
        }
        clearFieldError(field);
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

    /**Handle Update Activity Request directed to backend. */
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

    // --- UTIL FUNCTIONS -------------------------
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