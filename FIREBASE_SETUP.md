# Firebase Setup Guide for Connect 4 Gold BBs Challenge

## Overview
The Connect 4 game now includes Firebase Authentication and Realtime Database to track players who collect all 4 Gold BBs Tire Rims and unlock the secrets!

## Setup Instructions

### 1. Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" and follow the setup wizard
3. Name your project (e.g., "gold-bbs-challenge")

### 2. Enable Authentication
1. In Firebase Console, go to **Build > Authentication**
2. Click "Get started"
3. Go to **Sign-in method** tab
4. Enable **Email/Password** provider
5. Save changes

### 3. Create Realtime Database
1. In Firebase Console, go to **Build > Realtime Database**
2. Click "Create Database"
3. Choose your location (e.g., us-central1)
4. Start in **test mode** (we'll add rules next)

### 4. Set Database Rules
1. In Realtime Database, go to the **Rules** tab
2. Replace the default rules with the content from `firebase-rules.json`
3. Click "Publish"

### 5. Get Firebase Configuration
1. In Firebase Console, go to **Project Settings** (gear icon)
2. Scroll down to "Your apps"
3. Click the web icon `</>`
4. Register your app with a nickname
5. Copy the `firebaseConfig` object

### 6. Update connect4.html
1. Open `connect4.html`
2. Find the `firebaseConfig` object (around line 371)
3. Replace the placeholder values with your actual Firebase config:

```javascript
const firebaseConfig = {
    apiKey: "YOUR_ACTUAL_API_KEY",
    authDomain: "your-project-id.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project-id.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abcdef",
    databaseURL: "https://your-project-id.firebaseio.com"
};
```

### 7. Deploy
1. Commit your changes (DO NOT commit real Firebase credentials to public repos!)
2. For production, use environment variables (see `.env.example`)
3. Deploy to your hosting platform (Vercel, etc.)

## How It Works

### Game Mechanics
- Players must **sign up/login** before playing
- Each win against J4RV1S earns **1 Gold BBs Tire Rim** 🏆
- Consecutive wins are tracked
- Losing to J4RV1S or drawing resets consecutive wins
- Collect all **4 Gold BBs Tire Rims** to unlock ALL the secrets!

### Data Structure
```json
{
  "users": {
    "user-uid": {
      "username": "player123",
      "goldRims": 3,
      "consecutiveWins": 3,
      "totalWins": 15,
      "secretsUnlocked": false
    }
  }
}
```

### Security
- Users can only read/write their own data
- Authentication required for all operations
- Database rules enforce data validation

## Monitoring Winners

### Check Leaderboard
Query users who have unlocked secrets:

```javascript
// In Firebase Console > Realtime Database
// Navigate to: /users
// Look for users where "secretsUnlocked": true and "goldRims": 4
```

### Export Winners
1. Go to Realtime Database in Firebase Console
2. Click the 3-dot menu
3. Select "Export JSON"
4. Filter for users with `secretsUnlocked: true`

## Troubleshooting

### "Permission denied" errors
- Check that Authentication is enabled
- Verify database rules are published
- Ensure user is logged in

### Login not working
- Verify Firebase config is correct
- Check browser console for errors
- Ensure Email/Password authentication is enabled

### Game not saving progress
- Check Firebase Console > Realtime Database for data
- Verify databaseURL is included in config
- Check browser console for errors

## Production Recommendations

1. **Secure your config**: Use environment variables
2. **Enable email verification**: Prevent fake accounts
3. **Add rate limiting**: Prevent abuse
4. **Monitor usage**: Set up Firebase Analytics
5. **Backup database**: Enable automatic backups

## Support
For issues, check:
- [Firebase Documentation](https://firebase.google.com/docs)
- [Firebase Console](https://console.firebase.google.com/)
- Browser console for error messages
