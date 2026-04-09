// Calendar view that shows tasks for the selected date.

import { Ionicons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { MonthYearDropdown } from '../components/MonthYearDropdown';
import { Screen } from '../components/Screen';
import { useAppState } from '../store/AppStateProvider';
import { useTheme } from '../theme/ThemeProvider';
import { startOfMonth, toISODate } from '../utils/dates';
import type { CalendarStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<CalendarStackParamList, 'Calendar'>;

function buildMonthGrid(month: Date) {
  const start = new Date(month.getFullYear(), month.getMonth(), 1);
  const startWeekday = (start.getDay() + 6) % 7; // 0=Mon ... 6=Sun
  const daysInMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();

  const cells: Array<{ day: number | null; iso: string | null }> = [];
  for (let i = 0; i < startWeekday; i += 1) cells.push({ day: null, iso: null });
  for (let d = 1; d <= daysInMonth; d += 1) {
    const iso = toISODate(new Date(month.getFullYear(), month.getMonth(), d));
    cells.push({ day: d, iso });
  }
  while (cells.length % 7 !== 0) cells.push({ day: null, iso: null });
  return cells;
}

export function CalendarScreen({ navigation }: Props) {
  const { state, actions } = useAppState();
  const { colors } = useTheme();
  const [month, setMonth] = useState(() => startOfMonth(new Date())); // current month default
  const [selectedISO, setSelectedISO] = useState(() => toISODate(new Date())); // current date default
  const goHome = () => {
    const tabNav = navigation.getParent()?.getParent();
    (tabNav as any)?.navigate?.('HomeStack');
  };

  const cells = useMemo(() => buildMonthGrid(month), [month]);
  const tasksForSelected = useMemo(() => {
    return state.tasks
      .filter((t) => t.dateISO === selectedISO)
      .sort((a, b) => Number(a.completed) - Number(b.completed));
  }, [state.tasks, selectedISO]);

  return (
    <Screen style={styles.screen} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <Pressable
          accessibilityRole="button"
          onPress={() =>
            navigation.canGoBack() ? navigation.goBack() : goHome()
          }
          style={styles.backBtn}
        >
          <Ionicons name="chevron-back" size={26} color={colors.purple} />
        </Pressable>
        <Text style={[styles.title, { color: colors.purple }]}>Calendar</Text>
        <View style={{ width: 44 }} />
      </View>

      <View style={[styles.outerCard, { borderColor: colors.purple, backgroundColor: colors.lavender }]}>
        <MonthYearDropdown value={month} onChange={setMonth} minYear={2016} maxYear={2032} />

        <View style={styles.weekRow}>
          {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map((w) => (
            <Text key={w} style={[styles.weekLabel, { color: colors.muted }]}>
              {w}
            </Text>
          ))}
        </View>

        <View style={styles.grid}>
          {cells.map((c, idx) => {
            const selected = c.iso === selectedISO;
            return (
              <Pressable
                key={idx}
                disabled={!c.iso}
                onPress={() => c.iso && setSelectedISO(c.iso)}
                style={[styles.cell, selected && { backgroundColor: colors.purple }]}
              >
                <Text style={[styles.cellText, { color: colors.text }, selected && { color: colors.white }]}>
                  {c.day ?? ''}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View style={{ height: 14 }} />

      <View style={[styles.tasksCard, { backgroundColor: colors.lavender }]}>
        <Text style={[styles.tasksTitle, { color: colors.purple }]}>Todays Tasks</Text>
        <View style={styles.tasksList}>
          {tasksForSelected.length === 0 ? (
            <Text style={[styles.empty, { color: colors.muted }]}>No tasks for this day.</Text>
          ) : (
            tasksForSelected.map((t, idx) => (
              <Pressable
                key={t.id}
                accessibilityRole="button"
                onPress={() => actions.toggleTaskCompleted(t.id)}
                style={[styles.taskRow, idx < tasksForSelected.length - 1 && styles.taskRowBorder]}
              >
                <Text
                  style={[
                    styles.taskText,
                    { color: colors.text },
                    t.completed && { textDecorationLine: 'line-through', color: colors.muted },
                  ]}
                  numberOfLines={1}
                >
                  {t.name}
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
    marginBottom: 8,
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
  outerCard: {
    borderWidth: 2,
    borderRadius: 28,
    padding: 14,
  },
  weekRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 2,
    marginBottom: 6,
  },
  weekLabel: {
    width: 36,
    textAlign: 'center',
    fontSize: 10,
    fontWeight: '700',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 6,
  },
  cell: {
    width: 36,
    height: 32,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cellText: {
    fontSize: 12,
    fontWeight: '600',
  },
  tasksCard: {
    borderRadius: 16,
    padding: 12,
  },
  tasksTitle: {
    fontSize: 14,
    fontWeight: '900',
    marginBottom: 8,
  },
  tasksList: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  taskRow: {
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  taskRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#C9B3E0',
  },
  taskText: {
    fontSize: 12,
  },
  empty: {
    paddingVertical: 12,
    paddingHorizontal: 10,
    fontSize: 12,
  },
});
