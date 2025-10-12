import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider as PaperProvider, DefaultTheme } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import { IncidentProvider } from './src/context/IncidentContext';

import IncidentListScreen from './src/screens/IncidentListScreen';
import AddIncidentScreen from './src/screens/AddIncidentScreen';
import IncidentDetailScreen from './src/screens/IncidentDetailScreen';
import EditIncidentScreen from './src/screens/EditIncidentScreen';

const Stack = createStackNavigator();

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#1976d2',
    accent: '#f50057',
    background: '#f5f5f5',
  },
};

export default function App() {
  return (
    <PaperProvider theme={theme}>
      <IncidentProvider>
        <NavigationContainer>
          <StatusBar style="auto" />
          <Stack.Navigator
            initialRouteName="IncidentList"
            screenOptions={{
              headerStyle: {
                backgroundColor: '#1976d2',
              },
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontWeight: 'bold',
              },
            }}
          >
            <Stack.Screen 
              name="IncidentList" 
              component={IncidentListScreen}
              options={{
                title: 'Cyber Incidents',
              }}
            />
            <Stack.Screen 
              name="AddIncident" 
              component={AddIncidentScreen}
              options={{
                title: 'Add New Incident',
              }}
            />
            <Stack.Screen 
              name="IncidentDetail" 
              component={IncidentDetailScreen}
              options={{
                title: 'Incident Details',
              }}
            />
            <Stack.Screen 
              name="EditIncident" 
              component={EditIncidentScreen}
              options={{
                title: 'Edit Incident',
              }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </IncidentProvider>
    </PaperProvider>
  );
}
