/**
 * Public Browse Page
 * Handles event listing, search, filter, and detail expand
 * No login required
 */


// If logged in, show dashboard link.
document.addEventListener('DOMContentLoaded', function () {
    updateNavForUser();
    bindSearchAndFilter();
    loadPublicEvents();
});



// Nav based on login status
function updateNavForUser() {
    var authLinks = document.getElementById('authLinks');
    var userLinks = document.getElementById('userLinks');

    if (!authLinks || !userLinks) return;

    if (typeof Utils !== 'undefined' && Utils.isLoggedIn()) {
        // User is logged in — show dashboard link
        authLinks.classList.add('hidden');
        userLinks.classList.remove('hidden');

        var dashLink = document.getElementById('dashboardLink');
        var nameEl = document.getElementById('publicUserName');

        if (dashLink) {
            var role = Utils.getUserRole();
            if (role === 'ORGANIZER') {
                dashLink.href = '../organizer/dashboard.html';
                dashLink.textContent = 'Organizer Dashboard';
            } else {
                dashLink.href = '../customer/dashboard.html';
                dashLink.textContent = 'My Dashboard';
            }
        }

        if (nameEl) {
            nameEl.textContent = Utils.getUserName();
        }
    } else {
        // Not logged in — show login/register links
        authLinks.classList.remove('hidden');
        userLinks.classList.add('hidden');
    }
}


// States
var publicEvents = [];
var selectedDetail = null;


// Bind Search and Filter
function bindSearchAndFilter() {
    var searchInput = document.getElementById('searchInput');
    var categoryFilter = document.getElementById('categoryFilter');
    var searchBtn = document.getElementById('searchBtn');
    var clearBtn = document.getElementById('clearBtn');

    if (searchInput) {
        searchInput.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') filterPublicEvents();
        });
    }

    if (categoryFilter) {
        categoryFilter.addEventListener('change', function () {
            filterPublicEvents();
        });
    }

    if (searchBtn) {
        searchBtn.addEventListener('click', function () {
            filterPublicEvents();
        });
    }

    if (clearBtn) {
        clearBtn.addEventListener('click', function () {
            if (searchInput) searchInput.value = '';
            if (categoryFilter) categoryFilter.value = '';
            renderPublicEvents(publicEvents);
        });
    }
}


// Load Events
// Calls: GET /api/events (public, no auth)
async function loadPublicEvents() {
    var container = document.getElementById('eventsContainer');
    if (!container) return;

    container.innerHTML = '<div class="state-loading">Loading events...</div>';

    // Hide detail panel if open
    hideDetailPanel();

    try {
        var res = await API.getEvents();

        if (res.success && Array.isArray(res.data)) {
            publicEvents = res.data;
            renderPublicEvents(publicEvents);
        } else {
            container.innerHTML = '' +
                '<div class="state-empty">' +
                '<h3>Could not load events</h3>' +
                '<p>Please try again later.</p>' +
                '</div>';
        }

    } catch (err) {
        console.error('Load public events error:', err);
        container.innerHTML = '' +
            '<div class="state-empty">' +
            '<h3>Something went wrong</h3>' +
            '<p>Please refresh the page.</p>' +
            '</div>';
    }
}


// Filter Events (client side)
function filterPublicEvents() {
    var searchInput = document.getElementById('searchInput');
    var categoryFilter = document.getElementById('categoryFilter');

    var search = searchInput ? searchInput.value.trim().toLowerCase() : '';
    var category = categoryFilter ? categoryFilter.value.trim().toLowerCase() : '';

    var filtered = publicEvents.filter(function (event) {
        var matchSearch = !search ||
            (event.name || '').toLowerCase().indexOf(search) >= 0 ||
            (event.venue || '').toLowerCase().indexOf(search) >= 0 ||
            (event.description || '').toLowerCase().indexOf(search) >= 0;

        var matchCategory = !category ||
            (event.category || '').toLowerCase() === category;

        return matchSearch && matchCategory;
    });

    renderPublicEvents(filtered);
}


// Render Events Grid
function renderPublicEvents(events) {
    var container = document.getElementById('eventsContainer');
    var resultsEl = document.getElementById('resultsCount');
    if (!container) return;

    // Hide detail panel
    hideDetailPanel();

    // Update count
    if (resultsEl) {
        resultsEl.innerHTML = '<strong>' + events.length + '</strong> event' +
            (events.length === 1 ? '' : 's') + ' found';
    }

    if (events.length === 0) {
        container.innerHTML = '' +
            '<div class="state-empty">' +
            '<h3>No Events Found</h3>' +
            '<p>Try a different search or check back later.</p>' +
            '</div>';
        return;
    }

    var html = events.map(buildPublicCardHtml).join('');

    container.innerHTML = '<div class="events-grid">' + html + '</div>';
}


