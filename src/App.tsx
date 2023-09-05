import {KeyboardAvoidingView, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import 'react-native-gesture-handler';
// import MapScreen from './screens/MapScreen';
import MapCompleteScreen from '.';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

// export type RootStackParamList = {
//   PolygonPage: undefined;
//   MapScreen: undefined;
// };

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="MapScreen"
          // seecrnOptions={{headerShown: false}}
        >
          <Stack.Screen
            name="MapCompleteScreen"
            component={MapCompleteScreen}
            options={{headerShown: false}}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
};

export default App;

const styles = StyleSheet.create({});
