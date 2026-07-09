// =========================================================
//  Photography Portfolio — Feature Activation Gate System
//  Handles dynamic modal rendering and activation workflows
// =========================================================

const FeatureActivation = {
  // Features list with descriptions and icons
  features: [
    { id: 'like', name: 'Real-time Showcase Liking', desc: 'Love a photo? Save it to your favorites instantly and boost its popularity.', icon: '❤️' },
    { id: 'follow', name: 'Photographer Connections', desc: 'Follow your favorite artists to track their updates and new portfolio uploads.', icon: '👥' },
    { id: 'booking', name: 'Direct Event Booking', desc: 'Securely book custom sessions, choose session types, budgets, and submit details.', icon: '✉️' },
    { id: 'dashboard', name: 'Personalized Workspace', desc: 'Access your photographer portfolio settings, analytics, or client dashboard.', icon: '📊' }
  ],

  init() {
    this._injectStyles();
    this._createModalContainer();
  },

  _injectStyles() {
    if (document.getElementById('activation-gate-styles')) return;

    const styles = document.createElement('style');
    styles.id = 'activation-gate-styles';
    styles.textContent = `
      /* ── FEATURE GATE MODAL ── */
      .act-modal-overlay {
        position: fixed;
        inset: 0;
        z-index: 15000;
        background: rgba(3, 7, 18, 0.85);
        backdrop-filter: blur(12px);
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 1.5rem;
        opacity: 0;
        visibility: hidden;
        transition: opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1), visibility 0.4s;
      }
      
      .act-modal-overlay.active {
        opacity: 1;
        visibility: visible;
      }
      
      .act-modal-card {
        background: linear-gradient(145deg, rgba(17, 24, 39, 0.95), rgba(11, 15, 25, 0.98));
        border: 1px solid rgba(234, 179, 8, 0.25);
        box-shadow: 0 0 50px rgba(234, 179, 8, 0.1), inset 0 0 20px rgba(255, 255, 255, 0.02);
        border-radius: 24px;
        width: 100%;
        max-width: 580px;
        padding: 2.5rem;
        position: relative;
        overflow: hidden;
        transform: scale(0.9) translateY(20px);
        transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
      }
      
      .act-modal-overlay.active .act-modal-card {
        transform: scale(1) translateY(0);
      }
      
      .act-modal-close {
        position: absolute;
        top: 1.25rem;
        right: 1.25rem;
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.1);
        color: var(--text-muted);
        width: 32px;
        height: 32px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: var(--transition);
        font-size: 0.85rem;
      }
      .act-modal-close:hover {
        background: rgba(239, 68, 68, 0.15);
        color: #ef4444;
        border-color: rgba(239, 68, 68, 0.3);
        transform: rotate(90deg);
      }
      
      /* Header & Spinning Core */
      .act-header {
        text-align: center;
        margin-bottom: 2rem;
        position: relative;
      }
      
      .act-core-wrapper {
        position: relative;
        width: 70px;
        height: 70px;
        margin: 0 auto 1.25rem;
      }
      
      .act-core-glow {
        position: absolute;
        inset: -5px;
        border-radius: 50%;
        background: radial-gradient(circle, var(--accent) 0%, transparent 70%);
        opacity: 0.5;
        filter: blur(8px);
        animation: pulseCore 2.5s infinite alternate;
      }
      
      .act-core-ring {
        position: absolute;
        inset: 0;
        border: 2px dashed var(--accent);
        border-radius: 50%;
        animation: rotateCore 15s linear infinite;
      }
      
      .act-core-icon {
        position: absolute;
        inset: 6px;
        background: rgba(3, 7, 18, 0.9);
        border: 1.5px solid var(--accent);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.6rem;
      }
      
      .act-title {
        font-family: 'Playfair Display', serif;
        font-size: 1.8rem;
        font-weight: 700;
        color: #fff;
        letter-spacing: -0.5px;
        margin-bottom: 0.5rem;
      }
      .act-title span {
        color: var(--accent);
        text-shadow: 0 0 10px rgba(234, 179, 8, 0.3);
      }
      
      .act-subtitle {
        color: var(--text-secondary);
        font-size: 0.9rem;
        max-width: 420px;
        margin: 0 auto;
        line-height: 1.5;
      }
      
      /* Features List */
      .act-list {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        margin-bottom: 2.25rem;
      }
      
      .act-item {
        display: flex;
        gap: 1rem;
        padding: 1rem;
        background: rgba(255, 255, 255, 0.02);
        border: 1px solid rgba(255, 255, 255, 0.05);
        border-radius: 14px;
        transition: var(--transition);
      }
      
      .act-item:hover {
        background: rgba(234, 179, 8, 0.03);
        border-color: rgba(234, 179, 8, 0.15);
      }
      
      .act-item.highlight-feature {
        border-color: rgba(234, 179, 8, 0.4);
        background: rgba(234, 179, 8, 0.04);
        box-shadow: 0 0 15px rgba(234, 179, 8, 0.05);
      }
      
      .act-item-icon {
        width: 40px;
        height: 40px;
        border-radius: 10px;
        background: rgba(255, 255, 255, 0.04);
        border: 1px solid rgba(255, 255, 255, 0.08);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.15rem;
        flex-shrink: 0;
      }
      
      .act-item.highlight-feature .act-item-icon {
        background: rgba(234, 179, 8, 0.1);
        border-color: rgba(234, 179, 8, 0.3);
        color: var(--accent);
      }
      
      .act-item-content {
        flex-grow: 1;
      }
      
      .act-item-title {
        font-size: 0.95rem;
        font-weight: 600;
        color: #fff;
        margin-bottom: 0.2rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      
      .act-item-status {
        font-size: 0.7rem;
        text-transform: uppercase;
        letter-spacing: 1px;
        font-weight: 700;
        padding: 0.2rem 0.6rem;
        border-radius: 50px;
      }
      
      .act-status-locked {
        background: rgba(239, 68, 68, 0.1);
        color: #ef4444;
        border: 1px solid rgba(239, 68, 68, 0.25);
      }
      
      .act-status-active {
        background: rgba(34, 197, 94, 0.1);
        color: #22c55e;
        border: 1px solid rgba(34, 197, 94, 0.25);
        box-shadow: 0 0 10px rgba(34, 197, 94, 0.15);
      }
      
      .act-item-desc {
        color: var(--text-muted);
        font-size: 0.78rem;
        line-height: 1.4;
      }
      
      /* Actions */
      .act-actions {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
        text-align: center;
      }
      
      /* Keyframes */
      @keyframes pulseCore {
        0% { opacity: 0.3; transform: scale(0.95); }
        100% { opacity: 0.6; transform: scale(1.08); }
      }
      
      @keyframes rotateCore {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
      
      /* ── FULL SCREEN ACTIVATION SCREEN ── */
      .act-screen-overlay {
        position: fixed;
        inset: 0;
        z-index: 20000;
        background: #030712;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        opacity: 0;
        visibility: hidden;
        transition: opacity 0.5s ease, visibility 0.5s;
        color: #fff;
        padding: 2rem;
      }
      
      .act-screen-overlay.active {
        opacity: 1;
        visibility: visible;
      }
      
      .act-terminal {
        width: 100%;
        max-width: 600px;
        background: rgba(11, 15, 25, 0.7);
        border: 1px solid rgba(234, 179, 8, 0.3);
        border-radius: 16px;
        padding: 2rem;
        font-family: 'Courier New', Courier, monospace;
        color: #38bdf8; /* Light blue terminal style */
        box-shadow: 0 0 40px rgba(234, 179, 8, 0.05);
        margin-top: 1.5rem;
        font-size: 0.85rem;
      }
      
      .act-terminal-header {
        display: flex;
        gap: 0.4rem;
        margin-bottom: 1.25rem;
        border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        padding-bottom: 0.5rem;
      }
      .act-dot {
        width: 10px; height: 10px; border-radius: 50%;
      }
      .act-dot-r { background: #ef4444; }
      .act-dot-y { background: #eab308; }
      .act-dot-g { background: #22c55e; }
      
      .act-terminal-line {
        margin-bottom: 0.6rem;
        white-space: pre-wrap;
        line-height: 1.4;
      }
      
      .act-terminal-line.success {
        color: #22c55e;
      }
      .act-terminal-line.warning {
        color: #eab308;
      }
      
      .act-progress-bar-wrapper {
        width: 100%;
        height: 6px;
        background: rgba(255, 255, 255, 0.05);
        border-radius: 10px;
        overflow: hidden;
        margin-top: 1.5rem;
      }
      
      .act-progress-bar {
        width: 0%;
        height: 100%;
        background: linear-gradient(90deg, var(--accent-dark), var(--accent));
        border-radius: 10px;
        box-shadow: 0 0 10px var(--accent);
        transition: width 0.1s linear;
      }
    `;
    document.head.appendChild(styles);
  },

  _createModalContainer() {
    if (document.getElementById('activation-gate-modal')) return;

    const modal = document.createElement('div');
    modal.id = 'activation-gate-modal';
    modal.className = 'act-modal-overlay';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.innerHTML = `
      <div class="act-modal-card">
        <button class="act-modal-close" onclick="FeatureActivation.closeGate()">&times;</button>
        
        <div class="act-header">
          <div class="act-core-wrapper">
            <div class="act-core-glow"></div>
            <div class="act-core-ring"></div>
            <div class="act-core-icon">🔑</div>
          </div>
          <h2 class="act-title">Activate <span>LensArt</span> Features</h2>
          <p class="act-subtitle" id="act-modal-subtitle">To experience direct bookings, photographer follows, and likes, activate the LensArt dashboard pipeline.</p>
        </div>
        
        <div class="act-list" id="act-features-list">
          <!-- Populated Dynamically -->
        </div>
        
        <div class="act-actions">
          <button id="act-primary-btn" class="btn btn-primary" style="width: 100%; padding: 0.85rem; font-size: 0.95rem;">
            Authenticate to Activate Features
          </button>
          <button class="btn btn-ghost" onclick="FeatureActivation.closeGate()" style="width: 100%; padding: 0.85rem; font-size: 0.95rem;">
            Browse as Guest
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    // Bind backdrop close
    modal.addEventListener('click', (e) => {
      if (e.target === modal) this.closeGate();
    });
  },

  /**
   * Render features showing their locked/active state
   * @param {string} highlightId - ID of feature to highlight
   */
  _renderFeatures(highlightId = '') {
    const listContainer = document.getElementById('act-features-list');
    if (!listContainer) return;

    const loggedIn = window.Auth ? Auth.isLoggedIn() : false;

    listContainer.innerHTML = this.features.map(f => {
      const isHighlighted = f.id === highlightId;
      const statusLabel = loggedIn ? 'Activated' : 'Locked';
      const statusClass = loggedIn ? 'act-status-active' : 'act-status-locked';
      
      return `
        <div class="act-item ${isHighlighted ? 'highlight-feature' : ''}">
          <div class="act-item-icon">${f.icon}</div>
          <div class="act-item-content">
            <div class="act-item-title">
              <span>${f.name}</span>
              <span class="act-item-status ${statusClass}">${statusLabel}</span>
            </div>
            <div class="act-item-desc">${f.desc}</div>
          </div>
        </div>
      `;
    }).join('');
  },

  /**
   * Triggers the Activation Gate Modal
   * @param {string} featureId - 'like', 'follow', 'booking', 'dashboard'
   * @param {string} redirectUrl - URL to return to after auth
   */
  showGate(featureId = '', redirectUrl = '') {
    this._createModalContainer();
    this._renderFeatures(featureId);

    const modal = document.getElementById('activation-gate-modal');
    if (!modal) return;

    // Update modal description if matching a specific feature
    const subtitle = document.getElementById('act-modal-subtitle');
    if (subtitle) {
      if (featureId === 'booking') {
        subtitle.innerHTML = 'You are trying to submit a <strong>Commission request</strong>. Activating booking channels requires account clearance.';
      } else if (featureId === 'follow') {
        subtitle.innerHTML = 'You are trying to <strong>Follow an artist</strong>. Building connections requires authorization.';
      } else if (featureId === 'like') {
        subtitle.innerHTML = 'You are trying to <strong>Like a photo</strong>. Storing favorite images requires account activation.';
      } else if (featureId === 'dashboard') {
        subtitle.innerHTML = 'Access to your <strong>Personal Dashboard</strong> is restricted. Please sign in to authenticate your user token.';
      } else {
        subtitle.textContent = 'To experience direct bookings, photographer follows, and likes, activate the LensArt dashboard pipeline.';
      }
    }

    // Set button behavior
    const primaryBtn = document.getElementById('act-primary-btn');
    if (primaryBtn) {
      const pagePrefix = window.location.pathname.includes('/photographer/') ? '../' : './';
      const finalRedir = redirectUrl || window.location.href;
      
      primaryBtn.textContent = 'Sign In to Activate Features';
      primaryBtn.onclick = () => {
        this.closeGate();
        window.location.href = `${pagePrefix}login.html?redirect=${encodeURIComponent(finalRedir)}&activate=true`;
      };
    }

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  },

  closeGate() {
    const modal = document.getElementById('activation-gate-modal');
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  },

  /**
   * Run full-screen activation overlay matrix sequence on login page
   * @param {Function} callback - Ran when animation is complete
   */
  runActivationSequence(callback) {
    // Injects full screen console matrix overlays
    let overlay = document.getElementById('activation-screen-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'activation-screen-overlay';
      overlay.className = 'act-screen-overlay';
      overlay.innerHTML = `
        <div style="text-align:center; max-width: 500px;">
          <h2 style="font-family:'Playfair Display',serif; font-size:2.25rem; color:var(--accent); margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 2px;">Establishing Secure Handshake</h2>
          <p style="color:var(--text-secondary); font-size:0.875rem;">Initializing LensArt premium dashboard modules and client endpoints...</p>
        </div>
        
        <div class="act-terminal">
          <div class="act-terminal-header">
            <div class="act-dot act-dot-r"></div>
            <div class="act-dot act-dot-y"></div>
            <div class="act-dot act-dot-g"></div>
            <span style="font-size:0.75rem; margin-left: 0.5rem; color: var(--text-muted);">LENSART CORE ACTIVATION SYSTEM v2.6.4</span>
          </div>
          <div id="act-terminal-body" style="height: 180px; overflow-y: auto; text-align: left; padding: 0.5rem 0;"></div>
          <div class="act-progress-bar-wrapper">
            <div class="act-progress-bar" id="act-progress-bar"></div>
          </div>
        </div>
      `;
      document.body.appendChild(overlay);
    }

    // Trigger open
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';

    const termBody = document.getElementById('act-terminal-body');
    const progBar = document.getElementById('act-progress-bar');
    
    // Log items sequence
    const lines = [
      { text: '> Initializing authorization token handshake...', delay: 100, class: '' },
      { text: '> Handshake established. Loading user session credentials...', delay: 500, class: 'success' },
      { text: '> Binding pipeline resources for LIKING & FAVORITING...', delay: 900, class: '' },
      { text: '> [✓] Gallery pipeline bound successfully.', delay: 1300, class: 'success' },
      { text: '> Constructing event booking tables and budgets database...', delay: 1600, class: '' },
      { text: '> [✓] Commission channels authorized for booking requests.', delay: 2000, class: 'success' },
      { text: '> Setting up social nodes for FOLLOW system updates...', delay: 2300, class: '' },
      { text: '> [✓] Artist nodes connected.', delay: 2600, class: 'success' },
      { text: '> Syncing client dashboard profile properties...', delay: 2800, class: 'warning' },
      { text: '> [✓] Profile parameters aligned.', delay: 3100, class: 'success' },
      { text: '> Clearing cache... Authorizing token redirection... Secure pipeline ACTIVE.', delay: 3400, class: 'success' }
    ];

    // Animate lines and progress bar
    lines.forEach((line, index) => {
      setTimeout(() => {
        const div = document.createElement('div');
        div.className = `act-terminal-line ${line.class}`;
        div.innerHTML = line.text;
        termBody.appendChild(div);
        
        // Progress percentage
        const pct = Math.min(100, Math.round(((index + 1) / lines.length) * 100));
        progBar.style.width = `${pct}%`;
        
        // Scroll terminal to bottom
        termBody.scrollTop = termBody.scrollHeight;
      }, line.delay);
    });

    // Complete transition redirect
    setTimeout(() => {
      overlay.classList.remove('active');
      document.body.style.overflow = '';
      if (callback) callback();
    }, 4000);
  }
};

// Auto initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
  FeatureActivation.init();
});

// Bind to window global space
window.FeatureActivation = FeatureActivation;
