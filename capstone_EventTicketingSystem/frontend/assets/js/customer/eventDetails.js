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

    bindBookingForm();
    bindConfirmModal();
    loadEventDetails(eventId);
});


// Bind Booking Form
function bindBookingForm() {
    var ticketInput = document.getElementById('numTickets');
    if (ticketInput) {
        ticketInput.addEventListener('input', updateDetailsTotal);
    }

    var bookBtn = document.getElementById('bookNowBtn');
    if (bookBtn) {
        bookBtn.addEventListener('click', submitDetailsBooking);
    }
}


// Bind Confirm Modal
function bindConfirmModal() {
    var closeBtn = document.getElementById('closeConfirmModal');
    var cancelBtn = document.getElementById('cancelConfirmBtn');
    var processBtn = document.getElementById('processBookingBtn');
    var backdrop = document.getElementById('confirmModal');

    if (closeBtn) {
        closeBtn.addEventListener('click', closeConfirmModal);
    }
    if (cancelBtn) {
        cancelBtn.addEventListener('click', closeConfirmModal);
    }
    if (processBtn) {
        processBtn.addEventListener('click', processBooking);
    }
    if (backdrop) {
        backdrop.addEventListener('click', function (e) {
            if (e.target === backdrop) closeConfirmModal();
        });
    }
}


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

    // Update total on load
    updateDetailsTotal();

    // Book button state
    var bookBtn = document.getElementById('bookNowBtn');
    if (bookBtn) {
        if (available <= 0) {
            bookBtn.disabled = true;
            bookBtn.textContent = 'Sold Out';
        } else if (event.status !== 'ACTIVE') {
            bookBtn.disabled = true;
            bookBtn.textContent = 'Booking Closed';
        }
    }

    showDetailsContent();
}


// Update Total Price
function updateDetailsTotal() {
    if (!currentEvent) return;

    var ticketInput = document.getElementById('numTickets');
    var count = parseInt(ticketInput ? ticketInput.value : 1, 10) || 0;
    var totalEl = document.getElementById('detailsTotal');

    if (!totalEl) return;

    if (currentEvent.ticketPrice) {
        totalEl.textContent = '₹' + (count * currentEvent.ticketPrice);
    } else {
        totalEl.textContent = 'Free';
    }
}



// Submit Booking — opens confirm modal
function submitDetailsBooking() {
    if (!currentEvent) return;

    var ticketInput = document.getElementById('numTickets');
    var count = parseInt(ticketInput ? ticketInput.value : 1, 10);
    var errEl = document.getElementById('numTicketsError');
    var available = (currentEvent.totalSeats || 0) - (currentEvent.bookedSeats || 0);
    var maxAllowed = currentEvent.maxTicketsPerBooking || 10;

    if (errEl) errEl.textContent = '';

    if (!count || count < 1) {
        if (errEl) errEl.textContent = 'Please select at least 1 ticket.';
        return;
    }
    if (count > maxAllowed) {
        if (errEl) errEl.textContent = 'Maximum ' + maxAllowed + ' tickets per booking.';
        return;
    }
    if (count > available) {
        if (errEl) errEl.textContent = 'Only ' + available + ' seats available.';
        return;
    }

    bookingTickets = count;

    // Fill confirm modal
    document.getElementById('confirmEventName').textContent = currentEvent.eventName;
    document.getElementById('confirmEventDate').textContent = Utils.formatDate(currentEvent.eventDate);
    document.getElementById('confirmTickets').textContent = count + ' ticket(s)';
    document.getElementById('confirmTotal').textContent = currentEvent.ticketPrice
        ? '₹' + (count * currentEvent.ticketPrice) : 'Free';

    var modal = document.getElementById('confirmModal');
    if (modal) modal.classList.remove('hidden');
}

function closeConfirmModal() {
    var modal = document.getElementById('confirmModal');
    if (modal) modal.classList.add('hidden');
}



// Process Booking
// Calls: POST /api/bookings
async function processBooking() {
    if (!currentEvent) return;

    // Close confirm modal
    closeConfirmModal();

    // Calculate total
    var price = currentEvent.ticketPrice || 0;
    var total = bookingTickets * price;

    // Build payment page URL with booking details
    var params = new URLSearchParams();
    params.set('eventId', currentEvent.id);
    params.set('eventName', currentEvent.eventName || '');
    params.set('eventDate', Utils.formatDate(currentEvent.eventDate));
    params.set('venue', currentEvent.venue || '');
    params.set('tickets', bookingTickets);
    params.set('price', price);
    params.set('total', total);

    // Redirect to payment page
    window.location.href = 'payment.html?' + params.toString();
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