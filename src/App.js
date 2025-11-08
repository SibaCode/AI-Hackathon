import React, { useState, useEffect } from 'react';
import { db, auth } from './firebase/config';
import { collection, addDoc, getDocs, doc, setDoc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged, signInAnonymously } from 'firebase/auth';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('welcome');
  const [userTier, setUserTier] = useState('');
  const [userId, setUserId] = useState(null);
  const [businessData, setBusinessData] = useState(null);
  const [loading, setLoading] = useState(false);

  // Firebase Auth State Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserId(user.uid);
        // Check if user has existing business data
        const userDoc = await getDoc(doc(db, 'businesses', user.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setBusinessData(data);
          setUserTier(data.tier);
          setCurrentPage('dashboard');
        }
      } else {
        // Sign in anonymously
        signInAnonymously(auth);
      }
    });

    return () => unsubscribe();
  }, []);

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
    const [formData, setFormData] = useState({
      businessName: '',
      businessType: '',
      revenue: '',
      yearsInOperation: '',
      supportNeeds: [],
      recordKeeping: '',
      hasBankAccount: false
    });

    const handleInputChange = (field, value) => {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    };

    const assignTier = (data) => {
      if (data.revenue === 'low' || !data.hasBankAccount) return 'Basic';
      if (data.revenue === 'medium') return 'Intermediate';
      return 'Pro';
    };

    const saveBusinessData = async () => {
      setLoading(true);
      try {
        const tier = assignTier(formData);
        const businessData = {
          ...formData,
          tier,
          createdAt: new Date(),
          updatedAt: new Date(),
          userId: userId
        };

        // Save to Firestore
        await setDoc(doc(db, 'businesses', userId), businessData);
        
        setUserTier(tier);
        setBusinessData(businessData);
        setCurrentPage('dashboard');
      } catch (error) {
        console.error('Error saving business data:', error);
        alert('Error saving your data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      saveBusinessData();
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
                  value={formData.businessName}
                  onChange={(e) => handleInputChange('businessName', e.target.value)}
                  placeholder="Enter your business name"
                />
                
                <label>Business Type</label>
                <select 
                  value={formData.businessType}
                  onChange={(e) => handleInputChange('businessType', e.target.value)}
                >
                  <option value="">Select your business type</option>
                  <option value="street_food">Street Food</option>
                  <option value="retail">Retail Shop</option>
                  <option value="services">Services</option>
                  <option value="manufacturing">Small Manufacturing</option>
                  <option value="other">Other</option>
                </select>

                <button 
                  className="btn btn-primary"
                  onClick={() => setStep(2)}
                  disabled={!formData.businessName || !formData.businessType}
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
                    type="button"
                    className={`option-btn ${formData.revenue === 'low' ? 'selected' : ''}`}
                    onClick={() => handleInputChange('revenue', 'low')}
                  >
                    R0 - R5,000
                  </button>
                  <button 
                    type="button"
                    className={`option-btn ${formData.revenue === 'medium' ? 'selected' : ''}`}
                    onClick={() => handleInputChange('revenue', 'medium')}
                  >
                    R5,000 - R15,000
                  </button>
                  <button 
                    type="button"
                    className={`option-btn ${formData.revenue === 'high' ? 'selected' : ''}`}
                    onClick={() => handleInputChange('revenue', 'high')}
                  >
                    R15,000+
                  </button>
                </div>

                <label>Years in Operation</label>
                <input
                  type="number"
                  value={formData.yearsInOperation}
                  onChange={(e) => handleInputChange('yearsInOperation', e.target.value)}
                  placeholder="How many years?"
                  min="0"
                />

                <button 
                  className="btn btn-primary"
                  onClick={() => setStep(3)}
                  disabled={!formData.revenue || !formData.yearsInOperation}
                >
                  Next
                </button>
              </div>
            )}

            {step === 3 && (
              <div className="onboarding-step">
                <label>How do you track your finances?</label>
                <div className="option-buttons">
                  <button 
                    type="button"
                    className={`option-btn ${formData.recordKeeping === 'memory' ? 'selected' : ''}`}
                    onClick={() => handleInputChange('recordKeeping', 'memory')}
                  >
                    Memory
                  </button>
                  <button 
                    type="button"
                    className={`option-btn ${formData.recordKeeping === 'notebook' ? 'selected' : ''}`}
                    onClick={() => handleInputChange('recordKeeping', 'notebook')}
                  >
                    Notebook
                  </button>
                  <button 
                    type="button"
                    className={`option-btn ${formData.recordKeeping === 'digital' ? 'selected' : ''}`}
                    onClick={() => handleInputChange('recordKeeping', 'digital')}
                  >
                    Digital App
                  </button>
                </div>

                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.hasBankAccount}
                    onChange={(e) => handleInputChange('hasBankAccount', e.target.checked)}
                  />
                  I have a separate bank account for my business
                </label>

                <button 
                  className="btn btn-primary"
                  onClick={handleSubmit}
                  disabled={loading || !formData.recordKeeping}
                >
                  {loading ? 'Saving...' : 'Complete Setup'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Dashboard Component
  const Dashboard = () => {
    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
      const fetchTransactions = async () => {
        if (userId) {
          const transactionsRef = collection(db, 'businesses', userId, 'transactions');
          const snapshot = await getDocs(transactionsRef);
          const transactionsData = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          setTransactions(transactionsData);
        }
      };

      fetchTransactions();
    }, [userId]);

    const addSampleTransaction = async () => {
      try {
        const transactionsRef = collection(db, 'businesses', userId, 'transactions');
        await addDoc(transactionsRef, {
          amount: 1500,
          type: 'income',
          category: 'sales',
          description: 'Daily sales',
          date: new Date()
        });
        alert('Sample transaction added!');
      } catch (error) {
        console.error('Error adding transaction:', error);
      }
    };

    return (
      <div className="dashboard-container">
        <header className="dashboard-header">
          <div className="container">
            <div className="header-content">
              <div>
                <h1>Welcome back{businessData?.businessName ? `, ${businessData.businessName}` : ''}! 🎉</h1>
                <p>You're on the <strong>{userTier} Tier</strong></p>
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
                    <button className="btn btn-primary" onClick={addSampleTransaction}>
                      Add Sample Transaction
                    </button>
                  </div>
                  <div className="feature-card">
                    <h3>📊 Business Health</h3>
                    <p>View your AI-generated reports</p>
                    <button className="btn btn-outline">View Report</button>
                  </div>
                </div>
                
                <div className="transactions-section">
                  <h3>Recent Transactions</h3>
                  {transactions.length > 0 ? (
                    <div className="transactions-list">
                      {transactions.map(transaction => (
                        <div key={transaction.id} className="transaction-item">
                          <span>{transaction.description}</span>
                          <span className={`amount ${transaction.type}`}>
                            R{transaction.amount}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p>No transactions yet. Add your first transaction!</p>
                  )}
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

            <div className="business-info">
              <h3>Your Business Details</h3>
              {businessData && (
                <div className="info-grid">
                  <div><strong>Business Type:</strong> {businessData.businessType}</div>
                  <div><strong>Revenue:</strong> {businessData.revenue}</div>
                  <div><strong>Years Operating:</strong> {businessData.yearsInOperation}</div>
                  <div><strong>Record Keeping:</strong> {businessData.recordKeeping}</div>
                </div>
              )}
            </div>

            <button 
              className="btn btn-outline"
              onClick={() => {
                setCurrentPage('welcome');
                setUserTier('');
                setBusinessData(null);
              }}
              style={{ marginTop: '2rem' }}
            >
              ← Back to Welcome
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Enterprise Dashboard
  const EnterpriseDashboard = () => {
    const [allBusinesses, setAllBusinesses] = useState([]);

    useEffect(() => {
      const fetchAllBusinesses = async () => {
        const businessesRef = collection(db, 'businesses');
        const snapshot = await getDocs(businessesRef);
        const businessesData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setAllBusinesses(businessesData);
      };

      fetchAllBusinesses();
    }, []);

    return (
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
              
              <div className="stats-grid">
                <div className="stat-card">
                  <h3>Total Businesses</h3>
                  <p className="stat-number">{allBusinesses.length}</p>
                </div>
                <div className="stat-card">
                  <h3>Pro Tier</h3>
                  <p className="stat-number">
                    {allBusinesses.filter(b => b.tier === 'Pro').length}
                  </p>
                </div>
                <div className="stat-card">
                  <h3>Intermediate</h3>
                  <p className="stat-number">
                    {allBusinesses.filter(b => b.tier === 'Intermediate').length}
                  </p>
                </div>
              </div>

              <div className="features">
                <div className="feature-card">
                  <h3>📊 Verified Businesses</h3>
                  <p>Access profiles of verified businesses</p>
                  <button className="btn btn-primary">Browse Directory</button>
                </div>
                <div className="feature-card">
                  <h3>📈 Market Trends</h3>
                  <p>AI-generated insights and sector analysis</p>
                  <button className="btn btn-outline">View Reports</button>
                </div>
              </div>

              <div className="businesses-list">
                <h3>Recent Business Signups</h3>
                {allBusinesses.slice(0, 5).map(business => (
                  <div key={business.id} className="business-item">
                    <div>
                      <strong>{business.businessName}</strong>
                      <span className={`tier-badge small ${business.tier?.toLowerCase()}`}>
                        {business.tier}
                      </span>
                    </div>
                    <div>{business.businessType} • {business.revenue} revenue</div>
                  </div>
                ))}
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
  };

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