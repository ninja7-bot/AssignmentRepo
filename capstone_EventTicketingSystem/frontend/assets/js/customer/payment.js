/*
 * Customer Payment Page
 * Handles QR display, countdown timer, booking API call
*/



// Authentication
if (!Utils.requireAuth(CONFIG.ROLES.CUSTOMER)) {
    // redirect handled
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



// State
var paymentData = null;
var countdownTimer = null;
var secondsLeft = 10;


//  Dummy Payment Link
var PAYMENT_LINK = '';



// Initialization
document.addEventListener('DOMContentLoaded', function () {
    // Read booking data from URL params
    var params = new URLSearchParams(window.location.search);

    paymentData = {
        eventId: parseInt(params.get('eventId'), 10),
        eventName: params.get('eventName') || '-',
        eventDate: params.get('eventDate') || '-',
        venue: params.get('venue') || '-',
        tickets: parseInt(params.get('tickets'), 10) || 1,
        price: parseFloat(params.get('price')) || 0,
        total: parseFloat(params.get('total')) || 0
    };

    // Validation
    if (!paymentData.eventId || isNaN(paymentData.eventId)) {
        window.location.href = 'dashboard.html';
        return;
    }

    fillOrderSummary();
    setupQrLink();
    startCountdown();
    bindPaidButton();
});



// Order Summary
function fillOrderSummary() {
    document.getElementById('payEventName').textContent = paymentData.eventName;
    document.getElementById('payEventDate').textContent = paymentData.eventDate;
    document.getElementById('payEventVenue').textContent = paymentData.venue;
    document.getElementById('payTicketCount').textContent = paymentData.tickets + ' ticket(s)';
    document.getElementById('payTicketPrice').textContent = paymentData.price
        ? '₹' + paymentData.price
        : 'Free';
    document.getElementById('payTotal').textContent = paymentData.total
        ? '₹' + paymentData.total
        : 'Free';
}



// QR Link
function setupQrLink() {
    var qrLink = document.getElementById('qrLink');
    if (qrLink) {
        qrLink.href = PAYMENT_LINK;
        qrLink.textContent = PAYMENT_LINK;
    }
}



// Fake Countdown (10 seconds mandatory)
function startCountdown() {
    secondsLeft = 10;

    var timerRing = document.getElementById('timerRing');
    var timerText = document.getElementById('timerText');
    var paidBtn = document.getElementById('paidBtn');

    updateTimerDisplay();

    countdownTimer = setInterval(function () {
        secondsLeft--;

        if (secondsLeft <= 0) {
            clearInterval(countdownTimer);
            countdownTimer = null;

            // Enable the paid button
            timerRing.textContent = '✓';
            timerRing.classList.add('done');

            timerText.textContent = 'You can now confirm your payment.';
            timerText.classList.add('ready');

            paidBtn.disabled = false;
            paidBtn.textContent = "✓ I've Paid";
            paidBtn.classList.remove('btn-secondary');
            paidBtn.classList.add('btn-success');
        } else {
            updateTimerDisplay();
        }
    }, 1000);
}

function updateTimerDisplay() {
    var timerRing = document.getElementById('timerRing');
    var paidBtn = document.getElementById('paidBtn');

    if (timerRing) timerRing.textContent = secondsLeft;
    if (paidBtn) paidBtn.textContent = '⏳ Please wait... (' + secondsLeft + 's)';
}



// Bind Paid Button
function bindPaidButton() {
    var paidBtn = document.getElementById('paidBtn');
    if (paidBtn) {
        paidBtn.addEventListener('click', function () {
            confirmPaymentAndBook();
        });
    }
}



// Confirm Payment and Book
// Calls: POST /api/bookings
async function confirmPaymentAndBook() {
    // Show processing screen
    showScreen('processingScreen');

    try {
        var res = await API.createBooking({
            eventId: paymentData.eventId,
            numberOfTickets: paymentData.tickets
        });

        if (res.success) {
            // Fill success details
            var booking = res.data;

            document.getElementById('successBookingId').textContent =
                booking && booking.id ? '#' + booking.id : '-';
            document.getElementById('successEventName').textContent =
                paymentData.eventName;
            document.getElementById('successTickets').textContent =
                paymentData.tickets + ' ticket(s)';
            document.getElementById('successAmount').textContent =
                paymentData.total ? '₹' + paymentData.total : 'Free';

            showScreen('successScreen');

        } else {
            document.getElementById('errorMessage').textContent =
                res.message || 'Booking failed. Please try again.';
            showScreen('errorScreen');
        }

    } catch (err) {
        console.error('Payment booking error:', err);
        document.getElementById('errorMessage').textContent =
            'Something went wrong. Please try again.';
        showScreen('errorScreen');
    }
}



// Cancel Payment
function cancelPayment() {
    if (countdownTimer) {
        clearInterval(countdownTimer);
        countdownTimer = null;
    }

    if (confirm('Are you sure you want to cancel this payment?')) {
        window.location.href = 'dashboard.html';
    } else {
        // Restart timer
        startCountdown();
    }
}



// Retry Payment
// Goes back to payment screen and restarts timer
function retryPayment() {
    showScreen('paymentScreen');
    startCountdown();
}



// switch Screens
function showScreen(screenId) {
    var screens = ['paymentScreen', 'processingScreen', 'successScreen', 'errorScreen'];

    screens.forEach(function (id) {
        var el = document.getElementById(id);
        if (el) {
            if (id === screenId) {
                el.classList.remove('hidden');
            } else {
                el.classList.add('hidden');
            }
        }
    });
}