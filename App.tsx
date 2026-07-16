import React from 'react';
import { Platform, View, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_800ExtraBold,
} from '@expo-google-fonts/inter';
import { Raleway_400Regular } from '@expo-google-fonts/raleway';
import { PhoneFrame } from './src/components/PhoneFrame';
import { RootNavigator } from './src/navigation/RootNavigator';
import { SearchProvider } from './src/context/SearchContext';
import { colors } from './src/theme/theme';

// Remove the browser's default focus ring on inputs so the web preview
// matches the mockups (no effect on native).
if (Platform.OS === 'web' && typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent =
    'input, textarea, [contenteditable] { outline: none !important; box-shadow: none !important; -webkit-tap-highlight-color: transparent; }';
  document.head.appendChild(style);
}

export default function App() {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
    Raleway_400Regular,
  });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.white }}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <SearchProvider>
        <PhoneFrame>
          <NavigationContainer>
            <RootNavigator />
          </NavigationContainer>
          <StatusBar style="dark" />
        </PhoneFrame>
      </SearchProvider>
    </SafeAreaProvider>
  );
}
