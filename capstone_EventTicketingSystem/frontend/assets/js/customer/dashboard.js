/**
 * Customer Dashboard
 * Handles browse events, search, and filter
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
    logoutBtn.addEventListener('click', function(e) {
        e.preventDefault();
        Utils.logout();
    });
}


// State
var allEvents     = [];
var selectedEvent = null;


// Initialization
document.addEventListener('DOMContentLoaded', function() {
    if (!document.getElementById('eventsContainer')) return;

    bindSearchAndFilter();
    loadEvents();
});


// Bind Search and Filter
function bindSearchAndFilter() {
    var searchInput    = document.getElementById('searchInput');
    var categoryFilter = document.getElementById('categoryFilter');
    var searchBtn      = document.getElementById('searchBtn');

    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') filterEvents();
        });
    }

    if (categoryFilter) {
        categoryFilter.addEventListener('change', function() {
            filterEvents();
        });
    }

    if (searchBtn) {
        searchBtn.addEventListener('click', function() {
            filterEvents();
        });
    }

    var clearBtn = document.getElementById('clearBtn');
    if (clearBtn) {
        clearBtn.addEventListener('click', function() {
            if (searchInput)    searchInput.value    = '';
            if (categoryFilter) categoryFilter.value = '';
            renderEvents(allEvents);
        });
    }
}


// Load Events
// Calls: GET /api/events
async function loadEvents() {
    var container = document.getElementById('eventsContainer');
    if (!container) return;

    container.innerHTML = '<div class="state-loading">Loading events...</div>';

    try {
        var res = await API.getEvents();

        if (res.success && Array.isArray(res.data)) {
            allEvents = res.data;
            renderEvents(allEvents);
        } else {
            container.innerHTML = '' +
                '<div class="state-empty">' +
                    '<h3>Could not load events</h3>' +
                    '<p>Please try again later.</p>' +
                '</div>';
        }

    } catch (err) {
        console.error('Load events error:', err);
        container.innerHTML = '' +
            '<div class="state-empty">' +
                '<h3>Something went wrong</h3>' +
                '<p>Please refresh the page.</p>' +
            '</div>';
    }
}


// Filter Events (client side)
function filterEvents() {
    var searchInput    = document.getElementById('searchInput');
    var categoryFilter = document.getElementById('categoryFilter');

    var search   = searchInput    ? searchInput.value.trim().toLowerCase()    : '';
    var category = categoryFilter ? categoryFilter.value.trim().toLowerCase() : '';

    var filtered = allEvents.filter(function(event) {
        var matchSearch = !search ||
            (event.name || '').toLowerCase().indexOf(search) >= 0 ||
            (event.venue     || '').toLowerCase().indexOf(search) >= 0 ||
            (event.description || '').toLowerCase().indexOf(search) >= 0;

        var matchCategory = !category ||
            (event.category || '').toLowerCase() === category;

        return matchSearch && matchCategory;
    });

    renderEvents(filtered);
}


// Render Events Grid
function renderEvents(events) {
    var container = document.getElementById('eventsContainer');
    if (!container) return;

    if (events.length === 0) {
        container.innerHTML = '' +
            '<div class="state-empty">' +
                '<h3>No Events Found</h3>' +
                '<p>Try a different search or check back later.</p>' +
            '</div>';
        return;
    }

    var html = events.map(buildEventCardHtml).join('');

    container.innerHTML = '<div class="events-grid">' + html + '</div>';
}


// Build Event Cards
function buildEventCardHtml(event) {
    var available = (event.totalSeats || 0) - (event.bookedSeats || 0);
    var soldOut   = available <= 0;

    var seatsHtml = soldOut
        ? '<span class="seats-low">Sold Out</span>'
        : (available <= 10
            ? '<span class="seats-low">' + available + ' seats left</span>'
            : '<span>' + available + ' seats left</span>');

    var priceHtml = event.ticketPrice ? '₹' + event.ticketPrice : 'Free';

    var desc = event.description
        ? custEscHtml(event.description).substring(0, 80) + '...'
        : '';

    var bookBtn = soldOut
        ? '<button class="btn btn-secondary" disabled>Sold Out</button>'
        : '<button class="btn btn-primary" disabled>Booking Opening Soon</button>';

    return '' +
    '<div class="event-card">' +
        '<div class="event-card-top">' +
            '<h3>' + custEscHtml(event.name) + '</h3>' +
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
                '<span>' + custEscHtml(event.venue || '-') + '</span>' +
            '</div>' +
            '<div class="event-detail-row">' +
                '<span>Seats</span>' +
                seatsHtml +
            '</div>' +
        '</div>' +
        '<div class="event-card-footer">' +
            '<span class="event-price">' + priceHtml + '</span>' +
            '<div style="display: flex; gap: 6px;">' +
                '<button class="btn btn-outline btn-sm" onclick="viewEventDetails(' + event.id + ')">Details</button>' +
                bookBtn +
            '</div>' +
        '</div>' +
    '</div>';
}


// View Event Details
function viewEventDetails(eventId) {
    window.location.href = 'event-details.html?id=' + eventId;
}


// HTML Escape Helpers
function custEscHtml(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}