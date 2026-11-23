/* Better Rosales - Main JavaScript */

// ─── PWA Install Prompt ─────────────────────────────────────────────────────
var deferredInstallPrompt = null;

window.addEventListener('beforeinstallprompt', function (e) {
  e.preventDefault();
  deferredInstallPrompt = e;
  showInstallBanner();
});

function showInstallBanner() {
  // Don't show if already installed or dismissed recently
  if (window.matchMedia('(display-mode: standalone)').matches) return;
  if (navigator.standalone) return;
  // Reading storage throws outright in Safari private browsing and wherever
  // site data is blocked; treat that as "not dismissed" rather than letting it
  // abort the rest of this handler.
  try {
    if (sessionStorage.getItem('pwa-install-dismissed')) return;
  } catch (e) {
    /* storage unavailable — fall through and show the banner */
  }

  var existing = document.querySelector('.pwa-install-banner');
  if (existing) return;

  var banner = document.createElement('div');
  banner.className = 'pwa-install-banner';
  banner.setAttribute('role', 'alert');
  banner.setAttribute('aria-live', 'polite');
  banner.innerHTML =
    '<div class="pwa-install-content">' +
    '<i class="bi bi-download" aria-hidden="true"></i>' +
    '<span>Install BetterRosales for quick access to services.</span>' +
    '</div>' +
    '<div class="pwa-install-actions">' +
    '<button class="pwa-install-btn" aria-label="Install BetterRosales app">Install</button>' +
    '<button class="pwa-install-dismiss" aria-label="Dismiss install prompt">&times;</button>' +
    '</div>';

  document.body.appendChild(banner);

  banner.querySelector('.pwa-install-btn').addEventListener('click', function () {
    if (!deferredInstallPrompt) return;
    deferredInstallPrompt.prompt();
    deferredInstallPrompt.userChoice.then(function () {
      deferredInstallPrompt = null;
      banner.remove();
    });
  });

  banner.querySelector('.pwa-install-dismiss').addEventListener('click', function () {
    try {
      sessionStorage.setItem('pwa-install-dismissed', '1');
    } catch (e) {
      /* dismissal will not persist, but the banner still closes */
    }
    banner.remove();
  });
}

// ─── Register Service Worker with seamless updates ──────────────────────────
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function () {
    navigator.serviceWorker
      .register('/sw.js')
      .then(function (reg) {
        // Check for updates every 30 minutes
        setInterval(function () {
          reg.update();
        }, 30 * 60 * 1000);

        reg.addEventListener('updatefound', function () {
          var newWorker = reg.installing;
          if (!newWorker) return;
          newWorker.addEventListener('statechange', function () {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // New SW installed and waiting — show update banner
              showUpdateBanner(newWorker);
            }
          });
        });
      })
      .catch(function (err) {
        console.warn('SW registration failed:', err);
      });

    // When a new SW *replaces an existing one*, reload seamlessly.
    //
    // The guard matters: sw.js calls clients.claim() on activate, so on a first
    // visit the worker claims this page about a second after load and fires
    // controllerchange with no previous controller. Reloading there threw away
    // whatever the visitor was already looking at — including the volunteer
    // dialog, which reveals itself at the 800ms mark and was being torn down
    // mid-animation. An uncontrolled page has nothing stale to refresh, so the
    // first claim should be adopted silently.
    var hadController = !!navigator.serviceWorker.controller;
    var refreshing = false;
    navigator.serviceWorker.addEventListener('controllerchange', function () {
      if (!hadController || refreshing) return;
      refreshing = true;
      window.location.reload();
    });
  });
}

function showUpdateBanner(worker) {
  var existing = document.querySelector('.sw-update-banner');
  if (existing) existing.remove();

  var banner = document.createElement('div');
  banner.setAttribute('role', 'alert');
  banner.setAttribute('aria-live', 'polite');
  banner.className = 'sw-update-banner';
  banner.innerHTML =
    '<span>A new version is available.</span>' +
    '<button class="sw-update-btn" aria-label="Update now">Update</button>' +
    '<button class="sw-update-dismiss" aria-label="Dismiss update notice">&times;</button>';

  document.body.appendChild(banner);

  banner.querySelector('.sw-update-btn').addEventListener('click', function () {
    worker.postMessage({ type: 'SKIP_WAITING' });
    banner.remove();
  });

  banner.querySelector('.sw-update-dismiss').addEventListener('click', function () {
    banner.remove();
  });
}

