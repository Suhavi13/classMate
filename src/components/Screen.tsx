import React from 'react';
import { StyleSheet, SafeAreaView, View, ViewStyle, Platform, StatusBar } from 'react-native';

interface ScreenProps {
  children: React.ReactNode; // This fixes the "Property children does not exist" error
  style?: ViewStyle;
}

const Screen: React.FC<ScreenProps> = ({ children, style }) => {
  return (
    <SafeAreaView style={[styles.screen, style]}>
      {/* View is often needed inside SafeAreaView for consistent padding */}
      <View style={[styles.container, style]}>
        {children}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F9FBF2', // Your main theme cream color
    // Prevents content from going under the status bar on Android
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
  },
});

export default Screen;