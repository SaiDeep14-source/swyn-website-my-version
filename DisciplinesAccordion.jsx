import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const disciplines = [
  {
    id: '01',
    title: 'CFO',
    subtitle: 'Finance & Capital',
    description: [
      'Fundraising, cash flow, financial strategy, investor relations.',
      'The person who makes growth fundable.',
    ],
  },
  {
    id: '02',
    title: 'CMO',
    subtitle: 'Brand & Growth',
    description: [
      'GTM, brand, demand generation.',
      'The person who makes growth visible.',
    ],
  },
  {
    id: '03',
    title: 'CTO',
    subtitle: 'Technology & Product',
    description: [
      'Architecture, team building, product-tech alignment.',
      'The person who makes growth buildable.',
    ],
  },
  {
    id: '04',
    title: 'COO',
    subtitle: 'Operations & Execution',
    description: [
      'Scaling systems, operational infrastructure, execution.',
      'The person who makes growth sustainable.',
    ],
  },
];

const INTERVAL = 5000;

export default function DisciplinesAccordion() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const timerRef = useRef(null);
  const startTimeRef = useRef(null);
  const rafRef = useRef(null);

  // Detect mobile
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Auto-advance timer using requestAnimationFrame for smooth progress bar
  useEffect(() => {
    if (isMobile) return;

    const start = () => {
      startTimeRef.current = performance.now();
      setProgress(0);

      const tick = (now) => {
        const elapsed = now - startTimeRef.current;
        const pct = Math.min((elapsed / INTERVAL) * 100, 100);
        setProgress(pct);

        if (elapsed < INTERVAL) {
          rafRef.current = requestAnimationFrame(tick);
        } else {
          setActiveIndex((prev) => (prev + 1) % disciplines.length);
        }
      };

      rafRef.current = requestAnimationFrame(tick);
    };

    start();

    return () => {
      cancelAnimationFrame(rafRef.current);
    };
  }, [activeIndex, isMobile]);

  const handleClick = (index) => {
    if (index === activeIndex) return;
    cancelAnimationFrame(rafRef.current);
    setProgress(0);
    setActiveIndex(index);
    // Reset timer restart via the effect dependency on activeIndex
  };

  // ─── Mobile: standard vertical accordion ─────────────────
  if (isMobile) {
    return (
      <section className="disciplines-section" style={{ background: 'var(--bg-white)', padding: '4rem 0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem' }}>
          <span className="eyebrow eyebrow--dark" style={{ display: 'block', marginBottom: '1rem' }}>The Capabilities</span>
          <h2 className="section__headline section__headline--dark">The seats we fill</h2>
          <div style={{ marginTop: '2rem' }}>
            {disciplines.map((d, i) => {
              const isOpen = activeIndex === i;
              return (
                <div
                  key={d.id}
                  style={{
                    paddingTop: '1.25rem',
                    paddingBottom: '1.25rem',
                  }}
                >
                  <button
                    onClick={() => setActiveIndex(isOpen ? -1 : i)}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      textAlign: 'left',
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "'Playfair Display', serif",
                        fontSize: '0.875rem',
                        color: '#696774',
                        minWidth: '2rem',
                      }}
                    >
                      {d.id}
                    </span>
                    <span
                      style={{
                        fontFamily: "'Playfair Display', serif",
                        fontSize: '1.75rem',
                        color: 'var(--text-dark)',
                        flex: 1,
                      }}
                    >
                      {d.title}
                    </span>
                    <span style={{ color: '#696774', fontSize: '1.25rem' }}>
                      {isOpen ? '−' : '+'}
                    </span>
                  </button>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.4, ease: 'easeInOut' }}
                        style={{ overflow: 'hidden', paddingLeft: '3rem' }}
                      >
                        <p
                          style={{
                            fontFamily: "'Inter', sans-serif",
                            fontSize: '0.8125rem',
                            letterSpacing: '0.12em',
                            textTransform: 'uppercase',
                            color: '#696774',
                            marginBottom: '0.5rem',
                            marginTop: '1rem',
                          }}
                        >
                          {d.subtitle}
                        </p>
                        <ul
                          style={{
                            fontFamily: "'Inter', sans-serif",
                            fontSize: '0.9375rem',
                            lineHeight: 1.7,
                            color: '#242329',
                            margin: 0,
                            paddingLeft: '1.25rem',
                          }}
                        >
                          {d.description.map((point, idx) => (
                            <li key={idx} style={{ marginBottom: idx === d.description.length - 1 ? 0 : '0.5rem', paddingLeft: '0.25rem' }}>{point}</li>
                          ))}
                        </ul>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    );
  }

  // ─── Desktop: horizontal auto-advancing accordion ────────
  return (
    <section className="disciplines-section" style={{ background: 'var(--bg-white)' }}>
      {/* Section header */}
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '5rem 1.5rem 3rem',
        }}
      >
        <span className="eyebrow eyebrow--dark" style={{ display: 'block', marginBottom: '1rem' }}>The Capabilities</span>
        <h2 className="section__headline section__headline--dark">The seats we fill</h2>
      </div>

      {/* Pillars */}
      <div
        style={{
          display: 'flex',
          maxWidth: '100%',
          minHeight: '480px', /* Reduced slightly since there are no images */
        }}
      >
        {disciplines.map((d, i) => {
          const isActive = activeIndex === i;

          return (
            <motion.div
              key={d.id}
              layout
              transition={{ type: 'spring', stiffness: 260, damping: 30 }}
              onClick={() => handleClick(i)}
              style={{
                flex: isActive ? 2.8 : 1,
                cursor: isActive ? 'default' : 'pointer',
                borderRight: i < disciplines.length - 1 ? '1px solid #e8e4dd' : 'none',
                position: 'relative',
                overflow: 'hidden',
                background: 'var(--bg-white)',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {/* Progress bar — left edge of active pillar */}
              {isActive && (
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '2px',
                    height: '100%',
                    background: '#e8e4dd',
                    zIndex: 10,
                  }}
                >
                  <motion.div
                    style={{
                      width: '100%',
                      background: '#F65A26',
                      height: `${progress}%`,
                    }}
                  />
                </div>
              )}

              {/* Pillar inner content */}
              <div
                style={{
                  padding: '2.5rem 2rem 2.5rem 2.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%',
                  flex: 1,
                }}
              >
                {/* Number + Title row (always visible) */}
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem', marginBottom: isActive ? '2rem' : 'auto' }}>
                  <span
                    style={{
                      fontFamily: "'Playfair Display', serif",
                      fontSize: '0.875rem',
                      color: isActive ? '#696774' : '#bbb',
                      transition: 'color 0.3s ease',
                      lineHeight: 1,
                    }}
                  >
                    {d.id}
                  </span>
                  <motion.span
                    layout="position"
                    style={{
                      fontFamily: "'Playfair Display', serif",
                      fontSize: isActive ? 'clamp(2rem, 2.5vw, 2.75rem)' : 'clamp(2rem, 2.5vw, 2.75rem)',
                      fontWeight: 700,
                      color: isActive ? '#242329' : '#ccc',
                      lineHeight: 1,
                      transition: 'color 0.4s ease',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {d.title}
                  </motion.span>
                </div>

                {/* Active — expanded content */}
                <AnimatePresence mode="wait">
                  {isActive && (
                    <motion.div
                      key="expanded"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.4, ease: 'easeInOut' }}
                      style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', paddingTop: '1.5rem' }}
                    >

                      {/* Subtitle */}
                      <motion.p
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.35, delay: 0.15 }}
                        style={{
                          fontFamily: "'Inter', sans-serif",
                          fontSize: '0.75rem',
                          fontWeight: 500,
                          letterSpacing: '0.15em',
                          textTransform: 'uppercase',
                          color: '#696774',
                          marginBottom: '0.75rem',
                        }}
                      >
                        {d.subtitle}
                      </motion.p>

                      {/* Description */}
                      <motion.ul
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.35, delay: 0.22 }}
                        style={{
                          fontFamily: "'Inter', sans-serif",
                          fontSize: '1rem',
                          lineHeight: 1.6,
                          color: '#242329',
                          maxWidth: '420px',
                          margin: 0,
                          paddingLeft: '1.25rem',
                        }}
                      >
                        {d.description.map((point, idx) => (
                          <li key={idx} style={{ marginBottom: idx === d.description.length - 1 ? 0 : '0.5rem', paddingLeft: '0.25rem' }}>{point}</li>
                        ))}
                      </motion.ul>
                    </motion.div>
                  )}

                  {/* Inactive — just show the title rotated vertically when very narrow */}
                  {!isActive && (
                    <motion.div
                      key="inactive"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      style={{ flex: 1 }}
                    />
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
