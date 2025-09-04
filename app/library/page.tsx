"use client";

import { useState, useEffect } from "react";

interface LibraryImage {
  filename: string;
  url: string;
  client: string;
  createdAt: string;
  timestamp: number;
}

export default function LibraryPage() {
  const [images, setImages] = useState<LibraryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchLibrary();
  }, []);

  const fetchLibrary = async () => {
    try {
      const res = await fetch('/api/library');
      const data = await res.json();
      
      if (res.ok) {
        setImages(data.images);
      } else {
        setError(data.error || 'Failed to load library');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
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

  if (loading) {
    return (
      <main>
        <h1>Ornament Library</h1>
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <div className="loading-spinner" style={{ display: 'inline-block', marginBottom: '1rem' }}></div>
          <p>Loading your ornament collection...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main>
        <h1>Ornament Library</h1>
        <div className="error-message">
          Error: {error}
        </div>
      </main>
    );
  }

  return (
    <main>
      <h1>Ornament Library</h1>
      <div style={{ marginBottom: '2rem' }}>
        <p style={{ textAlign: 'center', fontSize: '1.1rem', color: '#666' }}>
          Collection of all generated holiday ornaments ({images.length} total)
        </p>
      </div>
      
      {images.length === 0 ? (
        <div className="preview-container">
          <h2>No ornaments yet!</h2>
          <p>Generate some ornaments first to see them appear here.</p>
        </div>
      ) : (
        <div className="library-grid">
          {images.map((image) => (
            <div key={image.filename} className="library-item">
              <div className="library-image-container">
                <img 
                  src={image.url} 
                  alt={`Ornament for ${image.client}`}
                  loading="lazy"
                />
              </div>
              <div className="library-info">
                <h3>{image.client}</h3>
                <p>{formatDate(image.createdAt)}</p>
                <a 
                  href={image.url} 
                  download={image.filename}
                  className="download-btn"
                >
                  Download
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
        <a href="/" className="generate-btn" style={{ textDecoration: 'none', display: 'inline-block' }}>
          Back to Home
        </a>
      </div>
    </main>
  );
}