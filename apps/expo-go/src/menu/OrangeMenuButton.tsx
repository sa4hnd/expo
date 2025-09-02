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
  const [position, setPosition] = useState({ x: 20, y: 100 });
  const pan = useRef(new Animated.ValueXY({ x: position.x, y: position.y })).current;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dx) > 5 || Math.abs(gestureState.dy) > 5;
      },
      onPanResponderGrant: () => {
        pan.setOffset({
          x: pan.x._value,
          y: pan.y._value,
        });
      },
      onPanResponderMove: Animated.event(
        [null, { dx: pan.x, dy: pan.y }],
        { useNativeDriver: false }
      ),
      onPanResponderRelease: (_, gestureState) => {
        pan.flattenOffset();
        
        // Keep button within screen bounds
        const newX = Math.max(0, Math.min(screenWidth - 80, position.x + gestureState.dx));
        const newY = Math.max(50, Math.min(screenHeight - 100, position.y + gestureState.dy));
        
        setPosition({ x: newX, y: newY });
        pan.setValue({ x: newX, y: newY });
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
          transform: [{ translateX: pan.x }, { translateY: pan.y }],
        },
      ]}
      {...panResponder.panHandlers}
    >
      <TouchableOpacity style={styles.button} onPress={handlePress}>
        <Text style={styles.text}>MENU</Text>
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
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    minWidth: 60,
    alignItems: 'center',
  },
  text: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
});

export default OrangeMenuButton;


