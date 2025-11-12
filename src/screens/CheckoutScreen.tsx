import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator } from 'react-native';
import { useCart } from '../context/CartContext';
import ApiService, { CreateOrderPayload } from '../services/api';

export const CheckoutScreen = ({ navigation }: any) => {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);

  const total = getCartTotal();

  const placeOrder = async () => {
    if (!name || !phone || !address) {
      Alert.alert('بيانات ناقصة', 'الرجاء إدخال الاسم ورقم الهاتف والعنوان');
      return;
    }
    // تحقق بسيط من رقم الهاتف (8-15 أرقام)
    const phoneDigits = phone.replace(/\D/g, '');
    if (phoneDigits.length < 8 || phoneDigits.length > 15) {
      Alert.alert('رقم غير صحيح', 'الرجاء إدخال رقم هاتف صحيح');
      return;
    }

    try {
      setLoading(true);
      // تجهيز البيانات
      const items = cartItems.map(ci => ({
        id: ci.id,
        name: ci.name,
        price: ci.price,
        quantity: ci.quantity,
      }));
      const total = items.reduce((sum, i) => sum + (parseFloat(i.price) * i.quantity), 0);
      const payload: CreateOrderPayload = {
        customerName: name,
        phone,
        address,
        note,
        items,
        total,
      };

      const result = await ApiService.createOrder(payload);
      if (result.success) {
        clearCart();
        Alert.alert(
          'تم إنشاء الطلب ✅',
          `شكراً لك! تم استلام طلبك بنجاح.${result.orderId ? `\nرقم الطلب: ${result.orderId}` : ''}`,
          [
            {
              text: 'متابعة',
              onPress: () => navigation.navigate('OrderConfirmation', { orderId: result.orderId, total }),
            },
          ],
        );
      } else {
        Alert.alert('خطأ', result.error || 'تعذر إنشاء الطلب، الرجاء المحاولة لاحقاً');
      }
    } catch (e: any) {
      const msg = e?.message || 'الرجاء المحاولة لاحقاً';
      Alert.alert('حدث خطأ', msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 24 }}>
        <Text style={styles.title}>إتمام الطلب</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>بيانات التوصيل</Text>
          <TextInput
            style={styles.input}
            placeholder="الاسم الكامل"
            value={name}
            onChangeText={setName}
          />
          <TextInput
            style={styles.input}
            placeholder="رقم الهاتف"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
          />
          <TextInput
            style={[styles.input, styles.textarea]}
            placeholder="العنوان الكامل"
            value={address}
            onChangeText={setAddress}
            multiline
          />
          <TextInput
            style={[styles.input, styles.textarea]}
            placeholder="ملاحظات (اختياري)"
            value={note}
            onChangeText={setNote}
            multiline
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ملخص الطلب</Text>
          <Text style={styles.row}>عدد العناصر: {cartItems.length}</Text>
          <Text style={styles.total}>الإجمالي: {total.toFixed(3)} د.ك</Text>
        </View>

        <TouchableOpacity style={[styles.submitButton, (loading || cartItems.length === 0) && { opacity: 0.6 }]} onPress={placeOrder} disabled={loading || cartItems.length === 0}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitButtonText}>تأكيد الطلب</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1F2937',
    textAlign: 'right',
    marginBottom: 16,
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
    textAlign: 'right',
  },
  input: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 10,
    textAlign: 'right',
  },
  textarea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  row: {
    fontSize: 14,
    color: '#374151',
    textAlign: 'right',
    marginBottom: 6,
  },
  total: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#059669',
    textAlign: 'right',
    marginTop: 8,
  },
  submitButton: {
    backgroundColor: '#059669',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
