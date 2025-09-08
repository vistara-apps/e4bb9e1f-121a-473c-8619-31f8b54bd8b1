# RightSpark - Legal Rights Mini App

**Demystify your rights, ignite your actions.**

RightSpark is a production-ready Farcaster-native Base Mini App that helps users instantly understand their legal rights and provides actionable guidance. Built with a comprehensive tech stack including authentication, payments, and AI-powered legal analysis.

## 🚀 Features

### Core Functionality
- **Instant Right Retrieval**: Search for specific legal rights using keywords or categories
- **Simplified Legal Explanations**: Complex legal jargon translated into plain English using AI
- **Actionable Next Steps**: Get specific guidance and resources for your situation
- **Farcaster Authentication**: Seamless login with Farcaster accounts via Privy
- **Credit-Based System**: Micro-transaction model with Stripe integration
- **Search History**: Track and review previous searches
- **User Profiles**: Manage credits, wallet connections, and account settings

### Technical Features
- Production-ready error handling and loading states
- Real-time credit updates and payment processing
- Responsive design optimized for mobile and desktop
- Comprehensive API with proper validation and security
- Database integration with Supabase
- Webhook handling for payment confirmations

## 🛠 Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Authentication**: Privy (Farcaster login + wallet connection)
- **Database**: Supabase (PostgreSQL)
- **Payments**: Stripe (micro-transactions)
- **AI**: OpenAI GPT-4 for legal analysis
- **Blockchain**: Base (via OnchainKit & MiniKit)
- **UI Components**: Custom components with shadcn/ui patterns
- **State Management**: React hooks and context

## 📦 Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd rightspark
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   ```bash
   cp .env.example .env.local
   ```
   
   Configure your environment variables in `.env.local`:
   ```env
   # Database
   SUPABASE_URL=your_supabase_project_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

   # Authentication
   NEXT_PUBLIC_PRIVY_APP_ID=your_privy_app_id

   # Payments
   STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
   STRIPE_WEBHOOK_SECRET=whsec_your_stripe_webhook_secret

   # AI
   OPENAI_API_KEY=sk-your_openai_api_key

   # OnchainKit
   NEXT_PUBLIC_ONCHAINKIT_API_KEY=your_onchainkit_api_key
   ```

4. **Set up the database**:
   - Create a new Supabase project
   - Run the database migrations (see Database Setup section below)

5. **Run the development server**:
   ```bash
   npm run dev
   ```

6. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🗄 Database Setup

Create the following tables in your Supabase database:

```sql
-- Users table
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  farcaster_id TEXT UNIQUE NOT NULL,
  user_address TEXT,
  paid_credits INTEGER DEFAULT 3,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Rights table (for storing legal rights data)
CREATE TABLE rights (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  complex_description TEXT NOT NULL,
  simplified_description TEXT NOT NULL,
  category TEXT NOT NULL,
  keywords TEXT[] DEFAULT '{}',
  next_steps TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Lookup history table
CREATE TABLE lookup_history (
  id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
  right_id TEXT REFERENCES rights(id) ON DELETE SET NULL,
  query TEXT NOT NULL,
  result JSONB NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Payments table
CREATE TABLE payments (
  id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
  stripe_payment_intent_id TEXT UNIQUE NOT NULL,
  amount INTEGER NOT NULL,
  currency TEXT DEFAULT 'usd',
  credits_purchased INTEGER NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for better performance
CREATE INDEX idx_users_farcaster_id ON users(farcaster_id);
CREATE INDEX idx_lookup_history_user_id ON lookup_history(user_id);
CREATE INDEX idx_lookup_history_timestamp ON lookup_history(timestamp DESC);
CREATE INDEX idx_payments_user_id ON payments(user_id);
CREATE INDEX idx_payments_stripe_id ON payments(stripe_payment_intent_id);
```

## 🏗 Architecture

### Data Model
- **User**: Farcaster ID, wallet address, credits, timestamps
- **Right**: Legal rights with simplified descriptions and next steps
- **LookupHistory**: User search history with results
- **Payment**: Stripe payment records and credit purchases

### API Endpoints
- `POST /api/auth/user` - User authentication and creation
- `POST /api/search-rights` - Search for legal rights (requires credits)
- `POST /api/payments/create-intent` - Create Stripe payment intent
- `POST /api/webhooks/stripe` - Handle Stripe webhooks

### Services
- **UserService**: User management and credit operations
- **LookupService**: Search history and analytics
- **PaymentService**: Stripe payment processing

### Components
- **Frame**: Main container for the Farcaster frame
- **SearchInterface**: Search input with authentication status
- **RightCard**: Displays simplified rights information
- **UserProfile**: User account management
- **CreditPurchase**: Stripe payment integration
- **UI Components**: Enhanced Button, TextInput, Card, Spinner components

## 🎨 Design System

The app uses a custom design system with:
- **Colors**: Primary blue theme with accent colors
- **Typography**: Responsive text scales (Display, Heading, Body)
- **Components**: Reusable UI components with variants
- **Layout**: Responsive grid system
- **Motion**: Smooth transitions and loading states

## 📝 API Documentation

### Search Rights
```typescript
POST /api/search-rights
{
  "query": "tenant rights",
  "userId": "user_id"
}

Response:
{
  "success": true,
  "data": {
    "title": "Tenant Rights",
    "simplifiedDescription": "...",
    "nextSteps": ["..."],
    "category": "Housing"
  },
  "remainingCredits": 2
}
```

### Create Payment Intent
```typescript
POST /api/payments/create-intent
{
  "userId": "user_id",
  "packageId": "STANDARD"
}

Response:
{
  "success": true,
  "data": {
    "clientSecret": "pi_...",
    "paymentIntentId": "pi_..."
  }
}
```

## 🚀 Deployment

### Vercel Deployment
1. Connect your GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Environment Variables for Production
Make sure to set all required environment variables in your production environment.

## 🧪 Testing

Run the test suite:
```bash
npm test
```

Run tests in watch mode:
```bash
npm run test:watch
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🔗 Links

- [Live Demo](https://rightspark.vercel.app)
- [Documentation](https://docs.rightspark.com)
- [Support](mailto:support@rightspark.com)

## 🆘 Support

If you need help or have questions:
1. Check the documentation
2. Search existing issues
3. Create a new issue with detailed information
4. Contact support at support@rightspark.com
