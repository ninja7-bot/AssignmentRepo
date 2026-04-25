/**
 * Organizer Dashboard
 * Handles stats cards, recent events list
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


// Initialization
document.addEventListener('DOMContentLoaded', function () {
    if (!document.getElementById('statTotal')) return;

    loadDashboardStats();
});


// Load Stats and Recent Events
// Calls: GET /api/events/my-events
async function loadDashboardStats() {
    var statTotal = document.getElementById('statTotal');
    var statActive = document.getElementById('statActive');
    var statBookings = document.getElementById('statBookings');
    var statCancelled = document.getElementById('statCancelled');
    var recentList = document.getElementById('recentList');

    try {
        var res = await API.getMyEvents();

        if (res.success && Array.isArray(res.data)) {
            var events = res.data;
            var now = new Date();

            var active = events.filter(function (e) {
                return e.status === 'ACTIVE' && new Date(e.eventDate) >= now;
            });

            var cancelled = events.filter(function (e) {
                return e.status === 'CANCELLED';
            });

            var totalBooked = events.reduce(function (sum, e) {
                return sum + (e.bookedSeats || 0);
            }, 0);

            if (statTotal) statTotal.textContent = events.length;
            if (statActive) statActive.textContent = active.length;
            if (statBookings) statBookings.textContent = totalBooked;
            if (statCancelled) statCancelled.textContent = cancelled.length;

            renderRecentEvents(events, recentList);

        } else {
            if (statTotal) statTotal.textContent = '0';
            if (statActive) statActive.textContent = '0';
            if (statBookings) statBookings.textContent = '0';
            if (statCancelled) statCancelled.textContent = '0';

            if (recentList) {
                recentList.innerHTML =
                    '<div class="state-empty"><p>Could not load events.</p></div>';
            }
        }

    } catch (err) {
        console.error('Dashboard load error:', err);
    }
}


// Render Recent Events
// Shows upcoming active events first, up to 5
function renderRecentEvents(events, container) {
    if (!container) return;

    if (events.length === 0) {
        container.innerHTML =
            '<div class="state-empty"><p>No events yet.</p></div>';
        return;
    }

    var now = new Date();

    var upcoming = events
        .filter(function (e) {
            return e.status === 'ACTIVE' && new Date(e.eventDate) >= now;
        })
        .sort(function (a, b) {
            return new Date(a.eventDate) - new Date(b.eventDate);
        })
        .slice(0, 5);

    var list = upcoming.length > 0 ? upcoming : events.slice(0, 5);

    var html = list.map(function (event) {
        var isPast = Utils.isEventPast(event.eventDate, event.eventTime);
        var label = event.status === 'CANCELLED' ? 'CANCELLED' : (isPast ? 'COMPLETED' : event.status);
        var cls = label === 'CANCELLED' ? 'cancelled' : (label === 'COMPLETED' ? 'completed' : 'active');
        var available = (event.totalSeats || 0) - (event.bookedSeats || 0);

        return '' +
            '<div class="mini-event">' +
            '<div>' +
            '<div class="mini-event-name">' + dashEscHtml(event.name) + '</div>' +
            '<div class="mini-event-meta">' +
            '<span>📅 ' + Utils.formatDate(event.eventDate) + '</span>' +
            '<span>📍 ' + dashEscHtml(event.venue || '-') + '</span>' +
            '<span>💺 ' + available + ' left</span>' +
            '</div>' +
            '</div>' +
            '<span class="pill pill-' + cls + '">' + label + '</span>' +
            '</div>';
    }).join('');

    container.innerHTML = '<div class="mini-event-list">' + html + '</div>';
}


// Helper
function dashEscHtml(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}