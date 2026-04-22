import React, { useRef, useMemo } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

function clamp01(n) { return Math.max(0, Math.min(1, n)); }

function tokenizeWords(raw) {
  const lines = (raw || "").split("\n");
  const out = [];
  let animIndex = 0;
  for (let li = 0; li < lines.length; li++) {
    const line = lines[li];
    const words = line.trim() ? line.trim().split(/\s+/) : [];
    for (let i = 0; i < words.length; i++) {
      out.push({ kind: "token", value: words[i], animIndex });
      animIndex++;
      if (i !== words.length - 1) {
        out.push({ kind: "token", value: " ", animIndex: null });
      }
    }
    if (!words.length) out.push({ kind: "token", value: "\u00A0", animIndex: null });
    if (li !== lines.length - 1) out.push({ kind: "br" });
  }
  return out;
}

function RevealToken({ value, animIndex, totalAnimated, progress, ghostOpacity }) {
  if (animIndex === null || totalAnimated <= 0) {
    return <span>{value}</span>;
  }
  const start = animIndex / totalAnimated;
  const end = start + (1 / totalAnimated);
  
  // Custom transform: map scroll progress section to opacity
  const opacity = useTransform(progress, [start, end], [ghostOpacity, 1]);
  
  return <motion.span style={{ opacity, display: "inline" }}>{value}</motion.span>;
}

export default function WhySwynScroll() {
  const text = "We spent decades in India's leading financial and advisory institutions. We watched brilliant companies stall because they couldn't access Tier-1 leadership, while exceptional leaders sat on the sidelines locked out by rigid full-time models. SWYN was built to close that gap. We curate this network personally, because the quality of the introduction is our entire reputation.";
  
  const sectionHeightVh = 250; // Extra height for smooth reading scroll

  const containerRef = useRef(null);
  
  const { scrollYProgress } = useScroll({ 
    target: containerRef, 
    offset: ["start start", "end end"] 
  });
  
  // Map progress so it reveals comfortably during the scroll
  const progress = useTransform(scrollYProgress, [0.1, 0.9], [0, 1]);

  const tokens = useMemo(() => tokenizeWords(text), [text]);
  const totalAnimated = useMemo(() => {
    let max = -1;
    for (const t of tokens) { if (t.kind === "token" && t.animIndex !== null) max = Math.max(max, t.animIndex); }
    return max + 1;
  }, [tokens]);

  return (
    <section ref={containerRef} style={{ position: "relative", height: `${sectionHeightVh}vh`, background: "var(--bg-warm)", width: "100%" }}>
      {/* Sticky Container - exactly 100vh to stick perfectly to viewport */}
      <div style={{ 
        position: "sticky", 
        top: 0, 
        height: "100vh", 
        display: "flex", 
        flexDirection: "column", 
        justifyContent: "center",
        alignItems: "flex-start", // Flush Left layout
        padding: "0 var(--space-md)",
        maxWidth: "1100px",
        margin: "0 auto",
        width: "100%",
        boxSizing: "border-box"
      }}>
        
        {/* Authoritative Headline */}
        <h2 style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(2.5rem, 5vw, 4rem)",
          color: "var(--text-dark)",
          fontWeight: 700,
          marginBottom: "var(--space-xl)", 
          lineHeight: 1.1,
          textAlign: "left"
        }}>
          Why SWYN exists.
        </h2>

        {/* Revealing Body Text */}
        <div style={{
          position: "relative",
          width: "100%",
          textAlign: "left", // Flush Left
          fontFamily: "var(--font-display)",
          fontSize: "clamp(1.5rem, 3.5vw, 2.75rem)", // Large prominent typography
          lineHeight: 1.4,
          color: "var(--text-dark)", 
          fontWeight: 400
        }}>
          {tokens.map((t, i) => 
            t.kind === "br" 
              ? <br key={`br-${i}`} /> 
              : <RevealToken 
                  key={`t-${i}`} 
                  value={t.value} 
                  animIndex={t.animIndex} 
                  totalAnimated={totalAnimated} 
                  progress={progress} 
                  ghostOpacity={0.18} // Subtle text before reading
                />
          )}
        </div>

      </div>
    </section>
  );
}