document.addEventListener('DOMContentLoaded', () => {
  // Prevent double-click on navigation and header links from causing unintended behavior
  const headerLinks = document.querySelectorAll('.site-header a, .main-nav a, .logo-container a');
  headerLinks.forEach((link) => {
    // Prevent text selection on double-click
    link.addEventListener('mousedown', (e) => {
      if (e.detail > 1) {
        e.preventDefault();
      }
    });

    // Handle double-click explicitly
    link.addEventListener('dblclick', (e) => {
      e.preventDefault();
      e.stopPropagation();
      // Stay on current link's destination (don't redirect elsewhere)
      if (link.href && !link.href.startsWith('javascript:')) {
        window.location.href = link.href;
      }
    });
  });

  // Prevent double-click text selection on entire header
  const siteHeader = document.querySelector('.site-header');
  if (siteHeader) {
    siteHeader.addEventListener('mousedown', (e) => {
      if (e.detail > 1) {
        e.preventDefault();
      }
    });
  }

  // Utility: detect mobile breakpoint
  var isMobileNav = function () {
    return window.matchMedia('(max-width: 1024px)').matches;
  };

  // Hotline Marquee (tablet + mobile)
  var initHotlineMarquee = function () {
    var isTabletOrBelow = function () {
      return window.matchMedia('(max-width: 1024px)').matches;
    };
    var hotlineItems = document.querySelector('.hotline-items');
    if (!hotlineItems) return;

    var track = null;
    var originalItems = Array.from(hotlineItems.children);

    var buildMarquee = function () {
      if (!isTabletOrBelow() || track) return;
      track = document.createElement('div');
      track.className = 'hotline-items-track';
      track.setAttribute('aria-label', 'Emergency contacts scrolling');
      while (hotlineItems.firstChild) {
        track.appendChild(hotlineItems.firstChild);
      }
      originalItems.forEach(function (item) {
        var clone = item.cloneNode(true);
        clone.setAttribute('aria-hidden', 'true');
        clone.setAttribute('tabindex', '-1');
        track.appendChild(clone);
      });
      hotlineItems.appendChild(track);
    };

    var destroyMarquee = function () {
      if (!track) return;
      while (hotlineItems.firstChild) {
        hotlineItems.removeChild(hotlineItems.firstChild);
      }
      originalItems.forEach(function (item) {
        hotlineItems.appendChild(item);
      });
      track = null;
    };

    var handleResize = function () {
      if (isTabletOrBelow()) {
        buildMarquee();
      } else {
        destroyMarquee();
      }
    };

    handleResize();
    var resizeTimer;
    window.addEventListener('resize', function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(handleResize, 150);
    });
  };

  initHotlineMarquee();

  // Mobile Menu Toggle
  var createMobileMenu = function () {
    var headerInner = document.querySelector('.header-inner');
    var nav = document.querySelector('.main-nav');

    if (!headerInner || !nav) return;

    var toggleBtn = document.createElement('button');
    toggleBtn.className = 'mobile-menu-toggle btn btn-secondary';
    toggleBtn.innerHTML = '<i class="bi bi-list" aria-hidden="true"></i>';
    toggleBtn.setAttribute('aria-label', 'Toggle Navigation');
    toggleBtn.setAttribute('aria-expanded', 'false');
    toggleBtn.setAttribute('aria-controls', 'main-nav');
    nav.setAttribute('id', 'main-nav');

    var actions = document.querySelector('.header-actions');
    if (actions) {
      headerInner.insertBefore(toggleBtn, actions);
    } else {
      headerInner.appendChild(toggleBtn);
    }

    // Get focusable elements within menu for focus trap
    var getFocusableElements = function () {
      return nav.querySelectorAll('a[href], button:not([disabled])');
    };

    var closeAllDropdowns = function () {
      var openItems = nav.querySelectorAll('.has-dropdown.dropdown-open');
      for (var i = 0; i < openItems.length; i++) {
        openItems[i].classList.remove('dropdown-open');
        var t = openItems[i].querySelector('a[aria-haspopup]');
        if (t) t.setAttribute('aria-expanded', 'false');
      }
    };

    var scrollY = 0;

    var lockBodyScroll = function () {
      scrollY = window.scrollY;
      document.body.classList.add('mobile-menu-open');
      document.body.style.top = '-' + scrollY + 'px';
    };

    var unlockBodyScroll = function () {
      document.body.classList.remove('mobile-menu-open');
      document.body.style.top = '';
      window.scrollTo(0, scrollY);
    };

    var isAnimating = false;

    var closeMobileMenu = function () {
      if (isAnimating) return;
      isAnimating = true;
      toggleBtn.setAttribute('aria-expanded', 'false');
      nav.classList.remove('active');
      toggleBtn.innerHTML = '<i class="bi bi-list" aria-hidden="true"></i>';
      closeAllDropdowns();
      unlockBodyScroll();
      setTimeout(function () {
        isAnimating = false;
      }, 320);
    };

    var openMobileMenu = function () {
      if (isAnimating) return;
      isAnimating = true;
      toggleBtn.setAttribute('aria-expanded', 'true');
      nav.classList.add('active');
      toggleBtn.innerHTML = '<i class="bi bi-x-lg" aria-hidden="true"></i>';
      lockBodyScroll();
      setTimeout(function () {
        isAnimating = false;
      }, 320);
    };

    toggleBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      var isExpanded = toggleBtn.getAttribute('aria-expanded') === 'true';
      if (isExpanded) {
        closeMobileMenu();
        toggleBtn.focus();
      } else {
        openMobileMenu();
      }
    });

    // Click outside to close mobile menu
    document.addEventListener('click', function (e) {
      if (!isMobileNav()) return;
      if (!nav.classList.contains('active')) return;
      if (nav.contains(e.target) || toggleBtn.contains(e.target)) return;
      closeMobileMenu();
    });

    // Close mobile menu when a non-dropdown nav link is clicked
    nav.addEventListener('click', function (e) {
      if (!isMobileNav()) return;
      var link = e.target.closest('a');
      if (!link) return;
      // If it's a dropdown trigger, don't close menu (handled by dropdown init)
      if (link.getAttribute('aria-haspopup') === 'true') return;
      if (link.parentElement && link.parentElement.classList.contains('has-dropdown') && link.parentElement.querySelector('.dropdown-menu')) return;
      closeMobileMenu();
    });

    // Escape key to close mobile menu
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('active')) {
        closeMobileMenu();
        toggleBtn.focus();
      }
    });

    // Focus trap for mobile menu
    nav.addEventListener('keydown', function (e) {
      if (!nav.classList.contains('active')) return;
      if (e.key !== 'Tab') return;

      var focusable = getFocusableElements();
      if (focusable.length === 0) return;
      var firstEl = focusable[0];
      var lastEl = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === firstEl) {
        e.preventDefault();
        lastEl.focus();
      } else if (!e.shiftKey && document.activeElement === lastEl) {
        e.preventDefault();
        firstEl.focus();
      }
    });

    // Clean up on resize: if resized to desktop, reset mobile state (debounced)
    var resizeTimer;
    window.addEventListener('resize', function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () {
        if (!isMobileNav() && nav.classList.contains('active')) {
          isAnimating = false; // force allow close on resize
          closeMobileMenu();
        }
      }, 150);
    });
  };

  createMobileMenu();

  // Dropdown handling: mobile touch/click toggle + desktop keyboard navigation (WCAG 2.1)
  var initDropdowns = function () {
    var dropdownItems = document.querySelectorAll('.has-dropdown');

    dropdownItems.forEach(function (item) {
      var trigger = item.querySelector('a[aria-haspopup]') || item.querySelector(':scope > a');
      var menu = item.querySelector('.dropdown-menu');

      if (!trigger || !menu) return;

      // Ensure ARIA attributes are present for accessibility
      if (!trigger.hasAttribute('aria-haspopup')) {
        trigger.setAttribute('aria-haspopup', 'true');
      }
      if (!trigger.hasAttribute('aria-expanded')) {
        trigger.setAttribute('aria-expanded', 'false');
      }

      var menuLinks = menu.querySelectorAll('a');

      var openDropdown = function () {
        // Close sibling dropdowns first
        var siblings = item.parentElement.querySelectorAll('.has-dropdown.dropdown-open');
        for (var i = 0; i < siblings.length; i++) {
          if (siblings[i] !== item) {
            siblings[i].classList.remove('dropdown-open');
            var st = siblings[i].querySelector('a[aria-haspopup]');
            if (st) st.setAttribute('aria-expanded', 'false');
          }
        }
        item.classList.add('dropdown-open');
        trigger.setAttribute('aria-expanded', 'true');
      };

      var closeDropdown = function () {
        item.classList.remove('dropdown-open');
        trigger.setAttribute('aria-expanded', 'false');
      };

      // Mobile: tap/click on dropdown trigger toggles submenu instead of navigating
      trigger.addEventListener('click', function (e) {
        if (!isMobileNav()) return;
        e.preventDefault();
        e.stopPropagation();
        if (item.classList.contains('dropdown-open')) {
          closeDropdown();
        } else {
          openDropdown();
        }
      });

      // iOS Safari: ensure touch events trigger dropdown reliably
      trigger.addEventListener('touchend', function (e) {
        if (!isMobileNav()) return;
        e.preventDefault();
        if (item.classList.contains('dropdown-open')) {
          closeDropdown();
        } else {
          openDropdown();
        }
      });

      // Keyboard: arrow-down opens dropdown and moves to first item
      trigger.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowDown' || e.key === 'Down') {
          e.preventDefault();
          openDropdown();
          if (menuLinks[0]) menuLinks[0].focus();
        } else if (e.key === 'Enter' || e.key === ' ') {
          if (isMobileNav()) {
            e.preventDefault();
            if (item.classList.contains('dropdown-open')) {
              closeDropdown();
            } else {
              openDropdown();
              if (menuLinks[0]) menuLinks[0].focus();
            }
          }
        }
      });

      // Navigate within dropdown with arrow keys
      menuLinks.forEach(function (link, index) {
        link.addEventListener('keydown', function (e) {
          if (e.key === 'ArrowDown' || e.key === 'Down') {
            e.preventDefault();
            var next = menuLinks[index + 1] || menuLinks[0];
            next.focus();
          } else if (e.key === 'ArrowUp' || e.key === 'Up') {
            e.preventDefault();
            var prev = menuLinks[index - 1] || menuLinks[menuLinks.length - 1];
            prev.focus();
          } else if (e.key === 'Escape') {
            e.preventDefault();
            closeDropdown();
            trigger.focus();
          } else if (e.key === 'Tab' && !e.shiftKey && index === menuLinks.length - 1) {
            closeDropdown();
          }
        });
      });

      // Close dropdown when focus leaves the item entirely
      item.addEventListener('focusout', function () {
        setTimeout(function () {
          if (!item.contains(document.activeElement)) {
            closeDropdown();
          }
        }, 100);
      });
    });

    // Desktop: click outside any open dropdown closes them
    document.addEventListener('click', function (e) {
      if (isMobileNav()) return;
      dropdownItems.forEach(function (item) {
        if (!item.contains(e.target)) {
          item.classList.remove('dropdown-open');
          var t = item.querySelector('a[aria-haspopup]');
          if (t) t.setAttribute('aria-expanded', 'false');
        }
      });
    });
  };

  initDropdowns();

  // Language handling is now managed by TranslationEngine in translations.js
  // The TranslationEngine initializes automatically and handles:
  // - Language persistence via localStorage
  // - Button state management
  // - Content translation with fallback support

  // Dynamic copyright year
  const yearElement = document.getElementById('copyright-year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  // FAQ Accordion Functionality
  const initAccordion = () => {
    const accordionTriggers = document.querySelectorAll('.accordion-trigger');

    if (accordionTriggers.length === 0) return;

    accordionTriggers.forEach((trigger) => {
      trigger.addEventListener('click', function () {
        const accordionItem = this.closest('.accordion-item');
        const isActive = accordionItem.classList.contains('active');
        const accordionContent = accordionItem.querySelector('.accordion-content');

        // Close all other accordion items (optional - remove for multi-open)
        const allItems = document.querySelectorAll('.accordion-item');
        allItems.forEach((item) => {
          if (item !== accordionItem) {
            item.classList.remove('active');
            item.querySelector('.accordion-trigger').setAttribute('aria-expanded', 'false');
          }
        });

        // Toggle current item
        if (isActive) {
          accordionItem.classList.remove('active');
          this.setAttribute('aria-expanded', 'false');
        } else {
          accordionItem.classList.add('active');
          this.setAttribute('aria-expanded', 'true');
        }
      });

      // Keyboard accessibility
      trigger.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.click();
        }
      });
    });

    // Open first accordion item by default (optional)
    // const firstItem = document.querySelector('.accordion-item');
    // if (firstItem) {
    //     firstItem.classList.add('active');
    //     firstItem.querySelector('.accordion-trigger').setAttribute('aria-expanded', 'true');
    // }
  };

  initAccordion();

  // Education Category Accordion
  const initEduAccordion = () => {
    const categoryHeaders = document.querySelectorAll('.edu-category-header');

    categoryHeaders.forEach((header) => {
      header.addEventListener('click', function () {
        const content = this.nextElementSibling;
        const isExpanded = this.getAttribute('aria-expanded') === 'true';

        if (isExpanded) {
          content.hidden = true;
          this.setAttribute('aria-expanded', 'false');
        } else {
          content.hidden = false;
          this.setAttribute('aria-expanded', 'true');
        }
      });
    });
  };

  initEduAccordion();

  // ─── Emergency Hotline Continuous Carousel ────────────────────────────────
  const initHotlineCarousel = () => {
    const hotlineBar = document.querySelector('.hotline-bar');
    if (!hotlineBar) return;

    const itemsContainer = hotlineBar.querySelector('.hotline-items');
    if (!itemsContainer || itemsContainer.dataset.carouselInit === 'true') return;

    const items = Array.from(itemsContainer.querySelectorAll('.hotline-item'));
    if (items.length === 0) return;

    itemsContainer.dataset.carouselInit = 'true';

    const inner = hotlineBar.querySelector('.hotline-inner');
    if (inner && !inner.querySelector('.hotline-label')) {
      const label = document.createElement('div');
      label.className = 'hotline-label';
      label.innerHTML = '<i class="bi bi-shield-exclamation" aria-hidden="true"></i> <span>24/7 Hotlines</span>';
      inner.insertBefore(label, itemsContainer);
    }

    const track = document.createElement('div');
    track.className = 'hotline-track hotline-items-track';

    // Original set
    items.forEach((item) => track.appendChild(item));

    // Duplicate sets for seamless infinite loop
    for (let c = 0; c < 2; c++) {
      items.forEach((item) => {
        const clone = item.cloneNode(true);
        clone.setAttribute('aria-hidden', 'true');
        clone.setAttribute('tabindex', '-1');
        track.appendChild(clone);
      });
    }

    itemsContainer.innerHTML = '';
    itemsContainer.appendChild(track);
    itemsContainer.classList.add('hotline-carousel-ready');
  };

  initHotlineCarousel();
});


