import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { VibeProjectCard } from './VibeProjectCard';
import { VibeAuthModal } from './VibeAuthModal';
import { useVibeAuth } from '../../contexts/VibeAuthContext';
import { trpc } from '../../config/trpc';
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

  // Fetch projects using tRPC (same approach as web app)
  const { 
    data: projects, 
    isLoading: projectsLoading, 
    error, 
    refetch 
  } = trpc.projects.getMany.useQuery(
    undefined,
    {
      enabled: isAuthenticated, // Only fetch when authenticated
      retry: 1, // Retry once on failure
      refetchOnWindowFocus: false, // Don't refetch on window focus
      onSuccess: (data) => {
        console.log('✅ Successfully fetched projects:', data?.length || 0);
        console.log('📊 Projects data:', JSON.stringify(data, null, 2));
      },
      onError: (err) => {
        console.log('❌ Failed to fetch projects:', err.message);
        console.log('❌ Error details:', err);
      },
    }
  );

  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refetch();
    } catch (error) {
      console.error('Error refreshing projects:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

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

  if (projectsLoading) {
    return (
      <View style={styles.container}>
        <Text style={styles.sectionTitle}>Your Projects</Text>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF6B35" />
          <Text style={styles.loadingText}>Loading your projects...</Text>
        </View>
      </View>
    );
  }

  // Show error state if there's an error
  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.sectionTitle}>Your Projects</Text>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={48} color="#FF6B35" />
          <Text style={styles.errorTitle}>Failed to load projects</Text>
          <Text style={styles.errorSubtitle}>
            {error.message || 'Something went wrong. Please try again.'}
          </Text>
          <TouchableOpacity 
            style={styles.signInButton}
            onPress={() => refetch()}
          >
            <Text style={styles.signInButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // Transform the API data to match our component interface
  console.log('🔍 Raw projects data:', projects);
  
  // Handle superjson response format - data is nested under 'json' property
  const projectsArray = projects?.json || projects;
  console.log('🔍 Projects array:', projectsArray);
  console.log('🔍 Is projects array?', Array.isArray(projectsArray));
  console.log('🔍 Projects length:', projectsArray?.length);
  
  const transformedProjects = (projectsArray && Array.isArray(projectsArray)) 
    ? projectsArray.map((project) => {
        // Use the real expo URL from the database fragment
        const expoUrl = project.expoUrl; // No fallback - only projects with real URLs are returned
        
        console.log(`📱 Project "${project.name}" expo URL:`, expoUrl);
        console.log(`📱 Project data:`, JSON.stringify(project, null, 2));
        
        return {
          id: project.id,
          name: project.name,
          icon: project.name.charAt(0).toUpperCase(),
          lastModified: new Date(project.updatedAt).toLocaleDateString(),
          expoUrl: expoUrl,
        };
      })
    : [];
    
  console.log('🔄 Transformed projects:', transformedProjects);

  // Show real projects if available, otherwise show empty state
  const allProjects = transformedProjects;

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Your Projects</Text>
      {allProjects.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="folder-open" size={48} color="#666666" />
          <Text style={styles.emptyTitle}>No projects yet</Text>
          <Text style={styles.emptySubtitle}>
            Create your first project to get started with Vibe
          </Text>
        </View>
      ) : (
        <ScrollView 
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              tintColor="#FF6B35"
              colors={["#FF6B35"]}
            />
          }
        >
          {allProjects.map((project) => (
            <VibeProjectCard
              key={project.id}
              project={project}
              onPress={() => {}} // Optional callback, not needed since we handle it in the card
            />
          ))}
        </ScrollView>
      )}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  loadingText: {
    color: '#CCCCCC',
    fontSize: 16,
    marginTop: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF6B35',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  errorSubtitle: {
    fontSize: 16,
    color: '#CCCCCC',
    textAlign: 'center',
    lineHeight: 24,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#CCCCCC',
    textAlign: 'center',
    lineHeight: 24,
  },
});

export default VibeProjectsList;
