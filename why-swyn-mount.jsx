import React from 'react'
import ReactDOM from 'react-dom/client'
import WhySwynScroll from './WhySwynScroll.jsx'

const rootElement = document.getElementById('why-swyn-root')
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <WhySwynScroll />
    </React.StrictMode>,
  )
}
