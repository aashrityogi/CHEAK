import React, { useEffect, useRef } from "react";
import "./App.css";
import img1 from "./image/img1.jpeg";
import hero from "./music/hero.m4a";

function useCanvasParticles() {
  const heartsRef = useRef(null);
  const sparklesRef = useRef(null);

  useEffect(() => {
    const canvas = heartsRef.current;
    const ctx = canvas.getContext("2d");
    const spark = sparklesRef.current;
    const sctx = spark.getContext("2d");
    let w, h, raf, raf2;

    const DPR = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      [canvas, spark].forEach(c => {
        c.width = w * DPR;
        c.height = h * DPR;
      });
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      sctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    // Hearts
    const hearts = Array.from({ length: 18 }).map(() => ({
      x: Math.random() * w,
      y: h + Math.random() * h,
      size: 10 + Math.random() * 18,
      speed: 0.4 + Math.random() * 0.8,
      sway: 0.4 + Math.random() * 0.8,
      phase: Math.random() * Math.PI * 2,
      hue: 335 + Math.floor(Math.random() * 20)
    }));

    function drawHeart(x, y, size, fillStyle) {
      ctx.save();
      ctx.translate(x, y);
      ctx.scale(size, size);
      ctx.beginPath();
      for (let t = 0; t < Math.PI * 2; t += 0.01) {
        const px = 16 * Math.pow(Math.sin(t), 3);
        const py =
          13 * Math.cos(t) -
          5 * Math.cos(2 * t) -
          2 * Math.cos(3 * t) -
          Math.cos(4 * t);
        if (t === 0) ctx.moveTo(px, -py);
        else ctx.lineTo(px, -py);
      }
      ctx.closePath();
      const grad = ctx.createRadialGradient(0, 0, 2, 0, 0, 18);
      grad.addColorStop(0, `hsla(${fillStyle}, 95%, 70%, .95)`);
      grad.addColorStop(1, `hsla(${fillStyle}, 85%, 52%, .55)`);
      ctx.fillStyle = grad;
      ctx.shadowColor = `hsla(${fillStyle}, 90%, 60%, .6)`;
      ctx.shadowBlur = 18;
      ctx.fill();
      ctx.restore();
    }

    const animateHearts = () => {
      ctx.clearRect(0, 0, w, h);
      hearts.forEach(p => {
        p.y -= p.speed;
        p.x += Math.sin(p.phase) * p.sway * 0.6;
        p.phase += 0.02;
        if (p.y < -40) {
          p.y = h + 20;
          p.x = Math.random() * w;
        }
        drawHeart(p.x, p.y, p.size / 100, p.hue);
      });
      raf = requestAnimationFrame(animateHearts);
    };
    animateHearts();

    // Sparkles
    const sparks = Array.from({ length: 80 }).map(() => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.6 + 0.4,
      a: Math.random() * Math.PI * 2,
      s: 0.2 + Math.random() * 0.6
    }));

    const animateSparkles = () => {
      sctx.clearRect(0, 0, w, h);
      sparks.forEach(sp => {
        sp.x += Math.cos(sp.a) * sp.s * 0.4;
        sp.y += Math.sin(sp.a) * sp.s * 0.4;
        sp.a += (Math.random() - 0.5) * 0.2;
        if (sp.x < -10) sp.x = w + 10;
        if (sp.x > w + 10) sp.x = -10;
        if (sp.y < -10) sp.y = h + 10;
        if (sp.y > h + 10) sp.y = -10;
        const g = sctx.createRadialGradient(sp.x, sp.y, 0, sp.x, sp.y, 6);
        g.addColorStop(0, "rgba(255,255,255,.9)");
        g.addColorStop(1, "rgba(255,255,255,0)");
        sctx.fillStyle = g;
        sctx.beginPath();
        sctx.arc(sp.x, sp.y, sp.r * 3, 0, Math.PI * 2);
        sctx.fill();
      });
      raf2 = requestAnimationFrame(animateSparkles);
    };
    animateSparkles();

    return () => {
      cancelAnimationFrame(raf);
      cancelAnimationFrame(raf2);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return { heartsRef, sparklesRef };
}

export default function App() {
  const { heartsRef, sparklesRef } = useCanvasParticles();
  const floatingHearts = Array.from({ length: 10 });

  return (
    <div className="wrapper">
      <audio src={hero} autoPlay loop />
      {/* animated background blobs */}
      <div className="blob one" />
      <div className="blob two" />
      <div className="blob three" />

      {/* particle layers */}
      <canvas id="sparkles" ref={sparklesRef} />
      <canvas id="hearts" ref={heartsRef} />

      {/* main content card */}
      <div className="center">
        <div className="card">
          {/* ✅ Card Image */}
          <img src={img1} alt="Swati" className="card-img" />

          <div className="eyebrow">
            <span className="badge">this day for you Swati ❤️</span>
            <span>Forever Vibes</span>
          </div>
          <h1 className="title">Be • Happy • Always</h1>
          <p className="subtitle">
            Matters of the caring heart are truly all that matters.
            Wherever there is a despair, there is an opportunity to care.
            Caring to balance the scales of injustice brings rewards that are beyond description.
            Without caring, one can neither know their own heart nor touch another’s.
            Anonymous giving is the true mastery of caring.
            The more we exhibit care, the better our self-esteem becomes.
            Injustices would be eliminated if we would all source our ability to care.
            The holiest place is where a cruelty becomes a caring.
            Our ego-need to be right leaves our caring gene out in the cold.
            There would be no deceptions if we care enough to do our inspections.
          </p>
          <div className="ctaRow">
            <button className="btn" onClick={() => alert('Love you to the moon 🌙')}>Start the Journey</button>
            <button className="btn secondary" onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })}>See More</button>
          </div>
          <div className="footer">© {new Date().getFullYear()} Forever</div>
        </div>
      </div>

      {/* decorative floating hearts */}
      <div className="floating">
        {floatingHearts.map((_, i) => (
          <span
            key={i}
            className="heart"
            style={{
              left: Math.random() * 100 + 'vw',
              bottom: (-10 + Math.random() * 20) + 'vh',
              animationDelay: (Math.random() * 6).toFixed(2) + 's',
              filter: `hue-rotate(${Math.floor(Math.random() * 30) - 15}deg)`
            }}
          />
        ))}
      </div>
    </div>
  );
}
