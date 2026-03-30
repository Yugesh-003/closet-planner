# ClosetMind - Deployment Guide

## 🔑 Where to Get API Keys and Configuration

### 1. Weather API Key (Optional - Can Skip for Now)
- **Option A**: WeatherAPI.com - https://www.weatherapi.com/ (Free tier: 1M calls/month)
- **Option B**: OpenWeatherMap - https://openweathermap.org/api (Free tier: 1,000 calls/day)
- **Option C**: Skip it - The app works without weather integration!

**Note**: Weather API is used for weather-based suggestions. Without it, suggestions are based on events, preferences, and wardrobe tags only.

### 2. AWS Account Setup
- You need an AWS account (free tier eligible)
- Install AWS CLI: `aws configure`
- Install AWS SAM CLI: [Installation Guide](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/install-sam-cli.html)

---

## 📦 Step-by-Step Deployment

### Step 1: Deploy Backend to AWS

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Build TypeScript
npm run build

# Navigate to infrastructure
cd ../infrastructure

# Build SAM application
sam build

# Deploy (first time - interactive)
sam deploy --guided
```

**During `sam deploy --guided`, you'll be asked**:
- Stack Name: `closetmind-stack` (or your choice)
- AWS Region: `us-east-1` (or your preferred region)
- Parameter WeatherApiKey: `[paste your OpenWeatherMap API key]`
- Confirm changes: `Y`
- Allow SAM CLI IAM role creation: `Y`
- Save arguments to config file: `Y`

**After deployment completes, you'll see outputs**:
```
Outputs:
ApiEndpoint: https://abc123xyz.execute-api.us-east-1.amazonaws.com/prod
UserPoolId: us-east-1_ABC123XYZ
UserPoolClientId: 1a2b3c4d5e6f7g8h9i0j
```

**⚠️ SAVE THESE VALUES - You need them for frontend!**

---

### Step 2: Configure Frontend

```bash
# Navigate to frontend
cd frontend

# Copy environment template
cp .env.example .env

# Edit .env file with your values
```

**Edit `frontend/.env`** with the values from SAM deployment:

```env
# Replace with your actual API Gateway URL from SAM outputs
VITE_API_URL=https://abc123xyz.execute-api.us-east-1.amazonaws.com/prod

# Replace with your Cognito User Pool ID from SAM outputs
VITE_USER_POOL_ID=us-east-1_ABC123XYZ

# Replace with your Cognito Client ID from SAM outputs
VITE_USER_POOL_CLIENT_ID=1a2b3c4d5e6f7g8h9i0j

# Optional: Your OpenWeatherMap API key
VITE_WEATHER_API_KEY=your-openweathermap-api-key
```

---

### Step 3: Test Frontend Locally

```bash
# Still in frontend directory
npm install

# Start development server
npm run dev
```

Open browser to `http://localhost:5173`

**Test the application**:
1. Sign up with a new account
2. Add wardrobe items
3. Log outfits on calendar
4. Create events
5. Get outfit suggestions

---

### Step 4: Deploy Frontend to Production

#### Option A: Deploy to Vercel (Recommended - Easiest)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy (from frontend directory)
vercel

# Add environment variables in Vercel dashboard:
# Settings > Environment Variables
# Add: VITE_API_URL, VITE_USER_POOL_ID, VITE_USER_POOL_CLIENT_ID
```

#### Option B: Deploy to AWS Amplify

1. Push code to GitHub
2. Go to AWS Amplify Console
3. Connect your GitHub repository
4. Add environment variables in build settings
5. Deploy

#### Option C: Deploy to S3 + CloudFront

```bash
# Build production bundle
npm run build

# Upload to S3 (create bucket first)
aws s3 sync dist/ s3://your-bucket-name --delete

# Set up CloudFront distribution pointing to S3 bucket
```

---

## 🔐 Security Checklist for GitHub

✅ **Already Protected**:
- `.env` files are in `.gitignore`
- Only `.env.example` files are committed
- No hardcoded secrets in code

✅ **Before Pushing to GitHub**:
```bash
# Verify no secrets are committed
git status

# Check .gitignore is working
git check-ignore frontend/.env
# Should output: frontend/.env

# Safe to push
git add .
git commit -m "Initial commit"
git push
```

⚠️ **Never Commit**:
- `.env` files
- AWS credentials
- API keys
- Cognito pool IDs (these go in `.env`)

---

## 📍 Where Each API Value Comes From

| Variable | Source | How to Get It |
|----------|--------|---------------|
| `VITE_API_URL` | AWS SAM Deployment | Output after `sam deploy` - labeled "ApiEndpoint" |
| `VITE_USER_POOL_ID` | AWS SAM Deployment | Output after `sam deploy` - labeled "UserPoolId" |
| `VITE_USER_POOL_CLIENT_ID` | AWS SAM Deployment | Output after `sam deploy` - labeled "UserPoolClientId" |
| `WEATHER_API_KEY` | OpenWeatherMap | Sign up at openweathermap.org/api |

---

## 🔄 Redeployment (After Code Changes)

### Backend Changes:
```bash
cd backend
npm run build
cd ../infrastructure
sam build
sam deploy  # No --guided needed after first time
```

### Frontend Changes:
```bash
cd frontend
npm run build
# Then redeploy to your hosting platform (Vercel/Amplify/S3)
```

---

## 🧪 Testing Checklist

- [ ] Backend deployed successfully
- [ ] API Gateway URL accessible
- [ ] Cognito user pool created
- [ ] DynamoDB tables created
- [ ] Frontend `.env` configured with correct values
- [ ] Frontend runs locally (`npm run dev`)
- [ ] Can sign up new user
- [ ] Can log in
- [ ] Can add wardrobe items
- [ ] Can log outfits
- [ ] Can create events
- [ ] Can get suggestions
- [ ] Frontend deployed to production
- [ ] Production site works end-to-end

---

## 💰 Cost Estimate

**AWS Free Tier (First 12 months)**:
- Lambda: 1M requests/month free
- DynamoDB: 25GB storage + 25 read/write units free
- API Gateway: 1M requests/month free
- Cognito: 50,000 MAU free forever

**After Free Tier** (estimated for low usage):
- ~$5-10/month for light usage
- ~$20-30/month for moderate usage

**Vercel/Amplify Hosting**:
- Free tier available for personal projects

---

## 🆘 Troubleshooting

### "Command not found: sam"
Install AWS SAM CLI: https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/install-sam-cli.html

### "Unable to locate credentials"
Run `aws configure` and enter your AWS access keys

### "API returns 403 Forbidden"
Check CORS settings in `infrastructure/template.yaml` - ensure your frontend domain is allowed

### "Cannot connect to API"
Verify `VITE_API_URL` in `.env` matches the ApiEndpoint from SAM deployment

### "Cognito authentication fails"
Verify `VITE_USER_POOL_ID` and `VITE_USER_POOL_CLIENT_ID` match SAM outputs

---

## 📚 Additional Resources

- [AWS SAM Documentation](https://docs.aws.amazon.com/serverless-application-model/)
- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)
- [OpenWeatherMap API Docs](https://openweathermap.org/api)
- [AWS Free Tier](https://aws.amazon.com/free/)

---

## 🎉 You're Done!

Once deployed, share your app URL and start planning outfits! 👗✨
