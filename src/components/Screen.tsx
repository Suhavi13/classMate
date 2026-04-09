import type { PropsWithChildren } from 'react';

import { StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import { SafeAreaView, type Edge } from 'react-native-safe-area-context';

import { useTheme } from '../theme/ThemeProvider';

type ScreenProps = PropsWithChildren<{
  style?: StyleProp<ViewStyle>;
  edges?: Edge[];
}>;

export function Screen({ children, style, edges = ['top', 'left', 'right'] }: ScreenProps) {
  const { colors } = useTheme();
  return (
    <SafeAreaView edges={edges} style={[styles.container, { backgroundColor: colors.background }, style]}>
      {children}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
