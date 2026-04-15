import React from "react";
import { useState } from "react";
import "./Career.css";

function CareerGuidance() {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState("free");

  return (
    <div className="career-page">
      <div className="career-icon">🎓</div>

      <h1 className="career-title">Career Guidance</h1>
      <p className="career-subtitle">
        Get guidance, mentorship, and direction for your future career.
      </p>

      <button className="career-btn" onClick={() => setOpen(true)}>
        Get Career Guidance
      </button>

      <div className="career-features">
        <div className="career-card">🧭 Career direction</div>
        <div className="career-card">🤝 Mentorship</div>
        <div className="career-card">📄 CV & interview tips</div>
      </div>

      {open && (
        <div className="career-overlay">
          <div className="career-modal">
            <button className="close-btn" onClick={() => setOpen(false)}>
              ✕
            </button>

            <div className="toggle">
              <button
                className={mode === "free" ? "active" : ""}
                onClick={() => setMode("free")}
              >
                Free Guidance
              </button>
              <button
                className={mode === "premium" ? "active premium" : "premium"}
                onClick={() => setMode("premium")}
              >
                Premium Guidance
              </button>
            </div>

            {mode === "free" && (
              <form className="career-form">
                <h2>Free Career Guidance</h2>

                <input type="text" placeholder="Full Name" required />
                <input type="text" placeholder="Institution" required />
                <input type="text" placeholder="Field of Study" required />
                <input type="text" placeholder="Year of Study" required />

                <textarea
                  Placeholder="What are you struggling with?"
                  Rows="4"
                  Required
                />

                <input type="tel" placeholder="Phone / WhatsApp" required />

                <button type="submit" className="submit-btn">
                  Submit Request
                </button>
              </form>
            )}

            {mode === "premium" && (
              <form className="career-form premium-form">
                <h2>Premium Career Guidance</h2>

                <input type="text" placeholder="Full Name" required />
                <input type="text" placeholder="Institution" required />
                <input type="text" placeholder="Field of Study" required />

                <select required>
                  <option value="">Select Service</option>
                  <option>Career Planning</option>
                  <option>CV Review</option>
                  <option>Interview Preparation</option>
                </select>

                <select required>
                  <option value="">Session Type</option>
                  <option>Online</option>
                  <option>In-Person</option>
                </select>

                <input type="tel" placeholder="Phone Number" required />

                <label className="checkbox">
                  <input type="checkbox" required />
                  I understand this is a paid service
                </label>

                <button type="submit" className="submit-btn premium-btn">
                  Request Premium Guidance
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default CareerGuidance;
