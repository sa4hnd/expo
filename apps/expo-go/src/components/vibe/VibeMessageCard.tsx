import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '../Icons';
import { format } from 'date-fns';

interface UserMessageProps {
  content: string;
}

const UserMessage: React.FC<UserMessageProps> = ({ content }) => {
  return (
    <View style={styles.userMessageContainer}>
      <View style={styles.userMessageBubble}>
        <Text style={styles.userMessageText}>{content}</Text>
      </View>
    </View>
  );
};

interface FragmentCardProps {
  fragment: any;
  isActiveFragment: boolean;
  onFragmentClick: (fragment: any) => void;
}

const FragmentCard: React.FC<FragmentCardProps> = ({
  fragment,
  isActiveFragment,
  onFragmentClick,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.fragmentCard,
        isActiveFragment && styles.fragmentCardActive,
      ]}
      onPress={() => onFragmentClick(fragment)}
    >
      <Ionicons name="code-slash" size={16} color="#666666" />
      <View style={styles.fragmentContent}>
        <Text style={styles.fragmentTitle}>{fragment.title}</Text>
        <Text style={styles.fragmentSubtitle}>Preview</Text>
      </View>
      <Ionicons name="chevron-forward" size={16} color="#666666" />
    </TouchableOpacity>
  );
};

interface AssistantMessageProps {
  content: string;
  fragment: any;
  createdAt: Date;
  isActiveFragment: boolean;
  onFragmentClick: (fragment: any) => void;
  type: string;
  isFirstInGroup: boolean;
}

const AssistantMessage: React.FC<AssistantMessageProps> = ({
  content,
  fragment,
  createdAt,
  isActiveFragment,
  onFragmentClick,
  type,
  isFirstInGroup,
}) => {
  const [showTypewriter, setShowTypewriter] = useState(true);
  const [hasAnimated, setHasAnimated] = useState(false);

  // Track if this message has been animated before
  useEffect(() => {
    const messageKey = `animated_${content}_${createdAt.getTime()}`;
    const wasAnimated = false; // In mobile, we'll always show typewriter for now
    
    if (wasAnimated) {
      setShowTypewriter(false);
      setHasAnimated(true);
    } else {
      setShowTypewriter(true);
      setHasAnimated(false);
    }
  }, [content, createdAt]);

  const isFileOperation = content.startsWith("Reading files:") || 
                         content.startsWith("Editing:") || 
                         content.startsWith("Edited:") || 
                         content.startsWith("Read:");

  // Extract just the filename from the content
  const getFilename = () => {
    const parts = content.split(": ");
    if (parts.length > 1) {
      const path = parts[1];
      const cleanPath = path.replace(/\s*\(.*?\)\s*/g, '').trim();
      const filename = cleanPath.split(' ')[0];
      return filename;
    }
    return "file";
  };

  return (
    <View style={[
      styles.assistantMessageContainer,
      type === "ERROR" && styles.errorMessage,
    ]}>
      {/* Only show Vibe header for first message in group */}
      {isFirstInGroup && (
        <View style={styles.assistantHeader}>
          <View style={styles.vibeLogo}>
            <Text style={styles.vibeLogoText}>V</Text>
          </View>
          <Text style={styles.assistantName}>Vibe</Text>
          <Text style={styles.messageTime}>
            {format(createdAt, "HH:mm 'on' dd/MM/yyyy")}
          </Text>
        </View>
      )}

      <View style={styles.assistantContent}>
        {/* Check if this is a file operation message */}
        {isFileOperation ? (
          <View style={styles.fileOperationCard}>
            <Ionicons 
              name={content.startsWith("Read:") || content.startsWith("Reading files:") ? "eye" : "create"} 
              size={14} 
              color="#666666" 
            />
            <Text style={styles.fileOperationText}>
              {getFilename()}
            </Text>
          </View>
        ) : (
          <View style={styles.messageTextContainer}>
            <Text style={styles.assistantMessageText}>{content}</Text>
          </View>
        )}

        {fragment && type === "RESULT" && (
          <FragmentCard 
            fragment={fragment}
            isActiveFragment={isActiveFragment}
            onFragmentClick={onFragmentClick}
          />
        )}
      </View>
    </View>
  );
};

interface VibeMessageCardProps {
  content: string;
  role: 'USER' | 'ASSISTANT';
  fragment: any;
  createdAt: Date;
  isActiveFragment: boolean;
  onFragmentClick: (fragment: any) => void;
  type: string;
  isFirstInGroup: boolean;
}

export const VibeMessageCard: React.FC<VibeMessageCardProps> = ({
  content,
  role,
  fragment,
  createdAt,
  isActiveFragment,
  onFragmentClick,
  type,
  isFirstInGroup,
}) => {
  if (role === 'ASSISTANT') {
    return (
      <AssistantMessage
        content={content}
        fragment={fragment}
        createdAt={createdAt}
        isActiveFragment={isActiveFragment}
        onFragmentClick={onFragmentClick}
        type={type}
        isFirstInGroup={isFirstInGroup}
      />
    );
  }

  return <UserMessage content={content} />;
};

const styles = StyleSheet.create({
  userMessageContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 16,
    paddingLeft: 40,
  },
  userMessageBubble: {
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    maxWidth: '80%',
  },
  userMessageText: {
    color: '#FFFFFF',
    fontSize: 16,
    lineHeight: 22,
  },
  assistantMessageContainer: {
    marginBottom: 16,
  },
  assistantHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    paddingLeft: 8,
  },
  vibeLogo: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#FF6B35',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  vibeLogoText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  assistantName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    marginRight: 8,
  },
  messageTime: {
    fontSize: 12,
    color: '#666666',
  },
  assistantContent: {
    paddingLeft: 26,
  },
  messageTextContainer: {
    marginBottom: 8,
  },
  assistantMessageText: {
    color: '#FFFFFF',
    fontSize: 16,
    lineHeight: 22,
  },
  fileOperationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A1A1A',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#333333',
    marginBottom: 8,
    alignSelf: 'flex-start',
  },
  fileOperationText: {
    color: '#CCCCCC',
    fontSize: 12,
    marginLeft: 6,
  },
  fragmentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A1A1A',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#333333',
    alignSelf: 'flex-start',
  },
  fragmentCardActive: {
    backgroundColor: '#FF6B35',
    borderColor: '#FF6B35',
  },
  fragmentContent: {
    flex: 1,
    marginLeft: 8,
  },
  fragmentTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 2,
  },
  fragmentSubtitle: {
    color: '#CCCCCC',
    fontSize: 12,
  },
  errorMessage: {
    // Error styling if needed
  },
});

export default VibeMessageCard;
