import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Alert
} from 'react-native';
import { VibeMessageCard } from './VibeMessageCard';
import { VibeMessageForm } from './VibeMessageForm';
import { VibeMessageLoading } from './VibeMessageLoading';
import { trpc } from '../../config/trpc';
import * as Linking from 'expo-linking';

interface VibeChatScreenProps {
  projectId: string;
  onClose: () => void;
}

export const VibeChatScreen: React.FC<VibeChatScreenProps> = ({ projectId, onClose }) => {
  const scrollViewRef = useRef<ScrollView>(null);
  const [activeFragment, setActiveFragment] = useState<any>(null);
  const [lastProcessedMessageId, setLastProcessedMessageId] = useState<string | null>(null);

  // Fetch messages using tRPC (same as web app)
  const { data: messages, isLoading, error } = trpc.messages.getMany.useQuery(
    { projectId },
    {
      refetchInterval: 1000, // Fast refresh for real-time updates
      onSuccess: (data) => {
        console.log('✅ Messages loaded:', data?.length || 0);
      },
      onError: (err) => {
        console.log('❌ Failed to load messages:', err.message);
      },
    }
  );

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messages && messages.length > 0) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages?.length]);

  // Check for project completion and open expo URL
  useEffect(() => {
    if (!messages || messages.length === 0) return;

    const lastMessage = messages[messages.length - 1];
    
    // Check if this is a new assistant message that indicates project completion
    if (lastMessage.role === 'ASSISTANT' && 
        lastMessage.id !== lastProcessedMessageId &&
        lastMessage.fragment?.expoUrl) {
      
      // Check if the message indicates project completion
      const completionKeywords = [
        'project is ready',
        'app is complete',
        'finished building',
        'project created',
        'ready to run',
        'task_summary'
      ];
      
      const isProjectComplete = completionKeywords.some(keyword => 
        lastMessage.content.toLowerCase().includes(keyword)
      );
      
      if (isProjectComplete) {
        setLastProcessedMessageId(lastMessage.id);
        
        // Show alert and open expo URL
        Alert.alert(
          'Project Complete! 🎉',
          'Your mobile app is ready! Would you like to open it in Expo Go?',
          [
            {
              text: 'Not Now',
              style: 'cancel',
            },
            {
              text: 'Open App',
              onPress: () => {
                const expoUrl = lastMessage.fragment.expoUrl;
                console.log('🚀 Opening expo URL:', expoUrl);
                
                Linking.openURL(expoUrl).then(() => {
                  console.log('✅ Successfully opened expo URL');
                }).catch((error) => {
                  console.error('❌ Error opening expo URL:', error);
                  Alert.alert('Error', 'Could not open the app. Please try again.');
                });
              },
            },
          ]
        );
      }
    }
  }, [messages, lastProcessedMessageId]);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF6B35" />
          <Text style={styles.loadingText}>Loading chat...</Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>Failed to load chat</Text>
          <Text style={styles.errorSubtitle}>
            {error.message || 'Something went wrong'}
          </Text>
        </View>
      </View>
    );
  }

  const allMessages = messages || [];
  const lastMessage = allMessages[allMessages.length - 1];
  const isLastMessageUser = lastMessage?.role === 'USER';

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Messages Container */}
      <ScrollView 
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
        showsVerticalScrollIndicator={false}
      >
        {allMessages.map((message, index) => {
          // Check if this is the first assistant message after a user message
          const previousMessage = index > 0 ? allMessages[index - 1] : null;
          const isFirstInGroup = message.role === 'ASSISTANT' && 
                                (!previousMessage || previousMessage.role === 'USER');
          
          return (
            <VibeMessageCard
              key={message.id}
              content={message.content}
              role={message.role}
              fragment={message.fragment}
              createdAt={new Date(message.createdAt)}
              isActiveFragment={activeFragment?.id === message.fragment?.id}
              onFragmentClick={() => setActiveFragment(message.fragment)}
              type={message.type}
              isFirstInGroup={isFirstInGroup}
            />
          );
        })}

        {/* Show loading indicator if last message is from user */}
        {isLastMessageUser && <VibeMessageLoading />}
      </ScrollView>

      {/* Message Form */}
      <View style={styles.messageFormContainer}>
        <VibeMessageForm projectId={projectId} />
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    paddingTop: 16,
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  messageFormContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#333333',
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
    marginBottom: 8,
    textAlign: 'center',
  },
  errorSubtitle: {
    fontSize: 16,
    color: '#CCCCCC',
    textAlign: 'center',
    lineHeight: 24,
  },
});

export default VibeChatScreen;
