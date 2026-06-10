/**
 * Authentication JavaScript - Login and Registration
 */

// Login Form Handler

const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Clear previous errors
        document.getElementById('emailError').textContent = '';
        document.getElementById('passwordError').textContent = '';
        
        // Get values
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        
        // Basic validation
        let hasError = false;
        
        if (!email) {
            document.getElementById('emailError').textContent = 'Email is required';
            hasError = true;
        }
        
        if (!password) {
            document.getElementById('passwordError').textContent = 'Password is required';
            hasError = true;
        }
        
        if (hasError) return;
        
        // Disable button
        const loginBtn = document.getElementById('loginBtn');
        loginBtn.disabled = true;
        loginBtn.textContent = 'Logging in...';
        
        try {
            // Call API
            const response = await API.login({ email, password });
            
            if (response.success) {
                // Store token and user info
                Utils.setToken(response.data.token);
                Utils.setUserInfo({
                    email: response.data.email,
                    name: response.data.name,
                    role: response.data.role
                });
                
                // Show success and redirect
                Utils.showNotification('Login successful!', 'success');
                
                setTimeout(() => {
                    Utils.redirectToDashboard();
                }, 1000);
                
            } else {
                // Show error
                Utils.showNotification('Invalid email or password', 'error');
                loginBtn.disabled = false;
                loginBtn.textContent = 'Login';
            }
            
        } catch (error) {
            console.error('Login error:', error);
            Utils.showNotification('An error occurred. Please try again.', 'error');
            loginBtn.disabled = false;
            loginBtn.textContent = 'Login';
        }
    });
}

// Registration Form Handler

const registerForm = document.getElementById('registerForm');
if (registerForm) {
    registerForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Clear previous errors
        clearAllErrors();
        
        // Get values
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const password = document.getElementById('password').value;
        const role = document.querySelector('input[name="role"]:checked').value;
        
        // Validate
        let hasError = false;
        
        // Name validation
        const nameError = Utils.validateName(name);
        if (nameError) {
            document.getElementById('nameError').textContent = nameError;
            hasError = true;
        }
        
        // Email validation
        const emailError = Utils.validateEmail(email);
        if (emailError) {
            document.getElementById('emailError').textContent = emailError;
            hasError = true;
        }
        
        // Phone validation
        const phoneError = Utils.validatePhone(phone);
        if (phoneError) {
            document.getElementById('phoneError').textContent = phoneError;
            hasError = true;
        }
        
        // Password validation
        const passwordError = Utils.validatePassword(password);
        if (passwordError) {
            document.getElementById('passwordError').textContent = passwordError;
            hasError = true;
        }
        
        if (hasError) return;
        
        // Disable button
        const registerBtn = document.getElementById('registerBtn');
        registerBtn.disabled = true;
        registerBtn.textContent = 'Creating account...';
        
        try {
            // Call API
            const response = await API.register({
                name,
                email,
                phone,
                password,
                role
            });
            
            if (response.success) {
                // Success
                Utils.showNotification('Registration successful! Please login.', 'success');
                
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 2000);
                
            } else {
                // Handle errors
                if (response.status === 409) {
                    document.getElementById('emailError').textContent = 'Email already exists';
                    Utils.showNotification('Email already registered', 'error');
                } else if (response.status === 400 && typeof response.data === 'object') {
                    // Field-specific errors
                    if (response.data.name) {
                        document.getElementById('nameError').textContent = response.data.name;
                    }
                    if (response.data.email) {
                        document.getElementById('emailError').textContent = response.data.email;
                    }
                    if (response.data.phone) {
                        document.getElementById('phoneError').textContent = response.data.phone;
                    }
                    if (response.data.password) {
                        document.getElementById('passwordError').textContent = response.data.password;
                    }
                } else {
                    Utils.showNotification('Registration failed. Please try again.', 'error');
                }
                
                registerBtn.disabled = false;
                registerBtn.textContent = 'Register';
            }
            
        } catch (error) {
            console.error('Registration error:', error);
            Utils.showNotification('An error occurred. Please try again.', 'error');
            registerBtn.disabled = false;
            registerBtn.textContent = 'Register';
        }
    });
}

// Helper Functions

function clearAllErrors() {
    const errorElements = document.querySelectorAll('.error-text');
    errorElements.forEach(el => el.textContent = '');
}

// Check if already logged in
if (Utils.isLoggedIn()) {
    Utils.redirectToDashboard();
}