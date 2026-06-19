import { motion } from "framer-motion";

const industries = [
  "Technology",
  "Retail",
  "BFSI",
  "Lifestyle",
  "Defence",
  "Analytics",
  "Entertainment",
  "Advertising",
  "Manufacturing",
  "Healthcare",
  "Education",
  "Real Estate",
];

const repeatedIndustries = [...industries, ...industries];

export default function LogoCarousel() {
  return (
    <section
      className="industries-marquee"
      aria-labelledby="industries-title"
      style={{ background: "var(--bg-white)", padding: "4.5rem 0", overflow: "hidden" }}
    >
      <div style={{ maxWidth: "100%", margin: "0 auto", textAlign: "center" }}>
        <h3
          id="industries-title"
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "0.875rem",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: "#696774",
            marginBottom: "2.75rem",
            fontWeight: 500,
          }}
        >
          Industries we cover
        </h3>

        <div style={{ position: "relative", display: "flex", overflow: "hidden" }}>
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: "0 auto 0 0",
              width: "clamp(2rem, 8vw, 8rem)",
              background: "linear-gradient(to right, var(--bg-white) 0%, transparent 100%)",
              zIndex: 2,
            }}
          />

          <motion.div
            className="industries-marquee__track"
            aria-label={industries.join(", ")}
            style={{
              display: "flex",
              alignItems: "center",
              width: "max-content",
              flexShrink: 0,
            }}
            animate={{ x: ["0%", "-50%"] }}
            transition={{
              duration: 34,
              ease: "linear",
              repeat: Infinity,
            }}
          >
            {repeatedIndustries.map((industry, index) => (
              <div
                className="industries-marquee__item"
                aria-hidden={index >= industries.length}
                key={`${industry}-${index}`}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "clamp(2rem, 4vw, 4rem)",
                  paddingRight: "clamp(2rem, 4vw, 4rem)",
                  whiteSpace: "nowrap",
                }}
              >
                <span
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "clamp(1.75rem, 3vw, 3rem)",
                    color: "var(--text-dark)",
                    lineHeight: 1,
                  }}
                >
                  {industry}
                </span>
                <span
                  aria-hidden="true"
                  style={{
                    width: "0.45rem",
                    height: "0.45rem",
                    borderRadius: "50%",
                    background: "var(--accent-orange)",
                    flex: "0 0 auto",
                  }}
                />
              </div>
            ))}
          </motion.div>

          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: "0 0 0 auto",
              width: "clamp(2rem, 8vw, 8rem)",
              background: "linear-gradient(to left, var(--bg-white) 0%, transparent 100%)",
              zIndex: 2,
            }}
          />
        </div>
      </div>
    </section>
  );
}
