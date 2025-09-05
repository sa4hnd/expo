# Vibe Integration Setup

This document explains how to set up the Vibe integration in the Expo Go app, following the same approach as your web app.

## Environment Variables

Create a `.env` file in the `expo-go` directory with the following variables:

```env
# Clerk Authentication
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key_here

# Vibe API
EXPO_PUBLIC_API_URL=http://localhost:3000
```

## Getting Your Clerk Publishable Key

1. Go to [Clerk Dashboard](https://dashboard.clerk.com/)
2. Create a new application or select an existing one
3. Go to "API Keys" in the sidebar
4. Copy the "Publishable key" (starts with `pk_test_` or `pk_live_`)
5. Add it to your `.env` file

## Setting Up OAuth Providers (Google, GitHub, Apple)

1. In your Clerk Dashboard, go to "User & Authentication" → "Social Connections"
2. Enable the providers you want (Google, GitHub, Apple)
3. Configure each provider with your OAuth credentials
4. The Expo app will automatically support these providers

## Getting Your Vibe API URL

- For local development: `http://localhost:3000`
- For production: Your deployed Vibe web app URL

## Features Implemented

### ✅ Authentication (Same as Web App)
- **Clerk authentication integration** with secure token storage
- **OAuth support** for Google, GitHub, and Apple (managed by Clerk)
- **Email/password authentication** with email verification
- **Sign-in and Sign-up flows** in a beautiful modal
- **Profile button integration** with user initials
- **Secure token storage** using expo-secure-store

### ✅ UI Components
- **VibeHeader** with profile button and OAuth integration
- **VibeSearchBar** with sort functionality
- **VibeProjectCard** with deep linking to Expo projects
- **VibeProjectsList** with authentication-gated content
- **VibeAuthModal** with OAuth buttons and email/password forms
- **Consistent dark theme** with orange accent (#FF6B35)

### ✅ Navigation
- **Bottom tab bar hidden** for clean Vibe experience
- **Deep linking** to Expo projects
- **Modal-based authentication** flow

### ✅ OAuth Integration
- **Google Sign-In** - One-click authentication
- **GitHub Sign-In** - Developer-friendly option
- **Apple Sign-In** - iOS native experience
- **Email verification** for new accounts
- **Seamless switching** between sign-in and sign-up

## How It Works

1. **User clicks profile button** → Opens VibeAuthModal
2. **User chooses authentication method**:
   - OAuth (Google/GitHub/Apple) - handled by Clerk
   - Email/Password - custom form with verification
3. **Authentication success** → User sees their projects
4. **Profile button shows user initial** when authenticated

## Next Steps

1. **Set up your Clerk application** with OAuth providers
2. **Add your environment variables** to `.env`
3. **Test the authentication flow** with different providers
4. **Integrate with your Vibe backend API** using tRPC
5. **Replace mock data** with real project data from your API

## Testing

1. Run `npx expo start` in the expo-go directory
2. Open the app on your device/simulator
3. Click the profile button to test authentication
4. Try different OAuth providers and email/password flow

## Troubleshooting

- Make sure all environment variables are set correctly
- Check that your Clerk application is properly configured with OAuth providers
- Ensure the Vibe API is running and accessible
- For OAuth issues, verify your provider configurations in Clerk Dashboard