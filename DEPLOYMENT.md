# Deployment Guide for Render.com

This guide explains how to deploy the Backtester application to Render.com.

## Prerequisites

1. A Render.com account
2. A GitHub repository with your code
3. API keys:
   - OpenAI API key
   - Polygon.io API key

## Deployment Steps

### 1. Connect GitHub Repository

1. Log in to Render.com
2. Click "New +" and select "Blueprint"
3. Connect your GitHub account if not already connected
4. Select your repository
5. Render will automatically detect the `render.yaml` file

### 2. Configure Environment Variables

During the deployment process, you'll need to set the following environment variables:

#### Backend Service (backtester-api):

- `OPENAI_API_KEY`: Your OpenAI API key
- `POLYGON_API_KEY`: Your Polygon.io API key

#### Frontend Service (backtester-frontend):

- `REACT_APP_POLYGON_API_KEY`: Your Polygon.io API key

### 3. Deploy

1. Click "Apply" to start the deployment
2. Render will create two services:
   - **backtester-api**: The Node.js backend API
   - **backtester-frontend**: The React frontend (static site)

### 4. Access Your Application

After deployment:

- Backend API: `https://backtester-api.onrender.com`
- Frontend: `https://backtester-frontend.onrender.com`

## Service Details

### Backend Service

- **Type**: Web Service
- **Runtime**: Node.js
- **Build Command**: `npm install`
- **Start Command**: `node server/server.js`
- **Health Check**: `/api/health`
- **Port**: 5000

### Frontend Service

- **Type**: Static Site
- **Build Command**: `npm install && npm run build`
- **Publish Directory**: `./build`
- **Routes**: All routes redirect to `index.html` for React Router

## Environment Variables Reference

### Backend (.env)

```
NODE_ENV=production
PORT=5000
OPENAI_API_KEY=your_key_here
POLYGON_API_KEY=your_key_here
CORS_ORIGIN=https://backtester-frontend.onrender.com
```

### Frontend (.env)

```
REACT_APP_API_URL=https://backtester-api.onrender.com
REACT_APP_POLYGON_API_KEY=your_key_here
```

## Monitoring

- Check service logs in the Render dashboard
- Monitor the health endpoint: `https://backtester-api.onrender.com/api/health`
- Set up alerts for service downtime

## Troubleshooting

### CORS Issues

- Ensure the frontend URL is correctly set in backend's CORS_ORIGIN
- Check that credentials are included in frontend API calls

### Build Failures

- Check build logs in Render dashboard
- Ensure all dependencies are in package.json
- Verify Node.js version compatibility

### API Connection Issues

- Verify REACT_APP_API_URL is set correctly
- Check backend service is running
- Test health endpoint directly

## Updating the Application

1. Push changes to your GitHub repository
2. Render will automatically detect changes and redeploy
3. Monitor deployment progress in the Render dashboard

## Custom Domain (Optional)

To use a custom domain:

1. Go to Settings for each service
2. Add your custom domain
3. Configure DNS records as instructed by Render
