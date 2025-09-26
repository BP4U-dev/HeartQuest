// HeartQuest - Auth UI stubs
(function(){
    function showLogin() {
        if (window.UI && typeof UI.showFloatingUI === 'function') {
            UI.showFloatingUI('Login', 'Redirecting to login page...');
            setTimeout(function(){ window.location.href = 'login.html'; }, 400);
        } else {
            window.location.href = 'login.html';
        }
    }

    function showRegister() {
        if (window.UI && typeof UI.showFloatingUI === 'function') {
            UI.showFloatingUI('Create Account', 'Registration flow coming soon. For now, sign in from the Login page.');
        } else {
            alert('Registration coming soon. Please use Login for demo.');
        }
    }

    window.showLogin = showLogin;
    window.showRegister = showRegister;
})();

// HeartQuest - Authentication & User Management
class AuthManager {
    constructor() {
        this.currentUser = null;
        this.isLoggedIn = false;
        this.loginModal = null;
        this.registerModal = null;
        this.init();
    }

    init() {
        this.checkStoredAuth();
        this.createAuthModals();
        this.bindEvents();
    }

    // Check if user is already logged in (from localStorage)
    checkStoredAuth() {
        const storedUser = localStorage.getItem('heartquest_user');
        const storedToken = localStorage.getItem('heartquest_token');
        
        if (storedUser && storedToken) {
            try {
                this.currentUser = JSON.parse(storedUser);
                this.isLoggedIn = true;
                this.updateUI();
                console.log('User auto-logged in:', this.currentUser.username);
            } catch (error) {
                console.error('Error parsing stored user data:', error);
                this.logout();
            }
        }
    }

    // Create login and registration modals
    createAuthModals() {
        // Create login modal
        this.loginModal = document.createElement('div');
        this.loginModal.className = 'auth-modal';
        this.loginModal.id = 'loginModal';
        this.loginModal.style.display = 'none';
        this.loginModal.innerHTML = `
            <div class="auth-content">
                <div class="auth-header">
                    <h2>Welcome Back to HeartQuest</h2>
                    <button class="close-btn" onclick="authManager.closeModal('login')">&times;</button>
                </div>
                <form id="loginForm" onsubmit="authManager.handleLogin(event)">
                    <div class="form-group">
                        <label for="loginEmail">Email</label>
                        <input type="email" id="loginEmail" required>
                    </div>
                    <div class="form-group">
                        <label for="loginPassword">Password</label>
                        <input type="password" id="loginPassword" required>
                    </div>
                    <div class="form-options">
                        <label class="checkbox-label">
                            <input type="checkbox" id="rememberMe">
                            <span class="checkmark"></span>
                            Remember me
                        </label>
                        <a href="#" onclick="authManager.showForgotPassword()">Forgot password?</a>
                    </div>
                    <button type="submit" class="btn btn-primary auth-btn">
                        <span class="btn-text">Login</span>
                        <div class="loading-spinner" style="display: none;"></div>
                    </button>
                    <div class="auth-divider">
                        <span>or</span>
                    </div>
                    <div class="social-login">
                        <button type="button" class="btn btn-social google" onclick="authManager.socialLogin('google')">
                            <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSI+PC9zdmc+" alt="Google">
                            Continue with Google
                        </button>
                        <button type="button" class="btn btn-social facebook" onclick="authManager.socialLogin('facebook')">
                            Continue with Facebook
                        </button>
                    </div>
                    <p class="auth-switch">
                        Don't have an account? 
                        <a href="#" onclick="authManager.switchModal('register')">Sign up</a>
                    </p>
                </form>
            </div>
        `;

        // Create registration modal
        this.registerModal = document.createElement('div');
        this.registerModal.className = 'auth-modal';
        this.registerModal.id = 'registerModal';
        this.registerModal.style.display = 'none';
        this.registerModal.innerHTML = `
            <div class="auth-content">
                <div class="auth-header">
                    <h2>Join HeartQuest</h2>
                    <button class="close-btn" onclick="authManager.closeModal('register')">&times;</button>
                </div>
                <form id="registerForm" onsubmit="authManager.handleRegister(event)">
                    <div class="form-row">
                        <div class="form-group">
                            <label for="firstName">First Name</label>
                            <input type="text" id="firstName" required>
                        </div>
                        <div class="form-group">
                            <label for="lastName">Last Name</label>
                            <input type="text" id="lastName" required>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="registerUsername">Username</label>
                        <input type="text" id="registerUsername" required>
                        <div class="input-hint">This will be your display name</div>
                    </div>
                    <div class="form-group">
                        <label for="registerEmail">Email</label>
                        <input type="email" id="registerEmail" required>
                    </div>
                    <div class="form-group">
                        <label for="registerPassword">Password</label>
                        <input type="password" id="registerPassword" required minlength="8">
                        <div class="password-strength" id="passwordStrength"></div>
                    </div>
                    <div class="form-group">
                        <label for="confirmPassword">Confirm Password</label>
                        <input type="password" id="confirmPassword" required>
                    </div>
                    <div class="form-group">
                        <label for="birthDate">Date of Birth</label>
                        <input type="date" id="birthDate" required>
                        <div class="input-hint">Must be 18+ to join</div>
                    </div>
                    <div class="form-group">
                        <label class="checkbox-label">
                            <input type="checkbox" id="agreeTerms" required>
                            <span class="checkmark"></span>
                            I agree to the <a href="#" target="_blank">Terms of Service</a> and <a href="#" target="_blank">Privacy Policy</a>
                        </label>
                    </div>
                    <div class="form-group">
                        <label class="checkbox-label">
                            <input type="checkbox" id="newsletterOptIn">
                            <span class="checkmark"></span>
                            Send me updates about new features and events
                        </label>
                    </div>
                    <button type="submit" class="btn btn-primary auth-btn">
                        <span class="btn-text">Create Account</span>
                        <div class="loading-spinner" style="display: none;"></div>
                    </button>
                    <p class="auth-switch">
                        Already have an account? 
                        <a href="#" onclick="authManager.switchModal('login')">Sign in</a>
                    </p>
                </form>
            </div>
        `;

        document.body.appendChild(this.loginModal);
        document.body.appendChild(this.registerModal);

        // Add styles
        this.addAuthStyles();
    }

