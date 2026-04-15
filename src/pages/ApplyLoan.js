import React from "react";
import "./ApplyLoan.css";
import { useState } from "react";

function ApplyLoan() {
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");

  const interestRate = 0.25;
  const interest = amount ? amount * interestRate : 0;
  const totalRepayment = amount ? Number(amount) + interest : 0;

  const handleSubmit = (e) => {
    e.preventDefault();
    const numericAmount = Number(amount);

    if (numericAmount < 200 || numericAmount >1000) {
        setError("Loan amount must be between M200 and M1000.");
        return;
    }
    setError("");
    alert("Application submitted successfully!");
};
  return (
    <div className="page">
      <h1>Student Loan Application</h1>

      <p>
        Complete this form to begin your loan application.
        Final approval requires in-person document verification.
      </p>

      <form className="loan-form" onSubmit={handleSubmit}>
        <input type="text" placeholder="Full Name" required />
        <input type="tel" placeholder="Phone Number" required />
        <input type="email" placeholder="Email Address" required />
        <input type="text" placeholder="Institution" required />

        <input
          type="number"
          placeholder="Loan Amount (M200 – M1000)"
          min="200"
          max="1000"
          malue={amount}
          onChange={(e) => setAmount(e.target.value)} className={error ? "input-error" : ""} required/>

        <small className="amount-note">
          Loan amounts range between <strong>M200</strong> and <strong>M1000</strong>.
        </small>

        {/* 🔥 Interest Preview */}
        {amount && (
          <div className="interest-preview">
            <p>
              <strong>Interest (25%):</strong> M{interest.toFixed(2)}
            </p>
            <p className="total">
              <strong>Total Repayment:</strong> M{totalRepayment.toFixed(2)}
            </p>
          </div>
        )}

        <label>
          <input type="checkbox" required />
          I understand that this loan carries a 25% interest rate and
          Requires in-person document submission.
        </label>

        <button type="submit" className="btn-primary">
          Submit Application
        </button>
      </form>
    </div>
  );
}

export default ApplyLoan;


