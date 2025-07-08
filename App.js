import { SafeAreaProvider } from 'react-native-safe-area-context';
import { OrientationProvider } from './OrientationContext';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WebView from './screens/webview';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';

const Stack = createNativeStackNavigator();

const MainScreen = () => {
  const insets = useSafeAreaInsets();
  return (
    <View
      style={{
        flex: 1,
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        paddingLeft: insets.left,
        paddingRight: insets.right,
        backgroundColor: '#000000',
      }}
    >
      <NavigationContainer>
      <Stack.Navigator  initialRouteName="WebView" screenOptions={{ headerShown: false }}>
        <Stack.Screen
          name="WebView"
          component={WebView}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
      </NavigationContainer>
      <StatusBar style="light" translucent backgroundColor="transparent" />
    </View>
  );
};


export default function App() {
  return (
    <SafeAreaProvider>
      <OrientationProvider>
        <MainScreen />
      </OrientationProvider>
    </SafeAreaProvider>
  );
}
