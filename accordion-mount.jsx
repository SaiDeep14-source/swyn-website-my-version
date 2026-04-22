import React from 'react';
import { createRoot } from 'react-dom/client';
import DisciplinesAccordion from './DisciplinesAccordion.jsx';

const mountEl = document.getElementById('disciplines-root');
if (mountEl) {
  createRoot(mountEl).render(
    <React.StrictMode>
      <DisciplinesAccordion />
    </React.StrictMode>
  );
}
