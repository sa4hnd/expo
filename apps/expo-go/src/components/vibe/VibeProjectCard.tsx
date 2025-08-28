import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Linking } from 'react-native';
import { Ionicons } from '../Icons';

interface VibeProjectCardProps {
  project: {
    id: string;
    name: string;
    icon: string;
    lastModified: string;
    expoUrl: string;
  };
  onPress: (expoUrl: string) => void;
}

export const VibeProjectCard: React.FC<VibeProjectCardProps> = ({ project, onPress }) => {
  const handlePress = () => {
    console.log('Project clicked:', project.name);
    console.log('Opening URL:', project.expoUrl);
    
    // Use React Native's Linking to open the expo:// URL
    Linking.openURL(project.expoUrl).then(() => {
      console.log('URL opened successfully');
    }).catch((error) => {
      console.error('Error opening URL:', error);
    });
    
    // Also call the onPress callback if provided
    if (onPress) {
      onPress(project.expoUrl);
    }
  };

  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={handlePress}
    >
      {/* Left side - Icon */}
      <View style={styles.iconContainer}>
        <Text style={styles.iconText}>{project.icon}</Text>
      </View>

      {/* Center - Project info */}
      <View style={styles.projectInfo}>
        <Text style={styles.projectName}>{project.name}</Text>
        <Text style={styles.lastModified}>{project.lastModified}</Text>
      </View>

      {/* Right side - Status icon */}
      <View style={styles.statusIcon}>
        <Ionicons name="ellipsis-vertical" size={20} color="#666666" />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    backgroundColor: '#4CAF50', // Green color
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  iconText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  projectInfo: {
    flex: 1,
  },
  projectName: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  lastModified: {
    color: '#999999',
    fontSize: 14,
  },
  statusIcon: {
    padding: 8,
  },
});

export default VibeProjectCard;
