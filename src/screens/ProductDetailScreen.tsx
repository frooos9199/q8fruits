import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { useCart } from '../context/CartContext';
import { Product } from '../services/api';

const { width, height } = Dimensions.get('window');

export const ProductDetailScreen = ({ route, navigation }: any) => {
  const { product } = route.params as { product: Product };
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    navigation.navigate('Cart');
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <Image source={{ uri: product.image }} style={styles.productImage} />
        
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.productName}>{product.name}</Text>
            {product.category && (
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryText}>{product.category}</Text>
              </View>
            )}
          </View>

          <Text style={styles.price}>{product.price} د.ك</Text>

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>الوصف</Text>
          <Text style={styles.description}>
            {product.description ||
              'منتج طازج ومميز من أفضل المزارع المحلية. يتميز بجودة عالية وطعم لذيذ. مناسب لجميع أفراد العائلة.'}
          </Text>

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>الكمية</Text>
          <View style={styles.quantityContainer}>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() => setQuantity(Math.max(1, quantity - 1))}
            >
              <Text style={styles.quantityButtonText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.quantity}>{quantity}</Text>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() => setQuantity(quantity + 1)}
            >
              <Text style={styles.quantityButtonText}>+</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.features}>
            <View style={styles.feature}>
              <Text style={styles.featureIcon}>✅</Text>
              <Text style={styles.featureText}>منتج طازج</Text>
            </View>
            <View style={styles.feature}>
              <Text style={styles.featureIcon}>🚚</Text>
              <Text style={styles.featureText}>توصيل سريع</Text>
            </View>
            <View style={styles.feature}>
              <Text style={styles.featureIcon}>💯</Text>
              <Text style={styles.featureText}>جودة مضمونة</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>الإجمالي:</Text>
          <Text style={styles.totalPrice}>
            {(parseFloat(product.price) * quantity).toFixed(3)} د.ك
          </Text>
        </View>
        <TouchableOpacity style={styles.addButton} onPress={handleAddToCart}>
          <Text style={styles.addButtonText}>إضافة للسلة</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  productImage: {
    width: width,
    height: height * 0.4,
  },
  content: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  productName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    flex: 1,
    textAlign: 'right',
  },
  categoryBadge: {
    backgroundColor: '#059669',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginLeft: 10,
  },
  categoryText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  price: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#059669',
    marginBottom: 20,
    textAlign: 'right',
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 10,
    textAlign: 'right',
  },
  description: {
    fontSize: 16,
    color: '#6B7280',
    lineHeight: 24,
    textAlign: 'right',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 15,
  },
  quantityButton: {
    backgroundColor: '#059669',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  quantity: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginHorizontal: 30,
    minWidth: 50,
    textAlign: 'center',
  },
  features: {
    marginTop: 20,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    justifyContent: 'flex-end',
  },
  featureIcon: {
    fontSize: 20,
    marginLeft: 10,
  },
  featureText: {
    fontSize: 16,
    color: '#1F2937',
  },
  footer: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalContainer: {
    flex: 1,
  },
  totalLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 5,
    textAlign: 'right',
  },
  totalPrice: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#059669',
    textAlign: 'right',
  },
  addButton: {
    backgroundColor: '#059669',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 12,
    marginLeft: 15,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
