# Deployment Guide

## Backend Deployment (Render)

### 1. Prepare Your Repository
- Make sure your backend code is in the `src/` folder
- Ensure `requirements.txt` is at the root level
- The `render.yaml` file is already configured

### 2. Deploy to Render
1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure the service:
   - **Name**: `news-recommender-api`
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn src.main:app --host 0.0.0.0 --port $PORT`
5. Click "Create Web Service"

### 3. Environment Variables
Add these in Render dashboard:
- `NEWS_API_KEY`: Your NewsAPI key
- `PORT`: Render will set this automatically

## Frontend Deployment (Vercel)

### 1. Prepare Frontend
- Make sure your frontend code is in the `frontend/` folder
- Update API calls to use your Render backend URL

### 2. Deploy to Vercel
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Add Environment Variables:
   - `VITE_API_URL`: Your Render backend URL (e.g., `https://your-app.onrender.com`)

### 3. Update Frontend API Calls
In your frontend code, make sure API calls use the environment variable:

```javascript
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
```

## Troubleshooting

### Common Issues:
1. **Module not found**: Make sure your file structure is correct
2. **CORS errors**: Check that your backend allows your frontend domain
3. **API key issues**: Ensure environment variables are set correctly

### Render Specific:
- Use `$PORT` instead of hardcoded port numbers
- Make sure all dependencies are in `requirements.txt`
- Check logs in Render dashboard for detailed error messages 