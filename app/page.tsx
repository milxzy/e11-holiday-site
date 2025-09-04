import Link from "next/link";

export default function Home() {
  return (
    <main>
      <h1>Holiday Ornament Generator</h1>
      
      <div className="client-greeting">
        Welcome to our Holiday Ornament Generator! Create personalized AI-generated ornaments for your organization.
      </div>
      
      <div className="form-container">
        <div className="form-group">
          <h2 style={{ color: '#2c5f2d', marginBottom: '1rem' }}>How it works:</h2>
          <ol style={{ fontSize: '1.1rem', lineHeight: '1.8', color: '#666', paddingLeft: '1.5rem' }}>
            <li>Each client receives a personalized URL (e.g., yoursite.com/<strong>/4as</strong>)</li>
            <li>Clients choose from predefined staff members and ornament styles</li>
            <li>System generates detailed prompts for AI ornament creation</li>
            <li>Preview the exact prompts that will be used for generation</li>
          </ol>
        </div>
        
        <div className="form-group">
          <h2 style={{ color: '#2c5f2d', marginBottom: '1rem' }}>Try it out:</h2>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            <Link href="/demo" className="generate-btn" style={{ textDecoration: 'none' }}>
              Try Demo
            </Link>
            <Link href="/4as" className="generate-btn" style={{ textDecoration: 'none' }}>
              4AS Example
            </Link>
            <Link href="/acme" className="generate-btn" style={{ textDecoration: 'none' }}>
              ACME Example
            </Link>
          </div>
        </div>
        
        <div className="form-group">
          <Link href="/library" className="download-btn" style={{ textDecoration: 'none', fontSize: '1.1rem', padding: '12px 24px' }}>
            View Ornament Library
          </Link>
        </div>
      </div>
      
      <div className="preview-container" style={{ marginTop: '2rem' }}>
        <h2>Features</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', textAlign: 'left' }}>
          <div>
            <h3 style={{ color: '#2c5f2d', marginBottom: '0.5rem' }}>Client-Specific URLs</h3>
            <p style={{ color: '#666' }}>Each organization gets their own personalized link</p>
          </div>
          <div>
            <h3 style={{ color: '#2c5f2d', marginBottom: '0.5rem' }}>AI Prompt Generation</h3>
            <p style={{ color: '#666' }}>Dynamic prompts based on user selections</p>
          </div>
          <div>
            <h3 style={{ color: '#2c5f2d', marginBottom: '0.5rem' }}>Print-Ready Design</h3>
            <p style={{ color: '#666' }}>Professional quality ornament specifications</p>
          </div>
          <div>
            <h3 style={{ color: '#2c5f2d', marginBottom: '0.5rem' }}>Prompt Showcase</h3>
            <p style={{ color: '#666' }}>See exactly what prompts will be generated</p>
          </div>
        </div>
      </div>
    </main>
  );
}