// Build Event Details Card
function buildPublicCardHtml(event) {
    var available = (event.totalSeats || 0) - (event.bookedSeats || 0);
    var soldOut = available <= 0;

    var seatsHtml = soldOut
        ? '<span class="seats-low">Sold Out</span>'
        : (available <= 10
            ? '<span class="seats-low">' + available + ' seats left</span>'
            : '<span>' + available + ' seats left</span>');

    var priceHtml = event.ticketPrice ? '₹' + event.ticketPrice : 'Free';

    var desc = event.description
        ? pubEscHtml(event.description).substring(0, 80) + '...'
        : '';

    return '' +
        '<div class="event-card">' +
        '<div class="event-card-top">' +
        '<h3>' + pubEscHtml(event.name) + '</h3>' +
        '<div class="event-card-category">' + (event.category || 'General') + '</div>' +
        '</div>' +
        '<div class="event-card-body">' +
        (desc ? '<div class="event-description">' + desc + '</div>' : '') +
        '<div class="event-detail-row">' +
        '<span>Date</span>' +
        '<span>' + Utils.formatDate(event.eventDate) + '</span>' +
        '</div>' +
        '<div class="event-detail-row">' +
        '<span>Time</span>' +
        '<span>' + Utils.formatTime(event.eventTime) + '</span>' +
        '</div>' +
        '<div class="event-detail-row">' +
        '<span>Venue</span>' +
        '<span>' + pubEscHtml(event.venue || '-') + '</span>' +
        '</div>' +
        '<div class="event-detail-row">' +
        '<span>Seats</span>' +
        seatsHtml +
        '</div>' +
        '</div>' +
        '<div class="event-card-footer">' +
        '<span class="event-price">' + priceHtml + '</span>' +
        '<button class="btn btn-outline btn-sm" onclick="showEventDetail(' + event.id + ')">View Details</button>' +
        '</div>' +
        '</div>';
}


// Event Details Panel
// Shows inline detail below the cards
function showEventDetail(eventId) {
    var event = publicEvents.find(function (e) { return e.id === eventId; });
    if (!event) return;

    selectedDetail = event;

    var available = (event.totalSeats || 0) - (event.bookedSeats || 0);
    var isLoggedIn = typeof Utils !== 'undefined' && Utils.isLoggedIn();
    var userRole = isLoggedIn ? Utils.getUserRole() : null;

    var loginPrompt = '';

    if (!isLoggedIn) {
        loginPrompt = '' +
            '<div class="login-prompt">' +
            '<span>Login to book tickets →</span>' +
            '<a href="../auth/login.html" class="btn btn-primary btn-sm">Login</a>' +
            '<a href="../auth/register.html" class="btn btn-outline btn-sm">Register</a>' +
            '</div>';
    } else if (userRole === 'CUSTOMER') {
        loginPrompt = '' +
            '<div class="login-prompt">' +
            '<a href="../customer/event-details.html?id=' + event.id + '" class="btn btn-primary btn-sm">View Full Details</a>' +
            '</div>';
    } else {
        loginPrompt = '' +
            '<div class="login-prompt">' +
            '<span>You are logged in as an organizer.</span>' +
            '</div>';
    }

    var html = '' +
        '<div class="event-detail-panel">' +
        '<div class="detail-panel-header">' +
        '<h2>' + pubEscHtml(event.name) + '</h2>' +
        '<div class="event-cat">' + (event.category || 'General') + '</div>' +
        '</div>' +
        '<div class="detail-panel-body">' +
        '<div class="detail-grid">' +
        '<div class="detail-item">' +
        '<span class="detail-item-label">Date</span>' +
        '<span class="detail-item-value">' + Utils.formatDate(event.eventDate) + '</span>' +
        '</div>' +
        '<div class="detail-item">' +
        '<span class="detail-item-label">Time</span>' +
        '<span class="detail-item-value">' + Utils.formatTime(event.eventTime) + '</span>' +
        '</div>' +
        '<div class="detail-item">' +
        '<span class="detail-item-label">Venue</span>' +
        '<span class="detail-item-value">' + pubEscHtml(event.venue || '-') + '</span>' +
        '</div>' +
        '<div class="detail-item">' +
        '<span class="detail-item-label">Price</span>' +
        '<span class="detail-item-value">' + (event.ticketPrice ? '₹' + event.ticketPrice : 'Free') + '</span>' +
        '</div>' +
        '<div class="detail-item">' +
        '<span class="detail-item-label">Status</span>' +
        '<span class="detail-item-value">' +
        '<span class="pill pill-active">' + (event.status || 'ACTIVE') + '</span>' +
        '</span>' +
        '</div>' +
        '</div>' +
        (event.description
            ? '<div class="detail-desc">' +
            '<h4>About this Event</h4>' +
            '<p>' + pubEscHtml(event.description) + '</p>' +
            '</div>'
            : '') +
        '</div>' +
        '<div class="detail-panel-footer">' +
        '<div class="seat-summary">' +
        '<span>Total: <strong>' + (event.totalSeats || 0) + '</strong></span>' +
        '<span>Booked: <strong>' + (event.bookedSeats || 0) + '</strong></span>' +
        '<span>Available: <strong>' + available + '</strong></span>' +
        '</div>' +
        loginPrompt +
        '</div>' +
        '</div>';

    var detailContainer = document.getElementById('detailContainer');
    if (detailContainer) {
        detailContainer.innerHTML = html;
        detailContainer.classList.remove('hidden');

        // Scroll to detail panel
        detailContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

function hideDetailPanel() {
    var detailContainer = document.getElementById('detailContainer');
    if (detailContainer) {
        detailContainer.innerHTML = '';
        detailContainer.classList.add('hidden');
    }
    selectedDetail = null;
}


// HTML Escape
function pubEscHtml(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}