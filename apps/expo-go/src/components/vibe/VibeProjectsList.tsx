import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { VibeProjectCard } from './VibeProjectCard';
import { VibeAuthModal } from './VibeAuthModal';
import { useVibeAuth } from '../../contexts/VibeAuthContext';
import { Ionicons } from '../Icons';
import * as Linking from 'expo-linking';

interface Project {
  id: string;
  name: string;
  icon: string;
  lastModified: string;
  expoUrl: string;
}

const mockProjects: Project[] = [
  {
    id: '1',
    name: 'ChatGPT Clone',
    icon: 'C',
    lastModified: '2 days ago',
    expoUrl: 'exp://tldd55-8000.csb.app'
  },
  {
    id: '2',
    name: 'Note Taking App',
    icon: 'N',
    lastModified: '1 week ago',
    expoUrl: 'exp://tldd55-8000.csb.app'
  },
  {
    id: '3',
    name: 'AI Chat App',
    icon: 'A',
    lastModified: '3 days ago',
    expoUrl: 'exp://tldd55-8000.csb.app'
  },
  {
    id: '4',
    name: 'Airbnb UI Clone',
    icon: 'A',
    lastModified: '5 days ago',
    expoUrl: 'exp://tldd55-8000.csb.app'
  },
  {
    id: '5',
    name: 'Wordle Clone',
    icon: 'W',
    lastModified: '1 day ago',
    expoUrl: 'exp://tldd55-8000.csb.app'
  }
];

export const VibeProjectsList: React.FC = () => {
  const { isAuthenticated, isLoading } = useVibeAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text style={styles.sectionTitle}>Loading...</Text>
      </View>
    );
  }

  if (!isAuthenticated) {
    return (
      <>
        <View style={styles.container}>
          <Text style={styles.sectionTitle}>Your Projects</Text>
          <View style={styles.signInPrompt}>
            <Ionicons name="lock-closed" size={48} color="#666666" />
            <Text style={styles.signInTitle}>Sign in to view your projects</Text>
            <Text style={styles.signInSubtitle}>
              Access your Vibe projects and continue building amazing apps
            </Text>
            <TouchableOpacity 
              style={styles.signInButton}
              onPress={() => {
                setAuthMode('signin');
                setShowAuthModal(true);
              }}
            >
              <Text style={styles.signInButtonText}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <VibeAuthModal
          visible={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          initialMode={authMode}
        />
      </>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Your Projects</Text>
      <ScrollView showsVerticalScrollIndicator={false}>
        {mockProjects.map((project) => (
          <VibeProjectCard
            key={project.id}
            project={project}
            onPress={() => {}} // Optional callback, not needed since we handle it in the card
          />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    paddingTop: 16,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  signInPrompt: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  signInTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 20,
    marginBottom: 12,
    textAlign: 'center',
  },
  signInSubtitle: {
    fontSize: 16,
    color: '#CCCCCC',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
  },
  signInButton: {
    backgroundColor: '#FF6B35',
    paddingHorizontal: 40,
    paddingVertical: 16,
    borderRadius: 12,
  },
  signInButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default VibeProjectsList;
