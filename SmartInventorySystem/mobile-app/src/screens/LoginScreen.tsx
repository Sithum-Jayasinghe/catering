import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, TouchableOpacity, Image } from 'react-native';
import { TextInput, Button, Surface, Checkbox } from 'react-native-paper';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useAuth } from '../hooks/useAuth';
import { APP_CONSTANTS } from '../utils/constants';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setError('Please enter both email and password');
      return;
    }

    setLoading(true);
    setError('');

    const result = await login(email, password);
    
    if (result.success) {
      setLoading(false);
    } else {
      setError(result.error || 'Login failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <View style={styles.logoCircle}>
            <MaterialIcons name="inventory" size={48} color="#ffffff" />
          </View>
          <Text style={styles.appName}>{APP_CONSTANTS.APP_NAME}</Text>
          <Text style={styles.tagline}>Enterprise AI-Powered Management</Text>
        </View>
      </View>

      <Surface style={styles.formCard} elevation={4}>
        <Text style={styles.formTitle}>Welcome Back</Text>
        <Text style={styles.formSubtitle}>Sign in to your account</Text>

        {error ? (
          <Surface style={styles.errorCard} elevation={0}>
            <MaterialIcons name="error-outline" size={20} color={APP_CONSTANTS.THEME.DANGER} />
            <Text style={styles.errorText}>{error}</Text>
          </Surface>
        ) : null}

        <View style={styles.inputContainer}>
          <MaterialIcons name="email" size={20} color="#64748b" style={styles.inputIcon} />
          <TextInput
            mode="outlined"
            label="Email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            style={styles.input}
            left={<TextInput.Icon icon="email" />}
          />
        </View>

        <View style={styles.inputContainer}>
          <MaterialIcons name="lock" size={20} color="#64748b" style={styles.inputIcon} />
          <TextInput
            mode="outlined"
            label="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            style={styles.input}
            left={<TextInput.Icon icon="lock" />}
            right={
              <TextInput.Icon
                icon={showPassword ? 'eye-off' : 'eye'}
                onPress={() => setShowPassword(!showPassword)}
              />
            }
          />
        </View>

        <View style={styles.optionsRow}>
          <View style={styles.rememberMe}>
            <Checkbox.Android
              status={rememberMe ? 'checked' : 'unchecked'}
              onPress={() => setRememberMe(!rememberMe)}
            />
            <Text style={styles.rememberMeText}>Remember me</Text>
          </View>
          <TouchableOpacity>
            <Text style={styles.forgotPassword}>Forgot Password?</Text>
          </TouchableOpacity>
        </View>

        <Button
          mode="contained"
          onPress={handleLogin}
          loading={loading}
          disabled={loading}
          style={styles.loginButton}
          contentStyle={styles.loginButtonContent}
          labelStyle={styles.loginButtonLabel}
        >
          Sign In
        </Button>

        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>OR</Text>
          <View style={styles.dividerLine} />
        </View>

        <View style={styles.demoContainer}>
          <Text style={styles.demoText}>Demo Credentials:</Text>
          <Text style={styles.demoCredentials}>admin@smartinventory.com / admin123</Text>
          <Text style={styles.demoRole}>Admin: Full Access</Text>
        </View>
      </Surface>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          {APP_CONSTANTS.APP_NAME} v1.0.0
        </Text>
        <Text style={styles.footerText}>Secure Enterprise Inventory Management</Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  logoContainer: {
    alignItems: 'center',
    gap: 16,
  },
  logoCircle: {
    width: 96,
    height: 96,
    borderRadius: 24,
    backgroundColor: APP_CONSTANTS.THEME.PRIMARY,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: APP_CONSTANTS.THEME.PRIMARY,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  appName: {
    fontSize: 28,
    fontWeight: '700',
    color: '#0f172a',
    textAlign: 'center',
  },
  tagline: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    marginTop: -8,
  },
  formCard: {
    marginHorizontal: 24,
    padding: 24,
    borderRadius: 16,
    backgroundColor: '#ffffff',
  },
  formTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 4,
  },
  formSubtitle: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 20,
  },
  errorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: APP_CONSTANTS.THEME.DANGER + '15',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    gap: 8,
  },
  errorText: {
    color: APP_CONSTANTS.THEME.DANGER,
    fontSize: 13,
    flex: 1,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputIcon: {
    position: 'absolute',
    left: 12,
    zIndex: 1,
    marginTop: 18,
  },
  input: {
    flex: 1,
    marginBottom: 12,
    backgroundColor: '#ffffff',
  },
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  rememberMe: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rememberMeText: {
    fontSize: 14,
    color: '#475569',
  },
  forgotPassword: {
    fontSize: 14,
    color: APP_CONSTANTS.THEME.PRIMARY,
    fontWeight: '600',
  },
  loginButton: {
    borderRadius: 8,
    backgroundColor: APP_CONSTANTS.THEME.PRIMARY,
  },
  loginButtonContent: {
    paddingVertical: 8,
  },
  loginButtonLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#e2e8f0',
  },
  dividerText: {
    marginHorizontal: 12,
    fontSize: 12,
    color: '#94a3b8',
    fontWeight: '500',
  },
  demoContainer: {
    backgroundColor: '#f1f5f9',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    gap: 4,
  },
  demoText: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  demoCredentials: {
    fontSize: 13,
    color: APP_CONSTANTS.THEME.PRIMARY,
    fontWeight: '600',
    fontFamily: 'monospace',
  },
  demoRole: {
    fontSize: 11,
    color: '#94a3b8',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 20,
    gap: 4,
  },
  footerText: {
    fontSize: 12,
    color: '#94a3b8',
  },
});
