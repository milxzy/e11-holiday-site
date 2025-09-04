"use client";

import { useState, useEffect } from "react";

interface ClientActivity {
  clientName: string;
  lastVisit: string;
  ornamentsCreated: number;
  promptsGenerated: number;
  mode: 'staff' | 'upload' | 'both';
  status: 'active' | 'inactive';
}

interface CustomPrompt {
  clientName: string;
  customPrompt: string;
  isActive: boolean;
  lastModified: string;
}

// Mock data for demonstration
const mockClientActivity: ClientActivity[] = [
  { clientName: '4AS', lastVisit: '2024-12-15', ornamentsCreated: 5, promptsGenerated: 12, mode: 'both', status: 'active' },
  { clientName: 'ACME', lastVisit: '2024-12-14', ornamentsCreated: 3, promptsGenerated: 8, mode: 'staff', status: 'active' },
  { clientName: 'Microsoft', lastVisit: '2024-12-13', ornamentsCreated: 0, promptsGenerated: 2, mode: 'upload', status: 'inactive' },
  { clientName: 'Google', lastVisit: '2024-12-12', ornamentsCreated: 7, promptsGenerated: 15, mode: 'both', status: 'active' },
  { clientName: 'Apple', lastVisit: '2024-12-10', ornamentsCreated: 2, promptsGenerated: 6, mode: 'staff', status: 'active' },
  { clientName: 'Harvard', lastVisit: '2024-12-08', ornamentsCreated: 0, promptsGenerated: 1, mode: 'upload', status: 'inactive' },
  { clientName: 'Stanford', lastVisit: '2024-12-07', ornamentsCreated: 4, promptsGenerated: 9, mode: 'both', status: 'active' },
  { clientName: 'RedCross', lastVisit: '2024-12-05', ornamentsCreated: 1, promptsGenerated: 3, mode: 'staff', status: 'active' },
];