    // Bind event listeners
    bindEvents() {
        // Password strength checker
        document.addEventListener('input', (e) => {
            if (e.target.id === 'registerPassword') {
                this.checkPasswordStrength(e.target.value);
            }
        });

        // Close modal on outside click
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('auth-modal')) {
                this.closeModal();
            }
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeModal();
            }
        });
    }

    // Show login modal
    showLogin() {
        this.loginModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        setTimeout(() => {
            document.getElementById('loginEmail').focus();
        }, 100);
    }

    // Show registration modal
    showRegister() {
        this.registerModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        setTimeout(() => {
            document.getElementById('firstName').focus();
        }, 100);
    }

    // Close modal
    closeModal(type = null) {
        if (this.loginModal) this.loginModal.style.display = 'none';
        if (this.registerModal) this.registerModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    // Switch between login and register
    switchModal(type) {
        this.closeModal();
        setTimeout(() => {
            if (type === 'login') {
                this.showLogin();
            } else {
                this.showRegister();
            }
        }, 200);
    }

    // Handle login form submission
    async handleLogin(event) {
        event.preventDefault();
        
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        const rememberMe = document.getElementById('rememberMe').checked;

        this.setLoadingState('login', true);

        try {
            // Simulate API call (replace with actual API endpoint)
            const response = await this.simulateLogin(email, password);
            
            if (response.success) {
                this.currentUser = response.user;
                this.isLoggedIn = true;
                
                // Store user data
                if (rememberMe) {
                    localStorage.setItem('heartquest_user', JSON.stringify(this.currentUser));
                    localStorage.setItem('heartquest_token', response.token);
                }
                
                this.updateUI();
                this.closeModal();
                this.showWelcomeMessage();
                
                // Initialize user data in game
                if (typeof gameManager !== 'undefined') {
                    gameManager.initializeUser(this.currentUser);
                }
            } else {
                throw new Error(response.message || 'Login failed');
            }
        } catch (error) {
            this.showError('login', error.message);
        } finally {
            this.setLoadingState('login', false);
        }
    }

    // Handle registration form submission
    async handleRegister(event) {
        event.preventDefault();
        
        const formData = {
            firstName: document.getElementById('firstName').value,
            lastName: document.getElementById('lastName').value,
            username: document.getElementById('registerUsername').value,
            email: document.getElementById('registerEmail').value,
            password: document.getElementById('registerPassword').value,
            confirmPassword: document.getElementById('confirmPassword').value,
            birthDate: document.getElementById('birthDate').value,
            agreeTerms: document.getElementById('agreeTerms').checked,
            newsletterOptIn: document.getElementById('newsletterOptIn').checked
        };

        // Validation
        if (!this.validateRegistration(formData)) {
            return;
        }

        this.setLoadingState('register', true);

        try {
            // Simulate API call (replace with actual API endpoint)
            const response = await this.simulateRegister(formData);
            
            if (response.success) {
                this.currentUser = response.user;
                this.isLoggedIn = true;
                
                // Store user data
                localStorage.setItem('heartquest_user', JSON.stringify(this.currentUser));
                localStorage.setItem('heartquest_token', response.token);
                
                this.updateUI();
                this.closeModal();
                this.showWelcomeMessage(true); // true for new user
                
                // Initialize user data in game
                if (typeof gameManager !== 'undefined') {
                    gameManager.initializeNewUser(this.currentUser);
                }
            } else {
                throw new Error(response.message || 'Registration failed');
            }
        } catch (error) {
            this.showError('register', error.message);
        } finally {
            this.setLoadingState('register', false);
        }
    }

    // Validate registration form
    validateRegistration(data) {
        // Age validation
        const birthDate = new Date(data.birthDate);
        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear();
        
        if (age < 18) {
            this.showError('register', 'You must be 18 or older to join HeartQuest');
            return false;
        }

        // Password confirmation
        if (data.password !== data.confirmPassword) {
            this.showError('register', 'Passwords do not match');
            return false;
        }

        // Terms agreement
        if (!data.agreeTerms) {
            this.showError('register', 'You must agree to the Terms of Service');
            return false;
        }

        return true;
    }

    // Check password strength
    checkPasswordStrength(password) {
        const strengthIndicator = document.getElementById('passwordStrength');
        if (!strengthIndicator) return;

        let strength = 0;
        let feedback = [];

        // Length check
        if (password.length >= 8) strength += 1;
        else feedback.push('At least 8 characters');

        // Complexity checks
        if (/[a-z]/.test(password)) strength += 1;
        else feedback.push('Lowercase letter');

        if (/[A-Z]/.test(password)) strength += 1;
        else feedback.push('Uppercase letter');

        if (/[0-9]/.test(password)) strength += 1;
        else feedback.push('Number');

        if (/[^A-Za-z0-9]/.test(password)) strength += 1;
        else feedback.push('Special character');

        const strengthLevels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
        const strengthColors = ['#ff4444', '#ff8800', '#ffbb00', '#88cc00', '#44bb00'];

        strengthIndicator.innerHTML = `
            <div class="strength-bar">
                <div class="strength-fill" style="width: ${(strength / 5) * 100}%; background-color: ${strengthColors[strength - 1] || '#ff4444'}"></div>
            </div>
            <div class="strength-text">Password strength: ${strengthLevels[strength - 1] || 'Very Weak'}</div>
            ${feedback.length > 0 ? `<div class="strength-feedback">Missing: ${feedback.join(', ')}</div>` : ''}
        `;
    }

    // Social login
    async socialLogin(provider) {
        try {
            // Simulate social login (replace with actual OAuth implementation)
            this.setLoadingState('social', true);
            
            const response = await this.simulateSocialLogin(provider);
            
            if (response.success) {
                this.currentUser = response.user;
                this.isLoggedIn = true;
                
                localStorage.setItem('heartquest_user', JSON.stringify(this.currentUser));
                localStorage.setItem('heartquest_token', response.token);
                
                this.updateUI();
                this.closeModal();
                this.showWelcomeMessage();
                
                if (typeof gameManager !== 'undefined') {
                    gameManager.initializeUser(this.currentUser);
                }
            }
        } catch (error) {
            this.showError('social', `${provider} login failed: ${error.message}`);
        } finally {
            this.setLoadingState('social', false);
        }
    }

    // Logout user
    logout() {
        this.currentUser = null;
        this.isLoggedIn = false;
        
        // Clear stored data
        localStorage.removeItem('heartquest_user');
        localStorage.removeItem('heartquest_token');
        
        this.updateUI();
        
        // Show logout message
        this.showNotification('You have been logged out successfully');
        
        // Redirect to login if needed
        setTimeout(() => {
            this.showLogin();
        }, 2000);
    }

    // Update UI based on authentication state
    updateUI() {
        // Update navigation
        const navContainer = document.querySelector('.nav-container');
        if (navContainer) {
            let userSection = document.querySelector('.user-section');
            
            if (this.isLoggedIn) {
                if (!userSection) {
                    userSection = document.createElement('div');
                    userSection.className = 'user-section';
                    navContainer.appendChild(userSection);
                }
                
                userSection.innerHTML = `
                    <div class="user-info">
                        <div class="user-avatar" onclick="authManager.showUserMenu()">
                            <img src="${this.currentUser.avatar || 'assets/images/default-avatar.png'}" alt="Avatar">
                        </div>
                        <div class="user-details">
                            <div class="username">${this.currentUser.username}</div>
                            <div class="user-level">Level ${this.currentUser.level || 1}</div>
                        </div>
                    </div>
                    <div class="user-menu" id="userMenu" style="display: none;">
                        <a href="#" onclick="authManager.showProfile()">Profile</a>
                        <a href="#" onclick="authManager.showSettings()">Settings</a>
                        <a href="#" onclick="authManager.logout()">Logout</a>
                    </div>
                `;
            } else {
                if (userSection) {
                    userSection.innerHTML = `
                        <div class="auth-buttons">
                            <button class="btn btn-secondary" onclick="authManager.showLogin()">Login</button>
                            <button class="btn btn-primary" onclick="authManager.showRegister()">Sign Up</button>
                        </div>
                    `;
                }
            }
        }
    }

    // Simulate API calls (replace with actual backend integration)
    async simulateLogin(email, password) {
        return new Promise((resolve) => {
            setTimeout(() => {
                // Simulate successful login
                resolve({
                    success: true,
                    user: {
                        id: 1,
                        username: email.split('@')[0],
                        email: email,
                        level: 12,
                        coins: 15240,
                        subscriptionTier: 0,
                        avatar: null,
                        createdDate: new Date().toISOString()
                    },
                    token: 'fake_jwt_token_' + Math.random()
                });
            }, 1500);
        });
    }

    async simulateRegister(formData) {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    success: true,
                    user: {
                        id: Date.now(),
                        username: formData.username,
                        email: formData.email,
                        firstName: formData.firstName,
                        lastName: formData.lastName,
                        level: 1,
                        coins: 1000,
                        subscriptionTier: 0,
                        avatar: null,
                        createdDate: new Date().toISOString()
                    },
                    token: 'fake_jwt_token_' + Math.random()
                });
            }, 2000);
        });
    }

    async simulateSocialLogin(provider) {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    success: true,
                    user: {
                        id: Date.now(),
                        username: `${provider}_user`,
                        email: `user@${provider}.com`,
                        level: 5,
                        coins: 5000,
                        subscriptionTier: 0,
                        avatar: null,
                        provider: provider,
                        createdDate: new Date().toISOString()
                    },
                    token: 'fake_jwt_token_' + Math.random()
                });
            }, 1000);
        });
    }

    // Helper methods
    setLoadingState(type, isLoading) {
        const selectors = {
            'login': '#loginForm .btn-text, #loginForm .loading-spinner',
            'register': '#registerForm .btn-text, #registerForm .loading-spinner',
            'social': '.btn-social'
        };

        if (type === 'social') {
            document.querySelectorAll('.btn-social').forEach(btn => {
                btn.disabled = isLoading;
            });
        } else {
            const [textSelector, spinnerSelector] = selectors[type].split(', ');
            const textEl = document.querySelector(textSelector);
            const spinnerEl = document.querySelector(spinnerSelector);
            
            if (textEl && spinnerEl) {
                textEl.style.display = isLoading ? 'none' : 'inline';
                spinnerEl.style.display = isLoading ? 'inline-block' : 'none';
            }
        }
    }

    showError(type, message) {
        const existingError = document.querySelector('.auth-error');
        if (existingError) existingError.remove();

        const errorDiv = document.createElement('div');
        errorDiv.className = 'auth-error';
        errorDiv.textContent = message;

        const form = document.querySelector(`#${type}Form, .auth-content`);
        if (form) {
            form.insertBefore(errorDiv, form.firstChild);
            setTimeout(() => errorDiv.remove(), 5000);
        }
    }

    showNotification(message) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'auth-notification';
        notification.textContent = message;
        document.body.appendChild(notification);
        
        // Auto remove
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    showWelcomeMessage(isNewUser = false) {
        const message = isNewUser 
            ? `Welcome to HeartQuest, ${this.currentUser.username}! Let's create your avatar.`
            : `Welcome back, ${this.currentUser.username}!`;
            
        this.showNotification(message);
    }

    // Add authentication styles
    addAuthStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .auth-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(43, 43, 43, 0.95);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 2000;
                backdrop-filter: blur(10px);
            }

            .auth-content {
                background: linear-gradient(135deg, rgba(43, 43, 43, 0.98) 0%, rgba(26, 26, 26, 0.98) 100%);
                border-radius: 20px;
                padding: 40px;
                max-width: 450px;
                width: 90%;
                max-height: 90vh;
                overflow-y: auto;
                border: 2px solid rgba(139, 58, 58, 0.4);
                box-shadow: 0 25px 60px rgba(139, 58, 58, 0.3);
            }

            .auth-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 30px;
            }

            .auth-header h2 {
                background: linear-gradient(45deg, #8B3A3A, #CD5C5C, #DC143C);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
                font-size: 1.8rem;
                margin: 0;
            }

            .close-btn {
                background: none;
                border: none;
                color: #8B3A3A;
                font-size: 2rem;
                cursor: pointer;
                padding: 0;
                width: 30px;
                height: 30px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 50%;
                transition: all 0.3s ease;
            }

            .close-btn:hover {
                background: rgba(139, 58, 58, 0.2);
                color: #CD5C5C;
            }

            .form-group {
                margin-bottom: 20px;
            }

            .form-row {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 15px;
            }

            .form-group label {
                display: block;
                margin-bottom: 8px;
                font-weight: 500;
                color: #e0e0e0;
            }

            .form-group input {
                width: 100%;
                padding: 12px 15px;
                background: rgba(139, 58, 58, 0.1);
                border: 2px solid rgba(139, 58, 58, 0.3);
                border-radius: 10px;
                color: white;
                font-size: 1rem;
                transition: border-color 0.3s ease;
            }

            .form-group input:focus {
                outline: none;
                border-color: #8B3A3A;
                box-shadow: 0 0 10px rgba(139, 58, 58, 0.3);
            }

            .input-hint {
                font-size: 0.8rem;
                color: #b0b0b0;
                margin-top: 5px;
            }

            .password-strength {
                margin-top: 10px;
            }

            .strength-bar {
                width: 100%;
                height: 4px;
                background: rgba(255, 255, 255, 0.2);
                border-radius: 2px;
                overflow: hidden;
                margin-bottom: 5px;
            }

            .strength-fill {
                height: 100%;
                transition: width 0.3s ease, background-color 0.3s ease;
            }

            .strength-text, .strength-feedback {
                font-size: 0.8rem;
                color: #b0b0b0;
            }

            .checkbox-label {
                display: flex;
                align-items: flex-start;
                cursor: pointer;
                font-size: 0.9rem;
                line-height: 1.4;
            }

            .checkbox-label input[type="checkbox"] {
                display: none;
            }

            .checkmark {
                min-width: 20px;
                height: 20px;
                background: rgba(139, 58, 58, 0.2);
                border: 2px solid #8B3A3A;
                border-radius: 4px;
                margin-right: 10px;
                position: relative;
                transition: all 0.3s ease;
            }

            .checkbox-label input[type="checkbox"]:checked + .checkmark {
                background: #8B3A3A;
            }

            .checkbox-label input[type="checkbox"]:checked + .checkmark::after {
                content: '✓';
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                color: white;
                font-size: 12px;
            }

            .form-options {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 25px;
            }

            .form-options a {
                color: #CD5C5C;
                text-decoration: none;
                font-size: 0.9rem;
            }

            .form-options a:hover {
                color: #DC143C;
            }

            .auth-btn {
                width: 100%;
                position: relative;
            }

            .loading-spinner {
                width: 20px;
                height: 20px;
                border: 2px solid rgba(255, 255, 255, 0.3);
                border-top: 2px solid white;
                border-radius: 50%;
                animation: spin 1s linear infinite;
            }

            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }

            .auth-divider {
                text-align: center;
                margin: 25px 0;
                position: relative;
            }

            .auth-divider::before {
                content: '';
                position: absolute;
                top: 50%;
                left: 0;
                right: 0;
                height: 1px;
                background: rgba(139, 58, 58, 0.3);
            }

            .auth-divider span {
                background: #2b2b2b;
                padding: 0 15px;
                color: #b0b0b0;
            }

            .social-login {
                display: grid;
                gap: 10px;
                margin-bottom: 25px;
            }

            .btn-social {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 10px;
                background: rgba(255, 255, 255, 0.1);
                border: 2px solid rgba(255, 255, 255, 0.2);
                color: white;
                padding: 12px 20px;
                border-radius: 10px;
                cursor: pointer;
                transition: all 0.3s ease;
            }

            .btn-social:hover {
                background: rgba(255, 255, 255, 0.2);
                border-color: rgba(255, 255, 255, 0.4);
            }

            .btn-social.google:hover {
                border-color: #4285f4;
            }

            .btn-social.facebook:hover {
                border-color: #1877f2;
            }

            .auth-switch {
                text-align: center;
                color: #b0b0b0;
                font-size: 0.9rem;
            }

            .auth-switch a {
                color: #CD5C5C;
                text-decoration: none;
            }

            .auth-switch a:hover {
                color: #DC143C;
            }

            .auth-error {
                background: rgba(220, 20, 60, 0.2);
                border: 1px solid #DC143C;
                color: #ff6b6b;
                padding: 12px;
                border-radius: 8px;
                margin-bottom: 20px;
                font-size: 0.9rem;
            }

            .auth-notification {
                position: fixed;
                top: 100px;
                right: 20px;
                background: rgba(139, 58, 58, 0.9);
                border: 1px solid #8B3A3A;
                color: white;
                padding: 15px 20px;
                border-radius: 10px;
                box-shadow: 0 10px 25px rgba(139, 58, 58, 0.4);
                z-index: 2100;
                animation: slideIn 0.3s ease-out;
            }

            @keyframes slideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }

            .user-section {
                display: flex;
                align-items: center;
                gap: 15px;
                position: relative;
            }

            .user-info {
                display: flex;
                align-items: center;
                gap: 10px;
                cursor: pointer;
            }

            .user-avatar {
                width: 40px;
                height: 40px;
                border-radius: 50%;
                border: 2px solid #8B3A3A;
                overflow: hidden;
            }

            .user-avatar img {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }

            .user-details {
                color: white;
            }

            .username {
                font-weight: bold;
                font-size: 0.9rem;
            }

            .user-level {
                font-size: 0.8rem;
                color: #CD5C5C;
            }

            .user-menu {
                position: absolute;
                top: 100%;
                right: 0;
                background: rgba(43, 43, 43, 0.95);
                border: 2px solid rgba(139, 58, 58, 0.4);
                border-radius: 10px;
                padding: 10px 0;
                min-width: 150px;
                z-index: 1000;
                backdrop-filter: blur(10px);
            }

            .user-menu a {
                display: block;
                padding: 10px 20px;
                color: #e0e0e0;
                text-decoration: none;
                transition: all 0.3s ease;
            }

            .user-menu a:hover {
                background: rgba(139, 58, 58, 0.2);
                color: #CD5C5C;
            }

            .auth-buttons {
                display: flex;
                gap: 10px;
            }

            .auth-buttons .btn {
                padding: 8px 20px;
                font-size: 0.9rem;
            }

            @media (max-width: 768px) {
                .auth-content {
                    padding: 30px 20px;
                    margin: 20px;
                }
                
                .form-row {
                    grid-template-columns: 1fr;
                }
                
                .auth-notification {
                    left: 20px;
                    right: 20px;
                    top: auto;
                    bottom: 20px;
                }
            }
        `;
        document.head.appendChild(style);
    }

    // Additional methods for user management
    showUserMenu() {
        const menu = document.getElementById('userMenu');
        if (menu) {
            menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
        }
    }

    showProfile() {
        console.log('Show user profile');
        // Implement profile modal
    }

    showSettings() {
        console.log('Show user settings');
        // Implement settings modal
    }

    showForgotPassword() {
        console.log('Show forgot password modal');
        // Implement forgot password functionality
    }
}

// Initialize authentication manager
const authManager = new AuthManager();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AuthManager;
}