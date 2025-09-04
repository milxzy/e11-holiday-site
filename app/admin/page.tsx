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
  const [activeTab, setActiveTab] = useState<'overview' | 'companies' | 'users' | 'gallery'>('overview');
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check if already authenticated (in a real app, you'd check for a valid token)
    const token = localStorage.getItem('adminToken');
    if (token === 'admin-authenticated') {
      setIsAuthenticated(true);
      loadDashboardData();
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
            Default credentials: admin / holiday2025!
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
            </div>
            <div className="stat-card">
              <h3>Total Users</h3>
              <div className="stat-number">{dashboardData.overview.totalUsers}</div>
            </div>
            <div className="stat-card">
              <h3>Active Companies</h3>
              <div className="stat-number">{dashboardData.overview.companiesWithActivity}</div>
            </div>
            <div className="stat-card">
              <h3>Total Companies</h3>
              <div className="stat-number">{dashboardData.overview.totalCompanies}</div>
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

      <div style={{ textAlign: 'center', marginTop: '3rem' }}>
        <a href="/" className="download-btn" style={{ textDecoration: 'none' }}>
          Back to Home
        </a>
      </div>
    </main>
  );
}