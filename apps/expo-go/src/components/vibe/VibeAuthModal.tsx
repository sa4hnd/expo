import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Alert, TextInput, ScrollView } from 'react-native';
import { useAuth, useSignIn, useSignUp, useSSO } from '@clerk/clerk-expo';
import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';
import { Ionicons } from '../Icons';

interface VibeAuthModalProps {
  visible: boolean;
  onClose: () => void;
  initialMode?: 'signin' | 'signup';
}

// Handle any pending authentication sessions
WebBrowser.maybeCompleteAuthSession();

// Browser warm-up hook for better UX
const useWarmUpBrowser = () => {
  useEffect(() => {
    // Preloads the browser for Android devices to reduce authentication load time
    void WebBrowser.warmUpAsync();
    return () => {
      // Cleanup: closes browser when component unmounts
      void WebBrowser.coolDownAsync();
    };
  }, []);
};

export const VibeAuthModal: React.FC<VibeAuthModalProps> = ({ visible, onClose, initialMode = 'signin' }) => {
  useWarmUpBrowser();
  
  // const { isSignedIn } = useAuth(); // Not used in this component
  const { signIn, setActive: setSignInActive, isLoaded: signInLoaded } = useSignIn();
  const { signUp, setActive: setSignUpActive, isLoaded: signUpLoaded } = useSignUp();
  const { startSSOFlow } = useSSO();
  
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode || 'signin');
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [pendingVerification, setPendingVerification] = useState(false);

  const isLoaded = mode === 'signin' ? signInLoaded : signUpLoaded;

  const handleEmailPasswordAuth = async () => {
    if (!isLoaded) return;

    try {
      setIsLoading(true);

      if (mode === 'signin') {
        // Sign in flow
        const signInAttempt = await signIn.create({
          identifier: email,
          password: password,
        });

        if (signInAttempt.status === 'complete') {
          await setSignInActive({ session: signInAttempt.createdSessionId });
          onClose();
        } else {
          Alert.alert('Sign In Error', 'Sign in failed. Please check your credentials.');
        }
      } else {
        // Sign up flow
        await signUp.create({
          emailAddress: email,
          password: password,
        });

        // Send verification email
        await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
        setPendingVerification(true);
      }
    } catch (error: any) {
      console.error('Auth error:', error);
      Alert.alert('Authentication Error', error.errors?.[0]?.message || 'Authentication failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailVerification = async () => {
    if (!isLoaded) return;

    try {
      setIsLoading(true);
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code,
      });

      if (signUpAttempt.status === 'complete') {
        await setSignUpActive({ session: signUpAttempt.createdSessionId });
        onClose();
      } else {
        Alert.alert('Verification Error', 'Email verification failed. Please check your code.');
      }
    } catch (error: any) {
      console.error('Verification error:', error);
      Alert.alert('Verification Error', error.errors?.[0]?.message || 'Verification failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuthSignIn = useCallback(async (strategy: 'oauth_google' | 'oauth_github' | 'oauth_apple') => {
    try {
      setIsLoading(true);
      
      // Start the authentication process using useSSO hook
      const { createdSessionId, setActive, signIn: ssoSignIn, signUp: ssoSignUp } = await startSSOFlow({
        strategy,
        // For web, defaults to current path
        // For native, you must pass a scheme, like AuthSession.makeRedirectUri({ scheme, path })
        redirectUrl: AuthSession.makeRedirectUri(),
      });

      // If sign in was successful, set the active session
      if (createdSessionId) {
        setActive!({
          session: createdSessionId,
          navigate: async ({ session }) => {
            if (session?.currentTask) {
              // Check for tasks and navigate to custom UI to help users resolve them
              console.log(session?.currentTask);
              return;
            }
            onClose();
          },
        });
      } else {
        // If there is no `createdSessionId`,
        // there are missing requirements, such as MFA
        // Use the `signIn` or `signUp` returned from `startSSOFlow`
        // to handle next steps
        if (ssoSignIn) {
          console.log('SSO Sign In status:', ssoSignIn.status);
        }
        if (ssoSignUp) {
          console.log('SSO Sign Up status:', ssoSignUp.status);
        }
      }
    } catch (error: any) {
      console.error('OAuth error:', error);
      Alert.alert('OAuth Error', error.errors?.[0]?.message || 'OAuth authentication failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [startSSOFlow, onClose]);

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setCode('');
    setPendingVerification(false);
  };

  const handleClose = () => {
    resetForm();
    setMode(initialMode || 'signin'); // Reset to initial mode
    onClose();
  };

  // Reset form when modal opens
  React.useEffect(() => {
    if (visible) {
      resetForm();
      setMode(initialMode || 'signin');
    }
  }, [visible, initialMode]);

  if (pendingVerification) {
    return (
      <Modal visible={visible} transparent animationType="slide" onRequestClose={handleClose}>
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <View style={styles.header}>
              <Text style={styles.title}>Verify Your Email</Text>
              <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
                <Ionicons name="close" size={24} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            <View style={styles.content}>
              <Text style={styles.subtitle}>
                We sent a verification code to {email}
              </Text>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Verification Code</Text>
                <TextInput
                  style={styles.input}
                  value={code}
                  onChangeText={setCode}
                  placeholder="Enter verification code"
                  placeholderTextColor="#666666"
                  keyboardType="number-pad"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>

              <TouchableOpacity 
                style={[styles.primaryButton, isLoading && styles.primaryButtonDisabled]} 
                onPress={handleEmailVerification}
                disabled={isLoading || !code}
              >
                <Text style={styles.primaryButtonText}>
                  {isLoading ? 'Verifying...' : 'Verify Email'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => setPendingVerification(false)} style={styles.linkButton}>
                <Text style={styles.linkButtonText}>Back to {mode === 'signin' ? 'Sign In' : 'Sign Up'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  }

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={handleClose}>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <View style={styles.header}>
            <Text style={styles.title}>
              {mode === 'signin' ? 'Sign In to Vibe' : 'Sign Up for Vibe'}
            </Text>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            <View style={styles.logoSection}>
              <View style={styles.orangeSquare} />
              <Text style={styles.brandTitle}>vibecoder</Text>
            </View>

            <Text style={styles.subtitle}>
              {mode === 'signin' 
                ? 'Welcome back! Sign in to access your projects'
                : 'Create your account to start building amazing apps'
              }
            </Text>

            {/* OAuth Buttons */}
            <View style={styles.oauthSection}>
              <TouchableOpacity 
                style={[styles.oauthButton, isLoading && styles.oauthButtonDisabled]} 
                onPress={() => handleOAuthSignIn('oauth_google')}
                disabled={isLoading}
              >
                <Ionicons name="logo-google" size={20} color="#FFFFFF" />
                <Text style={styles.oauthButtonText}>
                  Continue with Google
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Email/Password Form */}
            <View style={styles.formSection}>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Email</Text>
                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Enter your email"
                  placeholderTextColor="#666666"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Password</Text>
                <TextInput
                  style={styles.input}
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Enter your password"
                  placeholderTextColor="#666666"
                  secureTextEntry
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>

              <TouchableOpacity 
                style={[styles.primaryButton, isLoading && styles.primaryButtonDisabled]} 
                onPress={handleEmailPasswordAuth}
                disabled={isLoading || !email || !password}
              >
                <Text style={styles.primaryButtonText}>
                  {isLoading ? 'Processing...' : (mode === 'signin' ? 'Sign In' : 'Sign Up')}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.footer}>
              <Text style={styles.footerText}>
                {mode === 'signin' ? "Don't have an account? " : "Already have an account? "}
              </Text>
              <TouchableOpacity onPress={() => {
                resetForm();
                setMode(mode === 'signin' ? 'signup' : 'signin');
              }}>
                <Text style={styles.footerLink}>
                  {mode === 'signin' ? 'Sign Up' : 'Sign In'}
                </Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.termsText}>
              By continuing, you agree to our Terms of Service and Privacy Policy
            </Text>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: '#1A1A1A',
    borderRadius: 16,
    width: '90%',
    maxWidth: 400,
    maxHeight: '90%',
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
    padding: 20,
  },
  logoSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 12,
  },
  orangeSquare: {
    width: 40,
    height: 40,
    backgroundColor: '#FF6B35',
    borderRadius: 8,
  },
  brandTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  subtitle: {
    fontSize: 16,
    color: '#CCCCCC',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
  },
  oauthSection: {
    marginBottom: 20,
  },
  oauthButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#333333',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 12,
    gap: 12,
  },
  oauthButtonDisabled: {
    backgroundColor: '#666666',
  },
  oauthButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#333333',
  },
  dividerText: {
    color: '#666666',
    fontSize: 14,
    marginHorizontal: 16,
  },
  formSection: {
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    color: '#FFFFFF',
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#333333',
    borderWidth: 1,
    borderColor: '#555555',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#FFFFFF',
  },
  primaryButton: {
    backgroundColor: '#FF6B35',
    paddingHorizontal: 40,
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 8,
  },
  primaryButtonDisabled: {
    backgroundColor: '#666666',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  linkButton: {
    marginTop: 16,
  },
  linkButtonText: {
    color: '#FF6B35',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  footerText: {
    fontSize: 14,
    color: '#CCCCCC',
  },
  footerLink: {
    fontSize: 14,
    color: '#FF6B35',
    fontWeight: '500',
  },
  termsText: {
    fontSize: 12,
    color: '#888888',
    textAlign: 'center',
    lineHeight: 18,
  },
});
