//creates local account and signs user in
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useMemo, useState } from 'react';
import {
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

type Props = NativeStackScreenProps<RootStackParamList, 'SignUp'>;

function RuleRow({ ok, label, okColor, badColor }: { ok: boolean; label: string; okColor: string; badColor: string }) {
  return (
    <View style={styles.ruleRow}>
      <Ionicons name={ok ? 'checkmark-circle' : 'close-circle'} size={14} color={ok ? okColor : badColor} />
      <Text style={[styles.ruleText, { color: ok ? okColor : badColor }]}>{label}</Text>
    </View>
  );
}

export function SignUpScreen({ navigation }: Props) {
  const { actions } = useAuth();
  const { colors, darkMode } = useTheme();
  const inputBg = darkMode ? colors.surface : colors.white;

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [attempted, setAttempted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const emailOk = useMemo(() => isValidEmail(email), [email]);
  const pwCheck = useMemo(() => checkPassword(password), [password]);
  const rules = useMemo(() => passwordRules(password), [password]);
  const confirmOk = password.length > 0 && confirmPassword.length > 0 ? password === confirmPassword : true;

  const canAttempt = name.trim().length > 0 || email.trim().length > 0 || password.length > 0 || confirmPassword.length > 0;
  const canSubmit = name.trim().length >= 2 && emailOk && pwCheck.ok && confirmOk;

  const submit = async () => {
    setAttempted(true);
    setError(null);
    if (!canSubmit) return;
    const res = await actions.signUp({ name, email, password, confirmPassword });
    if (!res.ok) setError(res.message);
  };

  return (
    <Screen style={styles.screen}>
      <StatusBar style={darkMode ? 'light' : 'dark'} />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <View style={styles.container}>
          <View style={styles.topRow}>
            <Pressable accessibilityRole="button" onPress={() => navigation.goBack()} style={styles.backBtn}>
              <Ionicons name="chevron-back" size={26} color={colors.purple} />
            </Pressable>
            <Text style={[styles.title, { color: colors.purple }]}>Sign Up</Text>
            <View style={{ width: 44 }} />
          </View>

          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.label, { color: colors.text }]}>Name</Text>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder=""
              style={[styles.input, { backgroundColor: inputBg, borderColor: colors.border, color: colors.text }]}
            />
            {attempted && name.trim().length < 2 ? <Text style={styles.errorText}>Name must be at least 2 characters.</Text> : null}

            <Text style={[styles.label, { marginTop: 14, color: colors.text }]}>Email</Text>
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
            {(attempted || password.length > 0) && !pwCheck.ok ? <Text style={styles.errorText}>{pwCheck.reason}</Text> : null}
            {(attempted || password.length > 0) ? (
              <View style={styles.rulesBox}>
                <RuleRow ok={rules.minLen} label="8+ characters" okColor={colors.purple} badColor={colors.danger} />
                <RuleRow ok={rules.lower} label="Lowercase letter" okColor={colors.purple} badColor={colors.danger} />
                <RuleRow ok={rules.upper} label="Uppercase letter" okColor={colors.purple} badColor={colors.danger} />
                <RuleRow ok={rules.number} label="Number" okColor={colors.purple} badColor={colors.danger} />
                <RuleRow ok={rules.special} label="Special character" okColor={colors.purple} badColor={colors.danger} />
              </View>
            ) : null}

            <Text style={[styles.label, { marginTop: 14, color: colors.text }]}>Confirm Password</Text>
            <TextInput
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder=""
              secureTextEntry
              style={[styles.input, { backgroundColor: inputBg, borderColor: colors.border, color: colors.text }]}
            />
            {attempted && !confirmOk ? <Text style={styles.errorText}>Passwords do not match.</Text> : null}

            {attempted && error ? <Text style={styles.errorText}>{error}</Text> : null}

            <Pressable
              accessibilityRole="button"
              onPress={submit}
              disabled={!canAttempt}
              style={({ pressed }) => [
                styles.submitBtn,
                { backgroundColor: colors.purple },
                pressed && { opacity: 0.85 },
                !canAttempt && { opacity: 0.55 },
              ]}
            >
              <Text style={styles.submitText}>Create Account</Text>
            </Pressable>

            <Pressable accessibilityRole="button" onPress={() => navigation.navigate('Login')} style={{ marginTop: 10 }}>
              <Text style={[styles.link, { color: colors.text }]}>
                Already have an account? <Text style={{ color: colors.purple, fontWeight: '800' }}>Log in</Text>
              </Text>
            </Pressable>
          </View>
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
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 6,
    marginBottom: 10,
  },
  backBtn: {
    width: 44,
    height: 36,
    justifyContent: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '900',
  },
  card: {
    borderRadius: 10,
    borderWidth: 1,
    padding: 14,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 6,
  },
  input: {
    height: 34,
    borderRadius: 6,
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
  submitBtn: {
    marginTop: 14,
    height: 38,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  link: {
    fontSize: 12,
    textAlign: 'center',
  },
});
