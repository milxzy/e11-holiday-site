"use client";

import React from 'react';

interface OverlayData {
  overlayText: string;
  recipientName: string;
  senderName: string;
  overlayPosition: 'top' | 'center' | 'bottom';
  overlayStyle: {
    fontSize: string;
    fontFamily: string;
    color: string;
    backgroundColor: string;
    textAlign: 'left' | 'center' | 'right';
  };
}

interface CardWithOverlayProps {
  imageUrl: string;
  alt: string;
  overlayData?: OverlayData | null;
  style?: React.CSSProperties;
  className?: string;
}

export default function CardWithOverlay({ 
  imageUrl, 
  alt, 
  overlayData, 
  style, 
  className 
}: CardWithOverlayProps) {
  // Build the overlay text combining recipient name, custom message, and sender name
  const buildOverlayText = () => {
    if (!overlayData) return '';
    
    const parts: string[] = [];
    
    if (overlayData.recipientName.trim()) {
      parts.push(`Dear ${overlayData.recipientName.trim()},`);
    }
    
    if (overlayData.overlayText.trim()) {
      parts.push(overlayData.overlayText.trim());
    }
    
    if (overlayData.senderName.trim()) {
      parts.push(`- ${overlayData.senderName.trim()}`);
    }
    
    return parts.join('\n');
  };

  const overlayText = buildOverlayText();
  const hasOverlay = overlayData && overlayText.length > 0;

  // Get plaque position based on user selection
  const getPlaquePosition = (position: 'top' | 'center' | 'bottom') => {
    switch (position) {
      case 'top':
        return { top: '-20px' };
      case 'center':
        return { 
          top: '50%', 
          transform: 'translateY(-50%)' 
        };
      case 'bottom':
      default:
        return { bottom: '-20px' };
    }
  };

  return (
    <div 
      style={{ 
        display: 'inline-block',
        position: 'relative',
        ...style 
      }}
      className={className}
    >
      {/* Picture Frame Container */}
      <div
        style={{
          padding: hasOverlay ? '40px' : '20px',
          background: 'linear-gradient(145deg, #f0f0f0, #d9d9d9)',
          borderRadius: '16px',
          boxShadow: `
            inset 8px 8px 16px rgba(0, 0, 0, 0.1),
            inset -8px -8px 16px rgba(255, 255, 255, 0.8),
            8px 8px 24px rgba(0, 0, 0, 0.15)
          `,
          border: '2px solid #bbb',
          position: 'relative'
        }}
      >
        {/* Inner Frame */}
        <div
          style={{
            padding: '12px',
            background: 'linear-gradient(145deg, #e8e8e8, #ffffff)',
            borderRadius: '12px',
            boxShadow: 'inset 2px 2px 8px rgba(0, 0, 0, 0.1)',
            border: '1px solid #ccc'
          }}
        >
          {/* Card Image */}
          <img 
            src={imageUrl} 
            alt={alt}
            style={{ 
              width: '100%',
              height: 'auto', 
              borderRadius: '8px',
              display: 'block',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)'
            }}
          />
        </div>
        
        {/* Plaque on Frame Border */}
        {hasOverlay && (
          <div
            style={{
              position: 'absolute',
              right: '20px',
              maxWidth: '300px',
              minWidth: '200px',
              ...getPlaquePosition(overlayData.overlayPosition),
              background: 'linear-gradient(145deg, #d4af37, #b8941f)',
              color: '#2c2c2c',
              padding: '16px 20px',
              borderRadius: '12px',
              boxShadow: `
                4px 4px 12px rgba(0, 0, 0, 0.3),
                inset 2px 2px 6px rgba(255, 255, 255, 0.3),
                inset -2px -2px 6px rgba(0, 0, 0, 0.2)
              `,
              border: '2px solid #c9a96e',
              whiteSpace: 'pre-line',
              fontSize: overlayData.overlayStyle.fontSize,
              fontFamily: overlayData.overlayStyle.fontFamily === 'serif' ? 
                'Georgia, "Times New Roman", serif' : 
                'Arial, "Helvetica Neue", Helvetica, sans-serif',
              textAlign: overlayData.overlayStyle.textAlign,
              zIndex: 10,
              transform: overlayData.overlayPosition === 'center' ? 'translateY(-50%)' : 'none'
            }}
          >
            {/* Plaque inner content */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                padding: '8px 12px',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}
            >
              {overlayText}
            </div>
            
            {/* Decorative corner elements */}
            <div
              style={{
                position: 'absolute',
                top: '4px',
                left: '4px',
                width: '8px',
                height: '8px',
                background: 'radial-gradient(circle, #fff, #ddd)',
                borderRadius: '50%',
                boxShadow: 'inset 1px 1px 2px rgba(0, 0, 0, 0.3)'
              }}
            />
            <div
              style={{
                position: 'absolute',
                top: '4px',
                right: '4px',
                width: '8px',
                height: '8px',
                background: 'radial-gradient(circle, #fff, #ddd)',
                borderRadius: '50%',
                boxShadow: 'inset 1px 1px 2px rgba(0, 0, 0, 0.3)'
              }}
            />
            <div
              style={{
                position: 'absolute',
                bottom: '4px',
                left: '4px',
                width: '8px',
                height: '8px',
                background: 'radial-gradient(circle, #fff, #ddd)',
                borderRadius: '50%',
                boxShadow: 'inset 1px 1px 2px rgba(0, 0, 0, 0.3)'
              }}
            />
            <div
              style={{
                position: 'absolute',
                bottom: '4px',
                right: '4px',
                width: '8px',
                height: '8px',
                background: 'radial-gradient(circle, #fff, #ddd)',
                borderRadius: '50%',
                boxShadow: 'inset 1px 1px 2px rgba(0, 0, 0, 0.3)'
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}