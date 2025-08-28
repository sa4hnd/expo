import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { VibeProjectCard } from './VibeProjectCard';
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
});

export default VibeProjectsList;
