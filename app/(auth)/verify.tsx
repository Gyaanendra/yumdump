import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useSignUp } from '@clerk/clerk-expo';
import { router, useLocalSearchParams } from 'expo-router';

export default function VerifyScreen() {
  const { email } = useLocalSearchParams();
  const [verificationCode, setVerificationCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { signUp, setActive } = useSignUp();

  const handleVerify = async () => {
    if (!verificationCode) {
      setError('Please enter the verification code');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await signUp.attemptEmailAddressVerification({
        code: verificationCode,
      });

      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId });
        router.replace('/(tabs)');
      } else {
        setError('Verification failed. Please try again.');
      }
    } catch (err: any) {
      console.error('Error verifying email:', err);
      setError(err.errors?.[0]?.message || 'Failed to verify email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.title}>Verify Your Email</Text>
        
        <Text style={styles.subtitle}>
          We've sent a verification code to {email}. Please enter it below.
        </Text>
        
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Verification Code"
            value={verificationCode}
            onChangeText={setVerificationCode}
            keyboardType="number-pad"
          />
        </View>
        
        <TouchableOpacity 
          style={styles.verifyButton}
          onPress={handleVerify}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.verifyButtonText}>Verify</Text>
          )}
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.resendButton}
          onPress={async () => {
            try {
              await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
              alert('Verification code resent!');
            } catch (err) {
              console.error('Error resending code:', err);
              setError('Failed to resend verification code');
            }
          }}
        >
          <Text style={styles.resendButtonText}>Resend Code</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  formContainer: {
    flex: 1,
    justifyContent: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
  },
  errorText: {
    color: 'red',
    marginBottom: 15,
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    letterSpacing: 2,
  },
  verifyButton: {
    backgroundColor: '#F9A11B',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  verifyButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  resendButton: {
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  resendButtonText: {
    color: '#F9A11B',
    fontWeight: '600',
    fontSize: 16,
  },
});