// Add/edit screen for creating a task or habit

import DateTimePicker, { type DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { Pill } from '../components/Pill';
import { Screen } from '../components/Screen';
import { priorityLabels, useAppState } from '../store/AppStateProvider';
import type { Priority } from '../store/types';
import { useTheme } from '../theme/ThemeProvider';
import { formatTime, toISODate } from '../utils/dates';
import type { CalendarStackParamList, HomeStackParamList, StatsStackParamList } from '../navigation/types';

type AnyStackParamList = HomeStackParamList | StatsStackParamList | CalendarStackParamList;
type Props = NativeStackScreenProps<AnyStackParamList, 'AddItem'>;

type PickerKind = 'taskDate' | 'habitStart' | 'habitEnd' | 'reminderTime';

function SectionCard({ children }: { children: React.ReactNode }) {
  const { colors } = useTheme();
  return <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>{children}</View>;
}

function Row({
  left,
  right = '',
  onPress,
  icon,
}: {
  left: string;
  right?: string;
  icon?: React.ReactNode;
  onPress: () => void;
}) {
  const { colors } = useTheme();
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={styles.row}>
      <View style={styles.rowLeft}>
        {icon ? <View style={{ width: 20, alignItems: 'center' }}>{icon}</View> : null}
        <Text style={[styles.rowLabel, { color: colors.purple }]}>{left}</Text>
      </View>
      <View style={styles.rowRight}>
        {right.length > 0 ? <Text style={[styles.rowValue, { color: colors.purple }]}>{right}</Text> : null}
        <Ionicons name="chevron-forward" size={18} color={colors.purple} />
      </View>
    </Pressable>
  );
}

function PriorityPicker({ value, onChange }: { value: Priority; onChange: (p: Priority) => void }) {
  return (
    <View style={styles.priorityRow}>
      {(['high', 'medium', 'low'] as const).map((p) => (
        <Pill key={p} selected={value === p} onPress={() => onChange(p)}>
          {priorityLabels[p]}
        </Pill>
      ))}
    </View>
  );
}

