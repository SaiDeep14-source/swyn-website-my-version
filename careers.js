import { getPublishedJobs, getTeams } from './careers-store.js';

const FORMSUBMIT_AJAX_ENDPOINT = 'https://formsubmit.co/ajax/aniket297706@gmail.com';
const jobsRoot = document.getElementById('careersList');
const filtersRoot = document.getElementById('careersFilters');
const resultsCount = document.getElementById('careersCount');
const noticeRoot = document.getElementById('careersNotice');
const modal = document.getElementById('careerModal');
const modalTitle = document.getElementById('careerModalTitle');
const modalBody = document.getElementById('careerModalBody');
const modalMeta = document.getElementById('careerModalMeta');
const modalCloseButton = document.getElementById('careerModalClose');
const applyForm = document.getElementById('careerApplyForm');
const applyFeedback = document.getElementById('careerApplyFeedback');
const applySubmitButton = applyForm?.querySelector('.career-apply-form__submit');

let activeTeam = 'View all';
let activeApplicationJob = null;

function formatMetaLabel(value) {
  return value || 'Flexible';
}

function escapeHtml(value = '') {
  return `${value}`
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function escapeAttribute(value = '') {
  return escapeHtml(value);
}

function setApplicationContext(job) {
  activeApplicationJob = job;
  applyForm.reset();
  applyFeedback.hidden = true;
  applyFeedback.textContent = '';
  applyFeedback.className = 'career-apply-form__feedback';
  applyForm.elements._subject.value = `New SWYN career application - ${job.title}`;
  applyForm.elements.job_id.value = job.id;
  applyForm.elements.job_title.value = job.title;
  applyForm.elements.job_team.value = job.team;
  applyForm.elements.job_location.value = job.location;
  applyForm.elements.employment_type.value = job.employmentType;
  applyForm.elements.source_page.value = window.location.href;

  modalTitle.textContent = `Apply for ${job.title}`;
  modalBody.textContent = `Share the essentials, upload your resume, and we will review your application for ${job.title}.`;
  modalMeta.innerHTML = `
    <span>${escapeHtml(formatMetaLabel(job.team))}</span>
    <span>${escapeHtml(formatMetaLabel(job.location))}</span>
    <span>${escapeHtml(formatMetaLabel(job.employmentType))}</span>
  `;
}

function openApplicationModal(job) {
  setApplicationContext(job);
  modal.hidden = false;
  document.body.classList.add('career-modal-open');
  requestAnimationFrame(() => {
    applyForm.querySelector('input[name="name"]')?.focus();
  });
}

function closeApplicationModal() {
  if (modal.hidden) {
    return;
  }

  modal.hidden = true;
  document.body.classList.remove('career-modal-open');
}

function renderSubmissionNotice(job) {
  const jobLabel = job?.title || 'your application';
  noticeRoot.hidden = false;
  noticeRoot.innerHTML = `
    <strong>Application received.</strong>
    <span>Thanks for applying for ${escapeHtml(jobLabel)}. The form details have been sent to your email inbox.</span>
  `;
}

function renderFilters(jobs) {
  const teams = getTeams(jobs);
  filtersRoot.innerHTML = teams
    .map((team) => {
      const isActive = team === activeTeam;
      return `
        <button class="career-filter${isActive ? ' career-filter--active' : ''}" type="button" data-team="${escapeAttribute(team)}">
          ${escapeHtml(team)}
        </button>
      `;
    })
    .join('');

  filtersRoot.querySelectorAll('[data-team]').forEach((button) => {
    button.addEventListener('click', () => {
      activeTeam = button.dataset.team;
      renderPage();
    });
  });
}

function renderJobs(jobs) {
  const visibleJobs =
    activeTeam === 'View all' ? jobs : jobs.filter((job) => job.team === activeTeam);

  resultsCount.textContent = `${visibleJobs.length} opportunit${visibleJobs.length === 1 ? 'y' : 'ies'}`;

  if (visibleJobs.length === 0) {
    jobsRoot.innerHTML = `
      <div class="careers-empty">
        <h3>No openings in this track right now.</h3>
        <p>We are still growing. Check back soon or email careers@skillswhichyouneed.com if you think you should be part of SWYN.</p>
      </div>
    `;
    return;
  }

  jobsRoot.innerHTML = visibleJobs
    .map((job) => {
      return `
        <article class="career-card">
          <div class="career-card__copy">
            <p class="career-card__team">${escapeHtml(job.team)}</p>
            <h2 class="career-card__title">${escapeHtml(job.title)}</h2>
            <p class="career-card__summary">${escapeHtml(job.summary)}</p>
            <div class="career-card__meta">
              <span>${escapeHtml(formatMetaLabel(job.location))}</span>
              <span>${escapeHtml(formatMetaLabel(job.workMode))}</span>
              <span>${escapeHtml(formatMetaLabel(job.employmentType))}</span>
            </div>
          </div>
          <button class="career-card__apply" type="button" data-apply="${escapeAttribute(job.id)}">
            <span>Apply</span>
            <span aria-hidden="true">→</span>
          </button>
        </article>
      `;
    })
    .join('');

  jobsRoot.querySelectorAll('[data-apply]').forEach((button) => {
    button.addEventListener('click', () => {
      const job = jobs.find((item) => item.id === button.dataset.apply);
      if (job) {
        openApplicationModal(job);
      }
    });
  });
}

function renderPage() {
  const jobs = getPublishedJobs();
  renderFilters(jobs);
  renderJobs(jobs);
  noticeRoot.hidden = true;
  noticeRoot.innerHTML = '';
}

modalCloseButton?.addEventListener('click', closeApplicationModal);
modal?.addEventListener('click', (event) => {
  if (event.target instanceof HTMLElement && event.target.hasAttribute('data-modal-close')) {
    closeApplicationModal();
  }
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    closeApplicationModal();
  }
});

applyForm?.addEventListener('submit', async (event) => {
  event.preventDefault();

  applyFeedback.hidden = true;
  applyFeedback.textContent = '';
  applyFeedback.className = 'career-apply-form__feedback';

  const defaultButtonLabel = applySubmitButton?.textContent || 'Send application';
  if (applySubmitButton) {
    applySubmitButton.disabled = true;
    applySubmitButton.textContent = 'Sending...';
  }

  const formData = new FormData(applyForm);
  formData.set('_captcha', 'false');

  try {
    const response = await fetch(FORMSUBMIT_AJAX_ENDPOINT, {
      method: 'POST',
      body: formData,
      headers: {
        Accept: 'application/json',
      },
    });

    const result = await response.json().catch(() => ({}));
    if (!response.ok || result.success === 'false' || result.success === false) {
      throw new Error('FormSubmit rejected the request.');
    }

    closeApplicationModal();
    renderSubmissionNotice(activeApplicationJob);
  } catch (error) {
    applyFeedback.hidden = false;
    applyFeedback.classList.add('career-apply-form__feedback--error');
    applyFeedback.textContent = 'Something went wrong while sending the application. Please try again.';
  } finally {
    if (applySubmitButton) {
      applySubmitButton.disabled = false;
      applySubmitButton.textContent = defaultButtonLabel;
    }
  }
});

renderPage();
