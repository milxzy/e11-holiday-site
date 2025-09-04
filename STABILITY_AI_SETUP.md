# Stability AI Setup

Your app now uses Stability AI instead of DALL-E for much better ornament generation!

## Getting Your API Key

1. **Sign up at Stability AI**
   - Visit https://platform.stability.ai/
   - Create an account

2. **Get Your API Key**
   - Go to your account settings
   - Generate an API key

3. **Add to Environment Variables**
   - Open your `.env` file
   - Replace `your_stability_api_key_here` with your actual API key:
   ```
   STABILITY_API_KEY="sk-your_actual_stability_key_here"
   ```

4. **Restart Your Development Server**
   - Stop your `npm run dev` process
   - Start it again to load the new environment variable

## Pricing (Much Cheaper than DALL-E!)

- **$0.002 per image** (vs DALL-E's $0.04) - **20x cheaper!**
- **High resolution** 1024x1024 images included
- **Better quality** for 2D ornament designs

## New Features

### **Image-to-Image Generation**
- When users upload photos, uses **image-to-image** transformation
- Maintains facial features while applying ornament styling
- Much better likeness than DALL-E's vision approach

### **Text-to-Image Generation**
- For staff ornaments without photos
- Enhanced prompts optimized for Stable Diffusion
- Better artistic control and style consistency

### **GPT-4 Prompt Enhancement**
- Still uses GPT-4 to enhance prompts
- Now optimized for Stable Diffusion terminology
- Focuses on vector art, illustration style, clean edges

## How It Works

1. **User uploads photo** → Saved locally
2. **GPT-4 enhances prompt** → Adds artistic terminology
3. **Stability AI image-to-image** → Transforms photo to ornament
4. **Result**: High-quality ornament that looks like the person

## Benefits Over DALL-E

- ✅ **20x cheaper** ($0.002 vs $0.04)
- ✅ **Better image-to-image** capabilities
- ✅ **More artistic control** and style options
- ✅ **Better 2D/flat design** results
- ✅ **Faster generation** times
- ✅ **Higher consistency** across generations