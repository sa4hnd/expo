import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { HomeFilledIcon, RefreshIcon, iconSize } from '@expo/styleguide-native';

interface DevMenuTopActionsProps {
  onAppReload: () => void;
  onGoToHome: () => void;
}

export const DevMenuTopActions: React.FC<DevMenuTopActionsProps> = ({
  onAppReload,
  onGoToHome,
}) => {
  return (
    <View style={styles.container}>
      {/* Home Button - Top Left */}
      <TouchableOpacity 
        style={[styles.actionButton, styles.homeButton]} 
        onPress={onGoToHome}
        activeOpacity={0.8}
      >
        <HomeFilledIcon size={iconSize.small} color="#FFFFFF" />
      </TouchableOpacity>

      {/* Refresh Button - Top Right */}
      <TouchableOpacity 
        style={[styles.actionButton, styles.refreshButton]} 
        onPress={onAppReload}
        activeOpacity={0.8}
      >
        <RefreshIcon size={iconSize.small} color="#000000" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 60, // Below status bar
    left: 0,
    right: 0,
    height: 60,
    zIndex: 10000,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    pointerEvents: 'box-none', // Allow touches to pass through to buttons
  },
  actionButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  homeButton: {
    backgroundColor: '#FF6B35', // Orange color
  },
  refreshButton: {
    backgroundColor: '#FFFFFF', // White color
  },
});

export default DevMenuTopActions;
