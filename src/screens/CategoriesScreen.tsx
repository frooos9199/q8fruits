import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
} from 'react-native';
import ApiService, { Product } from '../services/api';
import { useCart } from '../context/CartContext';

const { width } = Dimensions.get('window');

const categories = [
  { id: 'all', name: 'جميع المنتجات', icon: '🍎' },
  { id: 'فواكه', name: 'فواكه', icon: '🍎' },
  { id: 'خضار', name: 'خضار', icon: '🥕' },
  { id: 'ورقيات', name: 'ورقيات', icon: '🥬' },
];

export const CategoriesScreen = ({ navigation }: any) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [_loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await ApiService.getProducts();
      setProducts(data);
    } catch (error: any) {
      console.error('Error loading products:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts =
    selectedCategory === 'all'
      ? products
      : products.filter((p) => p.category === selectedCategory);

  return (
    <View style={styles.container}>
      {/* Categories Header */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesContainer}
      >
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat.id}
            style={[
              styles.categoryButton,
              selectedCategory === cat.id && styles.categoryButtonActive,
            ]}
            onPress={() => setSelectedCategory(cat.id)}
          >
            <Text style={styles.categoryIcon}>{cat.icon}</Text>
            <Text
              style={[
                styles.categoryText,
                selectedCategory === cat.id && styles.categoryTextActive,
              ]}
            >
              {cat.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Products Grid */}
      <ScrollView style={styles.productsContainer}>
        {filteredProducts.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>لا توجد منتجات في هذه الفئة</Text>
          </View>
        ) : (
          <View style={styles.cardsContainer}>
            {filteredProducts.map((product) => (
              <TouchableOpacity
                key={product.id}
                style={styles.card}
                onPress={() => navigation.navigate('ProductDetail', { product })}
              >
                <Image source={{ uri: product.image }} style={styles.cardImage} />
                <View style={styles.cardContent}>
                  <Text style={styles.cardTitle}>{product.name}</Text>
                  <Text style={styles.cardPrice}>{product.price} د.ك</Text>
                  {product.category && (
                    <Text style={styles.cardCategory}>{product.category}</Text>
                  )}
                  <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => addToCart(product)}
                  >
                    <Text style={styles.addButtonText}>إضافة للسلة</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  categoriesContainer: {
    maxHeight: 80,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    marginHorizontal: 5,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
  },
  categoryButtonActive: {
    backgroundColor: '#059669',
  },
  categoryIcon: {
    fontSize: 24,
    marginRight: 8,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  categoryTextActive: {
    color: '#FFFFFF',
  },
  productsContainer: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
  cardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingTop: 15,
  },
  card: {
    width: (width - 30) / 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardImage: {
    width: '100%',
    height: 120,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  cardContent: {
    padding: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 5,
    textAlign: 'right',
  },
  cardPrice: {
    fontSize: 14,
    color: '#059669',
    fontWeight: '600',
    marginBottom: 5,
    textAlign: 'right',
  },
  cardCategory: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 8,
    textAlign: 'right',
  },
  addButton: {
    backgroundColor: '#059669',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
});
