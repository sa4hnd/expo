import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '../Icons';
import { trpc } from '../../config/trpc';

interface VibeMessageFormProps {
  projectId: string;
}

export const VibeMessageForm: React.FC<VibeMessageFormProps> = ({ projectId }) => {
  const [message, setMessage] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  // Get usage data (same as web app)
  const { data: usage } = trpc.usage.status.useQuery();

  // Create message mutation (same as web app)
  const createMessage = trpc.messages.create.useMutation({
    onSuccess: () => {
      setMessage('');
      console.log('✅ Message sent successfully');
    },
    onError: (error) => {
      console.error('❌ Failed to send message:', error.message);
    },
  });

  const handleSubmit = async () => {
    if (!message.trim() || createMessage.isPending) return;

    try {
      await createMessage.mutateAsync({
        value: message.trim(),
        projectId,
      });
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleKeyPress = (e: any) => {
    if (e.nativeEvent.key === 'Enter' && (e.nativeEvent.metaKey || e.nativeEvent.ctrlKey)) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const isButtonDisabled = createMessage.isPending || !message.trim();

  return (
    <View style={styles.container}>
      {/* Usage indicator (if available) */}
      {usage && (
        <View style={styles.usageContainer}>
          <Text style={styles.usageText}>
            {usage.remainingPoints} credits remaining
          </Text>
        </View>
      )}

      {/* Message form */}
      <View style={[
        styles.formContainer,
        isFocused && styles.formContainerFocused,
        usage && styles.formContainerWithUsage,
      ]}>
        <TextInput
          style={styles.textInput}
          value={message}
          onChangeText={setMessage}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onKeyPress={handleKeyPress}
          placeholder="What would you like to build?"
          placeholderTextColor="#666666"
          multiline
          maxLength={10000}
          editable={!createMessage.isPending}
        />
        
        <View style={styles.formFooter}>
          <Text style={styles.keyboardHint}>
            ⌘Enter to submit
          </Text>
          
          <TouchableOpacity
            style={[
              styles.submitButton,
              isButtonDisabled && styles.submitButtonDisabled,
            ]}
            onPress={handleSubmit}
            disabled={isButtonDisabled}
          >
            {createMessage.isPending ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Ionicons name="arrow-up" size={16} color="#FFFFFF" />
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000000',
  },
  usageContainer: {
    backgroundColor: '#1A1A1A',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
  },
  usageText: {
    color: '#CCCCCC',
    fontSize: 12,
    textAlign: 'center',
  },
  formContainer: {
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#333333',
  },
  formContainerFocused: {
    borderColor: '#FF6B35',
    shadowColor: '#FF6B35',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  formContainerWithUsage: {
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
  },
  textInput: {
    color: '#FFFFFF',
    fontSize: 16,
    lineHeight: 22,
    minHeight: 44,
    maxHeight: 120,
    paddingVertical: 8,
    paddingHorizontal: 0,
  },
  formFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  keyboardHint: {
    fontSize: 10,
    color: '#666666',
    fontFamily: 'monospace',
  },
  submitButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FF6B35',
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: '#333333',
  },
});

export default VibeMessageForm;
