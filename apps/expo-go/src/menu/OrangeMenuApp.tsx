import React from 'react';
import { AppRegistry } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { OrangeMenuButton } from './OrangeMenuButton';

function OrangeMenuApp() {
  const handleMenuPress = () => {
    // This will be called when the orange menu button is pressed
    // You can customize this to open your own menu or perform other actions
    console.log('Orange menu button pressed!');
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <OrangeMenuButton onPress={handleMenuPress} />
    </GestureHandlerRootView>
  );
}

AppRegistry.registerComponent('OrangeMenu', () => OrangeMenuApp);


