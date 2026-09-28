/**
 * NSS SLIET - Event Announcement Pop-up Screen
 * Handles the NSS Day Celebration announcement modal:
 * - Automatically displays when user first opens the web
 * - Allows dismissing via cross button (✕), backdrop, or Esc key
 * - Remembers user's dismissal in sessionStorage to allow smooth uninterrupted browsing
 * - Provides a floating trigger so user can revisit the announcement anytime
 */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', () => {
    const overlay = document.getElementById('nssEventPopup');
    const closeBtn = document.getElementById('nssPopupCloseBtn');
    const dismissBtn = document.getElementById('nssPopupDismissBtn');
    const reopenBtn = document.getElementById('nssPopupReopenBtn');
    const primaryAction = document.getElementById('nssPopupPrimaryBtn');

    if (!overlay) return;

    const STORAGE_KEY = 'nss_day_popup_seen';

    function openPopup() {
      overlay.classList.add('is-active');
      overlay.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      if (reopenBtn) {
        reopenBtn.classList.remove('is-visible');
      }
      // Focus close button for accessibility
      setTimeout(() => {
        closeBtn?.focus();
      }, 100);
    }

    function closePopup() {
      overlay.classList.remove('is-active');
      overlay.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      try {
        sessionStorage.setItem(STORAGE_KEY, 'true');
      } catch (e) {
        // Fallback if sessionStorage is disabled
      }
      if (reopenBtn) {
        reopenBtn.classList.add('is-visible');
      }
    }

    // Dismissal handlers
    closeBtn?.addEventListener('click', (e) => {
      e.preventDefault();
      closePopup();
    });

    dismissBtn?.addEventListener('click', (e) => {
      e.preventDefault();
      closePopup();
    });

    primaryAction?.addEventListener('click', () => {
      closePopup();
    });

    // Reopen handler
    reopenBtn?.addEventListener('click', () => {
      openPopup();
    });

    // Close when clicking the dark backdrop outside the modal
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        closePopup();
      }
    });

    // Close on Escape key press
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && overlay.classList.contains('is-active')) {
        closePopup();
      }
    });

    // Check if user has already dismissed popup in this session
    let hasDismissed = false;
    try {
      hasDismissed = sessionStorage.getItem(STORAGE_KEY) === 'true';
    } catch (e) {
      hasDismissed = false;
    }

    if (!hasDismissed) {
      // Show automatically when firstly opening the web (smooth short delay)
      setTimeout(openPopup, 450);
    } else {
      // If already dismissed, show floating badge so user still has access
      if (reopenBtn) {
        reopenBtn.classList.add('is-visible');
      }
    }
  });
})();
