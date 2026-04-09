import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { enableScreens } from 'react-native-screens';

import { useAuth } from '../auth/AuthProvider';
import { AddItemScreen } from '../screens/AddItemScreen';
import { CalendarScreen } from '../screens/CalendarScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { LoginScreen } from '../screens/LoginScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { SignUpScreen } from '../screens/SignUpScreen';
import { StatsScreen } from '../screens/StatsScreen';
import { useTheme } from '../theme/ThemeProvider';
import type {
  CalendarStackParamList,
  HomeStackParamList,
  RootStackParamList,
  StatsStackParamList,
  TabsParamList,
} from './types';


enableScreens();

const RootStack = createNativeStackNavigator<RootStackParamList>();
const Tabs = createBottomTabNavigator<TabsParamList>();
const HomeStack = createNativeStackNavigator<HomeStackParamList>();
const StatsStack = createNativeStackNavigator<StatsStackParamList>();
const CalendarStack = createNativeStackNavigator<CalendarStackParamList>();

function HomeStackNavigator() {
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
      <HomeStack.Screen name="Home" component={HomeScreen} />
      <HomeStack.Screen name="Profile" component={ProfileScreen} />
      <HomeStack.Screen name="AddItem" component={AddItemScreen} />
    </HomeStack.Navigator>
  );
}

function StatsStackNavigator() {
  return (
    <StatsStack.Navigator screenOptions={{ headerShown: false }}>
      <StatsStack.Screen name="Stats" component={StatsScreen} />
      <StatsStack.Screen name="AddItem" component={AddItemScreen} />
    </StatsStack.Navigator>
  );
}

function CalendarStackNavigator() {
  return (
    <CalendarStack.Navigator screenOptions={{ headerShown: false }}>
      <CalendarStack.Screen name="Calendar" component={CalendarScreen} />
      <CalendarStack.Screen name="AddItem" component={AddItemScreen} />
    </CalendarStack.Navigator>
  );
}

function MainTabs() {
  const { colors } = useTheme();
  return (
    <Tabs.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.purple,
        tabBarInactiveTintColor: colors.muted,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: colors.lavenderDeep,
          borderTopColor: 'transparent',
          height: 72,
          paddingTop: 8,
        },
        tabBarIcon: ({ color, size }) => {
          if (route.name === 'HomeStack') {
            return <Ionicons name="home" color={color} size={size} />;
          }
          if (route.name === 'StatsStack') {
            return <MaterialCommunityIcons name="chart-bar" color={color} size={size} />;
          }
          return <Ionicons name="calendar" color={color} size={size} />;
        },
      })}
    >
      <Tabs.Screen name="HomeStack" component={HomeStackNavigator} />
      <Tabs.Screen name="StatsStack" component={StatsStackNavigator} />
      <Tabs.Screen name="CalendarStack" component={CalendarStackNavigator} />
    </Tabs.Navigator>
  );
}

export function AppNavigator() {
  const { state } = useAuth();
  const signedIn = Boolean(state.user);
  return (
    <RootStack.Navigator screenOptions={{ headerShown: false }}>
      {signedIn ? (
        <RootStack.Screen name="Main" component={MainTabs} />
      ) : (
        <>
          <RootStack.Screen name="Login" component={LoginScreen} />
          <RootStack.Screen name="SignUp" component={SignUpScreen} />
        </>
      )}
    </RootStack.Navigator>
  );
}
