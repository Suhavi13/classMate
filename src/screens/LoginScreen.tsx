import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useMemo, useState } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { useAuth } from '../auth/AuthProvider';
import { checkPassword, isValidEmail, passwordRules } from '../auth/validation';
import { Screen } from '../components/Screen';
import type { RootStackParamList } from '../navigation/types';
import { useTheme } from '../theme/ThemeProvider';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

function RuleRow({ ok, label, okColor, badColor }: { ok: boolean; label: string; okColor: string; badColor: string }) {
  return (
    <View style={styles.ruleRow}>
      <Ionicons name={ok ? 'checkmark-circle' : 'close-circle'} size={14} color={ok ? okColor : badColor} />
      <Text style={[styles.ruleText, { color: ok ? okColor : badColor }]}>{label}</Text>
    </View>
  );
}

function LogoMark() {
  return (
    <View style={styles.logoWrap}>
      <Image
        source={require('../../assets/classmate-logo.png')}
        style={styles.logoImage}
        resizeMode="contain"
        accessibilityLabel="Classmate logo"
      />
    </View>
  );
}

export function LoginScreen({ navigation }: Props) {
  const { actions } = useAuth();
  const { colors, darkMode } = useTheme();
  const inputBg = darkMode ? colors.surface : colors.white;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [attempted, setAttempted] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const emailOk = useMemo(() => isValidEmail(email), [email]);
  const passwordCheck = useMemo(() => checkPassword(password), [password]);
  const rules = useMemo(() => passwordRules(password), [password]);
  const canSignIn = emailOk && passwordCheck.ok;
  const canAttempt = email.trim().length > 0 || password.length > 0;

  const signIn = async () => {
    setAttempted(true);
    setServerError(null);
    if (!canSignIn) return;
    const res = await actions.signIn(email, password);
    if (!res.ok) setServerError(res.message);
  };

  return (
    <Screen style={styles.screen}>
      <StatusBar style={darkMode ? 'light' : 'dark'} />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <View style={styles.container}>
          
          <LogoMark />

          <Text style={[styles.sectionTitle, { color: colors.text }]}>Log In</Text>
          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.label, { color: colors.text }]}>Email</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder=""
              autoCapitalize="none"
              keyboardType="email-address"
              style={[styles.input, { backgroundColor: inputBg, borderColor: colors.border, color: colors.text }]}
            />
            {attempted && !emailOk ? <Text style={styles.errorText}>Enter a valid email.</Text> : null}

            <Text style={[styles.label, { marginTop: 14, color: colors.text }]}>Password</Text>
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder=""
              secureTextEntry
              style={[styles.input, { backgroundColor: inputBg, borderColor: colors.border, color: colors.text }]}
            />
            {(attempted || password.length > 0) && !passwordCheck.ok ? (
              <Text style={styles.errorText}>{passwordCheck.reason}</Text>
            ) : null}
            {(attempted || password.length > 0) ? (
              <View style={styles.rulesBox}>
                <RuleRow ok={rules.minLen} label="8+ characters" okColor={colors.purple} badColor={colors.danger} />
                <RuleRow ok={rules.lower} label="Lowercase letter" okColor={colors.purple} badColor={colors.danger} />
                <RuleRow ok={rules.upper} label="Uppercase letter" okColor={colors.purple} badColor={colors.danger} />
                <RuleRow ok={rules.number} label="Number" okColor={colors.purple} badColor={colors.danger} />
                <RuleRow ok={rules.special} label="Special character" okColor={colors.purple} badColor={colors.danger} />
              </View>
            ) : null}
            {attempted && serverError ? <Text style={styles.errorText}>{serverError}</Text> : null}

            <Pressable
              accessibilityRole="button"
              onPress={signIn}
              disabled={!canAttempt}
              style={({ pressed }) => [
                styles.signInBtn,
                { backgroundColor: darkMode ? colors.lavenderDeep : '#2B2B2B' },
                pressed && { opacity: 0.85 },
                !canAttempt && { opacity: 0.55 },
              ]}
            >
              <Text style={styles.signInText}>Sign In</Text>
            </Pressable>

            <Pressable accessibilityRole="button" onPress={() => {}} style={styles.forgotWrap}>
              <Text style={[styles.forgotText, { color: colors.muted }]}>Forgot password?</Text>
            </Pressable>
          </View>

          <View style={{ height: 16 }} />

          <Pressable
            accessibilityRole="button"
            onPress={() => navigation.navigate('SignUp')}
            style={[styles.signUpBtn, { backgroundColor: colors.lavenderDeep, borderColor: colors.border }]}
          >
            <Text style={[styles.signUpText, { color: colors.text }]}>Sign Up</Text>
          </Pressable>

          <View style={{ height: 10 }} />

          <Pressable accessibilityRole="button" onPress={() => {}} style={styles.appleBtn}>
            <Ionicons name="logo-apple" size={18} color={colors.white} />
            <Text style={styles.appleText}>Sign in with Apple</Text>
          </Pressable>

          <View style={{ height: 10 }} />

          <Pressable
            accessibilityRole="button"
            onPress={() => {}}
            style={[styles.googleBtn, { backgroundColor: inputBg, borderColor: colors.border }]}
          >
            <Ionicons name="logo-google" size={18} color={colors.purple} />
            <Text style={[styles.googleText, { color: colors.text }]}>Sign in with Google</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    paddingHorizontal: 18,
  },
  container: {
    flex: 1,
    alignItems: 'center',
  },
  pageTitle: {
    alignSelf: 'flex-start',
    color: '#C7C7C7',
    fontSize: 22,
    fontWeight: '600',
    marginTop: 6,
  },
  logoWrap: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 12,
  },
  logoImage: {
    width: 260,
    height: 200,
  },
  sectionTitle: {
    fontSize: 16,
    color: '#1A1A1A',
    marginBottom: 8,
  },
  card: {
    width: '100%',
    backgroundColor: '#DADCD6',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#5B5B5B',
    padding: 14,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  label: {
    fontSize: 12,
    color: '#4A4A4A',
    marginBottom: 6,
  },
  input: {
    height: 34,
    borderRadius: 5,
    borderWidth: 1,
    paddingHorizontal: 10,
  },
  errorText: {
    marginTop: 6,
    color: '#B00020',
    fontSize: 12,
  },
  rulesBox: {
    marginTop: 8,
    gap: 4,
  },
  ruleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  ruleText: {
    fontSize: 12,
  },
  signInBtn: {
    marginTop: 12,
    height: 34,
    borderRadius: 6,
    backgroundColor: '#2B2B2B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  signInText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  forgotWrap: {
    marginTop: 10,
    alignSelf: 'flex-start',
  },
  forgotText: {
    color: '#4B4B4B',
    fontSize: 12,
    textDecorationLine: 'underline',
  },
  signUpBtn: {
    width: '100%',
    height: 34,
    borderRadius: 6,
    backgroundColor: '#CDB4E6',
    borderWidth: 1,
    borderColor: '#7D6A90',
    alignItems: 'center',
    justifyContent: 'center',
  },
  signUpText: {
    color: '#1A1A1A',
    fontSize: 13,
    fontWeight: '600',
  },
  appleBtn: {
    width: '100%',
    height: 34,
    borderRadius: 6,
    backgroundColor: '#111111',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  appleText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  googleBtn: {
    width: '100%',
    height: 34,
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#5C5C5C',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  googleText: {
    color: '#1A1A1A',
    fontSize: 13,
    fontWeight: '600',
  },
});
