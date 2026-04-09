import { DarkTheme, DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AppNavigator } from './src/navigation/AppNavigator';
import { AppStateProvider } from './src/store/AppStateProvider';
import { AuthProvider } from './src/auth/AuthProvider';
import { ThemeProvider, useTheme } from './src/theme/ThemeProvider';

function AppShell() {
  const { darkMode, colors } = useTheme();
  const baseTheme = darkMode ? DarkTheme : DefaultTheme;
  const navTheme = {
    ...baseTheme,
    colors: {
      ...baseTheme.colors,
      primary: colors.purple,
      background: colors.background,
      card: colors.lavenderDeep,
      text: colors.text,
      border: colors.border,
      notification: colors.purple,
    },
  };
  return (
    <NavigationContainer theme={navTheme}>
      <AppNavigator />
      <StatusBar style={darkMode ? 'light' : 'dark'} />
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AuthProvider>
          <ThemeProvider>
            <AppStateProvider>
              <AppShell />
            </AppStateProvider>
          </ThemeProvider>
        </AuthProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
