# Holiday Ornament Generator

A Next.js application that creates personalized AI-generated Christmas ornaments for client organizations using Google Gemini 2.5 Flash Image ("Nano Banana"). Features client-specific URLs, cartoon-style ornament generation, and admin management tools.

## Features

- **Client-Specific URLs**: Each organization gets their own personalized link
- **Dual Ornament Modes**: Staff member ornaments or personalized photo-based ornaments
- **Cartoon Style Ornaments**: Disney-like animated character ornaments with exaggerated features
- **Madlib-Style Customization**: Fun, interactive prompt building
- **Real-Time Prompt Preview**: See exactly what prompts will be generated
- **Admin Dashboard**: Track client engagement and customize prompts
- **Prompt Tailoring**: Customize prompts for specific clients
- **Image-to-Image Generation**: Transform uploaded photos into cartoon ornaments

## Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file with your API keys:
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Visit the application:
   - **Home**: `http://localhost:3000/`
   - **Client URLs**: `http://localhost:3000/{client-name}`
   - **Admin Dashboard**: `http://localhost:3000/admin`
   - **Library**: `http://localhost:3000/library`

## Dummy Client URLs

Use these URLs to test the client-specific functionality:

### Corporate Clients
- **4AS (Advertising Agency)**: `http://localhost:3000/4as`
- **ACME Corporation**: `http://localhost:3000/acme`
- **Microsoft**: `http://localhost:3000/microsoft`
- **Google**: `http://localhost:3000/google`
- **Apple**: `http://localhost:3000/apple`

### Non-Profit Organizations
- **Red Cross**: `http://localhost:3000/redcross`
- **United Way**: `http://localhost:3000/unitedway`
- **Habitat for Humanity**: `http://localhost:3000/habitat`
- **Salvation Army**: `http://localhost:3000/salvation`

### Educational Institutions
- **Harvard University**: `http://localhost:3000/harvard`
- **Stanford University**: `http://localhost:3000/stanford`
- **MIT**: `http://localhost:3000/mit`
- **UCLA**: `http://localhost:3000/ucla`

### Healthcare Organizations
- **Mayo Clinic**: `http://localhost:3000/mayo`
- **Johns Hopkins**: `http://localhost:3000/hopkins`
- **Kaiser Permanente**: `http://localhost:3000/kaiser`

### Tech Startups
- **Zendesk**: `http://localhost:3000/zendesk`
- **Slack**: `http://localhost:3000/slack`
- **Dropbox**: `http://localhost:3000/dropbox`
- **Airbnb**: `http://localhost:3000/airbnb`

### Local Businesses
- **Downtown Coffee**: `http://localhost:3000/coffee`
- **City Bakery**: `http://localhost:3000/bakery`
- **Main Street Books**: `http://localhost:3000/books`
- **Garden Center**: `http://localhost:3000/garden`

## Admin Features

Access the admin dashboard at `http://localhost:3000/admin` to:

- View client engagement analytics
- Track which clients have created ornaments
- See client activity timeline
- Customize prompts for specific clients
- Manage ornament templates per client
- Export client data

## File Structure

```
├── app/
│   ├── [client]/           # Dynamic client pages
│   ├── admin/              # Admin dashboard
│   ├── api/                # API endpoints
│   │   ├── generate/       # Ornament generation
│   │   ├── analyze-image/  # Image analysis
│   │   ├── library/        # Image library
│   │   └── admin/          # Admin APIs
│   └── library/            # Public ornament gallery
├── components/
│   └── OrnamentForm.tsx    # Main ornament form
└── public/
    └── generated/          # Generated ornament images
```

## API Endpoints

- `POST /api/generate` - Generate ornament prompts/images
- `POST /api/analyze-image` - Analyze uploaded photos
- `GET /api/library` - Get generated ornament library
- `GET /api/admin/clients` - Get client analytics
- `POST /api/admin/prompts` - Update client-specific prompts

## Testing

Currently no automated tests are configured:
```bash
npm test
```

## AI Technology Stack

This application uses a multi-AI approach:

- **Google Gemini 2.5 Flash Image ("Nano Banana")**: Primary image generation engine
- **OpenAI GPT-4**: Prompt enhancement and optimization
- **Cartoon Style Focus**: Generates Disney-like animated character ornaments
- **Image-to-Image Processing**: Transforms uploaded photos into cartoon ornaments

## Environment Variables

```bash
# Required API Keys
OPENAI_API_KEY=your_openai_api_key_here     # For prompt enhancement
GEMINI_API_KEY=your_gemini_api_key_here     # For image generation

# Optional Configuration
NODE_ENV=development
```

## Getting API Keys

1. **OpenAI API Key**: Get from [OpenAI Platform](https://platform.openai.com/api-keys)
2. **Gemini API Key**: Get from [Google AI Studio](https://aistudio.google.com/app/apikey)
