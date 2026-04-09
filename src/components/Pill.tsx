// Simple pill button used for priority and other controls.
import type { PropsWithChildren } from 'react';

import { Pressable, StyleSheet, Text } from 'react-native';

import { useTheme } from '../theme/ThemeProvider';

export function Pill({
  children,
  selected,
  onPress,
}: PropsWithChildren<{ selected: boolean; onPress: () => void }>) {
  const { colors } = useTheme();
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.pill,
        { borderColor: colors.purple },
        selected && { backgroundColor: colors.lavenderDeep },
        pressed && { opacity: 0.85 },
      ]}
    >
      <Text style={[styles.text, { color: colors.purple }]}>{children}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pill: {
    height: 26,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  text: {
    fontSize: 12,
    fontWeight: '600',
  },
});
