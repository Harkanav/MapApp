import {StyleSheet, StatusBar, View} from 'react-native';
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {AppStack} from './navigation/AppStack';

export type RootStackParamList = {
  MapScreen: undefined;
};

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#FFF"
        animated={true}
      />
      <NavigationContainer>
        {/* ---------------------- All the screens are in AppStack  */}
        <AppStack />
        {/* -------------------------------------------------- */}
      </NavigationContainer>
    </GestureHandlerRootView>
  );
};

export default App;

const styles = StyleSheet.create({});
