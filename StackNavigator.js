import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import HomeScreen from './screens/HomeScreen'
import LoginScreen from './screens/LoginScreen'
import SaleScreen from './screens/SaleScreen'
import ClientScreen from './screens/ClientScreen'
import CartScreen from './screens/CartScreen'
import PrintScreen from './screens/PrintScreen'
import PrintScreen2 from './screens/PrintScreen2'
import DeactivatedAccountScreen from './screens/DeactivatedAccountScreen'
import MySalesScreen from './screens/MySalesScreen'
import SaleDetailsScreen from './screens/SaleDetailsScreen'
import MyBillsScreen from './screens/MyBillsScreen'
import BillDetailsScreen from './screens/BillDetailsScreen'

const StackNavigator = () => {
  const Stack = createNativeStackNavigator()
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Sale"
          component={SaleScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Client"
          component={ClientScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Cart"
          component={CartScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Print"
          component={PrintScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Print2"
          component={PrintScreen2}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="DeactivatedAccount"
          component={DeactivatedAccountScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="MySales"
          component={MySalesScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="SaleDetails"
          component={SaleDetailsScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="MyBills"
          component={MyBillsScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="BillDetails"
          component={BillDetailsScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default StackNavigator

const styles = StyleSheet.create({})
