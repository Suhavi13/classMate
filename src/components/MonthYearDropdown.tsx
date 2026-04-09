// Month/year dropdown used by Stats and Calendar screens.
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import { useTheme } from '../theme/ThemeProvider';
import { formatMonthYear, startOfMonth } from '../utils/dates';

const MONTHS = Array.from({ length: 12 }).map((_, idx) =>
  new Date(2026, idx, 1).toLocaleString(undefined, { month: 'long' })
);

type Props = {
  value: Date;
  onChange: (next: Date) => void;
  minYear?: number;
  maxYear?: number;
};

export function MonthYearDropdown({ value, onChange, minYear = 2016, maxYear = 2032 }: Props) {
  const { colors } = useTheme();
  const [open, setOpen] = useState(false);
  const [draftMonth, setDraftMonth] = useState(value.getMonth());
  const [draftYear, setDraftYear] = useState(value.getFullYear());

  const years = useMemo(() => {
    const ys: number[] = [];
    for (let y = minYear; y <= maxYear; y += 1) ys.push(y);
    return ys;
  }, [minYear, maxYear]);

  const show = () => {
    setDraftMonth(value.getMonth());
    setDraftYear(value.getFullYear());
    setOpen(true);
  };

  const apply = () => {
    setOpen(false);
    onChange(startOfMonth(new Date(draftYear, draftMonth, 1)));
  };

  return (
    <>
      <Pressable accessibilityRole="button" onPress={show} style={styles.row}>
        <Ionicons name="calendar" size={16} color={colors.purple} />
        <Text style={[styles.text, { color: colors.purple }]}>{formatMonthYear(value)}</Text>
        <Ionicons name="chevron-down" size={16} color={colors.purple} />
      </Pressable>

      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable style={styles.backdrop} onPress={() => setOpen(false)} />
        <View style={[styles.sheet, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.sheetHeader}>
            <Pressable accessibilityRole="button" onPress={() => setOpen(false)}>
              <Text style={[styles.sheetBtn, { color: colors.purple }]}>Cancel</Text>
            </Pressable>
            <Text style={[styles.sheetTitle, { color: colors.purple }]}>Select month</Text>
            <Pressable accessibilityRole="button" onPress={apply}>
              <Text style={[styles.sheetBtn, { color: colors.purple }]}>Done</Text>
            </Pressable>
          </View>

          <View style={styles.pickers}>
            <View style={styles.pickerCol}>
              <Text style={[styles.pickerLabel, { color: colors.muted }]}>Month</Text>
              <Picker selectedValue={draftMonth} onValueChange={(v) => setDraftMonth(Number(v))}>
                {MONTHS.map((label, idx) => (
                  <Picker.Item key={label} label={label} value={idx} />
                ))}
              </Picker>
            </View>
            <View style={styles.pickerCol}>
              <Text style={[styles.pickerLabel, { color: colors.muted }]}>Year</Text>
              <Picker selectedValue={draftYear} onValueChange={(v) => setDraftYear(Number(v))}>
                {years.map((y) => (
                  <Picker.Item key={String(y)} label={String(y)} value={y} />
                ))}
              </Picker>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  row: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 10,
  },
  text: {
    fontSize: 14,
    fontWeight: '700',
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  sheet: {
    position: 'absolute',
    left: 14,
    right: 14,
    top: 150,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  sheetTitle: {
    fontWeight: '800',
  },
  sheetBtn: {
    fontWeight: '800',
  },
  pickers: {
    flexDirection: 'row',
  },
  pickerCol: {
    flex: 1,
    paddingBottom: 4,
  },
  pickerLabel: {
    paddingTop: 10,
    paddingHorizontal: 12,
    fontSize: 12,
    fontWeight: '700',
  },
});
