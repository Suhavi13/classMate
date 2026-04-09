import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

interface PillProps {
  label: string;
  onPress: () => void;
  active: boolean;
  size?: 'small' | 'large';
}

export default function Pill({ label, onPress, active, size = 'small' }: PillProps) {
  return (
    <TouchableOpacity 
      onPress={onPress} 
      activeOpacity={0.7}
      style={[
        styles.pill, 
        active ? styles.activePill : styles.inactivePill,
        size === 'large' ? styles.largePill : styles.smallPill
      ]}
    >
      <Text style={[
        styles.text, 
        active ? styles.activeText : styles.inactiveText,
        size === 'large' ? styles.largeText : styles.smallText
      ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  pill: {
    borderRadius: 8,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  smallPill: { paddingHorizontal: 10, paddingVertical: 4, minWidth: 65 },
  largePill: { flex: 1, paddingVertical: 8 },
  activePill: { backgroundColor: '#B886CD', borderColor: '#702D91' },
  inactivePill: { backgroundColor: '#FFFFFF', borderColor: '#702D91' },
  text: { fontWeight: '700' },
  smallText: { fontSize: 12 },
  largeText: { fontSize: 14 },
  activeText: { color: '#FFFFFF' },
  inactiveText: { color: '#702D91' },
});