// Vibe Expo Go App Configuration
// This file contains Expo-specific settings and constants

export const VIBE_CONFIG = {
  // Framework type - always Expo for this app
  FRAMEWORK: 'expo' as const,
  
  // Expo-specific project templates
  EXPO_TEMPLATES: [
    {
      emoji: "📱",
      title: "Build a mobile note taking app",
      prompt: "Build a mobile note taking app with dark mode, offline support, and local storage using Expo and React Native. Include navigation, note creation/editing, and search functionality.",
    },
    {
      emoji: "💬",
      title: "Create an AI chat app for mobile",
      prompt: "Create a mobile AI chat app with real-time messaging, message history, and a modern UI using Expo, React Native, and TypeScript. Include proper navigation and state management.",
    },
    {
      emoji: "🏠",
      title: "Build a mobile Airbnb clone",
      prompt: "Build a mobile Airbnb clone with property listings, search filters, map integration, and booking functionality using Expo, React Native, and navigation.",
    },
    {
      emoji: "🎮",
      title: "Create a mobile Wordle game",
      prompt: "Create a mobile Wordle game with daily puzzles, keyboard input, color-coded feedback, and score tracking using Expo and React Native.",
    },
    {
      emoji: "✅",
      title: "Build a mobile todo app",
      prompt: "Build a mobile todo app with notifications, categories, due dates, and sync capabilities using Expo, React Native, and local storage.",
    },
    {
      emoji: "🌤️",
      title: "Create a mobile weather app",
      prompt: "Create a mobile weather app with location services, current weather, forecasts, and beautiful animations using Expo, React Native, and weather APIs.",
    },
    {
      emoji: "📸",
      title: "Build a mobile social media app",
      prompt: "Build a mobile social media app with posts, likes, comments, user profiles, and real-time updates using Expo, React Native, and modern UI components.",
    },
    {
      emoji: "💪",
      title: "Create a mobile fitness tracking app",
      prompt: "Create a mobile fitness tracking app with workout logging, progress tracking, charts, and goal setting using Expo, React Native, and health data integration.",
    },
  ],
  
  // Expo-specific file patterns
  EXPO_FILE_PATTERNS: [
    'app/(tabs)/index.tsx',
    'app/_layout.tsx',
    'app.json',
    'package.json',
    'components/',
    'hooks/',
    'utils/',
    'constants/',
  ],
  
  // Mobile-specific features to highlight
  MOBILE_FEATURES: [
    'Navigation with Expo Router',
    'React Native components',
    'Mobile-optimized UI',
    'Touch gestures',
    'Local storage',
    'Push notifications',
    'Camera integration',
    'Location services',
  ],
} as const;

// API endpoints for Expo projects
export const VIBE_API_ENDPOINTS = {
  CREATE_PROJECT: '/api/projects/create',
  GET_PROJECTS: '/api/projects',
  SEND_MESSAGE: '/api/messages/create',
  GET_MESSAGES: '/api/messages',
} as const;

// Expo-specific project creation payload
export interface CreateExpoProjectPayload {
  value: string;
  framework: 'expo';
  platform: 'mobile';
  features?: string[];
}

export default VIBE_CONFIG;
