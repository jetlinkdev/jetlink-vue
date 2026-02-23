# Firebase Google Sign-In Setup

## Firebase Configuration

The app is configured with the following Firebase project:

- **Project ID**: `jetlink-47eb8`
- **App ID**: `1:706026144910:web:9363c4e13dd7d5947475df`

## Required Firebase Console Setup

### 1. Enable Google Sign-In Method

1. Go to [Firebase Console](https://console.firebase.google.com/project/jetlink-47eb8/authentication/providers)
2. Click on **Sign-in method** tab
3. Select **Google** from the providers list
4. Enable the Google sign-in method
5. Add your authorized domain (e.g., `localhost` for development)
6. Enter your project support email
7. Click **Save**

### 2. Add Authorized Domains

For development:
- `localhost` is automatically added

For production:
1. Go to **Authentication** → **Settings** → **Authorized domains**
2. Add your production domain

### 3. Configure OAuth Consent Screen (Google Cloud Console)

1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials/consent)
2. Select your project: `jetlink-47eb8`
3. Configure the OAuth consent screen:
   - **User Type**: External
   - **App name**: Jetlink Customer
   - **User support email**: Your email
   - **Developer contact**: Your email
4. Add scopes: `email`, `profile`
5. Add test users (if in testing mode)

## Running the App

```bash
cd simulation/customer
npm run dev
```

## How It Works

1. **App Load**: When the app loads, it checks Firebase auth state
2. **Not Logged In**: Shows a full-screen login dialog (cannot be dismissed)
3. **Sign In**: User clicks "Sign in with Google" → Firebase popup appears
4. **Success**: Dialog closes, user info displayed in header, can now book rides
5. **Logout**: Click logout button (top right) → signs out and shows login dialog again

## User ID Format

When creating orders, the user ID is sent as:
```
customer_{firebase_uid}
```

Example: `customer_abc123xyz789`

## Files Added/Modified

### New Files:
- `src/config/firebase.ts` - Firebase initialization
- `src/services/authService.ts` - Auth service with Google Sign-In
- `src/components/LoginDialog.tsx` - Login dialog component

### Modified Files:
- `src/App.tsx` - Integrated auth flow, logout, user display
- `src/context/OrderContext.tsx` - Added user state, uses Firebase UID
- `src/index.css` - Added fadeIn animation
- `package.json` - Added firebase dependency

## Testing

1. Start the dev server: `npm run dev`
2. You should see the login dialog
3. Click "Sign in with Google"
4. Select your Google account
5. After successful login:
   - Dialog closes
   - Your email/name appears in the header
   - You can now book rides
6. Click the logout button (top right) to sign out

## Troubleshooting

### "Firebase: Error (auth/unauthorized-domain)"
- Make sure `localhost` is added to authorized domains in Firebase Console

### "Firebase: Error (auth/popup-closed-by-user)"
- Popup was closed before completing sign-in
- Check popup blocker settings

### "Firebase: Error (auth/operation-not-allowed)"
- Google Sign-In method is not enabled in Firebase Console
- Enable it in Authentication → Sign-in method

## Security Notes

- Firebase rules should be configured to only allow authenticated users to create orders
- Consider implementing custom claims for role-based access (customer vs driver)
- Store sensitive configuration in environment variables for production
