# ClosetMind

A women-centric wardrobe management and outfit planning application built with React, TypeScript, and AWS serverless architecture.

## Features
- Wardrobe Management - Add, edit, and delete clothing items with detailed attributes
- Usage Tracking - Automatically tracks wear frequency and last worn dates
- Calendar View - Visual monthly calendar to log and view daily outfits
- Event Management - Create and manage upcoming events
- Analytics Dashboard - View most/least worn items and outfit statistics
- User Authentication - Secure signup and login with AWS Cognito

## Tech Stack
- Frontend: React 18, TypeScript, Vite, Tailwind CSS
- Backend: AWS Lambda (Node.js/TypeScript), API Gateway, DynamoDB, Cognito
- Infrastructure: AWS SAM, CloudFormation

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- AWS CLI configured with appropriate credentials
- AWS SAM CLI installed

### Installation

```bash
# Install dependencies
cd backend && npm install
cd ../frontend && npm install
```

### Deploy Backend
```bash
cd backend
npm run build

cd ../infrastructure
sam build
sam deploy --guided
```

Save the outputs: `ApiEndpoint`, `UserPoolId`, `UserPoolClientId`

### Configure Frontend
Edit `frontend/.env`:
```env
VITE_API_URL=<ApiEndpoint>
VITE_USER_POOL_ID=<UserPoolId>
VITE_USER_POOL_CLIENT_ID=<UserPoolClientId>
VITE_AWS_REGION=us-east-1
```

### Run Locally
```bash
cd frontend
npm run dev
```

### Build for Production
```bash
cd frontend
npm run build
```


## 📁 Project Structure

```
closetmind/
├── frontend/           # React TypeScript application
├── backend/            # AWS Lambda functions
├── infrastructure/     # AWS SAM templates
└── aidlc-docs/        # AI-DLC workflow documentation
```

## 📚 Documentation

See `DEPLOYMENT_GUIDE.md` for detailed deployment instructions.

## License

MIT License

---

Created by *Yugesh*
