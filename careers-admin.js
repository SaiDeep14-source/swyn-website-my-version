import { createJobId, readJobs, sanitizeJob, writeJobs } from './careers-store.js';

const form = document.getElementById('jobForm');
const list = document.getElementById('jobsAdminList');
const formTitle = document.getElementById('jobFormTitle');
const cancelEditButton = document.getElementById('cancelEdit');
const exportButton = document.getElementById('exportJobs');
const importInput = document.getElementById('importJobs');

let editingId = null;

function resetForm() {
  editingId = null;
  form.reset();
  formTitle.textContent = 'Add opportunity';
  cancelEditButton.hidden = true;
  form.status.value = 'open';
}

function populateForm(job) {
  editingId = job.id;
  formTitle.textContent = 'Edit opportunity';
  cancelEditButton.hidden = false;
  form.title.value = job.title;
  form.team.value = job.team;
  form.summary.value = job.summary;
  form.location.value = job.location;
  form.workMode.value = job.workMode;
  form.employmentType.value = job.employmentType;
  form.status.value = job.status;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function renderJobs() {
  const jobs = readJobs();

  if (jobs.length === 0) {
    list.innerHTML = '<p class="admin-empty">No roles yet. Use the form to create your first opening.</p>';
    return;
  }

  list.innerHTML = jobs
    .map((job) => {
      return `
        <article class="admin-job-card">
          <div>
            <div class="admin-job-card__topline">
              <span class="admin-job-card__status admin-job-card__status--${job.status}">${job.status}</span>
              <span class="admin-job-card__team">${job.team}</span>
            </div>
            <h3>${job.title}</h3>
            <p>${job.summary}</p>
            <div class="admin-job-card__meta">
              <span>${job.location}</span>
              <span>${job.workMode}</span>
              <span>${job.employmentType}</span>
            </div>
          </div>
          <div class="admin-job-card__actions">
            <button type="button" data-edit="${job.id}">Edit</button>
            <button type="button" data-delete="${job.id}">Delete</button>
          </div>
        </article>
      `;
    })
    .join('');

  list.querySelectorAll('[data-edit]').forEach((button) => {
    button.addEventListener('click', () => {
      const job = jobs.find((item) => item.id === button.dataset.edit);
      if (job) populateForm(job);
    });
  });

  list.querySelectorAll('[data-delete]').forEach((button) => {
    button.addEventListener('click', () => {
      const nextJobs = jobs.filter((job) => job.id !== button.dataset.delete);
      writeJobs(nextJobs);
      if (editingId === button.dataset.delete) {
        resetForm();
      }
      renderJobs();
    });
  });
}

function handleFormSubmit(event) {
  event.preventDefault();
  const formData = new FormData(form);
  const payload = sanitizeJob({
    id: editingId || createJobId(formData.get('title')),
    title: formData.get('title'),
    team: formData.get('team'),
    summary: formData.get('summary'),
    location: formData.get('location'),
    workMode: formData.get('workMode'),
    employmentType: formData.get('employmentType'),
    status: formData.get('status'),
    createdAt: editingId
      ? readJobs().find((job) => job.id === editingId)?.createdAt
      : new Date().toISOString(),
  });

  const jobs = readJobs();
  const nextJobs = editingId
    ? jobs.map((job) => (job.id === editingId ? payload : job))
    : [payload, ...jobs];

  writeJobs(nextJobs);
  resetForm();
  renderJobs();
}

function exportJobs() {
  const blob = new Blob([JSON.stringify(readJobs(), null, 2)], {
    type: 'application/json',
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'swyn-careers-jobs.json';
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function importJobs(event) {
  const [file] = event.target.files || [];
  if (!file) {
    return;
  }

  const reader = new FileReader();
  reader.onload = () => {
    try {
      const parsed = JSON.parse(String(reader.result));
      if (!Array.isArray(parsed)) {
        throw new Error('Expected an array of jobs.');
      }
      writeJobs(parsed.map(sanitizeJob));
      resetForm();
      renderJobs();
    } catch (error) {
      alert('Could not import that file. Please use a valid JSON export from this admin.');
    } finally {
      importInput.value = '';
    }
  };
  reader.readAsText(file);
}

form.addEventListener('submit', handleFormSubmit);
cancelEditButton.addEventListener('click', resetForm);
exportButton.addEventListener('click', exportJobs);
importInput.addEventListener('change', importJobs);
renderJobs();