export function AddItemScreen({ navigation, route }: Props) {
  const { actions } = useAppState();
  const { colors, darkMode } = useTheme();
  const inputBg = darkMode ? colors.surface : colors.white;

  const initialMode = route.params?.mode ?? 'task';
  const initialDateISO = route.params?.dateISO;
  const defaultTaskDateISO = '2026-04-24';
  const initialDate = initialDateISO
    ? new Date(`${initialDateISO}T12:00:00`)
    : new Date(`${defaultTaskDateISO}T12:00:00`);

  const [mode, setMode] = useState<'task' | 'habit'>(initialMode);

  // Task state
  const [taskName, setTaskName] = useState('');
  const [taskNotes, setTaskNotes] = useState('');
  const [taskDate, setTaskDate] = useState<Date>(initialDate);

  // Habit state
  const [habitName, setHabitName] = useState('');
  const [habitDesc, setHabitDesc] = useState('');
  const defaultHabitStart = useMemo(() => new Date('2026-04-13T12:00:00'), []);
  const [habitStart, setHabitStart] = useState<Date>(initialMode === 'habit' && !initialDateISO ? defaultHabitStart : initialDate);
  const [habitEnd, setHabitEnd] = useState<Date>(initialDate);

  // Shared state
  const [reminderTime, setReminderTime] = useState<Date>(() => {
    const d = new Date();
    d.setHours(9, 0, 0, 0);
    return d;
  });
  const [priority, setPriority] = useState<Priority>('high');
  const [pickerKind, setPickerKind] = useState<PickerKind | null>(null);

  const canSave = useMemo(() => {
    if (mode === 'task') return taskName.trim().length > 0;
    return habitName.trim().length > 0;
  }, [habitName, mode, taskName]);

  const onPickerChange = (event: DateTimePickerEvent, selected?: Date) => {
    if (Platform.OS !== 'ios') setPickerKind(null);
    if (event.type === 'dismissed' || !selected) return;

    if (pickerKind === 'taskDate') setTaskDate(selected);
    if (pickerKind === 'habitStart') setHabitStart(selected);
    if (pickerKind === 'habitEnd') setHabitEnd(selected);
    if (pickerKind === 'reminderTime') setReminderTime(selected);
  };

  const save = () => {
    if (!canSave) return;
    const reminder = formatTime(reminderTime);

    if (mode === 'task') {
      actions.addTask({
        name: taskName.trim(),
        notes: taskNotes.trim(),
        dateISO: toISODate(taskDate),
        reminderTime: reminder,
        priority,
      });
    } else {
      actions.addHabit({
        name: habitName.trim(),
        description: habitDesc.trim(),
        startDateISO: toISODate(habitStart),
        endDateISO: toISODate(habitEnd),
        reminderTime: reminder,
        priority,
      });
    }

    navigation.goBack();
  };

  const headerTitle = mode === 'task' ? 'Task' : 'Habit';
  const saveLabel = mode === 'task' ? 'Save Task' : 'Save Habit';
  const taskDateLabel = useMemo(
    () => taskDate.toLocaleString(undefined, { month: 'long', day: 'numeric', year: 'numeric' }).replace(', ', ','),
    [taskDate]
  );
  const durationLabel = useMemo(() => {
    const start = toISODate(habitStart).split('-');
    const end = toISODate(habitEnd).split('-');
    const startText = `${start[2]}/${start[1]}/${start[0]}`;
    const endText = `${end[2]}/${end[1]}/${end[0]}`;
    return `${startText} - ${endText}`;
  }, [habitEnd, habitStart]);

  return (
    <Screen style={styles.screen} edges={['top', 'left', 'right']}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <Pressable accessibilityRole="button" onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={26} color={colors.purple} />
          </Pressable>

          <View style={styles.segment}>
            <Pressable
              accessibilityRole="button"
              onPress={() => setMode('task')}
              style={[
                styles.segmentBtn,
                { borderColor: colors.purple },
                mode === 'task' && { backgroundColor: colors.lavenderDeep },
              ]}
            >
              <Text style={[styles.segmentText, { color: colors.purple }]}>Task</Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              onPress={() => setMode('habit')}
              style={[
                styles.segmentBtn,
                { borderColor: colors.purple },
                mode === 'habit' && { backgroundColor: colors.lavenderDeep },
              ]}
            >
              <Text style={[styles.segmentText, { color: colors.purple }]}>Habit</Text>
            </Pressable>
          </View>

          <View style={[styles.outerCard, { borderColor: colors.purple, backgroundColor: colors.surface }]}>
            <Text style={[styles.pageTitle, { color: colors.purple }]}>{headerTitle}</Text>

            <SectionCard>
              <TextInput
                value={mode === 'task' ? taskName : habitName}
                onChangeText={mode === 'task' ? setTaskName : setHabitName}
                placeholder={mode === 'task' ? 'Task Name' : 'Habit Name'}
                placeholderTextColor="#9A83B8"
                style={[styles.inputTitle, { color: colors.text, backgroundColor: inputBg }]}
              />
              <View style={styles.hr} />
              <TextInput
                value={mode === 'task' ? taskNotes : habitDesc}
                onChangeText={mode === 'task' ? setTaskNotes : setHabitDesc}
                placeholder={mode === 'task' ? 'Type your task here...' : 'Description'}
                placeholderTextColor="#9A83B8"
                style={[styles.inputBody, { color: colors.text, backgroundColor: inputBg }]}
                multiline
              />
            </SectionCard>

            <View style={{ height: 14 }} />

            {mode === 'task' ? (
              <SectionCard>
                <Row left={taskDateLabel} onPress={() => setPickerKind('taskDate')} />
              </SectionCard>
            ) : (
              <SectionCard>
                <Row
                  icon={<Ionicons name="calendar" size={16} color={colors.purple} />}
                  left="Duration"
                  right={durationLabel}
                  onPress={() => setPickerKind('habitStart')}
                />
                <Text style={[styles.durationHint, { color: colors.muted }]}>Tap to pick start date, then end date</Text>
              </SectionCard>
            )}

            <View style={{ height: 14 }} />

            <SectionCard>
              <View style={styles.reminderHeader}>
                <Text style={[styles.reminderLabel, { color: colors.purple }]}>Reminder</Text>
                <Pressable accessibilityRole="button" onPress={() => setPickerKind('reminderTime')}>
                  <Text style={[styles.reminderTime, { color: colors.purple }]}>{formatTime(reminderTime)}</Text>
                </Pressable>
              </View>
              <View style={styles.reminderLine} />
              <View style={styles.priorityHeader}>
                <Text style={[styles.priorityLabel, { color: colors.purple }]}>Priority</Text>
                <PriorityPicker value={priority} onChange={setPriority} />
              </View>
            </SectionCard>
          </View>

          <View style={{ height: 18 }} />

          <Pressable
            accessibilityRole="button"
            onPress={save}
            disabled={!canSave}
            style={({ pressed }) => [
              styles.saveBtn,
              { backgroundColor: colors.lavenderDeep, borderColor: colors.border },
              (!canSave || pressed) && { opacity: 0.7 },
              !canSave && { opacity: 0.45 },
            ]}
          >
            <Text style={[styles.saveText, { color: colors.purple }]}>{saveLabel}</Text>
          </Pressable>
        </ScrollView>

        {pickerKind ? (
          <View style={Platform.OS === 'ios' ? [styles.pickerIOS, { backgroundColor: colors.surface, borderTopColor: colors.border }] : undefined}>
            <DateTimePicker
              value={
                pickerKind === 'taskDate'
                  ? taskDate
                  : pickerKind === 'habitStart'
                    ? habitStart
                    : pickerKind === 'habitEnd'
                      ? habitEnd
                      : reminderTime
              }
              mode={pickerKind === 'reminderTime' ? 'time' : 'date'}
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={(e, d) => {
                onPickerChange(e, d);
                if (Platform.OS !== 'ios' && pickerKind === 'habitStart' && e.type !== 'dismissed' && d) {
                  setTimeout(() => setPickerKind('habitEnd'), 50);
                }
              }}
            />
            {Platform.OS === 'ios' ? (
              <Pressable
                accessibilityRole="button"
                onPress={() => {
                  if (pickerKind === 'habitStart') {
                    setPickerKind('habitEnd');
                    return;
                  }
                  setPickerKind(null);
                }}
                style={styles.pickerDone}
              >
                <Text style={[styles.pickerDoneText, { color: colors.purple }]}>Done</Text>
              </Pressable>
            ) : null}
          </View>
        ) : null}
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    paddingHorizontal: 14,
  },
  content: {
    paddingTop: 6,
    paddingBottom: 20,
  },
  backBtn: {
    width: 44,
    height: 36,
    justifyContent: 'center',
  },
  segment: {
    alignSelf: 'center',
    flexDirection: 'row',
    gap: 10,
    marginTop: 4,
    marginBottom: 10,
  },
  segmentBtn: {
    width: 90,
    height: 26,
    borderRadius: 6,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  segmentText: {
    fontSize: 12,
    fontWeight: '700',
  },
  outerCard: {
    borderWidth: 2,
    borderRadius: 28,
    padding: 14,
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: '900',
    marginBottom: 10,
  },
  card: {
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  inputTitle: {
    fontSize: 12,
    fontWeight: '700',
    paddingVertical: 2,
  },
  hr: {
    height: 1,
    backgroundColor: '#D9D9D9',
    marginVertical: 8,
  },
  inputBody: {
    fontSize: 12,
    minHeight: 42,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  rowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  rowLabel: {
    fontSize: 13,
    fontWeight: '800',
  },
  rowValue: { fontSize: 12, fontWeight: '700' },
  durationHint: {
    marginTop: 6,
    fontSize: 11,
  },
  reminderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  reminderLabel: { fontSize: 13, fontWeight: '800' },
  reminderTime: { fontSize: 12, fontWeight: '800' },
  reminderLine: {
    height: 1,
    backgroundColor: '#D9D9D9',
    marginVertical: 10,
  },
  priorityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  priorityLabel: { fontSize: 13, fontWeight: '800' },
  priorityRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  saveBtn: {
    alignSelf: 'center',
    width: '92%',
    height: 38,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveText: {
    fontSize: 18,
    fontWeight: '900',
  },
  pickerIOS: {
    borderTopWidth: 1,
    paddingBottom: 6,
  },
  pickerDone: {
    alignSelf: 'flex-end',
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  pickerDoneText: {
    fontWeight: '800',
  },
});
