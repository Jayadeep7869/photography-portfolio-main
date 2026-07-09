// ================================================
//  Photography Portfolio — Gallery & Lightbox
// ================================================

const Gallery = {
  images: [],          // Array of { src, alt, caption }
  currentIndex: 0,
  isOpen: false,

  /**
   * Initialize gallery with image data and bind events.
   * @param {Array} images - [{ src, alt, caption }]
   */
  init(images) {
    this.images = images;
    this._bindKeyboard();
    this._bindBackdrop();
    this._bindSwipe();

    // Pre-initialize stats for all images
    images.forEach(photo => {
      this.getStats(photo.src);
    });
  },

  /**
   * Open lightbox at given index.
   */
  open(index) {
    const lb     = document.getElementById('lightbox');
    const img    = document.getElementById('lightbox-img');
    const counter = document.getElementById('lightbox-counter');

    if (!lb || !img) return;

    this.currentIndex = index;
    this.isOpen = true;

    const photo = this.images[index];

    // Increment view count on open
    const stats = this.incrementViews(photo.src);
    const liked = this.isLiked(photo.src);

    // Update views count on the masonry card
    const masonryViews = document.getElementById(`masonry-views-${index}`);
    if (masonryViews) {
      masonryViews.textContent = `👁️ ${stats.views}`;
    }

    img.src = photo.src;
    img.alt = photo.alt || 'Photograph';

    if (counter) {
      counter.textContent = `${index + 1} / ${this.images.length}`;
    }

    const infoContainer = document.querySelector('.lightbox-info');
    if (infoContainer) {
      infoContainer.innerHTML = `
        <span class="lightbox-caption" id="lightbox-caption">${photo.caption || ''}</span>
        <div class="lightbox-stats-container">
          <span class="lightbox-stat">👁️ ${stats.views} views</span>
          <button class="lightbox-like-btn ${liked ? 'liked' : ''}" id="lightbox-like-btn" onclick="Gallery.handleLightboxLikeClick()">
            ❤️ Like (${stats.likes})
          </button>
        </div>
      `;
    }

    lb.classList.add('active');
    document.body.style.overflow = 'hidden';
  },

  /**
   * Close the lightbox.
   */
  close() {
    const lb = document.getElementById('lightbox');
    if (lb) {
      lb.classList.remove('active');
      document.body.style.overflow = '';
      this.isOpen = false;
    }
  },

  /** Navigate to previous image. */
  prev() {
    if (!this.isOpen) return;
    this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
    this._updateImage();
  },

  /** Navigate to next image. */
  next() {
    if (!this.isOpen) return;
    this.currentIndex = (this.currentIndex + 1) % this.images.length;
    this._updateImage();
  },

  /** Update lightbox image in-place (no close/open flicker). */
  _updateImage() {
    const img     = document.getElementById('lightbox-img');
    const counter = document.getElementById('lightbox-counter');
    const infoContainer = document.querySelector('.lightbox-info');

    if (!img) return;

    // Brief fade
    img.style.opacity = '0';
    img.style.transform = 'scale(0.95)';

    setTimeout(() => {
      const photo = this.images[this.currentIndex];

      // Increment view count on navigation
      const stats = this.incrementViews(photo.src);
      const liked = this.isLiked(photo.src);

      // Update views count on the masonry card
      const masonryViews = document.getElementById(`masonry-views-${this.currentIndex}`);
      if (masonryViews) {
        masonryViews.textContent = `👁️ ${stats.views}`;
      }

      img.src = photo.src;
      img.alt = photo.alt || 'Photograph';
      img.style.opacity = '1';
      img.style.transform = 'scale(1)';

      if (counter) counter.textContent = `${this.currentIndex + 1} / ${this.images.length}`;

      if (infoContainer) {
        infoContainer.innerHTML = `
          <span class="lightbox-caption" id="lightbox-caption">${photo.caption || ''}</span>
          <div class="lightbox-stats-container">
            <span class="lightbox-stat">👁️ ${stats.views} views</span>
            <button class="lightbox-like-btn ${liked ? 'liked' : ''}" id="lightbox-like-btn" onclick="Gallery.handleLightboxLikeClick()">
              ❤️ Like (${stats.likes})
            </button>
          </div>
        `;
      }
    }, 150);

    img.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
  },

  _bindKeyboard() {
    document.addEventListener('keydown', (e) => {
      if (!this.isOpen) return;
      if (e.key === 'Escape')     this.close();
      if (e.key === 'ArrowLeft')  this.prev();
      if (e.key === 'ArrowRight') this.next();
    });
  },

  _bindBackdrop() {
    const lb = document.getElementById('lightbox');
    if (!lb) return;
    lb.addEventListener('click', (e) => {
      if (e.target === lb) this.close();
    });
  },

  /** Basic touch swipe support for mobile. */
  _bindSwipe() {
    const lb = document.getElementById('lightbox');
    if (!lb) return;

    let startX = 0;
    lb.addEventListener('touchstart', (e) => { startX = e.changedTouches[0].clientX; }, { passive: true });
    lb.addEventListener('touchend', (e) => {
      const dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) < 50) return;
      if (dx > 0) this.prev();
      else        this.next();
    }, { passive: true });
  },

  /**
   * Build gallery items from an array and inject into a container.
   * @param {string} containerId
   * @param {Array}  images - same format as init()
   */
  render(containerId, images) {
    const container = document.getElementById(containerId);
    if (!container) return;

    this.init(images);

    container.innerHTML = images.map((photo, i) => {
      const stats = this.getStats(photo.src);
      const liked = this.isLiked(photo.src);
      return `
        <div class="masonry-item" data-index="${i}" data-category="${photo.category || 'all'}"
             onclick="Gallery.open(${i})" title="Click to enlarge">
          <img
            src="${photo.src}"
            alt="${photo.alt || 'Photograph'}"
            loading="lazy"
          />
          <div class="masonry-overlay">
            <div class="masonry-overlay-icon">&#128269;</div>
            <span class="masonry-overlay-caption">${photo.caption || 'View'}</span>
            <div class="masonry-stats-row" onclick="event.stopPropagation();">
              <span class="masonry-stat" id="masonry-views-${i}">👁️ ${stats.views}</span>
              <button class="masonry-like-btn ${liked ? 'liked' : ''}" id="masonry-like-btn-${i}" onclick="Gallery.handleLikeClick(event, ${i})">
                <span class="like-icon">❤️</span> <span id="masonry-likes-${i}">${stats.likes}</span>
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');
  },

  /**
   * Filter visible items by category.
   * @param {string} category - 'all' or specific
   */
  filter(category) {
    const items = document.querySelectorAll('.masonry-item');
    items.forEach(item => {
      if (category === 'all' || item.dataset.category === category) {
        item.style.display = '';
      } else {
        item.style.display = 'none';
      }
    });

    // Update active filter button
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.filter === category);
    });
  },

  // ── Database / LocalStorage helpers ──

  getStats(src) {
    let stats = {};
    try {
      stats = JSON.parse(localStorage.getItem('photofolio_gallery_stats') || '{}');
    } catch (e) {
      stats = {};
    }
    if (!stats[src]) {
      stats[src] = {
        views: Math.floor(Math.random() * 250) + 50,
        likes: Math.floor(Math.random() * 70) + 10
      };
      localStorage.setItem('photofolio_gallery_stats', JSON.stringify(stats));
    }
    return stats[src];
  },

  incrementViews(src) {
    let stats = {};
    try {
      stats = JSON.parse(localStorage.getItem('photofolio_gallery_stats') || '{}');
    } catch (e) {
      stats = {};
    }
    if (!stats[src]) {
      stats[src] = {
        views: Math.floor(Math.random() * 250) + 50,
        likes: Math.floor(Math.random() * 70) + 10
      };
    }
    stats[src].views += 1;
    localStorage.setItem('photofolio_gallery_stats', JSON.stringify(stats));
    return stats[src];
  },

  toggleLike(src) {
    if (window.Auth && !Auth.isLoggedIn()) {
      if (window.FeatureActivation) {
        FeatureActivation.showGate('like');
      }
      return null;
    }

    const user = window.Auth ? Auth.getCurrentUser() : null;
    const userId = user ? user.id : 'anon';
    const userLikesKey = 'photofolio_user_likes_' + userId;

    let userLikes = {};
    try {
      userLikes = JSON.parse(localStorage.getItem(userLikesKey) || '{}');
    } catch (e) {
      userLikes = {};
    }

    let stats = {};
    try {
      stats = JSON.parse(localStorage.getItem('photofolio_gallery_stats') || '{}');
    } catch (e) {
      stats = {};
    }
    if (!stats[src]) {
      stats[src] = {
        views: Math.floor(Math.random() * 250) + 50,
        likes: Math.floor(Math.random() * 70) + 10
      };
    }

    let liked = false;
    if (userLikes[src]) {
      delete userLikes[src];
      stats[src].likes = Math.max(0, stats[src].likes - 1);
      liked = false;
    } else {
      userLikes[src] = true;
      stats[src].likes += 1;
      liked = true;
    }

    localStorage.setItem(userLikesKey, JSON.stringify(userLikes));
    localStorage.setItem('photofolio_gallery_stats', JSON.stringify(stats));
    return { stats: stats[src], liked };
  },

  isLiked(src) {
    const user = window.Auth ? Auth.getCurrentUser() : null;
    const userId = user ? user.id : 'anon';
    const userLikesKey = 'photofolio_user_likes_' + userId;
    try {
      const userLikes = JSON.parse(localStorage.getItem(userLikesKey) || '{}');
      return !!userLikes[src];
    } catch (e) {
      return false;
    }
  },

  handleLikeClick(event, index) {
    event.stopPropagation();
    const photo = this.images[index];
    const result = this.toggleLike(photo.src);
    if (!result) return;

    const { stats, liked } = result;

    const likeBtn = document.getElementById(`masonry-like-btn-${index}`);
    const likesCount = document.getElementById(`masonry-likes-${index}`);
    if (likeBtn && likesCount) {
      likeBtn.classList.toggle('liked', liked);
      likesCount.textContent = stats.likes;
    }

    if (this.isOpen && this.currentIndex === index) {
      const lbLikeBtn = document.getElementById('lightbox-like-btn');
      if (lbLikeBtn) {
        lbLikeBtn.classList.toggle('liked', liked);
        lbLikeBtn.innerHTML = `❤️ Like (${stats.likes})`;
      }
    }
  },

  handleLightboxLikeClick() {
    this.handleLikeClick({ stopPropagation: () => {} }, this.currentIndex);
  }
};

window.Gallery = Gallery;

// polished
