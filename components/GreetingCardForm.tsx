"use client";

// react hooks for state management and side effects
import { useState, useEffect } from "react";

// predefined list of staff members for the staff greeting card mode
const staffMembers = [
  "John Smith", "Sarah Johnson", "Michael Brown", "Emily Davis", 
  "David Wilson", "Lisa Anderson", "Chris Taylor", "Jennifer Martinez",
  "Robert Garcia", "Ashley Rodriguez"
];

// available holidays for celebration
const holidays = [
  "Christmas", "Hanukkah", "Kwanzaa", "New Year", "Winter Solstice",
  "Diwali", "Thanksgiving", "Halloween", "Valentine's Day", "Easter",
  "St. Patrick's Day", "Fourth of July", "Mother's Day", "Father's Day"
];

// available greeting card styles/themes
const cardStyles = [
  "Classic Card", "Modern Minimalist", "Vintage Style", "Watercolor", "Hand-drawn", "Photo Frame",
  "Elegant Border", "Festive Pattern", "Nature Theme", "Abstract Art",
  "Typography Focus", "Illustration Style", "Collage Style", "Pop Art"
];

// madlib-style accessory options for personalized ornaments
const accessories = [
  "Santa hat", "Elf ears", "Reindeer antlers", "Christmas bow tie", 
  "Holly crown", "Candy cane", "Christmas scarf", "Jingle bell necklace",
  "Mistletoe headband", "Snowflake tiara", "Christmas lights garland"
];

// different pose options for the person in the ornament
const poses = [
  "waving cheerfully", "holding a present", "pointing upward", "arms crossed confidently",
  "giving thumbs up", "holding hot cocoa", "ice skating", "building a snowman",
  "decorating a tree", "singing carols", "laughing joyfully"
];

// background scene options for ornament settings
const backgrounds = [
  "snowy winter landscape", "cozy fireplace scene", "Christmas tree farm",
  "North Pole workshop", "starry night sky", "gingerbread house village",
  "ice palace", "candy cane forest", "Christmas market", "winter cabin"
];

// magical effect options to add sparkle and wonder
const magicalEffects = [
  "sparkling snowflakes falling", "golden Christmas magic swirling", "colorful Northern Lights",
  "twinkling fairy lights", "glowing Christmas stars", "magical frost patterns",
  "rainbow holiday sparkles", "shimmering snow globes", "dancing Christmas sprites"
];

