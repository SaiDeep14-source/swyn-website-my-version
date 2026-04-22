import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const steps = [
  {
    number: '01',
    title: 'You tell us what you need',
    desc: 'Fill a short brief. What function, what stage, what challenge. Five minutes, not five pages.'
  },
  {
    number: '02',
    title: 'We curate your match',
    desc: 'SWYN handpicks from our vetted bench. Not an algorithm. Not a marketplace. A considered introduction.'
  },
  {
    number: '03',
    title: 'You meet your expert',
    desc: 'A direct conversation. No middlemen in the room. You decide if it\'s the right fit.'
  }
];

export default function ProcessTimeline() {
  const containerRef = useRef(null);

  // Track the scroll progress of the entire section
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"] // Start tracking when top of section hits center of viewport, end when bottom hits center
  });

  // Transform scroll progress (0 to 1) into a pixel or percentage value for the dot's top position
  // We'll move the dot from 0% to 100% of the line container's height
  const dotPosition = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section ref={containerRef} style={{ background: 'var(--bg-white)', padding: '6rem 0', position: 'relative' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 1.5rem', position: 'relative' }}>
        
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '6rem' }}>
          <span className="eyebrow eyebrow--dark" style={{ display: 'block', marginBottom: '1rem' }}>The process</span>
          <h2 className="section__headline section__headline--dark">Three steps. No complexity.</h2>
        </div>

        {/* Timeline Container */}
        <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: '8rem' }}>
          
          {/* Center Line and Dot */}
          <div className="timeline-line" style={{
            position: 'absolute',
            left: '50%',
            top: '0',
            bottom: '0',
            width: '1px',
            background: '#e8e4dd',
            transform: 'translateX(-50%)',
            zIndex: 1 // Behind the content but visible
          }}>
            {/* The traveling dot */}
            <motion.div
              style={{
                position: 'absolute',
                top: dotPosition,
                left: '50%',
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                background: '#F65A26',
                x: '-50%',
                y: '-50%', // Centered on its vertical coordinate
                zIndex: 2
              }}
            />
          </div>

          {/* Steps */}
          {steps.map((step, index) => {
            const isLeft = index % 2 === 0; // alternating sides on desktop
            
            return (
              <div 
                className="timeline-step"
                key={step.number} 
                style={{
                  display: 'flex',
                  justifyContent: isLeft ? 'flex-start' : 'flex-end',
                  width: '100%',
                  position: 'relative',
                  zIndex: 3
                }}
              >
                {/* Content Box */}
                <div className="timeline-content" style={{
                  width: 'calc(50% - 4rem)', // 50% width minus some padding from the center line
                  textAlign: isLeft ? 'right' : 'left',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem'
                }}>
                  <span style={{ 
                    fontFamily: "'Playfair Display', serif", 
                    fontSize: '1rem', 
                    color: '#f3db5f' 
                  }}>
                    {step.number}
                  </span>
                  <h3 style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: '1.75rem',
                    color: 'var(--text-dark)',
                    fontWeight: 700,
                    margin: 0
                  }}>
                    {step.title}
                  </h3>
                  <p style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: '1rem',
                    color: '#696774',
                    lineHeight: 1.6,
                    margin: 0
                  }}>
                    {step.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile Override Styles via inline tag to handle responsiveness of timeline */}
      <style>{`
        @media (max-width: 768px) {
          /* On mobile, align line to left */
          .timeline-line {
            left: 2rem !important;
            transform: none !important;
          }
          .timeline-step {
            justify-content: flex-start !important;
            padding-left: 5rem !important;
          }
          .timeline-content {
            width: 100% !important;
            text-align: left !important;
          }
        }
      `}</style>
    </section>
  );
}
