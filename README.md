# RightSpark - Base Mini App

**Demystify your rights, ignite your actions.**

A Farcaster-native tool that helps users instantly understand their legal rights and provides actionable guidance.

## Features

- **Instant Right Retrieval**: Search for specific legal rights using keywords or categories
- **Simplified Legal Explanations**: Complex legal jargon translated into plain English
- **Actionable Next Steps**: Get specific guidance on what to do after understanding your rights
- **Popular Categories**: Quick access to common rights like tenant, employment, consumer, and civil rights

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Blockchain**: Base (via OnchainKit & MiniKit)
- **AI**: OpenAI/OpenRouter for legal text simplification
- **Styling**: Tailwind CSS with custom design system
- **TypeScript**: Full type safety throughout

## Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment variables**:
   ```bash
   cp .env.example .env.local
   ```
   
   Fill in your API keys:
   - `OPENAI_API_KEY` or `OPENROUTER_API_KEY` for AI functionality
   - `NEXT_PUBLIC_ONCHAINKIT_API_KEY` for OnchainKit integration

3. **Run the development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## Architecture

### Components
- **Frame**: Main container for the Farcaster frame
- **SearchInterface**: Search input and popular categories
- **RightCard**: Displays simplified rights information
- **UI Components**: Reusable Button, TextInput, Card, Spinner components

### API Routes
- `/api/search-rights`: Processes search queries and returns simplified legal information

### Design System
- **Colors**: Custom palette with primary, accent, and semantic colors
- **Typography**: Consistent text sizing and weights
- **Spacing**: Standardized spacing scale
- **Components**: Modular, reusable UI components

## Usage

1. **Search for Rights**: Enter keywords like "tenant rights" or "workplace discrimination"
2. **Browse Categories**: Click on popular categories for quick access
3. **Get Simplified Explanations**: Receive plain English explanations of complex legal concepts
4. **Follow Next Steps**: Get actionable guidance on what to do next

## Deployment

This app is designed to be deployed as a Base Mini App within the Farcaster ecosystem.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see LICENSE file for details
