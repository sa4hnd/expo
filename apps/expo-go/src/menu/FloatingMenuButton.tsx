import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  PanResponder,
  Animated,
  Platform,
} from 'react-native';
import * as DevMenu from './DevMenuModule';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface FloatingMenuButtonProps {
  visible?: boolean;
}

export const FloatingMenuButton: React.FC<FloatingMenuButtonProps> = ({ 
  visible = false 
}) => {
  console.log('FloatingMenuButton render: visible =', visible);
  
  const [buttonWidth, setButtonWidth] = useState(60);
  const [buttonHeight, setButtonHeight] = useState(40);
  const [isDocked, setIsDocked] = useState(false);
  
  const translateX = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(screenHeight / 2 - 40)).current;
  const scale = useRef(new Animated.Value(1)).current;
  const opacity = useRef(new Animated.Value(visible ? 1 : 0)).current;

  useEffect(() => {
    // Force visible for testing
    opacity.setValue(1);
  }, [visible]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        setIsDocked(false);
        Animated.spring(scale, {
          toValue: 1.1,
          useNativeDriver: true,
        }).start();
        setButtonWidth(60);
        setButtonHeight(40);
      },
      onPanResponderMove: (_, gestureState) => {
        translateX.setValue(gestureState.dx);
        translateY.setValue(gestureState.dy);
      },
      onPanResponderRelease: (_, gestureState) => {
        Animated.spring(scale, {
          toValue: 1,
          useNativeDriver: true,
        }).start();

        let finalX = gestureState.dx;
        let finalY = gestureState.dy;
        
        // Dock to edges if close enough
        if (gestureState.moveX < 50) {
          finalX = -screenWidth / 2 + 30;
          setButtonWidth(20);
          setButtonHeight(80);
          setIsDocked(true);
        } else if (gestureState.moveX > screenWidth - 50) {
          finalX = screenWidth / 2 - 30;
          setButtonWidth(20);
          setButtonHeight(80);
          setIsDocked(true);
        } else {
          setIsDocked(false);
        }

        Animated.parallel([
          Animated.spring(translateX, {
            toValue: finalX,
            useNativeDriver: true,
          }),
          Animated.spring(translateY, {
            toValue: finalY,
            useNativeDriver: true,
          }),
        ]).start();
      },
    })
  ).current;

  const handlePress = async () => {
    try {
      await DevMenu.openAsync();
    } catch (error) {
      console.error('Failed to open dev menu:', error);
    }
  };

  if (false) { // Always show for testing
    return null;
  }

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [
            { translateX },
            { translateY },
            { scale },
          ],
          opacity,
        },
      ]}
      pointerEvents='auto'
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
          <Text style={styles.text}>MENU</Text>
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
    left: screenWidth / 2 - 30,
    top: screenHeight / 2 - 20,
    zIndex: 999,
    backgroundColor: 'rgba(255,0,0,0.3)', // Debug background
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
    fontSize: 12,
    textAlign: 'center',
  },
  dockedLine: {
    width: 2,
    height: 40,
    backgroundColor: '#FFFFFF',
    borderRadius: 1,
  },
});

export default FloatingMenuButton;