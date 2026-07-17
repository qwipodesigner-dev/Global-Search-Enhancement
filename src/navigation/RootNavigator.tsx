import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';
import { HomeScreen } from '../screens/HomeScreen';
import { SearchInitialScreen } from '../screens/SearchInitialScreen';
import { SearchResultsScreen } from '../screens/SearchResultsScreen';
import { ProductListScreen } from '../screens/ProductListScreen';
import { CategoryGridScreen } from '../screens/CategoryGridScreen';
import { DistributorListScreen } from '../screens/DistributorListScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{ headerShown: false, animation: 'slide_from_right', contentStyle: { backgroundColor: '#fff' } }}
    >
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="SearchInitial" component={SearchInitialScreen} />
      <Stack.Screen name="SearchResults" component={SearchResultsScreen} />
      <Stack.Screen name="ProductList" component={ProductListScreen} />
      <Stack.Screen name="CategoryGrid" component={CategoryGridScreen} />
      <Stack.Screen name="DistributorList" component={DistributorListScreen} />
    </Stack.Navigator>
  );
}
