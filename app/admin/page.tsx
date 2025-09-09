"use client";

import { useState, useEffect } from "react";

interface User {
  id: string;
  name: string;
  email: string;
  company: string;
  createdAt: string;
}

interface Generation {
  id: string;
  userId: string;
  company: string;
  mode: 'staff' | 'upload';
  imageUrl: string;
  prompt: string;
  createdAt: string;
  userDetails: {
    name: string;
    email: string;
  };
}

interface CompanyStats {
  company: string;
  totalGenerations: number;
  limit: number;
  remainingGenerations: number;
  utilizationRate: string;
  users: User[];
  recentGenerations: Generation[];
}

interface DashboardData {
  overview: {
    totalGenerations: number;
    totalUsers: number;
    companiesWithActivity: number;
    totalCompanies: number;
  };
  companyBreakdown: CompanyStats[];
  recentActivity: Generation[];
  allGenerations: Generation[];
  allUsers: User[];
}

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [activeTab, setActiveTab] = useState<'overview' | 'companies' | 'users' | 'gallery' | 'prompts' | 'settings'>('overview');
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [customPrompts, setCustomPrompts] = useState<any[]>([]);
  const [newCompany, setNewCompany] = useState({ name: '', limit: 10 });
  const [editingCompany, setEditingCompany] = useState<string | null>(null);
  const [promptForm, setPromptForm] = useState({ clientName: '', customPrompt: '', isActive: true });

  useEffect(() => {
    // Check if already authenticated (in a real app, you'd check for a valid token)
    const token = localStorage.getItem('adminToken');
    if (token === 'admin-authenticated') {
      setIsAuthenticated(true);
      loadDashboardData();
      loadCustomPrompts();
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('adminToken', data.token);
        setIsAuthenticated(true);
        loadDashboardData();
      } else {
        setLoginError(data.error || 'Login failed');
      }
    } catch (error) {
      setLoginError('Network error. Please try again.');
    }
  };

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/dashboard', {
        headers: {
          'Authorization': 'Bearer admin-authenticated'
        }
      });

      if (res.ok) {
        const data = await res.json();
        setDashboardData(data);
      } else {
        console.error('Failed to load dashboard data');
      }
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadCustomPrompts = async () => {
    try {
      const res = await fetch('/api/admin/prompts');
      if (res.ok) {
        const data = await res.json();
        setCustomPrompts(data.prompts || []);
      }
    } catch (error) {
      console.error('Error loading custom prompts:', error);
    }
  };

  const saveCustomPrompt = async () => {
    if (!promptForm.clientName || !promptForm.customPrompt) return;
    
    try {
      const res = await fetch('/api/admin/prompts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(promptForm)
      });
      
      if (res.ok) {
        loadCustomPrompts();
        setPromptForm({ clientName: '', customPrompt: '', isActive: true });
      }
    } catch (error) {
      console.error('Error saving prompt:', error);
    }
  };

  const deletePrompt = async (clientName: string) => {
    try {
      const res = await fetch('/api/admin/prompts', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clientName })
      });
      
      if (res.ok) {
        loadCustomPrompts();
      }
    } catch (error) {
      console.error('Error deleting prompt:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setIsAuthenticated(false);
    setDashboardData(null);
    setUsername('');
    setPassword('');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Login form if not authenticated
  if (!isAuthenticated) {
    return (
      <main className="admin-dashboard">
        <div style={{ maxWidth: '400px', margin: '2rem auto', padding: '2rem' }}>
          <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>Admin Login</h1>
          
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label htmlFor="username">Username:</label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '8px',
                  border: '2px solid #e0e0e0',
                  fontSize: '16px'
                }}
                required
              />
            </div>
            
            <div>
              <label htmlFor="password">Password:</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '8px',
                  border: '2px solid #e0e0e0',
                  fontSize: '16px'
                }}
                required
              />
            </div>
            
            {loginError && (
              <div style={{ color: 'red', fontSize: '14px', textAlign: 'center' }}>
                {loginError}
              </div>
            )}
            
            <button type="submit" className="generate-btn">
              Login
            </button>
          </form>
          
          <div style={{ textAlign: 'center', marginTop: '2rem', fontSize: '14px', color: '#666' }}>
            <div>Admin credentials:</div>
            <div>• admin / holiday2025!</div>
            <div>• milx / 1</div>
          </div>
          
          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <a href="/" className="download-btn" style={{ textDecoration: 'none' }}>
              Back to Home
            </a>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="admin-dashboard">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Holiday Ornament Admin Dashboard</h1>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <button 
            onClick={loadDashboardData} 
            className="download-btn" 
            disabled={isLoading}
            style={{ textDecoration: 'none' }}
          >
            {isLoading ? 'Refreshing...' : 'Refresh Data'}
          </button>
          <button onClick={handleLogout} className="generate-btn">
            Logout
          </button>
        </div>
      </div>
      
      <div className="admin-nav">
        <button 
          className={activeTab === 'overview' ? 'admin-tab-active' : 'admin-tab'}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button 
          className={activeTab === 'companies' ? 'admin-tab-active' : 'admin-tab'}
          onClick={() => setActiveTab('companies')}
        >
          Companies
        </button>
        <button 
          className={activeTab === 'users' ? 'admin-tab-active' : 'admin-tab'}
          onClick={() => setActiveTab('users')}
        >
          Users
        </button>
        <button 
          className={activeTab === 'gallery' ? 'admin-tab-active' : 'admin-tab'}
          onClick={() => setActiveTab('gallery')}
        >
          Photo Gallery
        </button>
        <button 
          className={activeTab === 'prompts' ? 'admin-tab-active' : 'admin-tab'}
          onClick={() => setActiveTab('prompts')}
        >
          Custom Prompts
        </button>
        <button 
          className={activeTab === 'settings' ? 'admin-tab-active' : 'admin-tab'}
          onClick={() => setActiveTab('settings')}
        >
          Settings
        </button>
      </div>

      {isLoading && (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <div>Loading dashboard data...</div>
        </div>
      )}

      {!isLoading && dashboardData && activeTab === 'overview' && (
        <div className="admin-content">
          <div className="stats-grid">
            <div className="stat-card">
              <h3>Total Generations</h3>
              <div className="stat-number">{dashboardData.overview.totalGenerations}</div>
              <div className="stat-subtitle">Ornaments Created</div>
            </div>
            <div className="stat-card">
              <h3>Total Users</h3>
              <div className="stat-number">{dashboardData.overview.totalUsers}</div>
              <div className="stat-subtitle">Registered Users</div>
            </div>
            <div className="stat-card">
              <h3>Active Companies</h3>
              <div className="stat-number">{dashboardData.overview.companiesWithActivity}</div>
              <div className="stat-subtitle">With Generations</div>
            </div>
            <div className="stat-card">
              <h3>Total Companies</h3>
              <div className="stat-number">{dashboardData.overview.totalCompanies}</div>
              <div className="stat-subtitle">Configured</div>
            </div>
            <div className="stat-card">
              <h3>Custom Prompts</h3>
              <div className="stat-number">{customPrompts.length}</div>
              <div className="stat-subtitle">Active Templates</div>
            </div>
            <div className="stat-card">
              <h3>Avg Usage Rate</h3>
              <div className="stat-number">
                {dashboardData.companyBreakdown.length > 0 
                  ? (dashboardData.companyBreakdown.reduce((sum, c) => sum + parseFloat(c.utilizationRate), 0) / dashboardData.companyBreakdown.length).toFixed(1)
                  : 0}%
              </div>
              <div className="stat-subtitle">Company Utilization</div>
            </div>
          </div>

          <div className="recent-activity">
            <h2>Recent Generations</h2>
            <div className="activity-list">
              {dashboardData.recentActivity.slice(0, 10).map((generation) => (
                <div key={generation.id} className="activity-item">
                  <div className="activity-info">
                    <strong>{generation.userDetails.name}</strong>
                    <span className="status-badge active">{generation.company}</span>
                    <span className="mode-badge">{generation.mode}</span>
                  </div>
                  <div className="activity-details">
                    {formatDateTime(generation.createdAt)} • {generation.userDetails.email}
                  </div>
                  <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                    {generation.prompt.substring(0, 100)}...
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {!isLoading && dashboardData && activeTab === 'companies' && (
        <div className="admin-content">
          <h2>Company Statistics & Limits</h2>
          <div className="client-table-container">
            <table className="client-table">
              <thead>
                <tr>
                  <th>Company</th>
                  <th>Generations Used</th>
                  <th>Limit</th>
                  <th>Remaining</th>
                  <th>Utilization</th>
                  <th>Users</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {dashboardData.companyBreakdown.map((company) => (
                  <tr key={company.company}>
                    <td><strong>{company.company.toUpperCase()}</strong></td>
                    <td className="number-cell">{company.totalGenerations}</td>
                    <td className="number-cell">{company.limit}</td>
                    <td className="number-cell">
                      <span style={{ color: company.remainingGenerations > 5 ? 'green' : company.remainingGenerations > 0 ? 'orange' : 'red' }}>
                        {company.remainingGenerations}
                      </span>
                    </td>
                    <td className="number-cell">
                      <span style={{ color: parseFloat(company.utilizationRate) > 90 ? 'red' : parseFloat(company.utilizationRate) > 70 ? 'orange' : 'green' }}>
                        {company.utilizationRate}%
                      </span>
                    </td>
                    <td className="number-cell">{company.users.length}</td>
                    <td>
                      <a 
                        href={`/${company.company}`} 
                        target="_blank"
                        className="action-link"
                      >
                        Visit Page
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {!isLoading && dashboardData && activeTab === 'users' && (
        <div className="admin-content">
          <h2>User Management</h2>
          <div className="client-table-container">
            <table className="client-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Company</th>
                  <th>Joined</th>
                  <th>Generations</th>
                </tr>
              </thead>
              <tbody>
                {dashboardData.allUsers.map((user) => {
                  const userGenerations = dashboardData.allGenerations.filter(g => g.userId === user.id);
                  return (
                    <tr key={user.id}>
                      <td><strong>{user.name}</strong></td>
                      <td>{user.email}</td>
                      <td>
                        <span className="status-badge active">{user.company.toUpperCase()}</span>
                      </td>
                      <td>{formatDate(user.createdAt)}</td>
                      <td className="number-cell">{userGenerations.length}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {!isLoading && dashboardData && activeTab === 'gallery' && (
        <div className="admin-content">
          <h2>Generated Ornament Gallery</h2>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
            gap: '1.5rem',
            marginTop: '1rem'
          }}>
            {dashboardData.allGenerations.map((generation) => (
              <div key={generation.id} style={{
                border: '1px solid #e0e0e0',
                borderRadius: '12px',
                padding: '1rem',
                backgroundColor: 'white',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}>
                <div style={{ marginBottom: '0.5rem' }}>
                  <img 
                    src={generation.imageUrl} 
                    alt={`Ornament by ${generation.userDetails.name}`}
                    style={{
                      width: '100%',
                      height: '200px',
                      objectFit: 'cover',
                      borderRadius: '8px',
                      backgroundColor: '#f5f5f5'
                    }}
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
                <div style={{ fontSize: '14px' }}>
                  <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
                    {generation.userDetails.name}
                  </div>
                  <div style={{ color: '#666', marginBottom: '4px' }}>
                    {generation.company.toUpperCase()} • {generation.mode} • {formatDateTime(generation.createdAt)}
                  </div>
                  <div style={{ color: '#666', fontSize: '12px' }}>
                    {generation.userDetails.email}
                  </div>
                  <div style={{ 
                    marginTop: '8px', 
                    padding: '8px', 
                    backgroundColor: '#f9f9f9', 
                    borderRadius: '4px',
                    fontSize: '11px',
                    maxHeight: '60px',
                    overflow: 'hidden'
                  }}>
                    {generation.prompt.substring(0, 120)}...
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {dashboardData.allGenerations.length === 0 && (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#666' }}>
              No ornaments generated yet. Start creating some ornaments to see them here!
            </div>
          )}
        </div>
      )}

      {!isLoading && activeTab === 'prompts' && (
        <div className="admin-content">
          <h2>Custom Prompt Management</h2>
          
          <div style={{ 
            backgroundColor: 'white', 
            padding: '1.5rem', 
            borderRadius: '12px', 
            border: '1px solid #e0e0e0',
            marginBottom: '2rem'
          }}>
            <h3>Create New Custom Prompt</h3>
            <div style={{ display: 'grid', gap: '1rem', marginTop: '1rem' }}>
              <div>
                <label>Client Name:</label>
                <input
                  type="text"
                  value={promptForm.clientName}
                  onChange={(e) => setPromptForm({...promptForm, clientName: e.target.value})}
                  placeholder="Enter client name (e.g., Google, Apple)"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '8px',
                    border: '2px solid #e0e0e0',
                    fontSize: '16px'
                  }}
                />
              </div>
              <div>
                <label>Custom Prompt Template:</label>
                <textarea
                  value={promptForm.customPrompt}
                  onChange={(e) => setPromptForm({...promptForm, customPrompt: e.target.value})}
                  placeholder="Enter custom prompt template that will be used as base for this client's ornament generation..."
                  rows={4}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '8px',
                    border: '2px solid #e0e0e0',
                    fontSize: '16px',
                    resize: 'vertical'
                  }}
                />
              </div>
              <div>
                <label>
                  <input
                    type="checkbox"
                    checked={promptForm.isActive}
                    onChange={(e) => setPromptForm({...promptForm, isActive: e.target.checked})}
                    style={{ marginRight: '0.5rem' }}
                  />
                  Active (enable this prompt for the client)
                </label>
              </div>
              <button 
                onClick={saveCustomPrompt}
                className="generate-btn"
                disabled={!promptForm.clientName || !promptForm.customPrompt}
              >
                Save Custom Prompt
              </button>
            </div>
          </div>

          <div className="client-table-container">
            <table className="client-table">
              <thead>
                <tr>
                  <th>Client Name</th>
                  <th>Custom Prompt (Preview)</th>
                  <th>Status</th>
                  <th>Last Modified</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {customPrompts.map((prompt) => (
                  <tr key={prompt.id}>
                    <td><strong>{prompt.clientName.toUpperCase()}</strong></td>
                    <td style={{ maxWidth: '300px' }}>
                      <div style={{ 
                        fontSize: '12px', 
                        color: '#666', 
                        overflow: 'hidden', 
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}>
                        {prompt.customPrompt.substring(0, 80)}...
                      </div>
                    </td>
                    <td>
                      <span className={prompt.isActive ? 'status-badge active' : 'status-badge inactive'}>
                        {prompt.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>{formatDate(prompt.lastModified)}</td>
                    <td>
                      <button 
                        onClick={() => setPromptForm({
                          clientName: prompt.clientName,
                          customPrompt: prompt.customPrompt,
                          isActive: prompt.isActive
                        })}
                        className="action-link"
                        style={{ marginRight: '0.5rem', border: 'none', background: 'none', color: '#007bff', cursor: 'pointer' }}
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => deletePrompt(prompt.clientName)}
                        className="action-link"
                        style={{ border: 'none', background: 'none', color: '#dc3545', cursor: 'pointer' }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {customPrompts.length === 0 && (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#666' }}>
              No custom prompts configured yet. Create one above to get started!
            </div>
          )}
        </div>
      )}

      {!isLoading && activeTab === 'settings' && (
        <div className="admin-content">
          <h2>System Settings & Configuration</h2>
          
          <div style={{ display: 'grid', gap: '2rem' }}>
            <div style={{ 
              backgroundColor: 'white', 
              padding: '1.5rem', 
              borderRadius: '12px', 
              border: '1px solid #e0e0e0'
            }}>
              <h3>API Configuration</h3>
              <div style={{ display: 'grid', gap: '1rem', marginTop: '1rem' }}>
                <div>
                  <label>OpenAI API Status:</label>
                  <div style={{ marginTop: '0.5rem' }}>
                    <span className="status-badge active">Connected</span>
                    <button 
                      onClick={async () => {
                        try {
                          const res = await fetch('/api/test-key');
                          const data = await res.json();
                          alert(data.success ? 'API Key is working!' : 'API Key test failed: ' + data.error);
                        } catch (error) {
                          alert('Error testing API key');
                        }
                      }}
                      className="download-btn"
                      style={{ marginLeft: '1rem', textDecoration: 'none' }}
                    >
                      Test Connection
                    </button>
                  </div>
                </div>
                <div>
                  <label>Gemini API Status:</label>
                  <div style={{ marginTop: '0.5rem' }}>
                    <span className="status-badge active">Connected</span>
                    <small style={{ color: '#666', marginLeft: '1rem' }}>
                      Used for image generation
                    </small>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ 
              backgroundColor: 'white', 
              padding: '1.5rem', 
              borderRadius: '12px', 
              border: '1px solid #e0e0e0'
            }}>
              <h3>Company Limits Management</h3>
              <div style={{ marginBottom: '1rem' }}>
                <small style={{ color: '#666' }}>
                  Manage generation limits for each company. Add new companies or modify existing limits.
                </small>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '0.5rem', marginBottom: '1rem' }}>
                <input
                  type="text"
                  placeholder="Company name"
                  value={newCompany.name}
                  onChange={(e) => setNewCompany({...newCompany, name: e.target.value})}
                  style={{
                    padding: '0.5rem',
                    borderRadius: '4px',
                    border: '1px solid #e0e0e0'
                  }}
                />
                <input
                  type="number"
                  placeholder="Generation limit"
                  value={newCompany.limit}
                  onChange={(e) => setNewCompany({...newCompany, limit: parseInt(e.target.value) || 10})}
                  style={{
                    padding: '0.5rem',
                    borderRadius: '4px',
                    border: '1px solid #e0e0e0'
                  }}
                />
                <button 
                  className="generate-btn"
                  onClick={() => {
                    // In a real app, this would update the COMPANY_LIMITS environment variable
                    alert(`Added ${newCompany.name} with limit ${newCompany.limit}. In production, this would update the environment configuration.`);
                    setNewCompany({ name: '', limit: 10 });
                  }}
                  disabled={!newCompany.name}
                >
                  Add Company
                </button>
              </div>
              
              <div style={{ fontSize: '12px', color: '#666' }}>
                <strong>Current Companies:</strong> Configure in environment variables (COMPANY_LIMITS)
                <div style={{ marginTop: '0.5rem', fontFamily: 'monospace', backgroundColor: '#f5f5f5', padding: '0.5rem', borderRadius: '4px' }}>
                  {dashboardData ? JSON.stringify(dashboardData.companyBreakdown.reduce((acc, c) => {
                    acc[c.company] = c.limit;
                    return acc;
                  }, {} as Record<string, number>), null, 2) : '{}'}
                </div>
              </div>
            </div>

            <div style={{ 
              backgroundColor: 'white', 
              padding: '1.5rem', 
              borderRadius: '12px', 
              border: '1px solid #e0e0e0'
            }}>
              <h3>System Information</h3>
              <div style={{ display: 'grid', gap: '0.5rem', fontSize: '14px' }}>
                <div><strong>Platform:</strong> Holiday Ornament Generator MVP</div>
                <div><strong>Version:</strong> 1.0.0</div>
                <div><strong>Environment:</strong> Development</div>
                <div><strong>Data Storage:</strong> File-based (JSON)</div>
                <div><strong>Authentication:</strong> Basic Admin</div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div style={{ textAlign: 'center', marginTop: '3rem' }}>
        <a href="/" className="download-btn" style={{ textDecoration: 'none' }}>
          Back to Home
        </a>
      </div>
    </main>
  );
}