import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { useAuth } from '../auth/AuthProvider';
import { Screen } from '../components/Screen';
import type { HomeStackParamList } from '../navigation/types';
import { useAppState } from '../store/AppStateProvider';
import { useTheme } from '../theme/ThemeProvider';
import { toISODate } from '../utils/dates';

type Props = NativeStackScreenProps<HomeStackParamList, 'Home'>;

export function HomeScreen({ navigation }: Props) {
  const { state, actions } = useAppState();
  const { state: auth } = useAuth();
  const { colors } = useTheme();
  const today = useMemo(() => new Date(), []);
  const todayISO = useMemo(() => toISODate(today), [today]);

  const todayText = useMemo(
    () =>
      today.toLocaleString(undefined, {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
      }),
    [today]
  );

  const tasksForToday = useMemo(
    () =>
      state.tasks
        .filter((t) => t.dateISO === todayISO)
        .sort((a, b) => Number(a.completed) - Number(b.completed)),
    [state.tasks, todayISO]
  );

  const habitsForToday = useMemo(
    () =>
      state.habits.map((h) => ({
        id: h.id,
        name: h.name,
        done: Boolean(h.completions[todayISO]),
      })),
    [state.habits, todayISO]
  );

  return (
    <Screen style={styles.screen} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <Pressable
          accessibilityRole="button"
          onPress={() => navigation.navigate('Profile')}
          style={styles.headerIconBtn}
        >
          <Ionicons name="person-circle" size={30} color={colors.purple} />
        </Pressable>

        <Text style={[styles.headerTitle, { color: colors.purple }]}>Home</Text>

        <Pressable
          accessibilityRole="button"
          onPress={() => navigation.navigate('AddItem', { mode: 'task', dateISO: todayISO })}
          style={styles.headerIconBtn}
        >
          <View style={[styles.plusPill, { backgroundColor: colors.lavender }]}>
            <Ionicons name="add" size={18} color={colors.purple} />
          </View>
        </Pressable>
      </View>

      <View style={[styles.outerCard, { borderColor: colors.purple, backgroundColor: colors.background }]}>
        <Text style={[styles.greeting, { color: colors.purple }]}>Hello {auth.user?.name ?? 'Friend'} !</Text>
        <Text style={[styles.date, { color: colors.muted }]}>{todayText}</Text>

        <View style={styles.sectionRow}>
          <Text style={[styles.sectionTitle, { color: colors.purple }]}>To do:</Text>
          <Pressable
            accessibilityRole="button"
            onPress={() => navigation.navigate('AddItem', { mode: 'task', dateISO: todayISO })}
            style={styles.editBtn}
          >
            <MaterialCommunityIcons name="pencil" size={16} color={colors.purple} />
          </Pressable>
        </View>

        <View style={[styles.listCard, { backgroundColor: colors.lavender }]}>
          {tasksForToday.length === 0 ? (
            <Text style={[styles.emptyText, { color: colors.muted }]}>No tasks yet. Tap + to add one.</Text>
          ) : (
            tasksForToday.map((item, idx) => (
              <View
                key={item.id}
                style={[styles.todoRow, idx < tasksForToday.length - 1 && styles.todoRowBorder]}
              >
                <Pressable
                  accessibilityRole="checkbox"
                  accessibilityState={{ checked: item.completed }}
                  onPress={() => actions.toggleTaskCompleted(item.id)}
                  style={[styles.checkbox, { borderColor: colors.purple, backgroundColor: colors.background }]}
                >
                  {item.completed ? <Ionicons name="checkmark" size={14} color={colors.purple} /> : null}
                </Pressable>
                <Text
                  style={[
                    styles.todoText,
                    { color: colors.text },
                    item.completed && { textDecorationLine: 'line-through', color: colors.muted },
                  ]}
                  numberOfLines={1}
                >
                  {item.name}
                </Text>
              </View>
            ))
          )}
        </View>

        <View style={{ height: 14 }} />

        <View style={styles.sectionRow}>
          <Text style={[styles.sectionTitle, { color: colors.purple }]}>Habits to track:</Text>
          <Pressable
            accessibilityRole="button"
            onPress={() => navigation.navigate('AddItem', { mode: 'habit' })}
            style={styles.editBtn}
          >
            <MaterialCommunityIcons name="pencil" size={16} color={colors.purple} />
          </Pressable>
        </View>

        <View style={[styles.habitsCard, { backgroundColor: colors.lavender }]}>
          {habitsForToday.length === 0 ? (
            <Text style={[styles.emptyText, { color: colors.muted }]}>No habits yet. Tap pencil to add one.</Text>
          ) : (
            habitsForToday.map((h, idx) => (
              <Pressable
                key={h.id}
                accessibilityRole="checkbox"
                accessibilityState={{ checked: h.done }}
                onPress={() => actions.setHabitCompletedForDate(h.id, todayISO, !h.done)}
                style={[styles.habitRow, idx < habitsForToday.length - 1 && styles.todoRowBorder]}
              >
                <View style={[styles.checkbox, { borderColor: colors.purple, backgroundColor: colors.background }]}>
                  {h.done ? <Ionicons name="checkmark" size={14} color={colors.purple} /> : null}
                </View>
                <Text
                  style={[
                    styles.todoText,
                    { color: colors.text },
                    h.done && { textDecorationLine: 'line-through', color: colors.muted },
                  ]}
                  numberOfLines={1}
                >
                  {h.name}
                </Text>
              </Pressable>
            ))
          )}
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    paddingHorizontal: 14,
    paddingTop: 6,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  headerIconBtn: {
    width: 44,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  plusPill: {
    width: 26,
    height: 26,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: 0.2,
  },
  outerCard: {
    flex: 1,
    borderWidth: 2,
    borderRadius: 28,
    padding: 16,
  },
  greeting: {
    fontSize: 22,
    fontWeight: '900',
    textAlign: 'center',
  },
  date: {
    marginTop: 2,
    textAlign: 'center',
    fontSize: 12,
    marginBottom: 10,
  },
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 6,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  editBtn: {
    width: 32,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listCard: {
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  todoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 7,
    gap: 10,
  },
  todoRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#C9B3E0',
  },
  checkbox: {
    width: 16,
    height: 16,
    borderRadius: 4,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  todoText: {
    flex: 1,
    fontSize: 12,
  },
  habitsCard: {
    borderRadius: 16,
    overflow: 'hidden',
    paddingVertical: 6,
  },
  habitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 7,
    paddingHorizontal: 10,
    gap: 10,
  },
  emptyText: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    fontSize: 12,
  },
});