export default function GreetingCardForm({ client }: { client: string }) {
  // user information for tracking
  const [userName, setUserName] = useState<string>("");
  const [userEmail, setUserEmail] = useState<string>("");
  const [emailOptIn, setEmailOptIn] = useState<boolean>(false);
  
  // holiday selection
  const [selectedHoliday, setSelectedHoliday] = useState(holidays[0]);
  
  // component mode selection (staff member or personalized upload)
  const [mode, setMode] = useState<'staff' | 'upload'>('staff');
  
  // state for staff-based greeting card options
  const [staff, setStaff] = useState(staffMembers[0]);
  const [cardStyle, setCardStyle] = useState(cardStyles[0]);
  
  // state for personalized upload and madlib customization options
  const [personDescription, setPersonDescription] = useState<string>("A person with short brown hair and a friendly smile, wearing a casual business outfit");
  const [uploadedImagePath, setUploadedImagePath] = useState<string>("");
  const [accessory, setAccessory] = useState(accessories[0]);
  const [pose, setPose] = useState(poses[0]);
  const [background, setBackground] = useState(backgrounds[0]);
  const [magicalEffect, setMagicalEffect] = useState(magicalEffects[0]);
  
  // state for ai prompt generation and image output
  const [generatedPrompt, setGeneratedPrompt] = useState<string>("");
  const [enhancedPrompt, setEnhancedPrompt] = useState<string>("");
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // sharing functionality
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);
  
  // personal message fields that will be rendered by Gemini
  const [recipientName, setRecipientName] = useState<string>("");
  const [senderName, setSenderName] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  // build greeting text for prompt and payload
  const buildGreetingText = () => {
    const parts: string[] = [];
    if (recipientName.trim()) parts.push(`Dear ${recipientName.trim()},`);
    if (message.trim()) parts.push(message.trim());
    if (senderName.trim()) parts.push(`- ${senderName.trim()}`);
    return parts.join(' ');
  };

  // automatically generate ai prompt when user selections change
  useEffect(() => {
    let prompt = "";

    if (mode === 'staff') {
      prompt = `A beautiful ${selectedHoliday} greeting card in ${cardStyle} style, professionally designed for ${client}. The card should feature ${staff} with elegant ${selectedHoliday} themes, festive colors, and high-quality artistic details. Create a greeting card layout that is warm, inviting, and suitable for sharing with colleagues and friends.`;
    } else {
      prompt = `A beautiful ${selectedHoliday} greeting card in ${cardStyle} style featuring: ${personDescription}. The person is wearing ${accessory} and is ${pose}. The scene is set in ${background} with ${magicalEffect} around them. The card should have elegant ${selectedHoliday} themes, festive colors, vibrant details, and professional quality suitable for sharing. Make it warm, joyful, and celebratory with ${selectedHoliday} spirit.`;
    }

    const greetingText = buildGreetingText();
    if (greetingText) {
      prompt += ` Include the text "${greetingText}" on the card.`;
    }

    setGeneratedPrompt(prompt);
  }, [mode, staff, cardStyle, personDescription, accessory, pose, background, magicalEffect, client, selectedHoliday, recipientName, senderName, message]);

  // handle user photo upload for personalized ornaments
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setError(null);
    
    try {
      // prepare form data with uploaded image file
      const formData = new FormData();
      formData.append('image', file);

      const res = await fetch('/api/analyze-image', {
        method: 'POST',
        body: formData
      });

      const data = await res.json();
      
      if (res.ok) {
        // store both the description and image path for inspiration
        setPersonDescription(data.description);
        setUploadedImagePath(data.imagePath);
      } else {
        setError(data.error || "Failed to analyze image");
      }
    } catch (err) {
      setError("Failed to analyze image. Please try again.");
    }
  };

  // main function to generate ornament using ai image generation
  const handleGenerateCard = async () => {
    // validate user information
    if (!userName.trim() || !userEmail.trim()) {
      setError("Please enter your name and email address");
      return;
    }

    // validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userEmail)) {
      setError("Please enter a valid email address");
      return;
    }

    setIsGenerating(true);
    setError(null);
    setGeneratedImage(null);

    try {
      // build greeting text for gemini
      const greetingText = buildGreetingText();

      // prepare api payload based on current mode
      const payload = mode === 'staff'
        ? {
            staff,
            cardStyle,
            client,
            mode,
            selectedHoliday,
            userName: userName.trim(),
            userEmail: userEmail.trim(),
            emailOptIn,
            greetingText
          }
        : {
            personDescription,
            imagePath: uploadedImagePath,
            cardStyle,
            accessory,
            pose,
            background,
            magicalEffect,
            client,
            mode,
            selectedHoliday,
            userName: userName.trim(),
            userEmail: userEmail.trim(),
            emailOptIn,
            greetingText
          };

      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      
      const data = await res.json();
      
      if (res.ok) {
        setGeneratedImage(data.url);
        if (data.enhancedPrompt) {
          setEnhancedPrompt(data.enhancedPrompt);
        }
        if (data.shareUrl) {
          setShareUrl(data.shareUrl);
        }
      } else {
        setError(data.error || "Failed to generate greeting card");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  // function to handle sharing the greeting card
  const handleShare = () => {
    if (shareUrl) {
      navigator.clipboard.writeText(shareUrl);
      setShowShareModal(true);
      setTimeout(() => setShowShareModal(false), 3000);
    }
  };

  return (
    <div>
      <div className="client-greeting">
        Welcome {client}! Create your custom holiday greeting card
      </div>
      
      {/* User Information */}
      <div className="form-container">
        <div className="form-group">
          <label>Your Information:</label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <input
                type="text"
                placeholder="Your Full Name"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
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
              <input
                type="email"
                placeholder="Your Email Address"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
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
          </div>
          <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <input
              type="checkbox"
              id="emailOptIn"
              checked={emailOptIn}
              onChange={(e) => setEmailOptIn(e.target.checked)}
              style={{ transform: 'scale(1.2)' }}
            />
            <label htmlFor="emailOptIn" style={{ fontSize: '0.9rem', color: '#666' }}>
              Yes, I would like to receive marketing emails and enter to win a prize!
            </label>
          </div>
        </div>
      </div>

      {/* Holiday Selection */}
      <div className="form-container">
        <div className="form-group">
          <label htmlFor="holiday">Choose Your Holiday:</label>
          <select id="holiday" value={selectedHoliday} onChange={e => setSelectedHoliday(e.target.value)}>
            {holidays.map(h => (
              <option key={h} value={h}>{h}</option>
            ))}
          </select>
        </div>
      </div>

      {/* HTML Overlay Section */}
      <div className="form-container">
        <div className="form-group">
          <label style={{ color: '#2c5f2d', fontSize: '1.2rem', marginBottom: '1rem', display: 'block' }}>
            🎯 Add Personal Message (Optional)
          </label>
          <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '1rem' }}>
            Add names and a custom message that Gemini will render directly on your card
          </p>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label htmlFor="recipientName" style={{ display: 'block', marginBottom: '0.5rem', color: '#2c5f2d' }}>
                To (Recipient Name):
              </label>
              <input
                type="text"
                id="recipientName"
                placeholder="e.g., Sarah"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
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
              <label htmlFor="senderName" style={{ display: 'block', marginBottom: '0.5rem', color: '#2c5f2d' }}>
                From (Your Name):
              </label>
              <input
                type="text"
                id="senderName"
                placeholder="e.g., John"
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '8px',
                  border: '2px solid #e0e0e0',
                  fontSize: '16px'
                }}
              />
            </div>
          </div>
          
          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="message" style={{ display: 'block', marginBottom: '0.5rem', color: '#2c5f2d' }}>
              Custom Message:
            </label>
            <textarea
              id="message"
              placeholder="e.g., Happy Holidays! Wishing you joy and happiness this season."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={2}
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
        </div>
      </div>

      {/* Mode Selection */}
      <div className="form-container">
        <div className="form-group">
          <label>Choose Your Greeting Card Style:</label>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <button 
              type="button"
              onClick={() => setMode('staff')}
              className={mode === 'staff' ? 'generate-btn' : 'download-btn'}
              style={{ textDecoration: 'none' }}
            >
              Staff Member Card
            </button>
            <button 
              type="button"
              onClick={() => setMode('upload')}
              className={mode === 'upload' ? 'generate-btn' : 'download-btn'}
              style={{ textDecoration: 'none' }}
            >
              Personalized Card
            </button>
          </div>
        </div>
      </div>

      <div className="form-container">
        {mode === 'staff' ? (
          /* Staff Mode */
          <>
            <div className="form-group">
              <label htmlFor="staff">Choose a Staff Member:</label>
              <select id="staff" value={staff} onChange={e => setStaff(e.target.value)}>
                {staffMembers.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="cardStyle">Select Card Style:</label>
              <select id="cardStyle" value={cardStyle} onChange={e => setCardStyle(e.target.value)}>
                {cardStyles.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </>
        ) : (
          /* Upload Mode */
          <>
            <div className="form-group">
              <label htmlFor="image-upload">Upload Your Photo:</label>
              <input 
                type="file" 
                id="image-upload"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={handleImageUpload}
                style={{
                  padding: '12px',
                  border: '2px dashed #97bc62',
                  borderRadius: '8px',
                  background: '#f9f9f9'
                }}
              />
              <p style={{ color: '#666', fontSize: '0.8rem', marginTop: '0.5rem' }}>
                Accepted formats: JPG, PNG, WebP (max 10MB). Best results with clear, well-lit photos showing your face and upper body.
              </p>
              {uploadedImagePath && (
                <p style={{ color: '#97bc62', marginTop: '0.5rem', fontSize: '0.9rem' }}>
                  ✓ Photo uploaded successfully! Ready to generate your personalized greeting card.
                </p>
              )}
              {error && personDescription === "person from uploaded photo" && (
                <p style={{ color: '#c00', marginTop: '0.5rem', fontSize: '0.9rem' }}>
                  {error}
                </p>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="description">Person Description (editable for demo):</label>
              <textarea 
                id="description"
                value={personDescription}
                onChange={e => setPersonDescription(e.target.value)}
                rows={3}
                style={{
                  padding: '12px',
                  border: '2px solid #97bc62',
                  borderRadius: '8px',
                  background: 'white',
                  fontSize: '1rem',
                  resize: 'vertical',
                  width: '100%'
                }}
              />
            </div>

            <div className="madlib-container">
              <h3 style={{ color: '#2c5f2d', marginBottom: '1rem', textAlign: 'center' }}>
                Customize Your Greeting Card (Madlib Style!)
              </h3>
              
              <div className="form-group">
                <label htmlFor="cardStyle">Card Style:</label>
                <select id="cardStyle" value={cardStyle} onChange={e => setCardStyle(e.target.value)}>
                  {cardStyles.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="accessory">What accessory should you wear?</label>
                <select id="accessory" value={accessory} onChange={e => setAccessory(e.target.value)}>
                  {accessories.map(a => (
                    <option key={a} value={a}>{a}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="pose">What should you be doing?</label>
                <select id="pose" value={pose} onChange={e => setPose(e.target.value)}>
                  {poses.map(p => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="background">Where should this take place?</label>
                <select id="background" value={background} onChange={e => setBackground(e.target.value)}>
                  {backgrounds.map(b => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="effect">What magical effect should surround you?</label>
                <select id="effect" value={magicalEffect} onChange={e => setMagicalEffect(e.target.value)}>
                  {magicalEffects.map(e => (
                    <option key={e} value={e}>{e}</option>
                  ))}
                </select>
              </div>
            </div>
          </>
        )}
        
        <button 
          type="button"
          onClick={handleGenerateCard}
          className="generate-btn"
          disabled={isGenerating || (mode === 'upload' && !personDescription)}
        >
          {isGenerating && <span className="loading-spinner"></span>}
          {isGenerating ? "Creating Your Greeting Card..." : "Generate Greeting Card"}
        </button>
      </div>
      
      {/* Error Display */}
      {error && (
        <div className="error-message">
          Error: {error}
        </div>
      )}
      
      {/* Generated Image Display */}
      {generatedImage && (
        <div className="preview-container">
          <h2>Your Custom Greeting Card</h2>
          <img
            src={generatedImage}
            alt="Generated holiday greeting card"
            style={{ width: '100%', height: 'auto', borderRadius: '8px' }}
          />
          <p style={{marginTop: '1rem', color: '#666'}}>
            Perfect for sharing with colleagues and friends!
          </p>
          <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <a 
              href={generatedImage} 
              download={`greeting-card-${client}-${Date.now()}.png`}
              className="download-btn"
              style={{ textDecoration: 'none', display: 'inline-block' }}
            >
              Download Card
            </a>
            {shareUrl && (
              <button 
                onClick={handleShare}
                className="generate-btn"
                style={{ textDecoration: 'none' }}
              >
                Share with Peers
              </button>
            )}
          </div>
          {showShareModal && (
            <div style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              background: 'white',
              padding: '2rem',
              borderRadius: '12px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
              zIndex: 1000,
              textAlign: 'center'
            }}>
              <p style={{ marginBottom: '1rem' }}>Share link copied to clipboard!</p>
              <p style={{ color: '#666', fontSize: '0.9rem' }}>{shareUrl}</p>
            </div>
          )}
        </div>
      )}
      
      {/* Prompt Showcase */}
      {generatedPrompt && (
        <div className="prompt-showcase">
          <h2>AI Prompt Generation (Stability AI + GPT-4)</h2>
          
          <div style={{ marginBottom: '1rem' }}>
            <h3>Original Prompt:</h3>
            <div className="prompt-text" style={{ background: '#f5f5f5', padding: '1rem', borderRadius: '8px' }}>
              {generatedPrompt}
            </div>
          </div>

          {enhancedPrompt && enhancedPrompt !== generatedPrompt && (
            <div style={{ marginBottom: '1rem' }}>
              <h3>Enhanced Prompt (sent to Stability AI):</h3>
              <div className="prompt-text" style={{ background: '#e8f5e8', padding: '1rem', borderRadius: '8px' }}>
                {enhancedPrompt}
              </div>
            </div>
          )}
          
          <div className="prompt-info">
            <p><strong>Original Length:</strong> {generatedPrompt.length} characters</p>
            {enhancedPrompt && <p><strong>Enhanced Length:</strong> {enhancedPrompt.length} characters</p>}
            <p><strong>Mode:</strong> {mode === 'staff' ? 'Staff Member' : 'Personalized'}</p>
            <p><strong>Client:</strong> {client}</p>
            <p><strong>Enhancement:</strong> {enhancedPrompt ? 'GPT-4 Enhanced for Stable Diffusion' : 'Direct to Stability AI'}</p>
            <p><strong>Generation Method:</strong> {uploadedImagePath ? 'Image-to-Image (Photo → Greeting Card)' : 'Text-to-Image'}</p>
            <p><strong>Selected Holiday:</strong> {selectedHoliday}</p>
            <p><strong>Email Opt-in:</strong> {emailOptIn ? 'Yes' : 'No'}</p>
          </div>
        </div>
      )}
    </div>
  );
}