// ============================================================================
// Highlight-to-Report Floating Action Popover
// Allows citizens to highlight any text on the portal and send a prefilled
// correction or addition directly to #feedback-form.
// ============================================================================
document.addEventListener('DOMContentLoaded', () => {
    const STORAGE_KEY = 'betterrosales_pending_report';
    const MIN_LENGTH = 3;
    const MAX_QUOTE_LENGTH = 500;

    let popover = null;
    let activePayload = null;

    function getRootPrefix() {
        const scriptEl = document.querySelector('script[src*="assets/js/main.js"]');
        const src = scriptEl ? scriptEl.getAttribute('src') : '';
        const match = src ? src.match(/^((?:\.\.\/)+)/) : null;
        return match ? match[1] : '';
    }

    function inferSection(node) {
        const el = node && node.nodeType === Node.TEXT_NODE ? node.parentElement : node;
        const container = el && el.closest
            ? el.closest('section, article, main, [id]')
            : null;
        const contextText = [
            window.location.pathname,
            container ? container.id : '',
            container ? container.className : '',
            container && container.querySelector('h1, h2, h3')
                ? container.querySelector('h1, h2, h3').textContent
                : ''
        ].join(' ').toLowerCase();

        if (/barangay|captain|punong/.test(contextText)) {
            return '37 Barangays & Barangay Captains';
        }
        if (/hotline|emergency|mdrrmo|bfp|pnp|rhu|panelco|water/.test(contextText)) {
            return 'Emergency Hotlines';
        }
        if (/official|mayor|vice|sanggunian|council|government|leadership|directory/.test(contextText)) {
            return 'Government Directory (Officials / SB)';
        }
        if (/department|office|treasurer|assessor|engineering|planning|mpdc/.test(contextText)) {
            return 'Municipal Offices & Department Heads';
        }
        if (/budget|transparency|dpwh|philgeps|coa|ordinance|legislative|stat/.test(contextText)) {
            return 'Transparency / Budget / DPWH';
        }
        if (/service|permit|clearance|certificate|business|requirement/.test(contextText)) {
            return 'Services & Requirements';
        }
        return 'Other';
    }

    function ensurePopover() {
        if (popover) return popover;
        popover = document.createElement('div');
        popover.className = 'selection-report-popover';
        popover.setAttribute('role', 'dialog');
        popover.setAttribute('aria-label', 'Report highlighted content');
        popover.hidden = true;
        popover.innerHTML = [
            '<button type="button" class="srp-btn srp-btn--report" data-srp-action="report">',
            '  <i class="bi bi-flag-fill" aria-hidden="true"></i>',
            '  <span>Report Incorrect Info</span>',
            '</button>',
            '<button type="button" class="srp-btn srp-btn--add" data-srp-action="add">',
            '  <i class="bi bi-plus-circle-fill" aria-hidden="true"></i>',
            '  <span>Add Info</span>',
            '</button>'
        ].join('');

        popover.addEventListener('mousedown', (e) => {
            // Preserve current text selection when clicking popover buttons
            e.preventDefault();
        });

        popover.addEventListener('click', (e) => {
            const btn = e.target.closest('[data-srp-action]');
            if (!btn || !activePayload) return;

            const action = btn.getAttribute('data-srp-action');
            const payload = {
                type: action === 'add' ? 'Add Missing Information' : 'Incorrect Information',
                section: activePayload.section,
                quote: activePayload.quote,
                url: activePayload.url
            };

            hidePopover();
            const sel = window.getSelection();
            if (sel) sel.removeAllRanges();

            const feedbackForm = document.getElementById('feedback-form');
            if (feedbackForm && typeof window.prefillFeedbackForm === 'function') {
                window.prefillFeedbackForm(payload);
                return;
            }

            try {
                sessionStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
            } catch (_) {
                // Ignore storage quota / private mode errors; query params below act as fallback
            }

            const params = new URLSearchParams({
                reportType: payload.type,
                reportSection: payload.section,
                reportText: payload.quote
            });
            window.location.href = `${getRootPrefix()}contact/index.html?${params.toString()}#feedback-form`;
        });

        document.body.appendChild(popover);
        return popover;
    }

    function hidePopover() {
        if (popover) popover.hidden = true;
        activePayload = null;
    }

    function isIgnoredTarget(node) {
        const el = node && node.nodeType === Node.TEXT_NODE ? node.parentElement : node;
        if (!el || !el.closest) return true;
        return Boolean(
            el.closest('input, textarea, select, [contenteditable="true"], #feedback-form, .selection-report-popover')
        );
    }

    function updatePopoverFromSelection() {
        const sel = window.getSelection();
        if (!sel || sel.isCollapsed || sel.rangeCount === 0) {
            hidePopover();
            return;
        }

        const rawText = sel.toString().replace(/\s+/g, ' ').trim();
        if (rawText.length < MIN_LENGTH) {
            hidePopover();
            return;
        }

        const range = sel.getRangeAt(0);
        if (isIgnoredTarget(range.commonAncestorContainer)) {
            hidePopover();
            return;
        }

        const rect = range.getBoundingClientRect();
        if (!rect || (rect.width === 0 && rect.height === 0)) {
            hidePopover();
            return;
        }

        const pop = ensurePopover();
        const quote = rawText.length > MAX_QUOTE_LENGTH
            ? `${rawText.slice(0, MAX_QUOTE_LENGTH - 3)}...`
            : rawText;

        activePayload = {
            section: inferSection(range.commonAncestorContainer),
            quote,
            url: window.location.href
        };

        pop.hidden = false;
        const popRect = pop.getBoundingClientRect();
        const centerX = rect.left + (rect.width / 2) + window.scrollX;
        const minLeft = window.scrollX + 8;
        const maxLeft = window.scrollX + window.innerWidth - popRect.width - 8;
        const left = Math.max(minLeft, Math.min(maxLeft, centerX - (popRect.width / 2)));

        const preferAboveTop = rect.top + window.scrollY - popRect.height - 10;
        const top = rect.top > popRect.height + 16
            ? preferAboveTop
            : rect.bottom + window.scrollY + 10;

        pop.style.left = `${Math.round(left)}px`;
        pop.style.top = `${Math.round(top)}px`;
    }

    document.addEventListener('mouseup', () => {
        setTimeout(updatePopoverFromSelection, 10);
    });

    document.addEventListener('keyup', (e) => {
        if (e.key === 'Escape') {
            hidePopover();
            return;
        }
        if (e.shiftKey || e.key.startsWith('Arrow')) {
            setTimeout(updatePopoverFromSelection, 10);
        }
    });

    document.addEventListener('mousedown', (e) => {
        if (popover && !popover.hidden && !e.target.closest('.selection-report-popover')) {
            hidePopover();
        }
    });
});
