// Environment configuration for Vibe Expo Go app
// Make sure to set these environment variables in your .env file

export const ENV = {
  // Clerk Authentication
  CLERK_PUBLISHABLE_KEY: process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY || 'pk_test_YXBwYXJlbnQtZ2lyYWZmZS0zOS5jbGVyay5hY2NvdW50cy5kZXYk',
  
  // Vibe API
  API_URL: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3001',
} as const;

// Validate required environment variables
if (!ENV.CLERK_PUBLISHABLE_KEY) {
  console.warn('EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY is not set. Authentication will not work.');
}

if (!ENV.API_URL) {
  console.warn('EXPO_PUBLIC_API_URL is not set. Using default localhost URL.');
}
