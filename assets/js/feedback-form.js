/**
 * Citizen Feedback & Data Correction Form Module
 * Handles validation, submission via FormSubmit (configurable endpoint),
 * and graceful mailto / copy-to-clipboard fallback for static hosting.
 */
(function () {
  'use strict';

  const CONFIG = {
    TARGET_EMAIL: 'volunteer@betterrosales.org',
    // FormSubmit AJAX endpoint (sends activation email on first submission)
    ENDPOINT: 'https://formsubmit.co/ajax/volunteer@betterrosales.org'
  };

  function buildPlainTextSummary(data) {
    return [
      `Submission Type: ${data.type}`,
      `Section: ${data.section}`,
      `Page URL: ${window.location.href}`,
      `Details:\n${data.details}`,
      data.source ? `Official Source / Reference: ${data.source}` : null,
      data.name ? `Submitted By: ${data.name}` : null,
      data.email ? `Reply Email: ${data.email}` : null
    ]
      .filter(Boolean)
      .join('\n\n');
  }

  function initFeedbackForm(form) {
    const statusEl = form.querySelector('.fb-form-status');
    const submitBtn = form.querySelector('[type="submit"]');
    const typeButtons = form.querySelectorAll('[data-fb-type]');
    const typeInput = form.querySelector('input[name="submission_type"]');

    typeButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        typeButtons.forEach((b) => b.classList.remove('is-active'));
        btn.classList.add('is-active');
        if (typeInput) typeInput.value = btn.dataset.fbType;
      });
    });

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const detailsEl = form.querySelector('[name="details"]');
      const sectionEl = form.querySelector('[name="section"]');
      const sourceEl = form.querySelector('[name="source"]');
      const nameEl = form.querySelector('[name="name"]');
      const emailEl = form.querySelector('[name="email"]');

      const data = {
        type: typeInput ? typeInput.value : 'Incorrect Information',
        section: sectionEl ? sectionEl.value : 'General',
        details: detailsEl ? detailsEl.value.trim() : '',
        source: sourceEl ? sourceEl.value.trim() : '',
        name: nameEl ? nameEl.value.trim() : '',
        email: emailEl ? emailEl.value.trim() : ''
      };

      if (!data.details || data.details.length < 10) {
        statusEl.className = 'fb-form-status is-error';
        statusEl.innerHTML =
          '<i class="bi bi-exclamation-circle" aria-hidden="true"></i> Please provide at least 10 characters describing the correction or additional information.';
        if (detailsEl) detailsEl.focus();
        return;
      }

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML =
          '<i class="bi bi-hourglass-split" aria-hidden="true"></i> Submitting...';
      }

      const subject = `[BetterRosales ${data.type}] ${data.section}`;
      const plainSummary = buildPlainTextSummary(data);
      const mailtoHref = `mailto:${CONFIG.TARGET_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(plainSummary)}`;

      try {
        const res = await fetch(CONFIG.ENDPOINT, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json'
          },
          body: JSON.stringify({
            _subject: subject,
            _template: 'table',
            submission_type: data.type,
            section: data.section,
            details: data.details,
            official_source: data.source || 'Not provided',
            submitted_by: data.name || 'Anonymous',
            reply_email: data.email || 'Not provided',
            page_url: window.location.href
          })
        });

        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        statusEl.className = 'fb-form-status is-success';
        statusEl.innerHTML = `
          <div class="fb-status-title">
            <i class="bi bi-check-circle-fill" aria-hidden="true"></i>
            Thank you! Your submission has been sent.
          </div>
          <p></p>
        `;
        const msgP = statusEl.querySelector('p');
        if (msgP) {
          msgP.append('Our team will review your ' + data.type.toLowerCase() + ' for ');
          const strong = document.createElement('strong');
          strong.textContent = data.section;
          msgP.append(strong, ' and update the portal once verified.');
        }
        form.reset();
      } catch (err) {
        statusEl.className = 'fb-form-status is-fallback';
        statusEl.innerHTML = `
          <div class="fb-status-title">
            <i class="bi bi-envelope-check" aria-hidden="true"></i>
            Ready to send via your Email App
          </div>
          <p>Direct web delivery is unavailable in this environment. Use your email client or copy your formatted submission below:</p>
          <div class="fb-fallback-actions">
            <a href="${mailtoHref}" class="btn btn-primary btn-sm">
              <i class="bi bi-envelope-fill" aria-hidden="true"></i> Open Email App
            </a>
            <button type="button" class="btn btn-outline btn-sm fb-copy-btn">
              <i class="bi bi-clipboard" aria-hidden="true"></i> Copy Details
            </button>
          </div>
        `;

        const copyBtn = statusEl.querySelector('.fb-copy-btn');
        if (copyBtn && navigator.clipboard) {
          copyBtn.addEventListener('click', async () => {
            try {
              await navigator.clipboard.writeText(plainSummary);
              copyBtn.innerHTML =
                '<i class="bi bi-check2" aria-hidden="true"></i> Copied!';
            } catch (_) {
              /* ignore clipboard errors */
            }
          });
        }
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML =
            '<i class="bi bi-send-fill" aria-hidden="true"></i> Submit Report / Information';
        }
      }
    });
  }

  function prefillFeedbackForm(payload) {
    const form = document.querySelector('.js-feedback-form');
    if (!form || !payload) return;

    const typeButtons = form.querySelectorAll('[data-fb-type]');
    const typeInput = form.querySelector('input[name="submission_type"]');
    const sectionEl = form.querySelector('[name="section"]');
    const detailsEl = form.querySelector('[name="details"]');

    if (payload.type) {
      typeButtons.forEach((btn) => {
        const match = btn.dataset.fbType === payload.type;
        btn.classList.toggle('is-active', match);
        if (match && typeInput) typeInput.value = payload.type;
      });
    }

    if (sectionEl && payload.section) {
      const opt = Array.from(sectionEl.options).find((o) => o.value === payload.section);
      if (opt) sectionEl.value = opt.value;
    }

    if (detailsEl && payload.quote) {
      const sourceLine = payload.url ? `Source page: ${payload.url}\n\n` : '';
      detailsEl.value = `Highlighted text:\n"${payload.quote}"\n\n${sourceLine}Suggested correction / additional details:\n`;
    }

    const container = form.closest('#feedback-form') || form;
    container.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setTimeout(() => {
      if (detailsEl) {
        detailsEl.focus();
        detailsEl.setSelectionRange(detailsEl.value.length, detailsEl.value.length);
      }
    }, 350);
  }

  window.prefillFeedbackForm = prefillFeedbackForm;

  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.js-feedback-form').forEach(initFeedbackForm);

    let pending = null;
    try {
      const raw = sessionStorage.getItem('betterrosales_pending_report');
      if (raw) {
        pending = JSON.parse(raw);
        sessionStorage.removeItem('betterrosales_pending_report');
      }
    } catch (_) {
      /* ignore storage errors */
    }

    if (!pending && window.location.search) {
      const params = new URLSearchParams(window.location.search);
      const quote = params.get('reportText');
      if (quote) {
        pending = {
          type: params.get('reportType') || 'Incorrect Information',
          section: params.get('reportSection') || 'Other',
          quote,
          url: document.referrer || '',
        };
      }
    }

    if (pending) {
      prefillFeedbackForm(pending);
    }
  });
})();

