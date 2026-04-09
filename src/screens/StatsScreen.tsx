import { Ionicons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { MonthYearDropdown } from '../components/MonthYearDropdown';
import { Screen } from '../components/Screen';
import { useAppState } from '../store/AppStateProvider';
import { useTheme } from '../theme/ThemeProvider';
import { endOfMonth, startOfMonth, toISODate } from '../utils/dates';
import type { StatsStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<StatsStackParamList, 'Stats'>;

function clamp01(value: number) {
  return Math.max(0, Math.min(1, value));
}

function weekdayIndex(date: Date) {
  const d = date.getDay(); 
  return d === 0 ? 6 : d - 1; 
}

export function StatsScreen({ navigation }: Props) {
  const { state, actions } = useAppState();
  const { colors } = useTheme();
  const [month, setMonth] = useState(() => startOfMonth(new Date(2026, 3, 1))); // April 2026 like Figma
  const todayISO = toISODate(new Date());
  const goHome = () => {
    const tabNav = navigation.getParent()?.getParent();
    (tabNav as any)?.navigate?.('HomeStack');
  };

  const monthStart = useMemo(() => startOfMonth(month), [month]);
  const monthEnd = useMemo(() => endOfMonth(month), [month]);

  const bars = useMemo(() => {
    const totals = Array.from({ length: 7 }, () => ({ completed: 0, total: 0 }));

    // tasks completed per weekday in month
    for (const t of state.tasks) {
      const date = new Date(`${t.dateISO}T12:00:00`);
      if (date < monthStart || date > monthEnd) continue;
      const idx = weekdayIndex(date);
      totals[idx].total += 1;
      if (t.completed) totals[idx].completed += 1;
    }

    // habits completed per weekday in month
    for (const h of state.habits) {
      for (const [iso, completed] of Object.entries(h.completions)) {
        const date = new Date(`${iso}T12:00:00`);
        if (date < monthStart || date > monthEnd) continue;
        const idx = weekdayIndex(date);
        totals[idx].total += 1;
        if (completed) totals[idx].completed += 1;
      }
    }

    return totals.map((t) => (t.total === 0 ? 0.25 : clamp01(t.completed / t.total)));
  }, [state.habits, state.tasks, monthEnd, monthStart]);

  const habitsForToday = useMemo(() => {
    return state.habits.map((h) => ({
      id: h.id,
      name: h.name,
      done: Boolean(h.completions[todayISO]),
    }));
  }, [state.habits, todayISO]);

  return (
    <Screen style={styles.screen} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <Pressable
          accessibilityRole="button"
          onPress={() => (navigation.canGoBack() ? navigation.goBack() : goHome())}
          style={styles.backBtn}
        >
          <Ionicons name="chevron-back" size={26} color={colors.purple} />
        </Pressable>
        <Text style={[styles.title, { color: colors.purple }]}>Statistics</Text>
        <View style={{ width: 44 }} />
      </View>

      <MonthYearDropdown value={month} onChange={setMonth} minYear={2016} maxYear={2032} />

      <View style={[styles.card, { backgroundColor: colors.lavender }]}>
        <Text style={[styles.cardTitle, { color: colors.purple }]}>Monthly Progress</Text>
        <View style={styles.chart}>
          {bars.map((value, idx) => (
            <View key={idx} style={styles.barCol}>
              <View style={[styles.barTrack, { backgroundColor: colors.white }]}>
                <View style={[styles.barFill, { height: `${Math.round(value * 100)}%`, backgroundColor: colors.purple }]} />
              </View>
              <Text style={[styles.barLabel, { color: colors.muted }]}>{['M', 'T', 'W', 'T', 'F', 'S', 'SN'][idx]}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={{ height: 16 }} />

      <View style={[styles.card, { backgroundColor: colors.lavender }]}>
        <Text style={[styles.cardTitle, { color: colors.purple }]}>Habits Completed</Text>
        <View style={styles.habitList}>
          {habitsForToday.length === 0 ? (
            <Text style={[styles.emptyText, { color: colors.muted }]}>No habits yet.</Text>
          ) : (
            habitsForToday.map((h) => (
              <Pressable
                key={h.id}
                accessibilityRole="checkbox"
                accessibilityState={{ checked: h.done }}
                onPress={() => actions.setHabitCompletedForDate(h.id, todayISO, !h.done)}
                style={styles.habitRow}
              >
                <View style={[styles.habitDot, { borderColor: colors.purple, backgroundColor: colors.background }]}>
                  {h.done ? <Ionicons name="checkmark" size={12} color={colors.purple} /> : null}
                </View>
                <Text style={[styles.habitText, { color: colors.text }]}>{h.name}</Text>
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
    marginBottom: 6,
  },
  backBtn: {
    width: 44,
    height: 36,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '900',
  },
  card: {
    borderRadius: 16,
    padding: 12,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '900',
    marginBottom: 10,
  },
  chart: {
    height: 170,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 6,
  },
  barCol: {
    width: 32,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  barTrack: {
    width: 18,
    height: 132,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.85)',
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  barFill: {
    width: '100%',
    borderRadius: 12,
  },
  barLabel: {
    marginTop: 6,
    fontSize: 10,
    fontWeight: '700',
  },
  habitList: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  habitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#C9B3E0',
  },
  habitDot: {
    width: 14,
    height: 14,
    borderRadius: 4,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  habitText: {
    fontSize: 12,
  },
  emptyText: {
    paddingVertical: 10,
    paddingHorizontal: 8,
    fontSize: 12,
  },
});
