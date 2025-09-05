import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '../Icons';
import { useVibeAuth } from '../../contexts/VibeAuthContext';
import { VibeAuthModal } from './VibeAuthModal';
import { VibeProfileModal } from './VibeProfileModal';

interface VibeHeaderProps {
  onProfilePress: () => void;
  onPlusPress: () => void;
}

export const VibeHeader: React.FC<VibeHeaderProps> = ({ onProfilePress, onPlusPress }) => {
  const { isAuthenticated, user, signOut } = useVibeAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');

  const handleProfilePress = () => {
    if (isAuthenticated) {
      // If authenticated, show profile modal
      setShowProfileModal(true);
    } else {
      // If not authenticated, show auth modal
      setAuthMode('signin');
      setShowAuthModal(true);
    }
  };

  return (
    <>
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
            <TouchableOpacity style={styles.actionButton} onPress={handleProfilePress}>
              {isAuthenticated && user ? (
                <Text style={styles.userInitial}>
                  {user.firstName?.charAt(0) || user.emailAddresses[0]?.emailAddress?.charAt(0) || 'U'}
                </Text>
              ) : (
                <Ionicons name="person" size={20} color="#FFFFFF" />
              )}
            </TouchableOpacity>
            
            {isAuthenticated && (
              <TouchableOpacity style={styles.actionButton} onPress={onPlusPress}>
                <Ionicons name="add" size={20} color="#FFFFFF" />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>

      {/* Auth Modal */}
      <VibeAuthModal
        visible={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialMode={authMode}
      />

      {/* Profile Modal */}
      <VibeProfileModal
        visible={showProfileModal}
        onClose={() => setShowProfileModal(false)}
      />
    </>
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
  userInitial: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default VibeHeader;
