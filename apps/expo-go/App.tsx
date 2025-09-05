import { ApolloProvider } from '@apollo/client';
import * as SplashScreen from 'expo-splash-screen';
import * as React from 'react';
import { Platform } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useTheme } from 'react-native-paper';
import { enableScreens } from 'react-native-screens';
import { Provider as ReduxProvider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import HomeApp from './src/HomeApp';
import ApolloClient from './src/api/ApolloClient';
import Store from './src/redux/Store';
import './src/menu/DevMenuApp';
import './src/menu/OrangeMenuApp';
import { AccountNameProvider } from './src/utils/AccountNameContext';
import { InitialDataProvider } from './src/utils/InitialDataContext';
import { ClerkProvider, publishableKey } from './src/config/clerk';
import { tokenCache } from '@clerk/clerk-expo/token-cache';
import { trpc, trpcClient } from './src/config/trpc';
import { VibeAuthProvider } from './src/contexts/VibeAuthContext';

if (Platform.OS === 'android') {
  enableScreens(false);
}
SplashScreen.preventAutoHideAsync();

// Create a query client for React Query
const queryClient = new QueryClient();

export default function App() {
  const theme = useTheme();
  // Removing the background color of the active tab
  // See https://github.com/callstack/react-native-paper/issues/3554
  theme.colors.secondaryContainer = 'transperent';

  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <trpc.Provider client={trpcClient} queryClient={queryClient}>
        <QueryClientProvider client={queryClient}>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <ReduxProvider store={Store}>
              <ApolloProvider client={ApolloClient}>
                <InitialDataProvider>
                  <AccountNameProvider>
                    <VibeAuthProvider>
                      <HomeApp />
                    </VibeAuthProvider>
                  </AccountNameProvider>
                </InitialDataProvider>
              </ApolloProvider>
            </ReduxProvider>
          </GestureHandlerRootView>
        </QueryClientProvider>
      </trpc.Provider>
    </ClerkProvider>
  );
}
