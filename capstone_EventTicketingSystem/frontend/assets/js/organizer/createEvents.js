/**
 * Organizer Create Event
 * Handles create event form, validation, and submit
 */

// Authentication
if (!Utils.requireAuth(CONFIG.ROLES.ORGANIZER)) {
    // requireAuth handles the redirect
}

var userNameEl = document.getElementById('userName');
if (userNameEl) {
    userNameEl.textContent = Utils.getUserName();
}

var logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', function(e) {
        e.preventDefault();
        Utils.logout();
    });
}


// Initialization
document.addEventListener('DOMContentLoaded', function() {
    if (!document.getElementById('createEventForm')) return;

    initCreateEventPage();
});


// Page Initialization
function initCreateEventPage() {
    // Set minimum date to today
    var dateInput = document.getElementById('eventDate');
    if (dateInput) {
        dateInput.min = new Date().toISOString().split('T')[0];
    }

    // Clear errors as user types
    bindClearErrorsOnInput();

    // Reset button
    var resetBtn = document.getElementById('resetBtn');
    if (resetBtn) {
        resetBtn.addEventListener('click', function() {
            resetCreateForm();
        });
    }

    // Success modal buttons
    var createAnotherBtn = document.getElementById('createAnotherBtn');
    if (createAnotherBtn) {
        createAnotherBtn.addEventListener('click', function() {
            closeSuccessModal();
        });
    }

    var closeSuccessBtn = document.getElementById('closeSuccessBtn');
    if (closeSuccessBtn) {
        closeSuccessBtn.addEventListener('click', function() {
            closeSuccessModal();
        });
    }

    // Form submit
    var form = document.getElementById('createEventForm');
    form.addEventListener('submit', handleCreateSubmit);
}


// Clear errors as user types
function bindClearErrorsOnInput() {
    var form   = document.getElementById('createEventForm');
    var inputs = form.querySelectorAll('input, textarea, select');

    inputs.forEach(function(input) {
        input.addEventListener('input', function() {
            var errEl = document.getElementById(input.id + 'Error');
            if (errEl) errEl.textContent = '';
            input.classList.remove('has-error');
        });
    });
}


// Handles Form Submission
// Calls: POST /api/events
async function handleCreateSubmit(e) {
    e.preventDefault();

    if (!validateCreateForm()) return;

    var data = getCreateFormData();

    var submitBtn = document.getElementById('submitBtn');
    submitBtn.disabled    = true;
    submitBtn.textContent = 'Creating...';

    try {
        var res = await API.createEvent(data);

        if (res.success) {
            resetCreateForm();
            openSuccessModal();
        } else {
            handleCreateServerError(res);
        }

    } catch (err) {
        console.error('Create event error:', err);
        Utils.showNotification('Something went wrong. Please try again.', 'error');

    } finally {
        submitBtn.disabled    = false;
        submitBtn.textContent = 'Create Event';
    }
}


// Get Form Data
// Field names match EventRequest DTO exactly
function getCreateFormData() {
    return {
        name: document.getElementById('name').value.trim(),
        description: document.getElementById('description').value.trim(),
        eventDate: document.getElementById('eventDate').value,
        eventTime: document.getElementById('eventTime').value,
        venue: document.getElementById('venue').value.trim(),
        totalSeats: parseInt(document.getElementById('totalSeats').value, 10),
        ticketPrice: document.getElementById('ticketPrice').value ? parseFloat(document.getElementById('ticketPrice').value) : null,
        category: document.getElementById('category').value || null,
    };
}


// Form Validation
function validateCreateForm() {
    var hasError = false;

    // Event name
    var nameErr = Utils.validateEventName(
        document.getElementById('name').value.trim()
    );
    if (nameErr) {
        showCreateError('name', nameErr);
        hasError = true;
    }

    // Description
    var desc = document.getElementById('description').value.trim();
    if (!desc) {
        showCreateError('description', 'Description is required.');
        hasError = true;
    } else if (desc.length < 10) {
        showCreateError('description', 'Description must be at least 10 characters.');
        hasError = true;
    }

    // Date
    var dateErr = Utils.validateFutureDate(
        document.getElementById('eventDate').value
    );
    if (dateErr) {
        showCreateError('eventDate', dateErr);
        hasError = true;
    }

    // Time
    var timeVal = document.getElementById('eventTime').value;
    var dateVal = document.getElementById('eventDate').value;

    if (!timeVal) {
        showCreateError('eventTime', 'Event time is required.');
        hasError = true;
    } else if (dateVal) {
        var dt = new Date(dateVal + 'T' + timeVal);
        if (dt <= new Date()) {
            showCreateError('eventTime', 'Event date and time must be in the future.');
            hasError = true;
        }
    }

    // Venue
    var venueErr = Utils.validateVenue(
        document.getElementById('venue').value.trim()
    );
    if (venueErr) {
        showCreateError('venue', venueErr);
        hasError = true;
    }

    // Total seats
    var seatsErr = Utils.validateTotalSeats(
        document.getElementById('totalSeats').value
    );
    if (seatsErr) {
        showCreateError('totalSeats', seatsErr);
        hasError = true;
    }

    // Ticket price
    var priceVal = document.getElementById('ticketPrice').value;
    if (priceVal && parseFloat(priceVal) < 0) {
        showCreateError('ticketPrice', 'Price cannot be negative.');
        hasError = true;
    }

    return !hasError;
}


// Backend Error Handling
// Handles @Valid field errors from backend
function handleCreateServerError(res) {
    if (res.data && typeof res.data === 'object' && !res.data.message) {
        Object.keys(res.data).forEach(function(field) {
            showCreateError(field, res.data[field]);
        });
    } else {
        var msg = res.message || 'Failed to create event.';
        Utils.showNotification(msg, 'error');
    }
}


// Field Error Helpers
function showCreateError(fieldId, msg) {
    var errEl = document.getElementById(fieldId + 'Error');
    var input = document.getElementById(fieldId);
    if (errEl) errEl.textContent = msg;
    if (input) input.classList.add('has-error');
}

function clearAllCreateErrors() {
    document.querySelectorAll('.error-text').forEach(function(el) {
        el.textContent = '';
    });
    document.querySelectorAll('.has-error').forEach(function(el) {
        el.classList.remove('has-error');
    });
}


// Success Modal
function openSuccessModal() {
    var modal = document.getElementById('successModal');
    if (modal) modal.classList.remove('hidden');
}

function closeSuccessModal() {
    var modal = document.getElementById('successModal');
    if (modal) modal.classList.add('hidden');
}

// Reset Form
function resetCreateForm() {
    var form = document.getElementById('createEventForm');
    if (form) form.reset();

    clearAllCreateErrors();

    var dateInput = document.getElementById('eventDate');
    if (dateInput) dateInput.min = new Date().toISOString().split('T')[0];
}