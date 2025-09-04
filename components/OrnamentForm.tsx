"use client";

// react hooks for state management and side effects
import { useState, useEffect } from "react";

// predefined list of staff members for the staff ornament mode
const staffMembers = [
  "John Smith", "Sarah Johnson", "Michael Brown", "Emily Davis", 
  "David Wilson", "Lisa Anderson", "Chris Taylor", "Jennifer Martinez",
  "Robert Garcia", "Ashley Rodriguez"
];

// available ornament shape/style options for customization
const ornamentOptions = [
  "Classic Ball", "Snowflake", "Star", "Bell", "Angel", "Tree",
  "Candy Cane", "Present Box", "Reindeer", "Santa Hat",
  "Holly Leaf", "Wreath", "Gingerbread", "Icicle"
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

export default function OrnamentForm({ client }: { client: string }) {
  // user information for tracking
  const [userName, setUserName] = useState<string>("");
  const [userEmail, setUserEmail] = useState<string>("");
  
  // component mode selection (staff member or personalized upload)
  const [mode, setMode] = useState<'staff' | 'upload'>('staff');
  
  // state for staff-based ornament options
  const [staff, setStaff] = useState(staffMembers[0]);
  const [option, setOption] = useState(ornamentOptions[0]);
  
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

  // automatically generate ai prompt when user selections change
  useEffect(() => {
    let prompt = "";
    
    if (mode === 'staff') {
      prompt = `A beautiful Christmas ornament in ${option} style, professionally designed for ${client}. The ornament should feature ${staff} with elegant holiday themes, festive colors, and high-quality artistic details. Create a flat, 2D design with clean edges that can be easily cut out. Make it suitable for printing, cutting, and professional presentation. Do not include any text, letters, or words in the image.`;
    } else {
      prompt = `A beautiful Christmas ornament in ${option} style featuring: ${personDescription}. The person is wearing ${accessory} and is ${pose}. The scene is set in ${background} with ${magicalEffect} around them. The ornament should have elegant holiday themes, festive colors, vibrant details, and professional quality suitable for printing and cutting. Create a flat, 2D design with clean edges that can be easily cut out. Make it magical and joyful with Christmas spirit. Do not include any text, letters, or words in the image.`;
    }
    
    setGeneratedPrompt(prompt);
  }, [mode, staff, option, personDescription, accessory, pose, background, magicalEffect, client]);

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
  const handleGenerateOrnament = async () => {
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
      // prepare api payload based on current mode
      const payload = mode === 'staff' 
        ? { 
            staff, 
            option, 
            client, 
            mode,
            userName: userName.trim(),
            userEmail: userEmail.trim()
          }
        : { 
            personDescription, 
            imagePath: uploadedImagePath,
            option, 
            accessory, 
            pose, 
            background, 
            magicalEffect, 
            client, 
            mode,
            userName: userName.trim(),
            userEmail: userEmail.trim()
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
      } else {
        setError(data.error || "Failed to generate ornament");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div>
      <div className="client-greeting">
        Welcome {client}! Create your custom holiday ornament
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
        </div>
      </div>

      {/* Mode Selection */}
      <div className="form-container">
        <div className="form-group">
          <label>Choose Your Ornament Style:</label>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <button 
              type="button"
              onClick={() => setMode('staff')}
              className={mode === 'staff' ? 'generate-btn' : 'download-btn'}
              style={{ textDecoration: 'none' }}
            >
              Staff Member Ornament
            </button>
            <button 
              type="button"
              onClick={() => setMode('upload')}
              className={mode === 'upload' ? 'generate-btn' : 'download-btn'}
              style={{ textDecoration: 'none' }}
            >
              Personalized Ornament
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
              <label htmlFor="ornament">Select Ornament Style:</label>
              <select id="ornament" value={option} onChange={e => setOption(e.target.value)}>
                {ornamentOptions.map(o => (
                  <option key={o} value={o}>{o}</option>
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
                  ✓ Photo uploaded successfully! Ready to generate your personalized ornament.
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
                Customize Your Ornament (Madlib Style!)
              </h3>
              
              <div className="form-group">
                <label htmlFor="ornament">Ornament Shape:</label>
                <select id="ornament" value={option} onChange={e => setOption(e.target.value)}>
                  {ornamentOptions.map(o => (
                    <option key={o} value={o}>{o}</option>
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
          onClick={handleGenerateOrnament}
          className="generate-btn"
          disabled={isGenerating || (mode === 'upload' && !personDescription)}
        >
          {isGenerating && <span className="loading-spinner"></span>}
          {isGenerating ? "Creating Your Ornament..." : "Generate Ornament"}
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
          <h2>Your Custom Ornament</h2>
          <img 
            src={generatedImage} 
            alt="Generated holiday ornament" 
            style={{ maxWidth: '100%', height: 'auto', borderRadius: '12px' }}
          />
          <p style={{marginTop: '1rem', color: '#666'}}>
            Perfect for printing and display! Right-click to save.
          </p>
          <div style={{ marginTop: '1rem' }}>
            <a 
              href={generatedImage} 
              download={`ornament-${client}-${Date.now()}.png`}
              className="download-btn"
              style={{ textDecoration: 'none', display: 'inline-block' }}
            >
              Download Ornament
            </a>
          </div>
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
            <p><strong>Generation Method:</strong> {uploadedImagePath ? 'Image-to-Image (Photo → Ornament)' : 'Text-to-Image'}</p>
          </div>
        </div>
      )}
    </div>
  );
}
