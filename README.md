# ClosetMind - Smart Outfit Planning System

A women-centric smart outfit planning application built with React, AWS Lambda, and DynamoDB.

## Features

- 👤 User authentication with AWS Cognito
- 👗 Wardrobe management with detailed item attributes
- 📅 Calendar-based outfit logging
- 📆 Event planning and management
- 🤖 Smart outfit suggestions based on weather and events
- 📱 SMS reminders for upcoming events
- 📊 Outfit usage analytics

## Tech Stack

### Frontend
- React 18 with TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- React Query for state management
- React Router for navigation

### Backend
- AWS Lambda (Node.js/TypeScript)
- Amazon API Gateway
- Amazon DynamoDB
- Amazon Cognito
- Amazon SNS (SMS notifications)
- Amazon EventBridge (scheduled reminders)
- Amazon S3 (optional image storage)

### Infrastructure
- AWS SAM for infrastructure as code
- AWS Amplify Hosting for frontend

## 📁 Project Structure

```
closetmind/
├── frontend/                 # React TypeScript application
│   ├── src/
│   │   ├── features/        # Feature-based modules
│   │   ├── shared/          # Shared components
│   │   └── lib/             # API client
│   ├── .env.example         # Environment template (safe to commit)
│   └── .env                 # Your config (DO NOT COMMIT)
├── backend/                 # AWS Lambda functions
│   ├── src/
│   │   ├── handlers/        # Lambda function handlers
│   │   ├── shared/          # Shared utilities
│   │   └── types/           # TypeScript types
│   └── .env.example         # Reference only
├── infrastructure/          # AWS SAM templates
│   └── template.yaml        # Infrastructure as code
├── aidlc-docs/             # AI-DLC workflow documentation
├── DEPLOYMENT_GUIDE.md     # Step-by-step deployment
└── BUILD_STATUS.md         # Implementation status
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- AWS Account (free tier eligible)
- AWS CLI configured (`aws configure`)
- AWS SAM CLI installed ([Installation Guide](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/install-sam-cli.html))
- OpenWeatherMap API key (free at [openweathermap.org](https://openweathermap.org/api))

### Installation & Deployment

```bash
# 1. Clone and install dependencies
git clone <your-repo-url>
cd closetmind

cd backend && npm install && cd ..
cd frontend && npm install && cd ..

# 2. Deploy backend to AWS
cd backend && npm run build && cd ../infrastructure
sam build
sam deploy --guided
# ⚠️ SAVE THE OUTPUTS (ApiEndpoint, UserPoolId, UserPoolClientId)

# 3. Configure frontend environment
cd ../frontend
cp .env.example .env
# Edit .env with values from SAM deployment outputs

# 4. Run locally
npm run dev
```

Open `http://localhost:5173` and start using ClosetMind!

📖 **Complete deployment guide with API setup**: [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)

---

## 🔐 Environment Variables

**Important**: Never commit `.env` files! They're already in `.gitignore`.

All sensitive configuration uses environment variables:
- Frontend: `frontend/.env` (copy from `.env.example`)
- Backend: Configured automatically by AWS SAM
- See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for where to get each value

---

## 📁 Project Structure

```
closetmind/
├── frontend/                 # React TypeScript application
│   ├── src/
│   │   ├── features/        # Feature-based modules
│   │   ├── shared/          # Shared components
│   │   └── lib/             # API client
│   ├── .env.example         # Environment template (safe to commit)
│   └── .env                 # Your config (DO NOT COMMIT)
├── backend/                 # AWS Lambda functions
│   ├── src/
│   │   ├── handlers/        # Lambda function handlers
│   │   ├── shared/          # Shared utilities
│   │   └── types/           # TypeScript types
│   └── .env.example         # Reference only
├── infrastructure/          # AWS SAM templates
│   └── template.yaml        # Infrastructure as code
├── aidlc-docs/             # AI-DLC workflow documentation
├── DEPLOYMENT_GUIDE.md     # Step-by-step deployment
└── BUILD_STATUS.md         # Implementation status
```

---

## 🧪 Development

```bash
# Frontend development
cd frontend
npm run dev          # Start dev server
npm run build        # Production build
npm run preview      # Preview production build

# Backend development
cd backend
npm run build        # Compile TypeScript
npm run watch        # Watch mode

# Infrastructure
cd infrastructure
sam build            # Build SAM application
sam deploy           # Deploy to AWS
sam local start-api  # Test locally
```

---

## 🚀 Production Deployment

### Backend (AWS)
Already deployed via `sam deploy` - updates automatically on redeploy.

### Frontend Options

**Option 1: Vercel (Recommended)**
```bash
npm install -g vercel
cd frontend
vercel
# Add environment variables in Vercel dashboard
```

**Option 2: AWS Amplify**
- Connect GitHub repository
- Configure build settings
- Add environment variables
- Auto-deploys on push

**Option 3: S3 + CloudFront**
```bash
cd frontend
npm run build
aws s3 sync dist/ s3://your-bucket --delete
```

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for detailed instructions.

---

## 💰 Cost Estimate

**AWS Free Tier** (first 12 months):
- Lambda: 1M requests/month free
- DynamoDB: 25GB storage free
- API Gateway: 1M requests/month free
- Cognito: 50,000 MAU free (forever)

**After free tier**: ~$5-10/month for light usage

---

## 🆘 Troubleshooting

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for common issues and solutions.

## License

MIT

## Author

Built with AI-DLC workflow
