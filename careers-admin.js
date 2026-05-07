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
    const p = document.createElement('p');
    p.className = 'admin-empty';
    p.textContent = 'No roles yet. Use the form to create your first opening.';
    list.replaceChildren(p);
    return;
  }

  const cards = jobs.map((job) => {
    const article = document.createElement('article');
    article.className = 'admin-job-card';

    const content = document.createElement('div');
    const topline = document.createElement('div');
    topline.className = 'admin-job-card__topline';

    const status = document.createElement('span');
    status.className = `admin-job-card__status admin-job-card__status--${job.status}`;
    status.textContent = job.status;

    const team = document.createElement('span');
    team.className = 'admin-job-card__team';
    team.textContent = job.team;

    topline.append(status, team);

    const h3 = document.createElement('h3');
    h3.textContent = job.title;

    const p = document.createElement('p');
    p.textContent = job.summary;

    const meta = document.createElement('div');
    meta.className = 'admin-job-card__meta';
    [job.location, job.workMode, job.employmentType].forEach(val => {
      const span = document.createElement('span');
      span.textContent = val;
      meta.append(span);
    });

    content.append(topline, h3, p, meta);

    const actions = document.createElement('div');
    actions.className = 'admin-job-card__actions';

    const editBtn = document.createElement('button');
    editBtn.type = 'button';
    editBtn.textContent = 'Edit';
    editBtn.addEventListener('click', () => populateForm(job));

    const deleteBtn = document.createElement('button');
    deleteBtn.type = 'button';
    deleteBtn.textContent = 'Delete';
    deleteBtn.addEventListener('click', () => deleteJob(job.id)); // Assuming deleteJob is defined elsewhere or will be added

    actions.append(editBtn, deleteBtn);
    article.append(content, actions);
    return article;
  });
  list.replaceChildren(...cards);
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
