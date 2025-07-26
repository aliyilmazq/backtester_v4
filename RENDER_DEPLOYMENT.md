# Render Deployment Guide

## Environment Variables

To deploy on Render, you need to set the following environment variables in your Render dashboard:

### Required for Supabase (if using authentication):

- `REACT_APP_SUPABASE_URL` - Your Supabase project URL
- `REACT_APP_SUPABASE_ANON_KEY` - Your Supabase anonymous key

### Steps to Add Environment Variables on Render:

1. Go to your Render dashboard
2. Select your static site (backtester_v4)
3. Go to "Environment" tab
4. Click "Add Environment Variable"
5. Add each variable:
   - Key: `REACT_APP_SUPABASE_URL`
   - Value: `https://your-project-id.supabase.co`
   - Key: `REACT_APP_SUPABASE_ANON_KEY`
   - Value: `your-anon-key-here`

6. Click "Save Changes"
7. Trigger a new deploy

## Build Settings

The project is already configured with:

- Build Command: `npm run build`
- Publish Directory: `build`

## Without Supabase

If you want to deploy without Supabase authentication:

- The app will work but login/signup features will show an error message
- You can still use the simple login at `/simple-login`

## Debugging Build Failures

1. Check the build logs in Render dashboard
2. Common issues:
   - TypeScript errors: Fixed by using bracket notation for env vars
   - Missing dependencies: Run `npm install` locally and commit `package-lock.json`
   - Node version: Specified in `.nvmrc` file (20.11.0)

## Post-Deployment

After successful deployment:

1. Visit your site at the Render URL
2. Test the authentication flow
3. Check browser console for any runtime errors
