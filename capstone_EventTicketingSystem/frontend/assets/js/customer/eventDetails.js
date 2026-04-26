/**
 * Customer Event Details
 * Handles event info display and seat availability
 */


// Authentication
if (!Utils.requireAuth(CONFIG.ROLES.CUSTOMER)) {
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
var currentEvent = null;



// Initialization
document.addEventListener('DOMContentLoaded', function () {
    if (!document.getElementById('eventDetailsContainer')) return;

    // Get event id from URL
    var params = new URLSearchParams(window.location.search);
    var eventId = parseInt(params.get('id'), 10);

    if (!eventId || isNaN(eventId)) {
        showErrorState();
        return;
    }

    loadEventDetails(eventId);
});



// Load Event Details
// Calls: GET /api/events/{id}
async function loadEventDetails(eventId) {
    showDetailsLoading();

    try {
        var res = await API.getEventById(eventId);

        if (res.success && res.data) {
            currentEvent = res.data;
            renderEventDetails(currentEvent);
        } else {
            showErrorState();
        }

    } catch (err) {
        console.error('Load event details error:', err);
        showErrorState();
    }
}


// Render Event Details
function renderEventDetails(event) {
    var available = (event.totalSeats || 0) - (event.bookedSeats || 0);
    var pct = event.totalSeats
        ? Math.round((event.bookedSeats || 0) / event.totalSeats * 100)
        : 0;

    // Info card header
    document.getElementById('eventName').textContent = event.name || 'Untitled Event';
    document.getElementById('eventCategory').textContent = event.category || 'General';

    // Info rows
    document.getElementById('eventDate').textContent = Utils.formatDate(event.eventDate);
    document.getElementById('eventTime').textContent = Utils.formatTime(event.eventTime);
    document.getElementById('eventVenue').textContent = event.venue || '-';
    document.getElementById('eventPrice').textContent = event.ticketPrice
        ? '₹' + event.ticketPrice
        : 'Free';
    document.getElementById('eventStatus').textContent = event.status || '-';
    document.getElementById('eventDescription').textContent = event.description
        || 'No description available.';

    // Seat tiles
    document.getElementById('totalSeats').textContent = event.totalSeats || 0;
    document.getElementById('bookedSeats').textContent = event.bookedSeats || 0;
    document.getElementById('availableSeats').textContent = available;

    // Availability bar
    var bar = document.getElementById('availBar');
    if (bar) bar.style.width = pct + '%';

    // Sidebar summary
    var sidebarPrice = document.getElementById('sidebarPrice');
    if (sidebarPrice) {
        sidebarPrice.textContent = event.ticketPrice
            ? '₹' + event.ticketPrice
            : 'Free';
    }

    var sidebarCategory = document.getElementById('sidebarCategory');
    if (sidebarCategory) {
        sidebarCategory.textContent = event.category || 'General';
    }

    showDetailsContent();
}



// UI State Helpers
function showDetailsLoading() {
    document.getElementById('loadingState').classList.remove('hidden');
    document.getElementById('eventDetailsContainer').classList.add('hidden');
    document.getElementById('errorState').classList.add('hidden');
}

function showDetailsContent() {
    document.getElementById('loadingState').classList.add('hidden');
    document.getElementById('eventDetailsContainer').classList.remove('hidden');
    document.getElementById('errorState').classList.add('hidden');
}

function showErrorState() {
    document.getElementById('loadingState').classList.add('hidden');
    document.getElementById('eventDetailsContainer').classList.add('hidden');
    document.getElementById('errorState').classList.remove('hidden');
}