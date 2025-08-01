# Configuration Guide

## Environment Variables Setup

Create a `.env` file in your project root with the following variables:

```bash
# YouTube API Configuration
REACT_APP_YOUTUBE_API_KEY=your_youtube_api_key_here

# Firebase Configuration (if not already in firebase.js)
REACT_APP_FIREBASE_API_KEY=your_firebase_api_key_here
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id

# Backend Configuration
REACT_APP_BACKEND_URL=http://localhost:5000
```

## Important Notes

1. **Never commit your `.env` file** to version control
2. Add `.env` to your `.gitignore` file
3. Restart your development server after adding environment variables
4. All React environment variables must start with `REACT_APP_`

## YouTube API Key Setup

1. Get your API key from [Google Cloud Console](https://console.cloud.google.com/)
2. Enable YouTube Data API v3
3. Add the key to your `.env` file
4. Update `src/services/youtubeService.js` to use the environment variable:

```javascript
const YOUTUBE_API_KEY = process.env.REACT_APP_YOUTUBE_API_KEY || 'YOUR_YOUTUBE_API_KEY';
``` 