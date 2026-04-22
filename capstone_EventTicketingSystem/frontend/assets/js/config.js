/**
 * Configuration file for API endpoints and constants to be used.
 * Similar to an .env file.
 */

const CONFIG = {
    // API Base URLs for User and Organizer
    USER_SERVICE_URL: 'http://localhost:8081/api',
    ORGANIZER_SERVICE_URL: 'http://localhost:8082/api', // Future Implementation
    
    // API Endpoints
    ENDPOINTS: {
        // Auth endpoints
        REGISTER: '/auth/register',
        LOGIN: '/auth/login',
        
        // Event endpoints to be created later on.
        EVENTS: '/events',
        BOOKINGS: '/bookings'
    },
    
    /** JWT Token configuration
    * These are the tokens passed back and forth 
    * between the user-end and back-end.
    * Responsible for sharing details like
    * email, role, issuedAt and session expiry.
    */
    TOKEN_KEY: 'auth_token',
    USER_KEY: 'user_info',
    
    // Session timeout 30 minutes in milliseconds
    SESSION_TIMEOUT:30 * 60 * 1000,
    
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
    }
};

// Global Config
window.CONFIG = CONFIG;