import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';
import { HomeScreen } from '../screens/HomeScreen';
import { SearchInitialScreen } from '../screens/SearchInitialScreen';
import { SearchResultsScreen } from '../screens/SearchResultsScreen';
import { ProductListScreen } from '../screens/ProductListScreen';
import { CategoryGridScreen } from '../screens/CategoryGridScreen';
import { DistributorListScreen } from '../screens/DistributorListScreen';
import { ReorderScreen } from '../screens/ReorderScreen';
import { CartScreen } from '../screens/CartScreen';
import { ViewItemsScreen } from '../screens/ViewItemsScreen';
import { YourLocationScreen } from '../screens/YourLocationScreen';
import { AddLocationScreen } from '../screens/AddLocationScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { BusinessDetailsScreen } from '../screens/BusinessDetailsScreen';
import { NotificationsScreen } from '../screens/NotificationsScreen';
import { PaymentsScreen, CreditPartnersScreen } from '../screens/AccountEmptyScreens';
import { ContactUsScreen } from '../screens/ContactUsScreen';

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
      <Stack.Screen name="Reorder" component={ReorderScreen} />
      <Stack.Screen name="Cart" component={CartScreen} />
      <Stack.Screen name="ViewItems" component={ViewItemsScreen} />
      <Stack.Screen name="YourLocation" component={YourLocationScreen} />
      <Stack.Screen name="AddLocation" component={AddLocationScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="BusinessDetails" component={BusinessDetailsScreen} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
      <Stack.Screen name="Payments" component={PaymentsScreen} />
      <Stack.Screen name="CreditPartners" component={CreditPartnersScreen} />
      <Stack.Screen name="ContactUs" component={ContactUsScreen} />
    </Stack.Navigator>
  );
}
