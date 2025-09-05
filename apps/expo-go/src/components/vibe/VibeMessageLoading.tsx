import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ShimmerMessages = () => {
  const messages = [
    "Thinking...",
    "Loading...",
    "Generating...",
    "Analyzing your request...",
    "Building your app...",
    "Crafting components...",
    "Optimizing layout...",
    "Adding final touches...",
    "Almost ready...",
  ];

  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessageIndex((prev) => (prev + 1) % messages.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [messages.length]);

  return (
    <View style={styles.shimmerContainer}>
      <Text style={styles.shimmerText}>
        {messages[currentMessageIndex]}
      </Text>
    </View>
  );
};

export const VibeMessageLoading: React.FC = () => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.vibeLogo}>
          <Text style={styles.vibeLogoText}>V</Text>
        </View>
        <Text style={styles.assistantName}>Vibe</Text>
      </View>
      <View style={styles.content}>
        <ShimmerMessages />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    paddingLeft: 8,
  },
  vibeLogo: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#FF6B35',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  vibeLogoText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  assistantName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  content: {
    paddingLeft: 26,
  },
  shimmerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  shimmerText: {
    fontSize: 16,
    color: '#CCCCCC',
    opacity: 0.7,
  },
});

export default VibeMessageLoading;
