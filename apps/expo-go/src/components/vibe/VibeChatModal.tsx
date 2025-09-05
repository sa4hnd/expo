import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { VibePromptScreen } from './VibePromptScreen';
import { VibeChatScreen } from './VibeChatScreen';
import { Ionicons } from '../Icons';
import { trpc } from '../../config/trpc';
import { useQueryClient } from '@tanstack/react-query';

interface VibeChatModalProps {
  visible: boolean;
  onClose: () => void;
}

type ChatStep = 'prompt' | 'chat';

export const VibeChatModal: React.FC<VibeChatModalProps> = ({ visible, onClose }) => {
  const [currentStep, setCurrentStep] = useState<ChatStep>('prompt');
  const [prompt, setPrompt] = useState('');
  const [projectId, setProjectId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  // Create project mutation
  const createProject = trpc.projects.create.useMutation({
    onSuccess: (data) => {
      setProjectId(data.id);
      setCurrentStep('chat');
      
      // Invalidate projects query to refresh the project list
      queryClient.invalidateQueries({
        queryKey: ['projects', 'getMany']
      });
      
      console.log('✅ Project created and project list will refresh');
    },
    onError: (error) => {
      console.error('Failed to create project:', error.message);
    },
  });

  const handlePromptSubmit = async (userPrompt: string) => {
    setPrompt(userPrompt);
    
    // Create project with the prompt
    try {
      await createProject.mutateAsync({
        value: userPrompt,
        framework: 'expo',
      });
    } catch (error) {
      console.error('Error creating project:', error);
    }
  };

  const handleClose = () => {
    setCurrentStep('prompt');
    setPrompt('');
    setProjectId(null);
    onClose();
  };

  const renderContent = () => {
    switch (currentStep) {
      case 'prompt':
        return (
          <VibePromptScreen
            onSubmit={handlePromptSubmit}
            onClose={handleClose}
          />
        );
      case 'chat':
        return projectId ? (
          <VibeChatScreen
            projectId={projectId}
            onClose={handleClose}
          />
        ) : (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Creating project...</Text>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>
              {currentStep === 'prompt' ? 'Create New App' : 'Building Your App'}
            </Text>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {/* Content */}
          <View style={styles.content}>
            {renderContent()}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'flex-end',
  },
  modal: {
    backgroundColor: '#1A1A1A',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
    minHeight: '70%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#333333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  loadingText: {
    color: '#CCCCCC',
    fontSize: 16,
    marginTop: 16,
  },
});

export default VibeChatModal;