const mockCustomPrompts: CustomPrompt[] = [
  { 
    clientName: '4AS', 
    customPrompt: 'A professional Christmas ornament featuring modern advertising agency aesthetics with clean lines, corporate colors, and creative flair.',
    isActive: true,
    lastModified: '2024-12-10'
  },
  { 
    clientName: 'Google', 
    customPrompt: 'A tech-inspired Christmas ornament with Google brand colors (blue, red, yellow, green) and innovative design elements.',
    isActive: true,
    lastModified: '2024-12-08'
  }
];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'clients' | 'prompts'>('overview');
  const [clientData, setClientData] = useState<ClientActivity[]>(mockClientActivity);
  const [customPrompts, setCustomPrompts] = useState<CustomPrompt[]>(mockCustomPrompts);
  const [selectedClient, setSelectedClient] = useState<string>('');
  const [newPrompt, setNewPrompt] = useState<string>('');

  const totalClients = clientData.length;
  const activeClients = clientData.filter(c => c.status === 'active').length;
  const totalOrnaments = clientData.reduce((sum, c) => sum + c.ornamentsCreated, 0);
  const totalPrompts = clientData.reduce((sum, c) => sum + c.promptsGenerated, 0);

  const handleSavePrompt = () => {
    if (!selectedClient || !newPrompt) return;

    const existingIndex = customPrompts.findIndex(p => p.clientName === selectedClient);
    const promptData: CustomPrompt = {
      clientName: selectedClient,
      customPrompt: newPrompt,
      isActive: true,
      lastModified: new Date().toISOString().split('T')[0]
    };

    if (existingIndex >= 0) {
      const updated = [...customPrompts];
      updated[existingIndex] = promptData;
      setCustomPrompts(updated);
    } else {
      setCustomPrompts([...customPrompts, promptData]);
    }

    setNewPrompt('');
    setSelectedClient('');
    alert('Custom prompt saved successfully!');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <main className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      
      <div className="admin-nav">
        <button 
          className={activeTab === 'overview' ? 'admin-tab-active' : 'admin-tab'}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button 
          className={activeTab === 'clients' ? 'admin-tab-active' : 'admin-tab'}
          onClick={() => setActiveTab('clients')}
        >
          Client Activity
        </button>
        <button 
          className={activeTab === 'prompts' ? 'admin-tab-active' : 'admin-tab'}
          onClick={() => setActiveTab('prompts')}
        >
          Custom Prompts
        </button>
      </div>

      {activeTab === 'overview' && (
        <div className="admin-content">
          <div className="stats-grid">
            <div className="stat-card">
              <h3>Total Clients</h3>
              <div className="stat-number">{totalClients}</div>
            </div>
            <div className="stat-card">
              <h3>Active Clients</h3>
              <div className="stat-number">{activeClients}</div>
            </div>
            <div className="stat-card">
              <h3>Ornaments Created</h3>
              <div className="stat-number">{totalOrnaments}</div>
            </div>
            <div className="stat-card">
              <h3>Prompts Generated</h3>
              <div className="stat-number">{totalPrompts}</div>
            </div>
          </div>

          <div className="recent-activity">
            <h2>Recent Activity</h2>
            <div className="activity-list">
              {clientData.slice(0, 5).map((client) => (
                <div key={client.clientName} className="activity-item">
                  <div className="activity-info">
                    <strong>{client.clientName}</strong>
                    <span className={`status-badge ${client.status}`}>{client.status}</span>
                  </div>
                  <div className="activity-details">
                    Last visit: {formatDate(client.lastVisit)} • 
                    {client.ornamentsCreated} ornaments • 
                    {client.promptsGenerated} prompts
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'clients' && (
        <div className="admin-content">
          <h2>Client Activity Tracking</h2>
          <div className="client-table-container">
            <table className="client-table">
              <thead>
                <tr>
                  <th>Client Name</th>
                  <th>Status</th>
                  <th>Last Visit</th>
                  <th>Ornaments Created</th>
                  <th>Prompts Generated</th>
                  <th>Preferred Mode</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {clientData.map((client) => (
                  <tr key={client.clientName}>
                    <td>
                      <strong>{client.clientName}</strong>
                    </td>
                    <td>
                      <span className={`status-badge ${client.status}`}>
                        {client.status}
                      </span>
                    </td>
                    <td>{formatDate(client.lastVisit)}</td>
                    <td className="number-cell">{client.ornamentsCreated}</td>
                    <td className="number-cell">{client.promptsGenerated}</td>
                    <td>
                      <span className="mode-badge">{client.mode}</span>
                    </td>
                    <td>
                      <a 
                        href={`/${client.clientName.toLowerCase()}`} 
                        target="_blank"
                        className="action-link"
                      >
                        View Client Page
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'prompts' && (
        <div className="admin-content">
          <h2>Custom Prompt Management</h2>
          
          <div className="prompt-editor">
            <h3>Create Custom Prompt</h3>
            <div className="form-group">
              <label htmlFor="client-select">Select Client:</label>
              <select 
                id="client-select"
                value={selectedClient}
                onChange={e => setSelectedClient(e.target.value)}
              >
                <option value="">Choose a client...</option>
                {clientData.map(client => (
                  <option key={client.clientName} value={client.clientName}>
                    {client.clientName}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="custom-prompt">Custom Prompt Template:</label>
              <textarea
                id="custom-prompt"
                value={newPrompt}
                onChange={e => setNewPrompt(e.target.value)}
                placeholder="Enter a custom prompt template for this client. Use {ornament_style}, {client_name} as placeholders."
                rows={4}
              />
            </div>
            
            <button 
              onClick={handleSavePrompt}
              className="generate-btn"
              disabled={!selectedClient || !newPrompt}
            >
              Save Custom Prompt
            </button>
          </div>

          <div className="existing-prompts">
            <h3>Existing Custom Prompts</h3>
            {customPrompts.length === 0 ? (
              <p>No custom prompts configured yet.</p>
            ) : (
              <div className="prompt-list">
                {customPrompts.map((prompt) => (
                  <div key={prompt.clientName} className="prompt-card">
                    <div className="prompt-header">
                      <h4>{prompt.clientName}</h4>
                      <span className={`status-badge ${prompt.isActive ? 'active' : 'inactive'}`}>
                        {prompt.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <div className="prompt-text">
                      {prompt.customPrompt}
                    </div>
                    <div className="prompt-meta">
                      Last modified: {formatDate(prompt.lastModified)}
                    </div>
                  </div>
                ))}
              </div>
            )}
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