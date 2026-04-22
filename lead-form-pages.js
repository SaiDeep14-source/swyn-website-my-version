const FORMSUBMIT_AJAX_ENDPOINT = 'https://formsubmit.co/ajax/aniket297706@gmail.com';
const pageType = document.body.dataset.formPage;
const form = document.querySelector('.lead-form');
const cardBody = document.getElementById('leadCardBody');
const submitButton = form?.querySelector('.lead-form__submit');

const messages = {
  client: {
    title: 'Thank you.',
    body: 'We have your brief. Someone from SWYN will review it and reach out shortly with the next step.',
  },
  expert: {
    title: 'Application received.',
    body: 'Thank you for your interest in joining the SWYN bench. We will review your profile and get back to you if there is a fit.',
  },
};

function renderSuccess(message) {
  cardBody.innerHTML = `
    <div class="lead-success">
      <h2>${message.title}</h2>
      <p>${message.body}</p>
    </div>
  `;
}

function ensureStatusMessage() {
  let message = form.querySelector('.lead-form__status');

  if (!message) {
    message = document.createElement('p');
    message.className = 'lead-form__status';
    message.setAttribute('role', 'status');
    message.setAttribute('aria-live', 'polite');

    const note = form.querySelector('.lead-form__note');
    if (note) {
      note.insertAdjacentElement('beforebegin', message);
    } else {
      form.append(message);
    }
  }

  return message;
}

if (form && cardBody) {
  const current = messages[pageType] || messages.client;
  const defaultButtonLabel = submitButton?.textContent || 'Submit';
  const statusMessage = ensureStatusMessage();

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    statusMessage.hidden = true;
    statusMessage.textContent = '';
    statusMessage.className = 'lead-form__status';

    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = 'Sending...';
    }

    const formData = new FormData(form);
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

      renderSuccess(current);
    } catch (error) {
      statusMessage.hidden = false;
      statusMessage.classList.add('lead-form__status--error');
      statusMessage.textContent = 'Something went wrong while sending the form. Please try again.';
    } finally {
      if (submitButton && form.isConnected) {
        submitButton.disabled = false;
        submitButton.textContent = defaultButtonLabel;
      }
    }
  });
}
