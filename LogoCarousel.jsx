import { useRef } from "react";
import { motion } from "framer-motion";

const allLogos = [
  "public/logos/Citibank_id0l1hJpOt_1.svg",
  "public/logos/Deloitte_idXbysKEDR_0.svg",
  "public/logos/Goldman_Sachs_Logo_0.svg",
  "public/logos/J-P-_Morgan_Logo_0.svg",
  "public/logos/KPMG_id9tLD2YU7_1.png",
  "public/logos/Morgan_Stanley_id2T3ziuIZ_0.svg",
  "public/logos/Zoom_idWrhVhrtF_0.svg",
];

// Duplicate logos array so we can scroll infinitely
const repeatedLogos = [...allLogos, ...allLogos, ...allLogos];

const LogoSet = ({ logos }) => (
  <motion.div
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: 'clamp(3rem, 6vw, 6rem)',
      paddingRight: 'clamp(3rem, 6vw, 6rem)', // Add gap after the last logo for seamless looping
      flexShrink: 0,
      width: 'max-content',
    }}
    animate={{ x: ["0%", "-33.333333%"] }} // scroll by 1/3 of the total width (since we repeated 3 times)
    transition={{
      duration: 30, // adjust speed here
      ease: "linear",
      repeat: Infinity,
    }}
  >
    {logos.map((src, i) => (
      <img
        key={i}
        src={src}
        alt={`Logo ${i + 1}`}
        style={{
          maxHeight: '40px',
          maxWidth: '160px',
          objectFit: 'contain',
          /* User requested Pure Black or Deep Gray conversion */
          filter: 'grayscale(100%) brightness(0) opacity(0.8)',
          mixBlendMode: 'multiply' // helps if the jpeg background is white
        }}
      />
    ))}
  </motion.div>
);

export default function LogoCarousel() {
  return (
    <section className="built-in-boardrooms" style={{ background: 'var(--bg-white)', padding: '5rem 0', overflow: 'hidden' }}>
      <div style={{ maxWidth: '100%', margin: '0 auto', textAlign: 'center' }}>
        <h3 style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: '0.875rem',
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          color: '#696774',
          marginBottom: '3rem',
          fontWeight: 500
        }}>
          Built in the boardrooms of:
        </h3>

        <div style={{ position: 'relative', display: 'flex', overflow: 'hidden', padding: '0 1rem' }}>
          {/* Fading left/right edges for a polished look */}
          <div style={{
            position: 'absolute', top: 0, bottom: 0, left: 0, width: '100px',
            background: 'linear-gradient(to right, var(--bg-white) 0%, transparent 100%)', zIndex: 2
          }} />
          
          <LogoSet logos={repeatedLogos} />

          <div style={{
            position: 'absolute', top: 0, bottom: 0, right: 0, width: '100px',
            background: 'linear-gradient(to left, var(--bg-white) 0%, transparent 100%)', zIndex: 2
          }} />
        </div>
      </div>
    </section>
  );
}
