# ClosetMind - Quick Reference Card

## 🔑 Where to Get Your API Keys

### 1. Weather API Key (Optional - Can Skip)
- **Website**: https://www.weatherapi.com/ OR https://openweathermap.org/api
- **Steps**: Sign up → API Keys → Copy key
- **Cost**: FREE
- **Where to use**: SAM deployment parameter + frontend .env
- **Note**: App works fine without this - suggestions will be based on events and preferences

### 2. AWS Configuration (Auto-generated)
After running `sam deploy`, you'll get these outputs:

```
Outputs:
ApiEndpoint: https://abc123.execute-api.us-east-1.amazonaws.com/prod
UserPoolId: us-east-1_ABC123XYZ
UserPoolClientId: 1a2b3c4d5e6f7g8h9i0j
```

---

## 📝 Configuration Files

### Frontend `.env` (You create this)
```bash
# Location: frontend/.env
VITE_API_URL=https://[from SAM output].execute-api.us-east-1.amazonaws.com/prod
VITE_USER_POOL_ID=us-east-1_[from SAM output]
VITE_USER_POOL_CLIENT_ID=[from SAM output]

# Optional - can leave blank
VITE_WEATHER_API_KEY=
```

### Backend (Auto-configured by SAM)
No manual configuration needed! SAM sets these automatically:
- `USERS_TABLE`
- `WARDROBE_TABLE`
- `OUTFITS_TABLE`
- `EVENTS_TABLE`
- `USER_POOL_ID`
- `USER_POOL_CLIENT_ID`
- `WEATHER_API_KEY` (you provide during `sam deploy --guided`)

---

## 🚀 Deployment Commands

### First Time Deployment

```bash
# 1. Deploy Backend
cd backend
npm install
npm run build

cd ../infrastructure
sam build
sam deploy --guided
# Answer prompts:
# - Stack name: closetmind-stack
# - Region: us-east-1 (or your choice)
# - WeatherApiKey: skip-for-now (optional)
# - Confirm: Y
# - Allow IAM: Y
# - Save config: Y

# 2. Configure Frontend
cd ../frontend
cp .env.example .env
# Edit .env with SAM outputs

# 3. Test Locally
npm install
npm run dev
# Open http://localhost:5173

# 4. Deploy Frontend (when ready)
npm run build
vercel  # or your hosting choice
```

### Subsequent Deployments

```bash
# Backend updates
cd backend && npm run build
cd ../infrastructure
sam build && sam deploy

# Frontend updates
cd frontend
npm run build
vercel  # or redeploy to your host
```

---

## 🔐 GitHub Safety Checklist

✅ **Safe to commit**:
- `.env.example` files
- `.gitignore` files
- All source code
- `template.yaml`

❌ **NEVER commit**:
- `.env` files
- API keys
- AWS credentials
- Any file with real secrets

**Verify before pushing**:
```bash
# Check what will be committed
git status

# Verify .env is ignored
git check-ignore frontend/.env
# Should output: frontend/.env

# If .env shows up in git status, DON'T PUSH!
```

---

## 🧪 Testing Your Deployment

### 1. Check Backend
```bash
# Get your API URL from SAM outputs
curl https://your-api-url.amazonaws.com/prod/health
```

### 2. Test Frontend Locally
```bash
cd frontend
npm run dev
```

### 3. Test Features
- [ ] Sign up new user
- [ ] Log in
- [ ] Add wardrobe item
- [ ] Log outfit on calendar
- [ ] Create event
- [ ] Get suggestions

---

## 💡 Common Issues

### "Cannot find VITE_API_URL"
- Check `frontend/.env` exists (not just `.env.example`)
- Verify values are filled in (not placeholder text)
- Restart dev server after editing `.env`

### "API returns 403"
- Check `VITE_API_URL` matches SAM output exactly
- Verify CORS is enabled in `template.yaml`

### "Cognito error"
- Verify `VITE_USER_POOL_ID` and `VITE_USER_POOL_CLIENT_ID` are correct
- Check they match SAM outputs

### "sam: command not found"
Install SAM CLI: https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/install-sam-cli.html

---

## 📊 File Locations Summary

| What | Where | Committed to Git? |
|------|-------|-------------------|
| API URL | `frontend/.env` | ❌ NO |
| Cognito IDs | `frontend/.env` | ❌ NO |
| Weather Key | `frontend/.env` + SAM param | ❌ NO |
| Example configs | `.env.example` files | ✅ YES |
| Source code | `frontend/src`, `backend/src` | ✅ YES |
| Infrastructure | `infrastructure/template.yaml` | ✅ YES |

---

## 🎯 Quick Commands Reference

```bash
# Install everything
npm install --prefix frontend && npm install --prefix backend

# Build everything
npm run build --prefix backend

# Deploy backend
cd infrastructure && sam build && sam deploy

# Run frontend locally
npm run dev --prefix frontend

# Build frontend for production
npm run build --prefix frontend

# Check for secrets before commit
git status
git diff
```

---

## 📞 Need Help?

1. Check [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for detailed steps
2. Check [BUILD_STATUS.md](./BUILD_STATUS.md) for implementation status
3. Review AWS SAM documentation
4. Check Vite environment variables guide

---

**Remember**: 
- `.env` = YOUR secrets (never commit)
- `.env.example` = Template (safe to commit)
- Always run `git status` before pushing!
