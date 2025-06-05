# Build-a-Boiler — Discovery Engine (Phase 1)

🚀 AI-powered boilerplate discovery engine. Find the perfect starter template for your next project from curated GitHub repos and across the web.

## Overview

Build-a-Boiler Discovery Engine helps developers find the ideal boilerplate for their projects by:
- Selecting their desired tech stack (Frontend, Backend, ORM, Auth, Payments)
- Describing what they're building
- Getting AI-curated results with confidence scores and summaries

## Features

✅ **Tech Stack Selection** - Dropdowns for Frontend, Backend, ORM, Auth, and Payment providers
✅ **AI Analysis** - Claude AI analyzes each boilerplate for relevance and quality
✅ **Multiple Sources** - Searches both GitHub (via Sim Studio) and the web (via Firecrawl)
✅ **Confidence Scoring** - Each result includes an AI-generated confidence score (1-100)
✅ **Smart Summaries** - Get concise descriptions of what each boilerplate includes

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env.local
   ```

4. Add your API keys to `.env.local`:
   ```
   FIRECRAWL_API_KEY=your_firecrawl_key
   SIM_STUDIO_API_KEY=your_sim_studio_key
   ANTHROPIC_API_KEY=your_claude_api_key
   ```

5. Run the development server:
   ```bash
   npm run dev
   ```

6. Visit http://localhost:3000/discover

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **UI**: TailwindCSS + DaisyUI
- **AI**: Claude API (Anthropic)
- **Search APIs**: Firecrawl & Sim Studio
- **Database**: Supabase (for user history - optional)

## API Endpoints

- `POST /api/discover` - Searches for boilerplates across multiple sources
- `POST /api/analyze` - Analyzes boilerplates with Claude AI

## Phase 1 Limitations

This is Phase 1 of Build-a-Boiler. Current limitations:
- No ZIP generation or project packaging
- No boilerplate preview or file analysis
- Results limited to 10 curated options

## Contributing

This project is actively being developed. Contributions and feedback are welcome!

## License

Built on top of ShipFast boilerplate.