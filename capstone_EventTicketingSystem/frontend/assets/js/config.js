/**
 * Configuration file for API endpoints and constants to be used.
 * Similar to an .env file.
 */

const CONFIG = {
    // API Base URLs for User and Organizer
    USER_SERVICE_URL: 'http://localhost:8081/api',
    EVENT_SERVICE_URL: 'http://localhost:8082/api',

    // API Endpoints
    ENDPOINTS: {
        // Auth endpoints
        REGISTER: '/auth/register',
        LOGIN: '/auth/login',

        // Events endpoints
        EVENTS: '/events',
        MY_EVENTS: '/events/my-events',
        EVENT_BY_ID: '/events/',

        // Booking endpoints to be created later on.
        BOOKINGS: '/bookings'
    },

    /** JWT Token configuration
    * These are the tokens passed back and forth 
    * between the user-end and back-end.
    * Responsible for sharing details like
    * email, role, issuedAt and session expiry.
    *
    * Added Token Timestamp for the further use 
    * when handling bookings and stuff.
    */
    TOKEN_KEY: 'auth_token',
    USER_KEY: 'user_info',
    TIMESTAMP_KEY: 'token_timestamp',

    // Session timeout 30 minutes in milliseconds
    SESSION_TIMEOUT: 30 * 60 * 1000,

    // Roles
    ROLES: {
        CUSTOMER: 'CUSTOMER',
        ORGANIZER: 'ORGANIZER'
    },

    /** Validation patterns
    *   Email: ending with '@gmail.com'
    *   Phone: Integers, length 10.
    *   Name: ONLY Alphabets 
    *   Password: 1 special, 1 Uppercase, length 8 to 12.
    */
    PATTERNS: {
        EMAIL: /^[a-zA-Z0-9._%+-]+@gmail\.com$/,
        PHONE: /^[0-9]{10}$/,
        NAME: /^[a-zA-Z\s]{2,100}$/,
        PASSWORD: /^(?=.*[A-Z])(?=.*[\W_]).{8,12}$/
    },

    /** ROUTES through frontend
     *  Here, the page locations have been stored in variables so as to
     *  ease the implementation of redirection or transition between pages.
     */
    ROUTES: {
        LOGIN: '/frontend/pages/auth/login.html',
        REGISTER: '/frontend/pages/auth/register.html',
        CUSTOMER_DASHBOARD: '/frontend/pages/customer/dashboard.html',
        ORGANIZER_DASHBOARD: '/frontend/pages/organizer/dashboard.html',
        CREATE_EVENT: '/frontend/pages/organizer/create-event.html',
        MY_EVENTS: '/frontend/pages/organizer/my-events.html'
    }
};

// Global Config
window.CONFIG = CONFIG;