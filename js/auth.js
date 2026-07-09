// ================================================
//  Photography Portfolio — Authentication Manager
//  Storage: localStorage (client-side only)
// ================================================

// Load feature activation engine dynamically if needed
if (!window.FeatureActivation) {
  const script = document.createElement('script');
  const pathPrefix = window.location.pathname.includes('/photographer/') ? '../' : './';
  script.src = `${pathPrefix}js/activation.js`;
  document.head.appendChild(script);
}

const Auth = {

  USERS_KEY: 'photofolio_users',
  SESSION_KEY: 'photofolio_session',

  // ── Getters ──────────────────────────────────

  getUsers() {
    try {
      return JSON.parse(localStorage.getItem(this.USERS_KEY) || '[]');
    } catch { return []; }
  },

  saveUsers(users) {
    localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
  },

  getCurrentUser() {
    try {
      return JSON.parse(localStorage.getItem(this.SESSION_KEY) || 'null');
    } catch { return null; }
  },

  setSession(user) {
    const safeUser = { id: user.id, name: user.name, email: user.email, role: user.role || 'client' };
    localStorage.setItem(this.SESSION_KEY, JSON.stringify(safeUser));
  },

  clearSession() {
    localStorage.removeItem(this.SESSION_KEY);
  },

  isLoggedIn() {
    return this.getCurrentUser() !== null;
  },

  // ── Operations ────────────────────────────────

  /**
   * Register a new user.
   * @param {string} name
   * @param {string} email
   * @param {string} password
   * @returns {{ success: boolean, message?: string }}
   */
  signup(name, email, password, role = 'client') {
    if (!name.trim() || !email.trim() || !password) {
      return { success: false, message: 'All fields are required.' };
    }

    if (!this.isValidEmail(email)) {
      return { success: false, message: 'Please enter a valid email address.' };
    }

    if (password.length < 6) {
      return { success: false, message: 'Password must be at least 6 characters.' };
    }

    const users = this.getUsers();
    if (users.find(u => u.email.toLowerCase() === email.toLowerCase().trim())) {
      return { success: false, message: 'An account with this email already exists.' };
    }

    const newUser = {
      id: 'usr_' + Date.now(),
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: btoa(encodeURIComponent(password)),  // obfuscated (not production-grade)
      role: role,
      createdAt: new Date().toISOString(),
      favorites: [],
      // Photographer specific details
      specialty: 'Portrait',
      location: 'Paris, France',
      rate: '150',
      bio: 'Professional photographer ready for bookings.',
      portfolioPhotos: []
    };

    users.push(newUser);
    this.saveUsers(users);
    this.setSession(newUser);

    return { success: true, user: newUser };
  },

  /**
   * Log in an existing user.
   * @param {string} email
   * @param {string} password
   * @param {boolean} remember
   * @returns {{ success: boolean, message?: string, user?: object }}
   */
  login(email, password, remember = false) {
    if (!email.trim() || !password) {
      return { success: false, message: 'Please enter your email and password.' };
    }

    const users = this.getUsers();
    const encoded = btoa(encodeURIComponent(password));
    const user = users.find(
      u => u.email === email.toLowerCase().trim() && u.password === encoded
    );

    if (!user) {
      return { success: false, message: 'Invalid email or password. Please try again.' };
    }

    this.setSession(user);

    if (remember) {
      localStorage.setItem('photofolio_remembered_email', email.toLowerCase().trim());
    } else {
      localStorage.removeItem('photofolio_remembered_email');
    }

    return { success: true, user };
  },

  /**
   * Log out the current user and redirect.
   * @param {string} redirectUrl
   */
  logout(redirectUrl = 'index.html') {
    this.clearSession();
    window.location.href = redirectUrl;
  },

  /**
   * Simulate forgot-password email send.
   * @param {string} email
   * @returns {{ success: boolean, message: string }}
   */
  forgotPassword(email) {
    if (!email.trim()) {
      return { success: false, message: 'Please enter your email address.' };
    }

    if (!this.isValidEmail(email)) {
      return { success: false, message: 'Please enter a valid email address.' };
    }

    const users = this.getUsers();
    const exists = users.find(u => u.email === email.toLowerCase().trim());

    // Security: don't reveal if email exists
    if (!exists) {
      // Still return success to prevent email enumeration
      return {
        success: true,
        message: `If an account exists for ${email}, a reset link has been sent.`
      };
    }

    // In a real app you would call a backend API here.
    return {
      success: true,
      message: `Password reset link sent to ${email}. Please check your inbox (and spam folder).`
    };
  },

  // ── Helpers ───────────────────────────────────

  isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  },

  getRememberedEmail() {
    return localStorage.getItem('photofolio_remembered_email') || '';
  },

  // ── UI Helpers ────────────────────────────────

  /**
   * Inject auth state into navbar.
   * Call on every page. Provide root prefix for pages in subdirectories.
   * @param {string} root - e.g. './' for root pages, '../' for /photographer/ pages
   */
  updateNav(root = './') {
    const navAuth = document.getElementById('nav-auth');
    if (!navAuth) return;

    const user = this.getCurrentUser();

    if (user) {
      navAuth.innerHTML = `
        <span class="nav-user-greeting">
          Hello, <strong>${this.escapeHtml(user.name.split(' ')[0])}</strong>
        </span>
        <a href="${root}dashboard.html" class="btn btn-ghost" style="font-size:0.8rem;padding:0.5rem 1.1rem;">
          Dashboard
        </a>
        <button
          onclick="Auth.logout('${root}index.html')"
          class="btn btn-danger"
          style="font-size:0.8rem;padding:0.5rem 1.1rem;"
        >
          Logout
        </button>
      `;
    } else {
      navAuth.innerHTML = `
        <a href="${root}login.html" class="btn btn-ghost">Login</a>
        <a href="${root}signup.html" class="btn btn-primary">Sign Up Free</a>
      `;
    }
  },

  /**
   * Redirect to login if user is NOT logged in.
   * @param {string} loginUrl
   */
  requireAuth(loginUrl = 'login.html') {
    if (!this.isLoggedIn()) {
      window.location.href = loginUrl;
      return false;
    }
    return true;
  },

  /**
   * Redirect away from auth pages if already logged in.
   * @param {string} redirectUrl
   */
  redirectIfLoggedIn(redirectUrl = 'dashboard.html') {
    if (this.isLoggedIn()) {
      window.location.href = redirectUrl;
      return true;
    }
    return false;
  },

  escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }
};

// Make globally accessible
window.Auth = Auth;

// polished
