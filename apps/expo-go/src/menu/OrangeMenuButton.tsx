import React, { useState, useRef } from 'react';
import { 
  View,
  Text, 
  TouchableOpacity, 
  StyleSheet,
  Dimensions,
  PanResponder,
  Animated
} from 'react-native';
import * as DevMenu from './DevMenuModule';

interface OrangeMenuButtonProps {
  onPress?: () => void;
}

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export const OrangeMenuButton: React.FC<OrangeMenuButtonProps> = ({ onPress }) => {
  
  // Simple position tracking
  const translateX = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(screenHeight / 2 - 40)).current;
  const scale = useRef(new Animated.Value(1)).current;
  
  // Button dimensions
  const [buttonWidth, setButtonWidth] = useState(20);
  const [buttonHeight, setButtonHeight] = useState(80);
  const [isDocked, setIsDocked] = useState(true);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        setIsDocked(false);
        // Scale up when dragging
        Animated.spring(scale, {
          toValue: 1.1,
          useNativeDriver: true,
        }).start();
        // Make button normal size when dragging
        setButtonWidth(60);
        setButtonHeight(40);
      },
      onPanResponderMove: (_, gestureState) => {
        // Just follow the finger exactly
        translateX.setValue(gestureState.moveX - 30); // 30 is half button width
        translateY.setValue(gestureState.moveY - 20); // 20 is half button height
      },
      onPanResponderRelease: (_, gestureState) => {
        
        // Scale back down
        Animated.spring(scale, {
          toValue: 1,
          useNativeDriver: true,
        }).start();
        
        // Check if near edges and dock
        const finalX = gestureState.moveX - 30;
        const finalY = gestureState.moveY - 20;
        
        let targetX = finalX;
        let targetY = finalY;
        let newWidth = 60;
        let newHeight = 40;
        
        // Dock to edges if close enough
        if (finalX < 50) {
          targetX = 0;
          newWidth = 20;
          newHeight = 80;
          setIsDocked(true);
        } else if (finalX > screenWidth - 50) {
          targetX = screenWidth - 20;
          newWidth = 20;
          newHeight = 80;
          setIsDocked(true);
        } else if (finalY < 50) {
          targetY = 50;
          newWidth = 60;
          newHeight = 20;
          setIsDocked(true);
        } else if (finalY > screenHeight - 50) {
          targetY = screenHeight - 90;
          newWidth = 60;
          newHeight = 20;
          setIsDocked(true);
        } else {
          setIsDocked(false);
        }
        
        // Keep within bounds
        targetX = Math.max(0, Math.min(screenWidth - newWidth, targetX));
        targetY = Math.max(50, Math.min(screenHeight - newHeight, targetY));
        
        // Animate to final position
        Animated.parallel([
          Animated.spring(translateX, {
            toValue: targetX,
            useNativeDriver: true,
          }),
          Animated.spring(translateY, {
            toValue: targetY,
            useNativeDriver: true,
          }),
        ]).start();
        
        setButtonWidth(newWidth);
        setButtonHeight(newHeight);
      },
    })
  ).current;

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      // Default action: open dev menu
      DevMenu.openAsync();
    }
  };



  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [
            { translateX },
            { translateY },
            { scale }
          ],
        },
      ]}
      {...panResponder.panHandlers}
    >
      <TouchableOpacity 
        style={[
          styles.button,
          {
            width: buttonWidth,
            height: buttonHeight,
            borderRadius: isDocked && (buttonWidth < buttonHeight) ? 10 : 20,
          },
        ]}
        onPress={handlePress}
        activeOpacity={0.8}
      >
        {!isDocked || (buttonWidth >= buttonHeight) ? (
          <Text 
            style={[
              styles.text,
              {
                fontSize: 12,
              }
            ]}
          >
            MENU
          </Text>
        ) : (
          <View style={styles.dockedLine} />
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    zIndex: 9999,
  },
  button: {
    backgroundColor: '#FF6B35',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  dockedLine: {
    width: 2,
    height: 40,
    backgroundColor: '#FFFFFF',
    borderRadius: 1,
  },
});

export default OrangeMenuButton;


