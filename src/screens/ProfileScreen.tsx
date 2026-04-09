import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import { Alert, Image, Modal, Pressable, ScrollView, StyleSheet, Switch, Text, TextInput, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { useAuth } from '../auth/AuthProvider';
import { Screen } from '../components/Screen';
import type { HomeStackParamList } from '../navigation/types';
import { useTheme } from '../theme/ThemeProvider';

type Props = NativeStackScreenProps<HomeStackParamList, 'Profile'>;

export function ProfileScreen({ navigation }: Props) {
  const { state: auth, actions: authActions } = useAuth();
  const { colors, darkMode, setDarkMode } = useTheme();
  const user = auth.user;
  const inputBg = darkMode ? colors.surface : colors.white;

  const handle = useMemo(() => {
    if (!user) return '@user';
    const slug = user.name.trim().toLowerCase().replaceAll(/\s+/g, '');
    return `@${slug || 'user'}`;
  }, [user]);

  const [nameModalOpen, setNameModalOpen] = useState(false);
  const [nameDraft, setNameDraft] = useState(user?.name ?? '');
  const [nameError, setNameError] = useState<string | null>(null);

  const openNameModal = () => {
    setNameDraft(user?.name ?? '');
    setNameError(null);
    setNameModalOpen(true);
  };

  const saveName = async () => {
    const res = await authActions.updateName(nameDraft);
    if (!res.ok) {
      setNameError(res.message);
      return;
    }
    setNameModalOpen(false);
  };

  const confirmLogout = () => {
    Alert.alert('Log out?', 'You will need to sign in again to access your data.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Log out', style: 'destructive', onPress: () => authActions.signOut().catch(() => {}) },
    ]);
  };

  return (
    <Screen style={[styles.screen, { backgroundColor: colors.background }]} edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Pressable accessibilityRole="button" onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={26} color={colors.purple} />
        </Pressable>

        <View style={[styles.avatarWrap, { backgroundColor: colors.lavender }]}>
          <Image
            source={{ uri: 'https://i.pravatar.cc/200?img=32' }}
            style={styles.avatar}
            accessibilityLabel="Profile picture"
          />
        </View>

        <Text style={[styles.handle, { color: colors.text }]}>{handle}</Text>
        <Text style={[styles.email, { color: colors.muted }]}>{user?.email ?? '—'}</Text>

        <Pressable accessibilityRole="button" onPress={openNameModal} style={[styles.changeNameBtn, { backgroundColor: colors.lavenderDeep, borderColor: colors.border }]}>
          <Text style={[styles.changeNameText, { color: colors.text }]}>Change Name</Text>
          <Ionicons name="chevron-forward" size={18} color={colors.purple} />
        </Pressable>

        <View style={{ height: 8 }} />

        <View style={styles.row}>
          <Ionicons name="moon" size={18} color={colors.text} style={styles.rowIcon} />
          <Text style={[styles.rowText, { color: colors.text }]}>Dark theme</Text>
          <Switch
            value={darkMode}
            onValueChange={setDarkMode}
            trackColor={{ false: '#D7D7D7', true: colors.lavenderDeep }}
            thumbColor={darkMode ? colors.purple : '#6B6B6B'}
          />
        </View>

        <Pressable accessibilityRole="button" onPress={() => {}} style={styles.row}>
          <MaterialCommunityIcons name="email-outline" size={18} color={colors.text} style={styles.rowIcon} />
          <Text style={[styles.rowText, { color: colors.text }]}>Contact us</Text>
        </Pressable>

        <Pressable accessibilityRole="button" onPress={() => {}} style={styles.row}>
          <Ionicons name="information-circle-outline" size={18} color={colors.text} style={styles.rowIcon} />
          <Text style={[styles.rowText, { color: colors.text }]}>About app</Text>
        </Pressable>

        <Pressable accessibilityRole="button" onPress={() => {}} style={styles.row}>
          <Ionicons name="settings-outline" size={18} color={colors.text} style={styles.rowIcon} />
          <Text style={[styles.rowText, { color: colors.text }]}>Settings</Text>
        </Pressable>

        <View style={{ height: 26 }} />

        <Pressable accessibilityRole="button" onPress={confirmLogout} style={styles.logout}>
          <Ionicons name="log-out-outline" size={18} color={colors.danger} />
          <Text style={[styles.logoutText, { color: colors.danger }]}>Logout</Text>
        </Pressable>
      </ScrollView>

      <Modal visible={nameModalOpen} transparent animationType="fade" onRequestClose={() => setNameModalOpen(false)}>
        <Pressable style={styles.modalBackdrop} onPress={() => setNameModalOpen(false)} />
        <View style={[styles.modalCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.modalTitle, { color: colors.text }]}>Change name</Text>
          <TextInput
            value={nameDraft}
            onChangeText={(t) => {
              setNameDraft(t);
              setNameError(null);
            }}
            placeholder="Your name"
            placeholderTextColor={colors.muted}
            style={[styles.modalInput, { borderColor: colors.border, backgroundColor: inputBg, color: colors.text }]}
          />
          {nameError ? <Text style={styles.modalError}>{nameError}</Text> : null}
          <View style={styles.modalBtns}>
            <Pressable accessibilityRole="button" onPress={() => setNameModalOpen(false)} style={styles.modalBtn}>
              <Text style={[styles.modalBtnText, { color: colors.text }]}>Cancel</Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              onPress={saveName}
              style={[styles.modalBtn, { backgroundColor: colors.lavenderDeep, borderColor: colors.border }]}
            >
              <Text style={[styles.modalBtnText, { color: colors.text, fontWeight: '900' }]}>Save</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    paddingHorizontal: 18,
  },
  content: {
    paddingTop: 8,
    paddingBottom: 20,
    alignItems: 'center',
  },
  backBtn: {
    alignSelf: 'flex-start',
    width: 44,
    height: 36,
    justifyContent: 'center',
  },
  avatarWrap: {
    marginTop: 12,
    width: 96,
    height: 96,
    borderRadius: 48,
    overflow: 'hidden',
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  handle: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: '700',
  },
  email: {
    marginTop: 4,
    fontSize: 12,
  },
  changeNameBtn: {
    marginTop: 14,
    width: '100%',
    height: 38,
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  changeNameText: {
    fontSize: 13,
    fontWeight: '600',
  },
  row: {
    width: '100%',
    height: 42,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    gap: 10,
  },
  rowIcon: {
    width: 22,
    textAlign: 'center',
  },
  rowText: {
    flex: 1,
    fontSize: 13,
  },
  logout: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoutText: {
    fontSize: 13,
    fontWeight: '600',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  modalCard: {
    position: 'absolute',
    left: 18,
    right: 18,
    top: 220,
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '900',
    marginBottom: 10,
  },
  modalInput: {
    height: 36,
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 10,
  },
  modalError: {
    marginTop: 8,
    color: '#B00020',
    fontSize: 12,
  },
  modalBtns: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 12,
  },
  modalBtn: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  modalBtnText: {
    fontSize: 13,
    fontWeight: '800',
  },
});
