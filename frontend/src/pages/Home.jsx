import React, { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import styles from "../styles/Home.module.css";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  const [bgPos, setBgPos] = useState({ x: "50%", y: "50%" });

  const handleMouseMove = (e) => {
    const { clientX, clientY, currentTarget } = e;
    const { width, height, left, top } = currentTarget.getBoundingClientRect();
    const x = ((clientX - left) / width) * 100;
    const y = ((clientY - top) / height) * 100;
    setBgPos({ x: `${x}%`, y: `${y}%` });
  };

  return (
    <div className={styles.pageWrapper}>
      <Header />

      <section
        className={styles.hero}
        style={{ "--x": bgPos.x, "--y": bgPos.y }}
        onMouseMove={handleMouseMove}
      >
        <h1>Organize Your Ideas with Trelloer</h1>
        <p>
          Plan projects, collaborate in real-time, and bring your ideas to life
          — all in one simple, powerful workspace.
        </p>
        <button
          className={styles.ctaButton}
          onClick={() => {
            const token = localStorage.getItem("token"); // adjust if you store auth differently
            if (token) {
              navigate("/boards");
            } else {
              navigate("/register");
            }
          }}
        >
          Get Started
        </button>
      </section>

      <section className={styles.features}>
        <div className="container">
          <div className={styles.featuresGrid}>
            <div className={styles.featureCard}>
              <h3>Easy Board Creation</h3>
              <p>Create boards in seconds to start organizing your workflow.</p>
            </div>
            <div className={styles.featureCard}>
              <h3>Real-time Collaboration</h3>
              <p>
                Work with your team instantly with live updates and changes.
              </p>
            </div>
            <div className={styles.featureCard}>
              <h3>Stay Organized Anywhere</h3>
              <p>Access Trelloer on desktop or mobile, wherever you are.</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
