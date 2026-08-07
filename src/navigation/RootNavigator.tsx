import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { colors } from '../theme';
import HomeScreen from '../screens/HomeScreen';
import JournalListScreen from '../screens/JournalListScreen';
import JournalEntryScreen from '../screens/JournalEntryScreen';
import MoodScreen from '../screens/MoodScreen';
import ToolkitHomeScreen from '../screens/ToolkitHomeScreen';
import ReframeScreen from '../screens/exercises/ReframeScreen';
import UrgeSurfScreen from '../screens/exercises/UrgeSurfScreen';
import UnsentLetterListScreen from '../screens/exercises/UnsentLetterListScreen';
import UnsentLetterComposeScreen from '../screens/exercises/UnsentLetterComposeScreen';
import SettingsScreen from '../screens/SettingsScreen';
import PrivacyPolicyScreen from '../screens/PrivacyPolicyScreen';
import TermsScreen from '../screens/TermsScreen';
import CrisisResourcesScreen from '../screens/CrisisResourcesScreen';
import type {
  HomeStackParamList,
  JournalStackParamList,
  MoodStackParamList,
  RootTabParamList,
  SettingsStackParamList,
  ToolkitStackParamList,
} from './types';

const Tab = createBottomTabNavigator<RootTabParamList>();
const HomeStack = createNativeStackNavigator<HomeStackParamList>();
const JournalStack = createNativeStackNavigator<JournalStackParamList>();
const MoodStack = createNativeStackNavigator<MoodStackParamList>();
const ToolkitStack = createNativeStackNavigator<ToolkitStackParamList>();
const SettingsStack = createNativeStackNavigator<SettingsStackParamList>();

const screenOptions = {
  headerStyle: { backgroundColor: colors.background },
  headerShadowVisible: false,
  headerTitleStyle: { color: colors.text },
  headerTintColor: colors.primaryDark,
};

function HomeStackNavigator() {
  return (
    <HomeStack.Navigator screenOptions={screenOptions}>
      <HomeStack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
    </HomeStack.Navigator>
  );
}

function JournalStackNavigator() {
  return (
    <JournalStack.Navigator screenOptions={screenOptions}>
      <JournalStack.Screen
        name="JournalList"
        component={JournalListScreen}
        options={{ headerShown: false }}
      />
      <JournalStack.Screen
        name="JournalEntry"
        component={JournalEntryScreen}
        options={{ title: 'Journal entry' }}
      />
    </JournalStack.Navigator>
  );
}

function MoodStackNavigator() {
  return (
    <MoodStack.Navigator screenOptions={screenOptions}>
      <MoodStack.Screen name="Mood" component={MoodScreen} options={{ headerShown: false }} />
    </MoodStack.Navigator>
  );
}

function ToolkitStackNavigator() {
  return (
    <ToolkitStack.Navigator screenOptions={screenOptions}>
      <ToolkitStack.Screen
        name="ToolkitHome"
        component={ToolkitHomeScreen}
        options={{ headerShown: false }}
      />
      <ToolkitStack.Screen
        name="Reframe"
        component={ReframeScreen}
        options={{ title: 'Reframe a thought' }}
      />
      <ToolkitStack.Screen
        name="UrgeSurf"
        component={UrgeSurfScreen}
        options={{ title: 'Ride out an urge' }}
      />
      <ToolkitStack.Screen
        name="UnsentLetterList"
        component={UnsentLetterListScreen}
        options={{ title: 'Unsent letters' }}
      />
      <ToolkitStack.Screen
        name="UnsentLetterCompose"
        component={UnsentLetterComposeScreen}
        options={{ title: 'Letter' }}
      />
    </ToolkitStack.Navigator>
  );
}

function SettingsStackNavigator() {
  return (
    <SettingsStack.Navigator screenOptions={screenOptions}>
      <SettingsStack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ headerShown: false }}
      />
      <SettingsStack.Screen
        name="PrivacyPolicy"
        component={PrivacyPolicyScreen}
        options={{ title: 'Privacy Policy' }}
      />
      <SettingsStack.Screen name="Terms" component={TermsScreen} options={{ title: 'Terms of Use' }} />
      <SettingsStack.Screen
        name="Crisis"
        component={CrisisResourcesScreen}
        options={{ title: 'Crisis resources' }}
      />
    </SettingsStack.Navigator>
  );
}

const TAB_ICONS: Record<keyof RootTabParamList, keyof typeof Ionicons.glyphMap> = {
  HomeTab: 'home',
  JournalTab: 'book',
  MoodTab: 'heart',
  ToolkitTab: 'construct',
  SettingsTab: 'settings',
};

export default function RootNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primaryDark,
        tabBarInactiveTintColor: colors.textFaint,
        tabBarStyle: { backgroundColor: colors.surface, borderTopColor: colors.border },
        tabBarIcon: ({ color, size }) => (
          <Ionicons name={TAB_ICONS[route.name as keyof RootTabParamList]} size={size} color={color} />
        ),
      })}
    >
      <Tab.Screen name="HomeTab" component={HomeStackNavigator} options={{ title: 'Home' }} />
      <Tab.Screen
        name="JournalTab"
        component={JournalStackNavigator}
        options={{ title: 'Journal' }}
      />
      <Tab.Screen name="MoodTab" component={MoodStackNavigator} options={{ title: 'Mood' }} />
      <Tab.Screen
        name="ToolkitTab"
        component={ToolkitStackNavigator}
        options={{ title: 'Toolkit' }}
      />
      <Tab.Screen
        name="SettingsTab"
        component={SettingsStackNavigator}
        options={{ title: 'Settings' }}
      />
    </Tab.Navigator>
  );
}
