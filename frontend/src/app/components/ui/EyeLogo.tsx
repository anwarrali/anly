import { motion, useSpring, useMotionValue, useTransform } from "motion/react";
import { useEffect } from "react";

export function EyeLogo({
  className = "w-full h-full",
  color1 = "var(--primary)", // true blue
  color3 = "var(--accent)",  // yellow
}) {
  // ── Normalised mouse position (0 → 1) ──────────────────────────────
  const mxNorm = useMotionValue(0.5);
  const myNorm = useMotionValue(0.5);

  // ── Global 3-D tilt driven by mouse (±18°) ─────────────────────────
  const tiltX = useSpring(
    useTransform(myNorm, [0, 1], [18, -18]),
    { damping: 28, stiffness: 120 }
  );
  const tiltY = useSpring(
    useTransform(mxNorm, [0, 1], [-18, 18]),
    { damping: 28, stiffness: 120 }
  );

  // ── Iris / pupil translation (eye follows cursor) ───────────────────
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const irisX  = useSpring(rawX, { damping: 18, stiffness: 280, mass: 0.6 });
  const irisY  = useSpring(rawY, { damping: 18, stiffness: 280, mass: 0.6 });
  const pupilX = useSpring(rawX, { damping: 22, stiffness: 200, mass: 0.8 });
  const pupilY = useSpring(rawY, { damping: 22, stiffness: 200, mass: 0.8 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mxNorm.set(e.clientX / window.innerWidth);
      myNorm.set(e.clientY / window.innerHeight);
      rawX.set((e.clientX - window.innerWidth / 2) / 25);
      rawY.set((e.clientY - window.innerHeight / 2) / 25);
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [mxNorm, myNorm, rawX, rawY]);

  // ── Helpers ──────────────────────────────────────────────────────────
  const absRing: React.CSSProperties = {
    position: "absolute", inset: 0,
    display: "flex", alignItems: "center", justifyContent: "center",
    transformStyle: "preserve-3d",
  };

  return (
    <div
      className={`relative flex items-center justify-center ${className}`}
      style={{ perspective: "800px" }}
    >
      {/* ── Master 3-D container — reacts to mouse tilt ─────────────── */}
      <motion.div
        style={{
          rotateX: tiltX,
          rotateY: tiltY,
          transformStyle: "preserve-3d",
          width: "100%",
          height: "100%",
          position: "relative",
        }}
      >

        {/* ── Outer Rotating Path ── */}
        <div style={absRing}>
          <motion.svg
            viewBox="0 0 512 512"
            style={{ width: "95%", height: "95%", overflow: "visible" }}
            animate={{ rotate: [0, 90] }}
            transition={{ duration: 5, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
          >
            {/* Blue 3/4 arc */}
            <circle
              cx="256" cy="256" r="228"
              fill="none" stroke={color1} strokeWidth="22" strokeLinecap="round"
              pathLength="360" strokeDasharray="265 95"
              transform="rotate(-90, 256, 256)"
              style={{ filter: `drop-shadow(0 0 5px ${color1})` }}
            />
            {/* Yellow 1/4 arc */}
            <circle
              cx="256" cy="256" r="228"
              fill="none" stroke={color3} strokeWidth="22" strokeLinecap="round"
              pathLength="360" strokeDasharray="62 298"
              transform="rotate(193, 256, 256)"
              style={{ filter: `drop-shadow(0 0 5px ${color3})` }}
            />
          </motion.svg>
        </div>

        {/* ── Center 3-D eye ── */}
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg viewBox="0 0 512 512" style={{ width: "100%", height: "100%", overflow: "visible" }}>
            <defs>
              <radialGradient id="iris-3d" cx="36%" cy="32%" r="60%">
                <stop offset="0%" stopColor="white" stopOpacity="0.45" />
                <stop offset="45%" stopColor={color1} stopOpacity="0.85" />
                <stop offset="100%" stopColor={color1} stopOpacity="1" />
              </radialGradient>
              <radialGradient id="pupil-3d" cx="34%" cy="30%" r="64%">
                <stop offset="0%" stopColor="white" stopOpacity="0.6" />
                <stop offset="100%" stopColor={color3} stopOpacity="1" />
              </radialGradient>
            </defs>

            {/* Soft ambient glow */}
            <motion.circle
              cx="256" cy="256" r="90"
              fill={color1} opacity="0.1"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              style={{ x: irisX, y: irisY, filter: "blur(12px)" }}
            />

            {/* Iris */}
            <motion.circle
              cx="256" cy="256" r="72"
              fill="url(#iris-3d)"
              animate={{ scale: [1, 1.06, 1] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              style={{ x: irisX, y: irisY, filter: `drop-shadow(0 0 10px ${color1})` }}
            />

            {/* Pupil */}
            <motion.circle
              cx="256" cy="256" r="27"
              fill="url(#pupil-3d)"
              animate={{ scale: [1, 1.14, 1] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              style={{ x: pupilX, y: pupilY, filter: `drop-shadow(0 0 4px ${color3})` }}
            />

            {/* Specular highlight */}
            <motion.ellipse
              cx="240" cy="237" rx="15" ry="9"
              fill="white" opacity="0.5"
              style={{ x: irisX, y: irisY }}
            />
          </svg>
        </div>

      </motion.div>
    </div>
  );
}
