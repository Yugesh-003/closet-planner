# API Configuration Guide

## 🎯 TL;DR - What You Need

You need **3 values** to run ClosetMind (weather API is optional):

1. **API Gateway URL** - Get from AWS SAM deployment
2. **Cognito User Pool ID** - Get from AWS SAM deployment  
3. **Cognito Client ID** - Get from AWS SAM deployment
4. **Weather API Key** - OPTIONAL (can skip for now)

---

## 📍 Step-by-Step: Where to Get Each Value

### 1. Weather API Key (OPTIONAL - Skip for Now)

**Status**: ⚠️ You can deploy and use the app WITHOUT this!

The weather API is used for weather-based outfit suggestions. The app works fine without it - suggestions will be based on events and preferences only.

**If you want to add it later**:
- **Option A**: OpenWeatherMap - https://openweathermap.org/api (if website works)
- **Option B**: WeatherAPI.com - https://www.weatherapi.com/ (alternative, also free)
- **Option C**: Skip it entirely - app works without weather integration

**For now**: Just leave this blank or use a dummy value like `"skip-for-now"`

---

### 2. Deploy Backend to Get AWS Values

**Run these commands**:

```bash
cd backend
npm install
npm run build

cd ../infrastructure
sam build
sam deploy --guided
```

**During deployment, answer**:
- Stack Name: `closetmind-stack`
- AWS Region: `us-east-1` (or your preference)
- **Parameter WeatherApiKey**: Type `skip-for-now` (or leave blank)
- Confirm changes: `Y`
- Allow SAM CLI IAM role creation: `Y`
- Save arguments to config file: `Y`

**After deployment completes**, you'll see:

```
CloudFormation outputs from deployed stack
---------------------------------------------------------
Outputs
---------------------------------------------------------
Key                 ApiEndpoint
Description         API Gateway endpoint URL
Value               https://abc123xyz.execute-api.us-east-1.amazonaws.com/prod

Key                 UserPoolId
Description         Cognito User Pool ID
Value               us-east-1_ABC123XYZ

Key                 UserPoolClientId
Description         Cognito User Pool Client ID
Value               1a2b3c4d5e6f7g8h9i0j
---------------------------------------------------------
```

**⚠️ COPY THESE THREE VALUES - You need them next!**

---

## 📝 Where to Put the Values

### Create `frontend/.env` file

```bash
cd frontend
cp .env.example .env
```

### Edit `frontend/.env` with your values:

```env
# Replace with YOUR actual values from SAM deployment
VITE_API_URL=https://abc123xyz.execute-api.us-east-1.amazonaws.com/prod
VITE_USER_POOL_ID=us-east-1_ABC123XYZ
VITE_USER_POOL_CLIENT_ID=1a2b3c4d5e6f7g8h9i0j

# Optional - can leave blank for now
VITE_WEATHER_API_KEY=
```

**Important**: 
- Use YOUR actual values (not the examples above)
- No quotes around values
- No spaces around `=`
- Save the file

---

## ✅ Verify Configuration

### 1. Check file exists:
```bash
ls frontend/.env
# Should show: frontend/.env
```

### 2. Check file is ignored by git:
```bash
git check-ignore frontend/.env
# Should output: frontend/.env
```

### 3. Test frontend:
```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173` - if it loads, configuration is correct!

---

## 🔐 Security - GitHub Safety

### ✅ SAFE to commit:
- `frontend/.env.example` (template with placeholders)
- `backend/.env.example` (reference only)
- `.gitignore` files
- All source code

### ❌ NEVER commit:
- `frontend/.env` (your actual secrets)
- `backend/.env` (not needed, but don't create it)
- Any file with real API keys

### Before every git push:
```bash
git status
# Make sure .env is NOT listed

git diff
# Make sure no API keys visible
```

---

## 🔄 If You Need to Change Values Later

### Change API URL (after redeployment):
1. Run `sam deploy` again
2. Copy new ApiEndpoint from outputs
3. Update `VITE_API_URL` in `frontend/.env`
4. Restart frontend dev server

### Change Weather API Key:
1. Update `VITE_WEATHER_API_KEY` in `frontend/.env`
2. Restart frontend dev server
3. Redeploy backend: `sam deploy --parameter-overrides WeatherApiKey=new-key`

---

## 📊 Configuration Summary Table

| Variable | Source | Used By | Required? |
|----------|--------|---------|-----------|
| `VITE_API_URL` | SAM Output: ApiEndpoint | Frontend | ✅ YES |
| `VITE_USER_POOL_ID` | SAM Output: UserPoolId | Frontend | ✅ YES |
| `VITE_USER_POOL_CLIENT_ID` | SAM Output: UserPoolClientId | Frontend | ✅ YES |
| `VITE_WEATHER_API_KEY` | Weather API service | Frontend | ❌ NO (optional) |
| `WEATHER_API_KEY` | SAM Parameter | Backend | ❌ NO (optional) |

---

## 🆘 Troubleshooting

### "Cannot read VITE_API_URL"
**Problem**: `.env` file doesn't exist or is empty  
**Solution**: 
```bash
cd frontend
cp .env.example .env
# Edit .env with your values
```

### "API returns 404 or 403"
**Problem**: Wrong API URL  
**Solution**: 
- Check `VITE_API_URL` matches SAM output exactly
- Include `/prod` at the end
- No trailing slash

### "Cognito authentication fails"
**Problem**: Wrong Cognito IDs  
**Solution**:
- Verify `VITE_USER_POOL_ID` starts with region (e.g., `us-east-1_`)
- Check `VITE_USER_POOL_CLIENT_ID` is alphanumeric
- Both should match SAM outputs exactly

### "Weather suggestions don't work"
**Problem**: Missing or invalid weather API key  
**Solution**: This is OPTIONAL - the app works without it!
- Suggestions will be based on events and preferences (not weather)
- To add weather later:
  - Get free key from WeatherAPI.com or OpenWeatherMap
  - Add to `frontend/.env` as `VITE_WEATHER_API_KEY`
  - Redeploy backend: `sam deploy --parameter-overrides WeatherApiKey=your-key`

---

## 🎉 You're All Set!

Once you have:
- ✅ Backend deployed (`sam deploy`)
- ✅ `frontend/.env` created with 3 required values (weather API optional)
- ✅ Frontend running (`npm run dev`)

You can start using ClosetMind! 👗✨

**Note**: Weather API is optional - the app works great without it. Suggestions will be based on your events, preferences, and wardrobe tags.

**Next steps**: See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for production deployment.
