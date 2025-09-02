import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '../Icons';

interface VibeHeaderProps {
  onProfilePress: () => void;
  onPlusPress: () => void;
}

export const VibeHeader: React.FC<VibeHeaderProps> = ({ onProfilePress, onPlusPress }) => {
  return (
    <View style={styles.container}>
      {/* Main Header */}
      <View style={styles.mainHeader}>
        {/* Left side - Logo and Title */}
        <View style={styles.logoSection}>
          <View style={styles.orangeSquare} />
          <Text style={styles.mainTitle}>vibecoder</Text>
        </View>

        {/* Right side - Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.actionButton} onPress={onProfilePress}>
            <Ionicons name="person" size={20} color="#FFFFFF" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton} onPress={onPlusPress}>
            <Ionicons name="add" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000000',
    paddingTop: 0,
    paddingHorizontal: 20,
    paddingBottom: 20,
    marginTop: 0,
    marginBottom: 0,
  },
  mainHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 20,
  },
  logoSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  orangeSquare: {
    width: 40, // Match image size
    height: 40,
    backgroundColor: '#FF6B35',
    borderRadius: 8,
  },
  mainTitle: {
    color: '#FFFFFF',
    fontSize: 28, // Match image size
    fontWeight: 'bold',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 16,
  },
  actionButton: {
    width: 44, // Match image size
    height: 44,
    backgroundColor: '#333333',
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default VibeHeader;
