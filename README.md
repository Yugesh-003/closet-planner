# ClosetMind - Smart Outfit Planning System

A women-centric wardrobe management and outfit planning application built with React, TypeScript, and AWS serverless architecture.

## What It Does

ClosetMind helps you organize your wardrobe digitally and plan outfits efficiently. Think of it as a personal closet assistant that remembers what you own, tracks what you wear, and helps you plan outfits for upcoming events.

## Features
- **Wardrobe Management**: Add, edit, and delete clothing items with detailed attributes (type, color, fabric, occasion tags, comfort level, weather suitability)
- **Usage Tracking**: Automatically tracks how many times you've worn each item and when you last wore it
- **Calendar View**: Visual monthly calendar to log and view your daily outfits
- **Event Management**: Create and manage upcoming events (office, college, party, function, interview, casual)
- **Analytics Dashboard**: See your most worn items, least worn items, and outfit frequency statistics
- **User Authentication**: Secure signup and login with AWS Cognito


### Future plans
- **SMS Notifications**: SMS alerts for event reminders
- **Image Upload**: Image uploads for wardrobe items
- **Weather Integration**: Backend has weather API support but not actively used in current version


## Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **React Router v6** for navigation
- **Axios** for API calls
- **React Hooks** for state management

### Backend
- **AWS Lambda** (Node.js/TypeScript) - 7 serverless functions
- **Amazon API Gateway** - REST API with CORS support
- **Amazon DynamoDB** - NoSQL database (4 tables: Users, Wardrobe, Outfits, Events)
- **Amazon Cognito** - User authentication and authorization

### Infrastructure
- **AWS SAM** (Serverless Application Model) for infrastructure as code
- **CloudFormation** for resource provisioning
- **CloudWatch** for logging and monitoring

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
- **Node.js 18+** and npm
- **AWS Account** (free tier eligible)
- **AWS CLI** configured with credentials (`aws configure`)
- **AWS SAM CLI** installed ([Installation Guide](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/install-sam-cli.html))

### Installation & Deployment

#### 1. Clone and Install Dependencies
```bash
git clone <your-repo-url>
cd closetmind

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

#### 2. Deploy Backend to AWS
```bash
# Build backend
cd ../backend
npm run build

# Deploy with SAM
cd ../infrastructure
sam build
sam deploy --guided
```

**During `sam deploy --guided`:**
- Stack Name: `closetmind-stack`
- AWS Region: `us-east-1` (or your preferred region)
- Parameter WeatherApiKey: Just press Enter (optional, not used yet)
- Confirm changes: `y`
- Allow IAM role creation: `y`
- Disable rollback: `n`
- Save arguments: `y`

**⚠️ IMPORTANT**: After deployment completes, save these outputs:
- `ApiEndpoint` (API Gateway URL)
- `UserPoolId` (Cognito User Pool ID)
- `UserPoolClientId` (Cognito Client ID)

#### 3. Configure Frontend
```bash
cd ../frontend
```

Edit `frontend/.env` and add the values from SAM deployment:
```env
VITE_API_URL=https://xxxxxxxxxx.execute-api.us-east-1.amazonaws.com/prod
VITE_USER_POOL_ID=us-east-1_xxxxxxxxx
VITE_USER_POOL_CLIENT_ID=xxxxxxxxxxxxxxxxxxxxxxxxxx
VITE_AWS_REGION=us-east-1
```

#### 4. Run Locally
```bash
npm run dev
```

Open `http://localhost:5173` in your browser!

### 🎮 Try the Demo
Use the test account to explore the app without creating an account:
- **Email**: test@test.com
- **Password**: Test1234
- **Note**: This account works completely offline with pre-loaded demo data

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

### Frontend Commands
```bash
cd frontend
npm run dev          # Start dev server (http://localhost:5173)
npm run build        # Production build
npm run preview      # Preview production build
```

### Backend Commands
```bash
cd backend
npm run build        # Compile TypeScript to JavaScript
```

### Infrastructure Commands
```bash
cd infrastructure
sam build            # Build Lambda functions
sam deploy           # Deploy/update AWS resources
sam delete           # Delete entire stack (cleanup)
sam logs             # View CloudWatch logs
```

### Making Changes

**Frontend Changes**: Just save the file - Vite hot-reloads automatically

**Backend Changes**: 
1. Edit code in `backend/src/handlers/`
2. Run `npm run build` in backend folder
3. Run `sam build` then `sam deploy` in infrastructure folder
4. Changes are live in AWS

---

## 🌐 Production Deployment

### Backend
Backend is already deployed to AWS via `sam deploy`. To update:
```bash
cd backend && npm run build
cd ../infrastructure
sam build && sam deploy
```

### Frontend
The frontend currently runs locally. For production deployment, you have several options:

**Option 1: Vercel (Easiest)**
1. Push code to GitHub
2. Import project in Vercel dashboard
3. Add environment variables from `.env`
4. Deploy automatically

**Option 2: Netlify**
1. Push code to GitHub
2. Connect repository in Netlify
3. Build command: `npm run build`
4. Publish directory: `dist`
5. Add environment variables

**Option 3: AWS Amplify**
1. Connect GitHub repository in AWS Amplify Console
2. Configure build settings (auto-detected)
3. Add environment variables
4. Auto-deploys on every push

**Option 4: Manual (S3 + CloudFront)**
```bash
cd frontend
npm run build
# Upload dist/ folder to S3 bucket configured for static hosting
```

---

## 🗑️ Cleanup (Delete Everything)

To avoid any AWS charges, delete all resources:

```bash
cd infrastructure
sam delete --stack-name closetmind-stack --region us-east-1
```

This removes:
- All Lambda functions
- API Gateway
- DynamoDB tables (and all data!)
- Cognito User Pool
- IAM roles
- CloudWatch logs

**Note**: The SAM deployment S3 bucket is not auto-deleted. To remove it:
```bash
# List SAM buckets
aws s3 ls | findstr samclisourcebucket

# Delete bucket (replace with your bucket name)
aws s3 rm s3://aws-sam-cli-managed-default-samclisourcebucket-xxxxx --recursive
aws s3 rb s3://aws-sam-cli-managed-default-samclisourcebucket-xxxxx
```

## 🐛 Common Issues

### "CORS error" in browser console
- Check that API Gateway URL in `.env` is correct
- Verify CORS is enabled in `infrastructure/template.yaml`
- Try hard refresh: `Ctrl + Shift + R`

### "Cannot find module" errors
- Run `npm install` in both `frontend/` and `backend/` folders
- Delete `node_modules` and reinstall if issues persist

### Changes not appearing after deployment
- Run `sam build` before `sam deploy`
- Check CloudWatch logs: `sam logs --stack-name closetmind-stack`
- Verify Lambda function code updated in AWS Console

### Test account not working
- Clear browser localStorage (F12 → Application → Local Storage → Clear)
- Hard refresh the page
- Check browser console for errors

## 📚 Project Documentation

- **API_CONFIGURATION.md** - API endpoints and request/response formats
- **DEPLOYMENT_GUIDE.md** - Detailed deployment instructions
- **BUILD_STATUS.md** - Implementation status and roadmap
- **PROJECT_ARTICLE.md** - Comprehensive project overview for articles

## 🤝 Contributing

Suggestions and feedbacks are welcome! Feel free to:
- Open issues for bugs or feature requests
- Fork and experiment with your own version
- Share your experience using the app

## 📄 License

MIT License - feel free to use this project for learning or personal use.


## 🙏 Acknowledgments

- AWS for generous free tier
- React and Vite communities
- Tailwind CSS for rapid UI development

Created by *Yugesh*
