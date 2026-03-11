// src/navigation/AppNavigator.tsx
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CalendarScreen from '../screens/CalendarScreen';
import FestivalDetail from '../screens/FestivalDetail';
import RegionFilter from '../screens/RegionFilter';
import ReminderSettings from '../screens/ReminderSettings';

type CalendarStackParamList = {
  CalendarMain: undefined;
  FestivalDetail: { festivalId: string };
};

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator<CalendarStackParamList>();

function CalendarStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="CalendarMain"
        component={CalendarScreen}
        options={{ title: '节日日历', headerStyle: { backgroundColor: '#FBF7F0' } }}
      />
      <Stack.Screen
        name="FestivalDetail"
        component={FestivalDetail}
        options={{ title: '节日详情', headerStyle: { backgroundColor: '#FBF7F0' } }}
      />
    </Stack.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName: string;
              if (route.name === 'Calendar') {
                iconName = focused ? 'calendar' : 'calendar-outline';
              } else if (route.name === 'Regions') {
                iconName = focused ? 'map' : 'map-outline';
              } else {
                iconName = focused ? 'notifications' : 'notifications-outline';
              }
              return <Ionicons name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: '#C0392B',
            tabBarInactiveTintColor: '#999',
            headerShown: false,
            tabBarStyle: { backgroundColor: '#FBF7F0' },
          })}
        >
          <Tab.Screen name="Calendar" component={CalendarStack} options={{ title: '日历', tabBarLabel: '日历' }} />
          <Tab.Screen name="Regions" component={RegionFilter} options={{ title: '地区', tabBarLabel: '地区' }} />
          <Tab.Screen name="Settings" component={ReminderSettings} options={{ title: '提醒', tabBarLabel: '提醒' }} />
        </Tab.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}
