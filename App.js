import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AnalyzerScreen from "./screens/AnalyzerScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Analyzer"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Analyzer" component={AnalyzerScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
