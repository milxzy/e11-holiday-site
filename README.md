# Holiday Ornament Generator

A Next.js application that creates personalized AI-generated Christmas ornaments for client organizations. Features client-specific URLs, prompt customization, and admin management tools.

## Features

- **Client-Specific URLs**: Each organization gets their own personalized link
- **Dual Ornament Modes**: Staff member ornaments or personalized photo-based ornaments
- **Madlib-Style Customization**: Fun, interactive prompt building
- **Real-Time Prompt Preview**: See exactly what prompts will be generated
- **Admin Dashboard**: Track client engagement and customize prompts
- **Prompt Tailoring**: Customize prompts for specific clients

## Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file with your OpenAI API key:
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Visit the application:
   - **Home**: `http://localhost:3001/`
   - **Client URLs**: `http://localhost:3001/{client-name}`
   - **Admin Dashboard**: `http://localhost:3001/admin`
   - **Library**: `http://localhost:3001/library`

## Dummy Client URLs

Use these URLs to test the client-specific functionality:

### Corporate Clients
- **4AS (Advertising Agency)**: `http://localhost:3001/4as`
- **ACME Corporation**: `http://localhost:3001/acme`
- **Microsoft**: `http://localhost:3001/microsoft`
- **Google**: `http://localhost:3001/google`
- **Apple**: `http://localhost:3001/apple`

### Non-Profit Organizations
- **Red Cross**: `http://localhost:3001/redcross`
- **United Way**: `http://localhost:3001/unitedway`
- **Habitat for Humanity**: `http://localhost:3001/habitat`
- **Salvation Army**: `http://localhost:3001/salvation`

### Educational Institutions
- **Harvard University**: `http://localhost:3001/harvard`
- **Stanford University**: `http://localhost:3001/stanford`
- **MIT**: `http://localhost:3001/mit`
- **UCLA**: `http://localhost:3001/ucla`

### Healthcare Organizations
- **Mayo Clinic**: `http://localhost:3001/mayo`
- **Johns Hopkins**: `http://localhost:3001/hopkins`
- **Kaiser Permanente**: `http://localhost:3001/kaiser`

### Tech Startups
- **Zendesk**: `http://localhost:3001/zendesk`
- **Slack**: `http://localhost:3001/slack`
- **Dropbox**: `http://localhost:3001/dropbox`
- **Airbnb**: `http://localhost:3001/airbnb`

### Local Businesses
- **Downtown Coffee**: `http://localhost:3001/coffee`
- **City Bakery**: `http://localhost:3001/bakery`
- **Main Street Books**: `http://localhost:3001/books`
- **Garden Center**: `http://localhost:3001/garden`

## Admin Features

Access the admin dashboard at `http://localhost:3001/admin` to:

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

## Demo Mode

The application runs in demo mode by default, showcasing prompt generation without requiring actual AI API calls. Perfect for demonstrations and development.
