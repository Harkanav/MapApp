import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import MapCompleteScreen from '../screens/Map';

export type RootStackParamList = {
  MapScreen: undefined;
};

export const AppStack = () => {
  const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator
      initialRouteName="MapScreen"
      // screenOptions={{headerShown: false}}
    >
      <Stack.Screen
        name="MapCompleteScreen"
        component={MapCompleteScreen}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};
