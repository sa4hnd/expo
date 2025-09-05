import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView,
  KeyboardAvoidingView,
  Platform 
} from 'react-native';
import { Ionicons } from '../Icons';
import { VIBE_CONFIG } from '../../config/vibe';

interface VibePromptScreenProps {
  onSubmit: (prompt: string) => void;
  onClose?: () => void;
}

export const VibePromptScreen: React.FC<VibePromptScreenProps> = ({ onSubmit }) => {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!prompt.trim()) return;
    
    setIsLoading(true);
    // Simulate API call delay
    setTimeout(() => {
      onSubmit(prompt.trim());
      setIsLoading(false);
    }, 500);
  };

  const handleSuggestionPress = (suggestion: string) => {
    setPrompt(suggestion);
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Pro Tip */}
        <View style={styles.proTipContainer}>
          <Text style={styles.proTipText}>
            Pro Tip: Make your prompts short and specific
          </Text>
        </View>

        {/* Main Prompt Area */}
        <View style={styles.promptContainer}>
          <Text style={styles.promptLabel}>Describe your mobile app idea...</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              value={prompt}
              onChangeText={setPrompt}
              placeholder="e.g., A mobile todo app with dark mode, notifications, and offline support"
              placeholderTextColor="#666666"
              multiline
              textAlignVertical="top"
              maxLength={500}
            />
          </View>
        </View>

        {/* Suggested Prompts */}
        <View style={styles.suggestionsContainer}>
          <Text style={styles.suggestionsTitle}>Or try one of these mobile app templates:</Text>
          <View style={styles.suggestionsList}>
            {VIBE_CONFIG.EXPO_TEMPLATES.map((template, index) => (
              <TouchableOpacity
                key={index}
                style={styles.suggestionItem}
                onPress={() => handleSuggestionPress(template.prompt)}
              >
                <Text style={styles.suggestionEmoji}>{template.emoji}</Text>
                <Text style={styles.suggestionText}>{template.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Bottom Action Bar */}
      <View style={styles.bottomBar}>
        <View style={styles.bottomActions}>
          {/* Image Upload Button */}
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="image-outline" size={24} color="#666666" />
          </TouchableOpacity>

          {/* Build Button */}
          <TouchableOpacity 
            style={[styles.buildButton, (!prompt.trim() || isLoading) && styles.buildButtonDisabled]}
            onPress={handleSubmit}
            disabled={!prompt.trim() || isLoading}
          >
            <View style={styles.buildButtonContent}>
              <Ionicons name="build-outline" size={20} color="#FFFFFF" />
              <Text style={styles.buildButtonText}>
                {isLoading ? 'Building...' : 'Build'}
              </Text>
            </View>
            <Text style={styles.buildButtonSubtext}>expo-mobile</Text>
          </TouchableOpacity>

          {/* Voice Input Button */}
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="mic-outline" size={24} color="#666666" />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
  },
  proTipContainer: {
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    padding: 16,
    marginTop: 20,
    marginBottom: 30,
  },
  proTipText: {
    fontSize: 14,
    color: '#CCCCCC',
    textAlign: 'center',
    lineHeight: 20,
  },
  promptContainer: {
    flex: 1,
    marginBottom: 30,
  },
  promptLabel: {
    fontSize: 24,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 20,
  },
  inputContainer: {
    flex: 1,
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#333333',
    padding: 16,
    minHeight: 120,
  },
  textInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 16,
    lineHeight: 24,
    padding: 0,
  },
  suggestionsContainer: {
    marginBottom: 20,
  },
  suggestionsTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#CCCCCC',
    marginBottom: 16,
  },
  suggestionsList: {
    gap: 12,
  },
  suggestionItem: {
    backgroundColor: '#1A1A1A',
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: '#333333',
    flexDirection: 'row',
    alignItems: 'center',
  },
  suggestionEmoji: {
    fontSize: 20,
    marginRight: 12,
  },
  suggestionText: {
    fontSize: 16,
    color: '#FFFFFF',
    flex: 1,
  },
  bottomBar: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#333333',
  },
  bottomActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  actionButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#1A1A1A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buildButton: {
    backgroundColor: '#FF6B35',
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 12,
    alignItems: 'center',
    minWidth: 120,
  },
  buildButtonDisabled: {
    backgroundColor: '#333333',
  },
  buildButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  buildButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  buildButtonSubtext: {
    color: '#CCCCCC',
    fontSize: 12,
    marginTop: 4,
  },
});

export default VibePromptScreen;
