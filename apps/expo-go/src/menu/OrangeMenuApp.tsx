import React from 'react';
import { AppRegistry } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { OrangeMenuButton } from './OrangeMenuButton';
import * as DevMenu from './DevMenuModule';

function OrangeMenuApp() {
  const handleMenuPress = async () => {
    // Open the dev menu when the orange menu button is pressed
    try {
      await DevMenu.openAsync();
    } catch (error) {
      console.error('Failed to open dev menu:', error);
    }
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <OrangeMenuButton onPress={handleMenuPress} />
    </GestureHandlerRootView>
  );
}

AppRegistry.registerComponent('OrangeMenu', () => OrangeMenuApp);


