import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Ionicons } from '@expo/vector-icons';
import { Link, Tabs } from 'expo-router';
import { Pressable } from 'react-native';

import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';
import { useAuth } from '@clerk/clerk-expo';
import { Redirect } from 'expo-router';

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

function IonIcon(props: {
  name: React.ComponentProps<typeof Ionicons>['name'];
  color: string;
}) {
  return <Ionicons size={24} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const { isSignedIn, isLoaded } = useAuth();

  // If auth is loaded and user is not signed in, redirect to login
  if (isLoaded && !isSignedIn) {
    return <Redirect href="/(auth)/login" />;
  }

  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#F9A11B',
        headerShown: useClientOnlyValue(false, true),
        tabBarStyle: {
          position: 'absolute',
          bottom: 20,
          left: 20,
          right: 20,
          elevation: 0,
          backgroundColor: '#ffffff',
          borderRadius: 25,
          height: 60,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 3,
          paddingBottom: 5,
          paddingTop: 5,
        },
        tabBarItemStyle: {
          height: 50,
          borderRadius: 10,
          marginHorizontal: 5,
        },
        tabBarShowLabel: false, // Hide the tab labels
      }}>
      <Tabs.Screen
        name="index"
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => <IonIcon name="home" color={color} />,
        }}
      />
      <Tabs.Screen
        name="two"
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => <IonIcon name="location-outline" color={color} />,
        }}
      />
      <Tabs.Screen
        name="three"
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => <IonIcon name="person-outline" color={color} />,
        }}
      />
    </Tabs>
  );
}
