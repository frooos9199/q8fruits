import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export const OrderConfirmationScreen = ({ route, navigation }: any) => {
  const { orderId, total } = route.params || {};

  return (
    <View style={styles.container}>
      <Text style={styles.title}>شكراً لطلبك! ✅</Text>
      {orderId ? (
        <Text style={styles.subtitle}>رقم الطلب: {orderId}</Text>
      ) : null}
      {typeof total === 'number' ? (
        <Text style={styles.total}>الإجمالي: {total.toFixed(3)} د.ك</Text>
      ) : null}

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('HomeTab')}>
        <Text style={styles.buttonText}>العودة للرئيسية</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.button, styles.secondary]} onPress={() => navigation.navigate('Cart')}>
        <Text style={styles.buttonText}>عرض السلة</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#059669',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#111827',
    marginBottom: 8,
  },
  total: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 24,
  },
  button: {
    backgroundColor: '#059669',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 10,
    marginTop: 10,
  },
  secondary: {
    backgroundColor: '#10B981',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
