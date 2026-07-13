class AuthManager {
    constructor() {
        this.api = api;
        this.initializeEventListeners();
    }

    // --- INTIALIZE EVENTS -------------------------
    initializeEventListeners() {
        if (window.location.pathname.includes('login.html')) {
            this.initializeLogin();
        } else if (window.location.pathname.includes('register.html')) {
            this.initializeRegister();
        }
    }

    initializeLogin() {
        const loginForm = document.getElementById("login-form");

        if (!loginForm) return;

        loginForm.addEventListener("submit", (e) => this.handleLogin(e));

        document.getElementById("email").addEventListener("input", () => {
            this.validateLoginEmail();
        });

        document.getElementById("password").addEventListener("input", () => {
            this.validateLoginPassword();
        });
    }

    initializeRegister() {
        const registerForm = document.getElementById('register-form');
        if (!registerForm) return;

        registerForm.addEventListener('submit', (e) => this.handleRegister(e));

        const fields = ['name', 'email', 'phone_number', 'password', 'confirm_password', 'bio'];
        const validators = {
            name: () => this.validateName(),
            email: () => this.validateEmail(),
            phone_number: () => this.validatePhoneNumber(),
            password: () => this.validatePassword(),
            confirm_password: () => this.validateConfirmPassword(),
            bio: () => this.validateBio()
        };

        fields.forEach(field => {
            const element = document.getElementById(field);
            if (element) {
                element.addEventListener('input', validators[field]);
            }
        });
    }

    // --- VALIDATIONS -------------------------
    validateLoginEmail() {
        const emailField = document.getElementById("email");
        const error = document.getElementById("emailError");

        const value = emailField.value.trim();

        if (!value) {
            error.textContent = "Email is required.";
            return false;
        }

        if (!/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(value)) {
            error.textContent = "Please enter a valid gmail address.";
            return false;
        }

        error.textContent = "";
        return true;
    }

    validateLoginPassword() {
        const passwordField = document.getElementById("password");
        const error = document.getElementById("passwordError");

        const value = passwordField.value;

        if (!value) {
            error.textContent = "Password is required.";
            return false;
        }

        error.textContent = "";
        return true;
    }

    validateName() {
        const nameField = document.getElementById('name');
        const error = document.getElementById('nameError');
        const value = nameField.value.trim();

        if (!value) {
            error.textContent = 'Name is required.';
            return false;
        }

        if (value.length < 3) {
            error.textContent = 'Name must be at least 3 characters.';
            return false;
        }

        if (!/^[A-Za-z\s]+$/.test(value)) {
            error.textContent = 'Name must contain alphabets only.';
            return false;
        }

        error.textContent = '';
        nameField.classList.remove('error');
        return true;
    }

    validateEmail() {
        const emailField = document.getElementById('email');
        const error = document.getElementById('emailError');
        const value = emailField.value.trim();

        if (!value) {
            error.textContent = 'Email is required.';
            return false;
        }

        if (!/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(value)) {
            error.textContent = 'Please enter a valid gmail address.';
            return false;
        }

        error.textContent = '';
        emailField.classList.remove('error');
        return true;
    }

    validatePhoneNumber() {
        const phoneField = document.getElementById('phone_number');
        const error = document.getElementById('phoneError');
        const value = phoneField.value.trim();

        if (!value) {
            error.textContent = 'Phone number is required.';
            return false;
        }

        if (!/^[6-9]\d{9}$/.test(value)) {
            error.textContent = 'Please enter a valid 10-digit Indian phone number.';
            return false;
        }

        error.textContent = '';
        phoneField.classList.remove('error');
        return true;
    }

    validatePassword() {
        const passwordField = document.getElementById('password');
        const error = document.getElementById('passwordError');
        const value = passwordField.value.trim();

        const checks = [
            { test: !value, message: 'Password is required.' },
            { test: value.length < 8, message: 'Password must be at least 8 characters.' },
            { test: !/[A-Z]/.test(value), message: 'Password must contain at least one uppercase letter.' },
            { test: !/[a-z]/.test(value), message: 'Password must contain at least one lowercase letter.' },
            { test: !/[0-9]/.test(value), message: 'Password must contain at least one number.' },
            { test: !/[!@#$%^&*(),.?":{}|<>]/.test(value), message: 'Password must contain at least one special character.' }
        ];

        for (const check of checks) {
            if (check.test) {
                error.textContent = check.message;
                return false;
            }
        }

        error.textContent = '';
        passwordField.classList.remove('error');
        return true;
    }

    validateConfirmPassword() {
        const confirmPasswordField = document.getElementById('confirm_password');
        const error = document.getElementById('confirmPasswordError');
        const passwordValue = document.getElementById('password').value.trim();
        const confirmPasswordValue = confirmPasswordField.value.trim();

        if (!confirmPasswordValue) {
            error.textContent = 'Please confirm your password.';
            return false;
        }

        if (passwordValue !== confirmPasswordValue) {
            error.textContent = 'Passwords do not match.';
            return false;
        }

        error.textContent = '';
        confirmPasswordField.classList.remove('error');
        return true;
    }

    validateBio() {
        const bioField = document.getElementById('bio');
        const error = document.getElementById('bioError');
        const value = bioField.value.trim();

        if (value.length > 500) {
            error.textContent = 'Bio must not exceed 500 characters.';
            return false;
        }

        error.textContent = '';
        bioField.classList.remove('error');
        return true;
    }

    /**Handle Login by the User. */
    async handleLogin(event) {
        event.preventDefault();

        const form = event.target;
        const submitBtn = form.querySelector('button[type="submit"]');
        const formData = new FormData(form);

        const credentials = {
            email: formData.get('email'),
            password: formData.get('password')
        };

        if (!this.validateLoginForm()) return;

        try {
            showLoading(submitBtn, true);

            const response = await this.api.login(credentials);

            TokenManager.setToken(response.access_token);
            UserManager.setUser(response.user);

            showAlert('Login successful! Redirecting...', 'success');
            setTimeout(() => window.location.href = HOME_PAGE, 1000);

        } catch (error) {
            console.error('Login failed:', error);

            if (error instanceof ApiError) {
                if (error.status === 401) {
                    showAlert('Invalid email or password.', 'error');
                } else if (error.isValidationError()) {
                    showAlert('Please check your input and try again.', 'error');
                } else {
                    showAlert(error.message || 'Login failed.', 'error');
                }
            } else {
                showAlert('Connection error. Please try again.', 'error');
            }
        } finally {
            showLoading(submitBtn, false);
        }
    }

    /**Handle New User Registration. */
    async handleRegister(event) {
        event.preventDefault();

        const form = event.target;
        const submitBtn = form.querySelector('button[type="submit"]');
        const formData = new FormData(form);

        const userData = {
            name: formData.get('name'),
            email: formData.get('email'),
            password: formData.get('password'),
            phone_number: formData.get('phone_number') || null,
            city: formData.get('city') || null,
            bio: formData.get('bio') || null
        };

        const isValid = [
            this.validateName(),
            this.validateEmail(),
            this.validatePhoneNumber(),
            this.validatePassword(),
            this.validateConfirmPassword(),
            this.validateBio()
        ].every(Boolean);

        if (!isValid) return;

        try {
            showLoading(submitBtn, true);

            const response = await this.api.register(userData);

            TokenManager.setToken(response.access_token);
            UserManager.setUser(response.user);

            showAlert('Registration successful! Redirecting...', 'success');
            setTimeout(() => window.location.href = HOME_PAGE, 1000);

        } catch (error) {
            console.error('Registration failed:', error);

            if (error instanceof ApiError) {
                if (error.status === 400 && error.message.includes('Email already registered')) {
                    showAlert('This email is already registered. Please use a different email.', 'error');
                } else if (error.isValidationError()) {
                    showAlert('Please check your input and try again.', 'error');
                } else {
                    showAlert(error.message || 'Registration failed.', 'error');
                }
            } else {
                showAlert('Connection error. Please try again.', 'error');
            }
        } finally {
            showLoading(submitBtn, false);
        }
    }

    /**Validate Login Form */
    validateLoginForm() {
        return (
            this.validateLoginEmail() &&
            this.validateLoginPassword()
        );
    }

    // --- ERRORS -------------------------
    showFieldError(fieldName, message) {
        const field = document.getElementById(fieldName);
        if (!field) return;

        field.classList.add('error');

        const existingError = field.parentNode.querySelector('.error-message');
        if (existingError) existingError.remove();

        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        field.parentNode.appendChild(errorDiv);
    }

    clearFormErrors() {
        document.querySelectorAll('.form-control.error').forEach(field => field.classList.remove('error'));
        document.querySelectorAll('.error-message').forEach(error => error.remove());
    }
}

document.addEventListener('DOMContentLoaded', function () {
    const path = window.location.pathname;

    if (path.includes('login.html') || path.includes('register.html')) {
        requireGuest();
    }

    new AuthManager();
});