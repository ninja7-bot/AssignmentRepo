/**
 * Organizer My Events
 * Handles: event list, filter, search, edit modal, capacity modal, cancel modal
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
    logoutBtn.addEventListener('click', function (e) {
        e.preventDefault();
        Utils.logout();
    });
}


// States
var allMyEvents = [];
var currentFilter = 'all';
var currentSearch = '';
var selectedEventId = null;


// Initialization
document.addEventListener('DOMContentLoaded', function () {
    if (!document.getElementById('eventsContainer')) return;
    if (!document.getElementById('editModal')) return;

    initMyEventsPage();
});


// Page Initialization
function initMyEventsPage() {
    bindSearchInput();
    bindTabButtons();
    bindModalCloseButtons();
    bindModalActionButtons();
    bindBackdropClose();

    loadMyEvents();
}


// Bind Search Input
function bindSearchInput() {
    var searchInput = document.getElementById('searchInput');
    if (!searchInput) return;

    searchInput.addEventListener('input', function (e) {
        currentSearch = e.target.value.trim().toLowerCase();
        applyFilterAndSearch();
    });
}


// Bind Tab Buttons
function bindTabButtons() {
    var tabs = document.querySelectorAll('.tab-btn');

    tabs.forEach(function (tab) {
        tab.addEventListener('click', function () {
            currentFilter = tab.dataset.filter;
            updateActiveTabs();
            applyFilterAndSearch();
        });
    });
}


// Bind Modal Close Buttons
function bindModalCloseButtons() {
    var pairs = [
        ['closeEditBtn', 'editModal'],
        ['cancelEditBtn', 'editModal'],
        ['closeCapBtn', 'capModal'],
        ['cancelCapBtn', 'capModal'],
        ['closeCancelBtn', 'cancelModal'],
        ['keepEventBtn', 'cancelModal']
    ];

    pairs.forEach(function (pair) {
        var btn = document.getElementById(pair[0]);
        if (btn) {
            btn.addEventListener('click', function () {
                closeOrgModal(pair[1]);
            });
        }
    });
}


// Bind Modal Action Buttons
function bindModalActionButtons() {
    var saveEditBtn = document.getElementById('saveEditBtn');
    if (saveEditBtn) {
        saveEditBtn.addEventListener('click', saveEdit);
    }

    var saveCapBtn = document.getElementById('saveCapBtn');
    if (saveCapBtn) {
        saveCapBtn.addEventListener('click', saveCapacity);
    }

    var confirmCancelBtn = document.getElementById('confirmCancelBtn');
    if (confirmCancelBtn) {
        confirmCancelBtn.addEventListener('click', confirmCancelEvent);
    }
}


// Close Modal on Backdrop
function bindBackdropClose() {
    document.addEventListener('click', function (e) {
        if (e.target.classList.contains('modal-backdrop')) {
            e.target.classList.add('hidden');
        }
    });
}


// Modal Helpers
function openOrgModal(id) {
    var el = document.getElementById(id);
    if (el) el.classList.remove('hidden');
}

function closeOrgModal(id) {
    var el = document.getElementById(id);
    if (el) el.classList.add('hidden');
}


// HTML Escape
function myEscHtml(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}



// Load My Events
// Calls: GET /api/events/my-events
async function loadMyEvents() {
    showLoadingState();

    try {
        var res = await API.getMyEvents();

        if (res.success && Array.isArray(res.data)) {
            allMyEvents = res.data;
            applyFilterAndSearch();
        } else {
            showEventsLoadError();
        }

    } catch (err) {
        console.error('Load my events error:', err);
        showEventsLoadError();
    }
}



// Filter and Search
function updateActiveTabs() {
    document.querySelectorAll('.tab-btn').forEach(function (tab) {
        tab.classList.toggle('active', tab.dataset.filter === currentFilter);
    });
}

function applyFilterAndSearch() {
    var now = new Date();
    var filtered = allMyEvents;

    if (currentFilter === 'ACTIVE') {
        filtered = allMyEvents.filter(function (e) {
            return e.status === 'ACTIVE' && new Date(e.eventDate) >= now;
        });
    } else if (currentFilter === 'COMPLETED') {
        filtered = allMyEvents.filter(function (e) {
            return e.status !== 'CANCELLED' && new Date(e.eventDate) < now;
        });
    } else if (currentFilter === 'CANCELLED') {
        filtered = allMyEvents.filter(function (e) {
            return e.status === 'CANCELLED';
        });
    }

    if (currentSearch) {
        filtered = filtered.filter(function (e) {
            var text = (
                (e.name || '') + ' ' +
                (e.venue || '') + ' ' +
                (e.category || '')
            ).toLowerCase();
            return text.indexOf(currentSearch) >= 0;
        });
    }

    filtered.sort(function (a, b) {
        return new Date(b.eventDate) - new Date(a.eventDate);
    });

    renderMyEvents(filtered);
    updateResultsCount(filtered.length);
}

function updateResultsCount(count) {
    var countEl = document.getElementById('resultsCount');
    if (countEl) {
        countEl.textContent = count + ' event' + (count === 1 ? '' : 's');
    }
}



// Render Event List
function renderMyEvents(events) {
    var container = document.getElementById('eventsContainer');
    if (!container) return;

    if (events.length === 0) {
        container.innerHTML = '' +
            '<div class="state-empty">' +
            '<h3>No Events Found</h3>' +
            '<p>No events match your current filter.</p>' +
            '<a href="create-event.html" class="btn btn-primary btn-sm">Create Event</a>' +
            '</div>';
        return;
    }

    var html = events.map(buildEventRowHtml).join('');

    container.innerHTML = '<div class="events-list">' + html + '</div>';
}


// Build Event Rows in HTML
function buildEventRowHtml(event) {
    var isPast = Utils.isEventPast(event.eventDate, event.eventTime);
    var label = event.status === 'CANCELLED' ? 'CANCELLED' : (isPast ? 'COMPLETED' : event.status);
    var cls = label === 'CANCELLED' ? 'cancelled' : (label === 'COMPLETED' ? 'completed' : 'active');

    var booked = event.bookedSeats || 0;
    var available = (event.totalSeats || 0) - booked;
    var pct = event.totalSeats ? Math.round((booked / event.totalSeats) * 100) : 0;

    var canEdit = Utils.canEditEvent(event.eventDate, event.eventTime) && event.status === 'ACTIVE';
    var canCancel = label === 'ACTIVE';

    return '' +
        '<div class="event-row ' + cls + '">' +

        '<div class="event-row-top">' +
        '<div>' +
        '<h3 class="event-row-name">' + myEscHtml(event.name) + '</h3>' +
        '<div class="event-row-sub">' +
        '<span>📅 ' + Utils.formatDate(event.eventDate) + '</span>' +
        '<span>🕐 ' + Utils.formatTime(event.eventTime) + '</span>' +
        '<span>📍 ' + myEscHtml(event.venue || '-') + '</span>' +
        '</div>' +
        '</div>' +
        '<span class="pill pill-' + cls + '">' + label + '</span>' +
        '</div>' +

        '<div class="event-row-details">' +
        '<div class="detail-chip">' +
        '<span class="chip-label">Category</span>' +
        '<span class="chip-value">' + myEscHtml(event.category || 'General') + '</span>' +
        '</div>' +
        '<div class="detail-chip">' +
        '<span class="chip-label">Price</span>' +
        '<span class="chip-value">' +
        (event.ticketPrice ? '₹' + event.ticketPrice : 'Free') +
        '</span>' +
        '</div>' +
        '<div class="detail-chip">' +
        '<span class="chip-label">Booked</span>' +
        '<span class="chip-value">' + booked + '</span>' +
        '</div>' +
        '<div class="detail-chip">' +
        '<span class="chip-label">Available</span>' +
        '<span class="chip-value">' + available + '</span>' +
        '</div>' +
        '</div>' +

        '<div class="event-row-bottom">' +
        '<div class="event-row-stats">' +
        '<span><strong>' + (event.totalSeats || 0) + '</strong> total seats</span>' +
        '<span><strong>' + pct + '%</strong> filled</span>' +
        '</div>' +
        '<div class="event-row-actions">' +
        (canEdit
            ? '<button class="btn btn-primary btn-sm" onclick="openEditModal(' + event.id + ')">Edit</button>'
            : '') +
        (label !== 'CANCELLED'
            ? '<button class="btn btn-outline btn-sm" onclick="openCapModal(' + event.id + ')">Capacity</button>'
            : '') + (canCancel
                ? '<button class="btn btn-danger btn-sm" onclick="openCancelModal(' + event.id + ')">Cancel</button>'
                : '') +
        '</div>' +
        '</div>' +

        '</div>';
}


//  Edit Modal
//  Calls: PUT /api/events/{id}
function openEditModal(eventId) {
    var event = findEvent(eventId);
    if (!event) return;

    selectedEventId = eventId;
    clearEditErrors();

    document.getElementById('editName').value = event.name || '';
    document.getElementById('editDesc').value = event.description || '';
    document.getElementById('editDate').value = Utils.toDateInput(event.eventDate);
    document.getElementById('editTime').value = Utils.toTimeInput(event.eventTime);
    document.getElementById('editVenue').value = event.venue || '';
    document.getElementById('editSeats').value = event.totalSeats || '';
    document.getElementById('editTicketPrice').value = event.ticketPrice || '';

    openOrgModal('editModal');
}

async function saveEdit() {
    clearEditErrors();

    var event = findEvent(selectedEventId);
    if (!event) return;

    var payload = {
        name: document.getElementById('editName').value.trim(),
        description: document.getElementById('editDesc').value.trim(),
        eventDate: document.getElementById('editDate').value,
        eventTime: document.getElementById('editTime').value,
        venue: document.getElementById('editVenue').value.trim(),
        totalSeats: document.getElementById('editSeats').value,
        ticketPrice: document.getElementById('editTicketPrice').value.trim(),

        // Not editing
        category: event.category,
    };

    // Validate
    var hasError = false;

    if (!payload.name) {
        showEditError('editName', 'Event name is required.');
        hasError = true;
    }
    if (!payload.description || payload.description.length < 10) {
        showEditError('editDesc', 'Description must be at least 10 characters.');
        hasError = true;
    }
    if (!payload.eventDate) {
        showEditError('editDate', 'Date is required.');
        hasError = true;
    }
    if (!payload.eventTime) {
        showEditError('editTime', 'Time is required.');
        hasError = true;
    }
    if (payload.eventDate && payload.eventTime) {
        var dt = new Date(payload.eventDate + 'T' + payload.eventTime);
        if (dt <= new Date()) {
            showEditError('editTime', 'Must be in the future.');
            hasError = true;
        }
    }
    if (!payload.venue) {
        showEditError('editVenue', 'Venue is required.');
        hasError = true;
    }
    if (!payload.totalSeats) {
        showEditError('editSeats', 'Total Seats are required.');
        hasError = true;
    }
    if (!payload.ticketPrice) {
        showEditError('editTicketPrice', 'Ticket Price is required.');
        hasError = true;
    }

    if (hasError) return;

    var saveBtn = document.getElementById('saveEditBtn');
    saveBtn.disabled = true;
    saveBtn.textContent = 'Saving...';

    try {
        var res = await API.updateEvent(selectedEventId, payload);

        if (res.success) {
            closeOrgModal('editModal');
            Utils.showNotification('Event updated!', 'success');
            await loadMyEvents();
        } else {
            Utils.showNotification(res.message || 'Update failed.', 'error');
        }

    } catch (err) {
        console.error('Save edit error:', err);
        Utils.showNotification('Something went wrong.', 'error');

    } finally {
        saveBtn.disabled = false;
        saveBtn.textContent = 'Save Changes';
    }
}

function showEditError(fieldId, msg) {
    var el = document.getElementById(fieldId + 'Error');
    if (el) el.textContent = msg;
}

function clearEditErrors() {
    ['editName', 'editDesc', 'editDate', 'editTime', 'editVenue'].forEach(function (id) {
        var el = document.getElementById(id + 'Error');
        if (el) el.textContent = '';
    });
}


//  CAPACITY MODAL
//  No separate capacity endpoint in controller
//  Uses PUT /api/events/{id} with full payload
function openCapModal(eventId) {
    var event = findEvent(eventId);
    if (!event) return;

    selectedEventId = eventId;

    var booked = event.bookedSeats || 0;
    var available = (event.totalSeats || 0) - booked;

    document.getElementById('capTotal').textContent = event.totalSeats || 0;
    document.getElementById('capBooked').textContent = booked;
    document.getElementById('capAvailable').textContent = available;
    document.getElementById('newSeats').value = event.totalSeats || 0;
    document.getElementById('newSeatsError').textContent = '';

    openOrgModal('capModal');
}

async function saveCapacity() {
    var newSeats = parseInt(document.getElementById('newSeats').value, 10);
    var booked = parseInt(document.getElementById('capBooked').textContent, 10);
    var errEl = document.getElementById('newSeatsError');

    errEl.textContent = '';

    var seatsErr = Utils.validateTotalSeats(newSeats);
    if (seatsErr) {
        errEl.textContent = seatsErr;
        return;
    }

    if (newSeats < booked) {
        errEl.textContent = 'Cannot be less than ' + booked + ' (already booked).';
        return;
    }

    var event = findEvent(selectedEventId);
    if (!event) return;

    var saveBtn = document.getElementById('saveCapBtn');
    saveBtn.disabled = true;
    saveBtn.textContent = 'Updating...';

    try {
        // Send full EventRequest payload with updated totalSeats
        // Matches PUT /api/events/{id} in EventController
        var payload = {
            name: event.name,
            description: event.description,
            eventDate: event.eventDate,
            eventTime: event.eventTime,
            venue: event.venue,
            totalSeats: newSeats,
            ticketPrice: event.ticketPrice,
            category: event.category,
        };

        var res = await API.updateEvent(selectedEventId, payload);

        if (res.success) {
            closeOrgModal('capModal');
            Utils.showNotification('Capacity updated!', 'success');
            await loadMyEvents();
        } else {
            Utils.showNotification(res.message || 'Update failed.', 'error');
        }

    } catch (err) {
        console.error('Save capacity error:', err);
        Utils.showNotification('Something went wrong.', 'error');

    } finally {
        saveBtn.disabled = false;
        saveBtn.textContent = 'Update Capacity';
    }
}


//  Cancel Modal
//  Calls: DELETE /api/events/{id}
function openCancelModal(eventId) {
    var event = findEvent(eventId);
    if (!event) return;

    selectedEventId = eventId;
    document.getElementById('cancelName').textContent = event.name || 'this event';

    openOrgModal('cancelModal');
}

async function confirmCancelEvent() {
    var btn = document.getElementById('confirmCancelBtn');
    btn.disabled = true;
    btn.textContent = 'Cancelling...';

    try {
        var res = await API.cancelEvent(selectedEventId);

        if (res.success) {
            closeOrgModal('cancelModal');
            Utils.showNotification('Event cancelled.', 'success');
            await loadMyEvents();
        } else {
            Utils.showNotification(res.message || 'Cancel failed.', 'error');
        }

    } catch (err) {
        console.error('Cancel event error:', err);
        Utils.showNotification('Something went wrong.', 'error');

    } finally {
        btn.disabled = false;
        btn.textContent = 'Yes, Cancel Event';
    }
}


//  UI States
function showLoadingState() {
    var container = document.getElementById('eventsContainer');
    if (container) {
        container.innerHTML =
            '<div class="state-loading">Loading your events...</div>';
    }
}

function showEventsLoadError() {
    var container = document.getElementById('eventsContainer');
    if (container) {
        container.innerHTML = '' +
            '<div class="state-empty">' +
            '<h3>Could not load events</h3>' +
            '<p>Please try again later.</p>' +
            '</div>';
    }
}


//  Helper Functions
function findEvent(id) {
    return allMyEvents.find(function (e) { return e.id === id; }) || null;
}