"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import CardWithOverlay from "../../../components/CardWithOverlay";

export default function SharePage({ params }: { params: Promise<{ id: string }> }) {
  const [cardData, setCardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [id, setId] = useState<string>('');

  useEffect(() => {
    // get the id from params
    params.then(({ id: paramId }) => {
      setId(paramId);
      
      // fetch the greeting card metadata
      fetch(`/api/share/${paramId}`)
        .then(response => {
          if (response.ok) {
            return response.json();
          }
          throw new Error('Card not found');
        })
        .then(data => {
          setCardData(data);
          setLoading(false);
        })
        .catch(error => {
          console.error("Failed to fetch card data:", error);
          setLoading(false);
        });
    });
  }, [params]);

  if (loading) {
    return (
      <main style={{ textAlign: 'center', padding: '2rem' }}>
        <h1>Loading...</h1>
      </main>
    );
  }

  if (!cardData) {
    return (
      <main style={{ textAlign: 'center', padding: '2rem' }}>
        <h1>Greeting Card Not Found</h1>
        <p>This greeting card may have been removed or the link is invalid.</p>
        <Link href="/" className="generate-btn" style={{ textDecoration: 'none', display: 'inline-block' }}>
          Create Your Own
        </Link>
      </main>
    );
  }

  return (
    <main style={{ textAlign: 'center', padding: '2rem' }}>
      <h1>Holiday Greeting Card</h1>
      <div className="client-greeting">
        Someone shared this beautiful holiday greeting card with you!
      </div>
      
      <div className="preview-container" style={{ marginTop: '2rem' }}>
        <CardWithOverlay
          imageUrl={cardData.imageUrl}
          alt="Shared holiday greeting card"
          overlayData={cardData.overlayData}
        />
        
        <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <a 
            href={cardData.imageUrl} 
            download={`holiday-greeting-card-${id}.png`}
            className="download-btn"
            style={{ textDecoration: 'none', display: 'inline-block' }}
          >
            Download Card
          </a>
          
          <Link href="/" className="generate-btn" style={{ textDecoration: 'none', display: 'inline-block' }}>
            Create Your Own
          </Link>
          
          <button 
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: 'Holiday Greeting Card',
                  text: 'Check out this beautiful holiday greeting card!',
                  url: window.location.href
                });
              } else {
                navigator.clipboard.writeText(window.location.href);
                alert('Link copied to clipboard!');
              }
            }}
            className="generate-btn"
            style={{ background: '#97bc62', border: 'none', cursor: 'pointer' }}
          >
            Share Card
          </button>
        </div>
      </div>
      
      <div style={{ marginTop: '2rem', padding: '1.5rem', background: '#f9f9f9', borderRadius: '12px', maxWidth: '600px', margin: '2rem auto 0' }}>
        <h2 style={{ color: '#2c5f2d', marginBottom: '1rem' }}>Create Your Own Greeting Card</h2>
        <p style={{ color: '#666', marginBottom: '1rem' }}>
          Love this card? Create your own personalized holiday greeting card with our AI-powered generator!
        </p>
        <Link href="/" className="generate-btn" style={{ textDecoration: 'none', fontSize: '1.1rem' }}>
          Get Started
        </Link>
      </div>
    </main>
  );
}