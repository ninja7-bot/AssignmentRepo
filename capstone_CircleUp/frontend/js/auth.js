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

        populateCityDropdown(document.getElementById('city'));

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
        const value = document.getElementById("email").value;
        const result = ValidationRules.email(value);
        setFieldErrorById('email', 'emailError', result.valid ? '' : result.message);
        return result.valid;
    }

    validateLoginPassword() {
        const value = document.getElementById("password").value;
        const result = ValidationRules.required(value, 'Password is required.');
        setFieldErrorById('password', 'passwordError', result.valid ? '' : result.message);
        return result.valid;
    }

    validateName() {
        const value = document.getElementById('name').value;
        const result = ValidationRules.name(value);
        setFieldErrorById('name', 'nameError', result.valid ? '' : result.message);
        return result.valid;
    }

    validateEmail() {
        const value = document.getElementById('email').value;
        const result = ValidationRules.email(value);
        setFieldErrorById('email', 'emailError', result.valid ? '' : result.message);
        return result.valid;
    }

    validatePhoneNumber() {
        const value = document.getElementById('phone_number').value;
        const result = ValidationRules.phoneNumber(value);
        setFieldErrorById('phone_number', 'phoneError', result.valid ? '' : result.message);
        return result.valid;
    }

    validatePassword() {
        const value = document.getElementById('password').value;
        const result = ValidationRules.password(value);
        setFieldErrorById('password', 'passwordError', result.valid ? '' : result.message);
        return result.valid;
    }

    validateConfirmPassword() {
        const value = document.getElementById('confirm_password').value;
        const passwordValue = document.getElementById('password').value;
        const result = ValidationRules.confirmPassword(value, passwordValue);
        setFieldErrorById('confirm_password', 'confirmPasswordError', result.valid ? '' : result.message);
        return result.valid;
    }

    validateBio() {
        const value = document.getElementById('bio').value;
        const result = ValidationRules.bio(value);
        setFieldErrorById('bio', 'bioError', result.valid ? '' : result.message);
        return result.valid;
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
                if (error.status === 409 && error.message.includes('Email already registered')) {
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

}

document.addEventListener('DOMContentLoaded', function () {
    const path = window.location.pathname;

    if (path.includes('login.html') || path.includes('register.html')) {
        requireGuest();
    }

    new AuthManager();
});