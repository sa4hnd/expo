import { darkTheme, lightTheme } from '@expo/styleguide-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ComponentProps } from 'react';
import { StyleSheet } from 'react-native';

const BottomTabNavigator = createBottomTabNavigator();
export default BottomTabNavigator;

export const getNavigatorProps = (props: {
  theme: string;
}): Partial<ComponentProps<typeof BottomTabNavigator.Navigator>> => ({
  screenOptions: {
    headerShown: false,
    tabBarLabelStyle: { fontFamily: 'Inter-SemiBold' },
    tabBarHideOnKeyboard: false,
    tabBarStyle: {
      display: 'none', // Hide the tab bar
    },
    tabBarActiveTintColor:
      props.theme === 'dark' ? darkTheme.link.default : lightTheme.link.default,
    tabBarInactiveTintColor:
      props.theme === 'dark' ? darkTheme.icon.default : lightTheme.icon.default,
  },
});
