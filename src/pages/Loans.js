import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Loans.css';

// Import local background image
import loansHeroBg from '../assets/images/loans-hero-bg.jpg';

function Loans() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('apply');
  const [loanAmount, setLoanAmount] = useState(500);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [applicationSubmitted, setApplicationSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [selectedDocuments, setSelectedDocuments] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [myApplications, setMyApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Format phone number: add +266 for 8-digit local numbers
  const formatPhoneNumber = (phone) => {
    let cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 8) {
      return '+266' + cleaned; // Lesotho country code
    }
    if (!phone.startsWith('+')) {
      return '+' + cleaned;
    }
    return phone;
  };

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    setIsLoggedIn(!!token);
  }, []);

  useEffect(() => {
    if (isLoggedIn && activeTab === 'active') {
      fetchMyApplications();
    }
  }, [isLoggedIn, activeTab]);

  useEffect(() => {
    const pendingAmount = sessionStorage.getItem('pendingLoanAmount');
    if (pendingAmount && isLoggedIn) {
      sessionStorage.removeItem('pendingLoanAmount');
      setLoanAmount(parseInt(pendingAmount));
      setShowApplicationForm(true);
    }
  }, [isLoggedIn]);

  const fetchMyApplications = async () => {
    const token = localStorage.getItem('access_token');
    if (!token) return;
    setIsLoading(true);
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/v1/loans/my-applications`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setMyApplications(data);
      }
    } catch (error) {
      console.error('Failed to fetch applications');
    } finally {
      setIsLoading(false);
    }
  };

  const documents = [
    { id: 'nads', name: 'NMDS Contract', description: 'National Manpower Development Secretariat contract' },
    { id: 'registration', name: 'Proof of Registration', description: 'Current academic year registration' },
    { id: 'id', name: 'National ID / Passport', description: 'Valid identification document' },
    { id: 'results', name: 'Academic Results', description: 'Latest academic transcripts' },
    { id: 'studentId', name: 'Student ID Card', description: 'University/college student ID' }
  ];

  const calculateTotalRepayment = () => {
    const interest = loanAmount * 0.25;
    const total = loanAmount + interest;
    return { interest: interest.toFixed(2), total: total.toFixed(2) };
  };

  const handleDocumentToggle = (docId) => {
    if (selectedDocuments.includes(docId)) {
      setSelectedDocuments(selectedDocuments.filter(id => id !== docId));
    } else {
      setSelectedDocuments([...selectedDocuments, docId]);
    }
  };

  const handleApplyLoan = () => {
    if (!isLoggedIn) {
      const confirmLogin = window.confirm(
        'You need to be logged in to check loan eligibility.\n\nWould you like to log in or create an account?'
      );
      if (confirmLogin) {
        sessionStorage.setItem('pendingLoanAmount', loanAmount);
        navigate('/login', { state: { from: '/loans', action: 'apply' } });
      }
      return;
    }
    if (loanAmount >= 200 && loanAmount <= 1000) {
      setSubmitError('');
      setShowApplicationForm(true);
    } else {
      alert('Loan amount must be between M200 and M1000');
    }
  };

  const handleSubmitApplication = async (e) => {
    e.preventDefault();
    setSubmitError('');
    if (!isLoggedIn) {
      alert('Please log in to submit your loan eligibility assessment.');
      navigate('/login', { state: { from: '/loans' } });
      return;
    }
    if (selectedDocuments.length !== documents.length) {
      alert('Please confirm that you have all required documents ready for physical submission');
      return;
    }
    setIsSubmitting(true);

    // Format phone number
    const rawPhone = e.target.phone_number.value;
    const formattedPhone = formatPhoneNumber(rawPhone);

    const formData = {
      full_name: e.target.full_name.value,
      student_id: e.target.student_id.value,
      email: e.target.email.value,
      phone_number: formattedPhone,          // ✅ correct field name
      institution: e.target.institution.value,
      course: e.target.course.value,
      amount: parseInt(loanAmount, 10),      // ✅ integer
      purpose: e.target.purpose.value
    };

    try {
      const token = localStorage.getItem('access_token');
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/v1/loans/apply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (res.ok) {
        setApplicationSubmitted(true);
        if (activeTab === 'active') fetchMyApplications();
        setTimeout(() => {
          setShowApplicationForm(false);
          setApplicationSubmitted(false);
          e.target.reset();
          setSelectedDocuments([]);
        }, 5000);
      } else {
        if (res.status === 401) {
          setSubmitError('Your session has expired. Please log in again.');
          setTimeout(() => navigate('/login'), 2000);
        } else if (res.status === 400) {
          setSubmitError(data.detail || 'Please check your information and try again.');
        } else if (res.status === 422) {
          // Show detailed validation errors
          const errors = data.detail?.map(err => err.msg).join(', ') || 'Invalid data. Check fields.';
          setSubmitError(`Validation error: ${errors}`);
        } else {
          setSubmitError('Unable to submit your application. Please try again later.');
        }
      }
    } catch (error) {
      setSubmitError('Unable to connect to the server. Please check your internet connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const { interest, total } = calculateTotalRepayment();

  // Fallback data (displayed only when backend returns empty)
  const activeLoans = myApplications.length > 0 ? myApplications : [
    { id: 'LN001', amount: 500, interest: 125, totalRepayment: 625, dueDate: '2026-04-23', status: 'active', applicationDate: '2026-03-24' }
  ];
  const loanHistory = [
    { id: 'LN000', amount: 300, interest: 75, totalRepayment: 375, status: 'completed', approvedDate: '2024-02-15', repaidDate: '2024-03-10' }
  ];

  return (
    <div className="loans-page">
      <div className="container">
        {/* Hero Section */}
        <div className="loans-hero" style={{ backgroundImage: `linear-gradient(135deg, rgba(102, 126, 234, 0.7), rgba(118, 75, 162, 0.7)), url(${loansHeroBg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
          <div className="hero-icon">💰</div>
          <h1>Student Micro-Loans</h1>
          <p>Quick financial support for your immediate academic needs</p>
          <div className="loan-stats">
            <div className="stat-card"><span className="stat-number">M200 - M1000</span><span className="stat-label">Loan Amount</span></div>
            <div className="stat-card"><span className="stat-number">25%</span><span className="stat-label">Interest Rate</span></div>
            <div className="stat-card"><span className="stat-number">30 Days</span><span className="stat-label">Repayment Period</span></div>
          </div>
          <div className="loan-notice"><p>⚠️ <strong>Important:</strong> This is an eligibility assessment only. Approved loans require physical document handover at our office. No online money transactions.</p></div>
        </div>

        {/* Tabs */}
        <div className="loans-tabs">
          <button className={`tab ${activeTab === 'apply' ? 'active' : ''}`} onClick={() => setActiveTab('apply')}>Check Eligibility</button>
          <button className={`tab ${activeTab === 'active' ? 'active' : ''}`} onClick={() => setActiveTab('active')}>Active Loans</button>
          <button className={`tab ${activeTab === 'history' ? 'active' : ''}`} onClick={() => setActiveTab('history')}>Loan History</button>
        </div>

        <div className="tab-content">
          {/* Apply for Loan Tab */}
          {activeTab === 'apply' && !showApplicationForm && !applicationSubmitted && (
            <div className="loan-calculator">
              <h2>Check Your Loan Eligibility</h2>
              <p className="calculator-description">Select your desired loan amount to see the repayment terms. All loans must be repaid within 30 days with 25% interest.</p>
              <div className="calculator-form">
                <div className="form-group">
                  <label>Loan Amount (M)</label>
                  <input type="range" min="200" max="1000" step="50" value={loanAmount} onChange={(e) => setLoanAmount(parseInt(e.target.value))} />
                  <div className="range-value">M{loanAmount.toLocaleString()}</div>
                </div>
                <div className="loan-summary">
                  <div className="summary-item"><span>Principal Amount:</span><strong>M{loanAmount.toLocaleString()}</strong></div>
                  <div className="summary-item"><span>Interest (25%):</span><strong>M{interest}</strong></div>
                  <div className="summary-item total"><span>Total Repayment:</span><strong>M{total}</strong></div>
                  <div className="summary-item"><span>Repayment Period:</span><strong>30 days from disbursement</strong></div>
                </div>
                <button className="apply-btn" onClick={handleApplyLoan}>Check Eligibility</button>
              </div>
              <div className="info-box"><h4>📋 How It Works</h4><ol><li>Submit your eligibility assessment online</li><li>Receive preliminary approval notification</li><li>Visit our office with required documents</li><li>Physical document verification</li><li>Loan disbursement (cash/bank transfer after verification)</li><li>Repay within 30 days with 25% interest</li></ol></div>
            </div>
          )}

          {/* Loan Application Form */}
          {showApplicationForm && (
            <div className="application-form">
              <h2>Loan Eligibility Assessment</h2>
              <p className="form-notice">⚠️ This is an assessment only. Approval requires physical document submission at our office.</p>
              {submitError && <div className="error-message">{submitError}</div>}
              <form onSubmit={handleSubmitApplication}>
                <div className="form-row">
                  <div className="form-group"><label>Full Name *</label><input type="text" name="full_name" required placeholder="John Doe" /></div>
                  <div className="form-group"><label>Student ID *</label><input type="text" name="student_id" required placeholder="STU12345" /></div>
                </div>
                <div className="form-row">
                  <div className="form-group"><label>Email Address *</label><input type="email" name="email" required placeholder="student@nul.ls" /></div>
                  <div className="form-group"><label>Phone Number *</label><input type="tel" name="phone_number" required placeholder="56613551 or +26612345678" /></div>
                </div>
                <div className="form-row">
                  <div className="form-group"><label>Institution *</label><select name="institution" required><option value="">Select Institution</option><option value="NUL">National University of Lesotho</option><option value="Limkokwing">Limkokwing University</option><option value="Botho">Botho University</option><option value="LEC">Lesotho Evangelical Church</option><option value="Other">Other Institution</option></select></div>
                  <div className="form-group"><label>Course/Program *</label><input type="text" name="course" required placeholder="Bachelor of Commerce" /></div>
                </div>
                <div className="form-row">
                  <div className="form-group"><label>Requested Loan Amount *</label><input type="number" value={loanAmount} readOnly className="readonly" /></div>
                  <div className="form-group"><label>Repayment Amount (incl. interest) *</label><input type="text" value={`M${total}`} readOnly className="readonly" /></div>
                </div>
                <div className="form-group"><label>Purpose of Loan *</label><select name="purpose" required><option value="">Select purpose</option><option value="tuition">Tuition Fees</option><option value="accommodation">Accommodation</option><option value="books">Books & Materials</option><option value="equipment">Laptop & Equipment</option><option value="transport">Transport</option><option value="emergency">Emergency</option></select></div>
                <div className="documents-section">
                  <label>Required Documents for Physical Submission *</label>
                  <p className="documents-note">Please confirm you have these documents ready. You will need to bring them to our office for verification.</p>
                  {documents.map(doc => (
                    <label key={doc.id} className="document-checkbox">
                      <input type="checkbox" checked={selectedDocuments.includes(doc.id)} onChange={() => handleDocumentToggle(doc.id)} />
                      <div className="document-info"><strong>{doc.name}</strong><span className="document-desc">{doc.description}</span></div>
                    </label>
                  ))}
                </div>
                <div className="form-group"><label className="checkbox-label"><input type="checkbox" required /> I understand that this is an eligibility assessment only. Approval requires physical document submission at LeSAH office.</label></div>
                <div className="form-group"><label className="checkbox-label"><input type="checkbox" required /> I confirm that all information provided is accurate and I will repay the loan within 30 days if approved.</label></div>
                <div className="form-actions">
                  <button type="submit" className="submit-btn" disabled={isSubmitting}>{isSubmitting ? 'Submitting...' : 'Submit Assessment'}</button>
                  <button type="button" className="cancel-btn" onClick={() => setShowApplicationForm(false)}>Cancel</button>
                </div>
              </form>
            </div>
          )}

          {/* Success Message */}
          {applicationSubmitted && (
            <div className="success-message">
              <div className="success-icon">✓</div>
              <h3>Eligibility Assessment Submitted!</h3>
              <p>Your application has been received. We will review it and contact you within 2-3 business days.</p>
              <div className="next-steps"><h4>What's Next?</h4><ul><li>Wait for our call/email for preliminary approval</li><li>Visit our office with all required documents</li><li>Documents needed: NMDS Contract, Proof of Registration, ID, Results, Student ID</li><li>Complete physical verification process</li><li>Loan disbursement after verification (cash or bank transfer)</li></ul></div>
              <button onClick={() => setApplicationSubmitted(false)} className="close-btn">Close</button>
            </div>
          )}

          {/* Active Loans Tab */}
          {activeTab === 'active' && (
            <div className="loans-list">
              {isLoading ? <div className="loading-state">Loading your applications...</div> : activeLoans.length > 0 ? activeLoans.map(loan => (
                <div key={loan.id} className="loan-card active">
                  <div className="loan-header"><h3>Loan #{loan.id}</h3><span className={`status-badge ${loan.status}`}>{loan.status === 'active' ? 'Active' : 'Pending'}</span></div>
                  <div className="loan-details">
                    <div className="detail-row"><span>Amount Disbursed:</span><strong>M{loan.amount?.toLocaleString() || loan.amount}</strong></div>
                    <div className="detail-row"><span>Interest (25%):</span><span>M{loan.interest || (loan.amount * 0.25)}</span></div>
                    <div className="detail-row"><span>Total to Repay:</span><strong className="total-amount">M{loan.totalRepayment || (loan.amount * 1.25)}</strong></div>
                    <div className="detail-row"><span>Due Date:</span><span className="due-date">{loan.dueDate || 'Awaiting approval'}</span></div>
                    <div className="progress-bar"><div className="progress-fill" style={{ width: loan.status === 'approved' ? '50%' : '10%' }}></div><span className="progress-text">{loan.status === 'approved' ? '50% of term completed' : 'Awaiting approval'}</span></div>
                  </div>
                  {loan.status === 'active' && <button className="make-payment-btn">Request Repayment Instructions</button>}
                </div>
              )) : <div className="empty-state"><p>No active loans at the moment</p><button onClick={() => setActiveTab('apply')} className="apply-link">Check eligibility →</button></div>}
            </div>
          )}

          {/* Loan History Tab */}
          {activeTab === 'history' && (
            <div className="loans-list">
              {loanHistory.length > 0 ? loanHistory.map(loan => (
                <div key={loan.id} className="loan-card completed">
                  <div className="loan-header"><h3>Loan #{loan.id}</h3><span className={`status-badge ${loan.status}`}>✓ Completed</span></div>
                  <div className="loan-details">
                    <div className="detail-row"><span>Amount:</span><strong>M{loan.amount.toLocaleString()}</strong></div>
                    <div className="detail-row"><span>Interest Paid:</span><span>M{loan.interest}</span></div>
                    <div className="detail-row"><span>Total Repaid:</span><strong>M{loan.totalRepayment}</strong></div>
                    <div className="detail-row"><span>Approved Date:</span><span>{loan.approvedDate}</span></div>
                    <div className="detail-row"><span>Repaid Date:</span><span>{loan.repaidDate}</span></div>
                  </div>
                  <button onClick={() => setActiveTab('apply')} className="reapply-link">Apply for another loan →</button>
                </div>
              )) : <div className="empty-state"><p>No loan history yet</p></div>}
            </div>
          )}
        </div>

        {/* FAQ Section */}
        <div className="faq-section">
          <h2>Frequently Asked Questions</h2>
          <div className="faq-grid">
            <div className="faq-item"><h3>Who is eligible for a student loan?</h3><p>All registered students with a valid student ID from accredited institutions in Lesotho can apply.</p></div>
            <div className="faq-item"><h3>What is the interest rate?</h3><p>The interest rate is 25% on the principal amount. For example, a M500 loan requires M625 repayment.</p></div>
            <div className="faq-item"><h3>How long do I have to repay?</h3><p>All loans must be repaid within 30 days from the date of disbursement.</p></div>
            <div className="faq-item"><h3>How do I receive the money?</h3><p>After document verification, you can receive the loan in cash at our office or via bank transfer (processing may take 1-2 days).</p></div>
            <div className="faq-item"><h3>What documents do I need?</h3><p>NMDS Contract, Proof of Registration, National ID, Latest Results, and Student ID Card.</p></div>
            <div className="faq-item"><h3>Can I apply online?</h3><p>You can submit an eligibility assessment online, but final approval requires physical document submission at our office.</p></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Loans;
