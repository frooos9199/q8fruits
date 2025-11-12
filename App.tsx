/**
 * Q8 Fruit Pro App
 * @format
 */

import React from 'react';
import { StatusBar, useColorScheme, View, Text, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { CartProvider, useCart } from './src/context/CartContext';
import { HomeScreen } from './src/screens/HomeScreen';
import { CartScreen } from './src/screens/CartScreen';
import { CategoriesScreen } from './src/screens/CategoriesScreen';
import { ProductDetailScreen } from './src/screens/ProductDetailScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Home Stack Navigator
function HomeStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#059669',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerTitleAlign: 'center',
      }}
    >
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: 'فكهاني الكويت' }}
      />
      <Stack.Screen
        name="ProductDetail"
        component={ProductDetailScreen}
        options={{ title: 'تفاصيل المنتج' }}
      />
    </Stack.Navigator>
  );
}

// Categories Stack Navigator
function CategoriesStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#059669',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerTitleAlign: 'center',
      }}
    >
      <Stack.Screen
        name="Categories"
        component={CategoriesScreen}
        options={{ title: 'الفئات' }}
      />
      <Stack.Screen
        name="ProductDetail"
        component={ProductDetailScreen}
        options={{ title: 'تفاصيل المنتج' }}
      />
    </Stack.Navigator>
  );
}

// Cart Stack Navigator
function CartStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#059669',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerTitleAlign: 'center',
      }}
    >
      <Stack.Screen
        name="Cart"
        component={CartScreen}
        options={{ title: 'السلة' }}
      />
      <Stack.Screen
        name="Checkout"
        component={require('./src/screens/CheckoutScreen').CheckoutScreen}
        options={{ title: 'إتمام الطلب' }}
      />
      <Stack.Screen
        name="OrderConfirmation"
        component={require('./src/screens/OrderConfirmationScreen').OrderConfirmationScreen}
        options={{ title: 'تأكيد الطلب' }}
      />
    </Stack.Navigator>
  );
}

// Tab Icon Component
const TabIcon = ({ icon, focused }: { icon: string; focused: boolean }) => (
  <Text style={{ fontSize: 24, opacity: focused ? 1 : 0.5 }}>{icon}</Text>
);

// Cart Badge Component
const CartBadge = () => {
  const { getCartCount } = useCart();
  const count = getCartCount();

  if (count === 0) return null;

  return (
    <View style={styles.badge}>
      <Text style={styles.badgeText}>{count}</Text>
    </View>
  );
};

// Main Tab Navigator
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#059669',
        tabBarInactiveTintColor: '#6B7280',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#E5E7EB',
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeStack}
        options={{
          tabBarLabel: 'الرئيسية',
          tabBarIcon: ({ focused }) => (
            <TabIcon icon="🏠" focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="CategoriesTab"
        component={CategoriesStack}
        options={{
          tabBarLabel: 'الفئات',
          tabBarIcon: ({ focused }) => (
            <TabIcon icon="📂" focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="CartTab"
        component={CartStack}
        options={{
          tabBarLabel: 'السلة',
          tabBarIcon: ({ focused }) => (
            <View>
              <TabIcon icon="🛒" focused={focused} />
              <CartBadge />
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
}

// Main App Component
function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <CartProvider>
      <NavigationContainer>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
        <MainTabs />
      </NavigationContainer>
    </CartProvider>
  );
}

const styles = StyleSheet.create({
  badge: {
    position: 'absolute',
    right: -6,
    top: -3,
    backgroundColor: '#DC2626',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default App;
