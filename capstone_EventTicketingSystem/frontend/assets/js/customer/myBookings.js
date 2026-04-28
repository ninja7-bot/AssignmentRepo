/**
 * Customer My Bookings
 * Handles bookings table and cancel booking
 */



// Auhentication
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



// Initialization
document.addEventListener('DOMContentLoaded', function() {
    if (!document.getElementById('bookingsContainer')) return;

    loadMyBookings();
});



// Load Customer Bookings
// Calls: GET /api/bookings/my-bookings
async function loadMyBookings() {
    var container = document.getElementById('bookingsContainer');
    if (!container) return;

    container.innerHTML = '<div class="state-loading">Loading your bookings...</div>';

    try {
        var res = await API.getMyBookings();

        if (res.success && Array.isArray(res.data)) {
            renderBookings(res.data);
        } else {
            container.innerHTML = '' +
                '<div class="state-empty">' +
                    '<h3>Could not load bookings</h3>' +
                    '<p>Please try again later.</p>' +
                '</div>';
        }

    } catch (err) {
        console.error('Load bookings error:', err);
        container.innerHTML = '' +
            '<div class="state-empty">' +
                '<h3>Something went wrong</h3>' +
                '<p>Please refresh the page.</p>' +
            '</div>';
    }
}



// Rendner Bookings Table
function renderBookings(bookings) {
    var container = document.getElementById('bookingsContainer');
    if (!container) return;

    if (bookings.length === 0) {
        container.innerHTML = '' +
            '<div class="state-empty">' +
                '<h3>No Bookings Yet</h3>' +
                '<p>You haven\'t booked any tickets yet.</p>' +
                '<a href="dashboard.html" class="btn btn-primary">Browse Events</a>' +
            '</div>';
        return;
    }

    var rows = bookings.map(function(b) {
        var status  = b.bookingStatus || 'UNKNOWN';
        var pillCls = getPillClass(status);
        var canCancel = status === 'CONFIRMED';

        var amount = b.totalAmount
            ? '₹' + b.totalAmount
            : 'Free';

        var cancelBtn = canCancel
            ? '<button class="btn btn-danger btn-sm" onclick="cancelBooking(' + b.id + ')">Cancel</button>'
            : '<span class="pill pill-' + pillCls + '">' + status + '</span>';

        return '' +
            '<tr>' +
                '<td>' + bkEscHtml(b.eventName || '-') + '</td>' +
                '<td>' + Utils.formatDate(b.eventDate) + '</td>' +
                '<td>' + bkEscHtml(b.venue || '-') + '</td>' +
                '<td>' + (b.numberOfTickets || '-') + '</td>' +
                '<td>' + amount + '</td>' +
                '<td>' + Utils.formatDateTime(b.bookingDate || b.createdAt) + '</td>' +
                '<td>' + cancelBtn + '</td>' +
            '</tr>';
    }).join('');

    container.innerHTML = '' +
        '<div class="table-card">' +
            '<div class="table-card-header">' +
                '<h2>Your Bookings (' + bookings.length + ')</h2>' +
            '</div>' +
            '<div class="table-wrap">' +
                '<table class="data-table">' +
                    '<thead>' +
                        '<tr>' +
                            '<th>Event</th>' +
                            '<th>Date</th>' +
                            '<th>Venue</th>' +
                            '<th>Tickets</th>' +
                            '<th>Amount</th>' +
                            '<th>Booked On</th>' +
                            '<th>Action</th>' +
                        '</tr>' +
                    '</thead>' +
                    '<tbody>' + rows + '</tbody>' +
                '</table>' +
            '</div>' +
        '</div>';
}



// Cancel Booking
// Calls: PATCH /api/bookings/{bookingId}/cancel
async function cancelBooking(bookingId) {
    if (!confirm('Are you sure you want to cancel this booking?')) return;

    try {
        var res = await API.cancelBooking(bookingId);

        if (res.success) {
            Utils.showNotification('Booking cancelled.', 'success');
            await loadMyBookings();
        } else {
            Utils.showNotification(res.message || 'Cancel failed.', 'error');
        }

    } catch (err) {
        console.error('Cancel booking error:', err);
        Utils.showNotification('Something went wrong.', 'error');
    }
}



// Helpers
function getPillClass(status) {
    var s = (status || '').toUpperCase();
    if (s === 'CONFIRMED') return 'confirmed';
    if (s.indexOf('CANCELLED') >= 0) return 'cancelled';
    if (s === 'PENDING') return 'pending';
    return 'confirmed';
}

function bkEscHtml(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}