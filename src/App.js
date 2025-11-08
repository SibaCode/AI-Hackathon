import React, { useState } from 'react';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('welcome');
  const [userTier, setUserTier] = useState('');

  // Welcome Page Component
  const WelcomePage = () => (
    <div className="welcome-container">
      <header className="header">
        <div className="container">
          <h1 className="logo">Nceda<span>Hub</span></h1>
        </div>
      </header>

      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1>Your Business, <span className="highlight">Powered by Data</span></h1>
            <p>Access loans, grants, and AI-powered insights to grow your enterprise</p>

            <div className="role-selection">
              <div className="role-card" onClick={() => setCurrentPage('onboarding')}>
                <div className="role-icon">👨‍💼</div>
                <h3>Business Owner</h3>
                <p>Get personalized insights and funding opportunities</p>
                <button className="btn btn-primary">Get Started</button>
              </div>

              <div className="role-card" onClick={() => setCurrentPage('enterprise')}>
                <div className="role-icon">🏢</div>
                <h3>Enterprise Partner</h3>
                <p>For investors, lenders, and government agencies</p>
                <button className="btn btn-outline">Enter Portal</button>
              </div>
            </div>

            <div className="security-badge">
              🔒 Bank-level security & encryption
            </div>
          </div>
        </div>
      </section>
    </div>
  );

  // Onboarding Component
  const Onboarding = () => {
    const [step, setStep] = useState(1);
    const [businessName, setBusinessName] = useState('');
    const [revenue, setRevenue] = useState('');

    const handleSubmit = (e) => {
      e.preventDefault();
      // Simple tier assignment logic
      if (revenue === 'low') setUserTier('Basic');
      else if (revenue === 'medium') setUserTier('Intermediate');
      else setUserTier('Pro');
      
      setCurrentPage('dashboard');
    };

    return (
      <div className="onboarding-container">
        <div className="container">
          <div className="onboarding-card">
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${(step / 3) * 100}%` }}
              ></div>
            </div>

            <h2>Tell us about your business</h2>

            {step === 1 && (
              <div className="onboarding-step">
                <label>Business Name</label>
                <input
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="Enter your business name"
                />
                <button 
                  className="btn btn-primary"
                  onClick={() => setStep(2)}
                  disabled={!businessName}
                >
                  Next
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="onboarding-step">
                <label>Average Monthly Revenue</label>
                <div className="option-buttons">
                  <button 
                    className={`option-btn ${revenue === 'low' ? 'selected' : ''}`}
                    onClick={() => setRevenue('low')}
                  >
                    R0 - R5,000
                  </button>
                  <button 
                    className={`option-btn ${revenue === 'medium' ? 'selected' : ''}`}
                    onClick={() => setRevenue('medium')}
                  >
                    R5,000 - R15,000
                  </button>
                  <button 
                    className={`option-btn ${revenue === 'high' ? 'selected' : ''}`}
                    onClick={() => setRevenue('high')}
                  >
                    R15,000+
                  </button>
                </div>
                <button 
                  className="btn btn-primary"
                  onClick={() => setStep(3)}
                  disabled={!revenue}
                >
                  Next
                </button>
              </div>
            )}

            {step === 3 && (
              <div className="onboarding-step">
                <label>What support do you need?</label>
                <div className="option-buttons">
                  <button className="option-btn">Loans</button>
                  <button className="option-btn">Grants</button>
                  <button className="option-btn">Business Skills</button>
                  <button className="option-btn">Insurance</button>
                </div>
                <button 
                  className="btn btn-primary"
                  onClick={handleSubmit}
                >
                  Complete Setup
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Dashboard Component
  const Dashboard = () => (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="container">
          <div className="header-content">
            <div>
              <h1>Welcome to your Dashboard! 🎉</h1>
              <p>You've been assigned to: <strong>{userTier} Tier</strong></p>
            </div>
            <div className="tier-badge">{userTier} Tier</div>
          </div>
        </div>
      </header>

      <div className="container">
        <div className="dashboard-content">
          {userTier === 'Basic' && (
            <div className="tier-section">
              <h2>Basic Tier - The Builder</h2>
              <div className="features">
                <div className="feature-card">
                  <h3>📚 Learning Modules</h3>
                  <p>Start with financial literacy basics</p>
                  <button className="btn btn-primary">Begin Learning</button>
                </div>
                <div className="feature-card">
                  <h3>👥 Assign Admin</h3>
                  <p>Designate someone to help manage finances</p>
                  <button className="btn btn-outline">Assign</button>
                </div>
              </div>
            </div>
          )}

          {userTier === 'Intermediate' && (
            <div className="tier-section">
              <h2>Intermediate Tier - The Grower</h2>
              <div className="features">
                <div className="feature-card">
                  <h3>💳 Log Transactions</h3>
                  <p>Track your income and expenses</p>
                  <button className="btn btn-primary">Add Transaction</button>
                </div>
                <div className="feature-card">
                  <h3>📊 Business Health</h3>
                  <p>View your AI-generated reports</p>
                  <button className="btn btn-outline">View Report</button>
                </div>
              </div>
            </div>
          )}

          {userTier === 'Pro' && (
            <div className="tier-section">
              <h2>Pro Tier - The Optimizer</h2>
              <div className="features">
                <div className="feature-card">
                  <h3>📈 Advanced Analytics</h3>
                  <p>Deep insights into your business performance</p>
                  <button className="btn btn-primary">View Analytics</button>
                </div>
                <div className="feature-card">
                  <h3>🎯 Investor Ready</h3>
                  <p>Connect with potential investors</p>
                  <button className="btn btn-outline">Explore Opportunities</button>
                </div>
              </div>
            </div>
          )}

          <button 
            className="btn btn-outline"
            onClick={() => {
              setCurrentPage('welcome');
              setUserTier('');
            }}
            style={{ marginTop: '2rem' }}
          >
            ← Back to Welcome
          </button>
        </div>
      </div>
    </div>
  );

  // Enterprise Dashboard
  const EnterpriseDashboard = () => (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="container">
          <div className="header-content">
            <div>
              <h1>Enterprise Portal</h1>
              <p>Verified business data and insights</p>
            </div>
            <div className="tier-badge">Enterprise</div>
          </div>
        </div>
      </header>

      <div className="container">
        <div className="dashboard-content">
          <div className="tier-section">
            <h2>Business Overview</h2>
            <div className="features">
              <div className="feature-card">
                <h3>📊 Verified Businesses</h3>
                <p>Access profiles of Pro-tier verified businesses</p>
                <button className="btn btn-primary">Browse Directory</button>
              </div>
              <div className="feature-card">
                <h3>📈 Market Trends</h3>
                <p>AI-generated insights and sector analysis</p>
                <button className="btn btn-outline">View Reports</button>
              </div>
            </div>
          </div>

          <button 
            className="btn btn-outline"
            onClick={() => setCurrentPage('welcome')}
            style={{ marginTop: '2rem' }}
          >
            ← Back to Welcome
          </button>
        </div>
      </div>
    </div>
  );

  // Render current page
  return (
    <div className="App">
      {currentPage === 'welcome' && <WelcomePage />}
      {currentPage === 'onboarding' && <Onboarding />}
      {currentPage === 'dashboard' && <Dashboard />}
      {currentPage === 'enterprise' && <EnterpriseDashboard />}
    </div>
  );
}

export default App;