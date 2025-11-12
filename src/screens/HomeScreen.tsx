import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import ApiService, { Product, Banner } from '../services/api';
import { useCart } from '../context/CartContext';

const { width } = Dimensions.get('window');

export const HomeScreen = ({ navigation }: any) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [productsData, bannersData] = await Promise.all([
        ApiService.getProducts(),
        ApiService.getBanners(),
      ]);
      setProducts(productsData);
      setBanners(bannersData);
    } catch (error: any) {
      console.error('Error loading data:', error);
      // عرض رسالة خطأ للمستخدم
      setProducts([]);
      setBanners([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product: Product) => {
    addToCart(product);
    // يمكن إضافة Toast notification هنا
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#059669" />
        <Text style={styles.loadingText}>جاري التحميل...</Text>
      </View>
    );
  }

  // عرض رسالة إذا لم تكن هناك منتجات
  if (products.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.emptyText}>لا توجد منتجات متاحة حالياً</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadData}>
          <Text style={styles.retryText}>إعادة المحاولة</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const firstHalf = products.slice(0, 6);
  const secondHalf = products.slice(6, 12);

  return (
    <ScrollView style={styles.container}>
      {/* Banner 1 */}
      {banners[0] && (
        <TouchableOpacity style={styles.bannerContainer}>
          <Image
            source={{ uri: banners[0].image }}
            style={styles.banner}
            resizeMode="cover"
          />
          <View style={styles.bannerOverlay}>
            <Text style={styles.bannerText}>{banners[0].title}</Text>
          </View>
        </TouchableOpacity>
      )}

      {/* Product Cards Set 1 */}
      <View style={styles.cardsContainer}>
        {firstHalf.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={handleAddToCart}
            onPress={() => navigation.navigate('ProductDetail', { product })}
          />
        ))}
      </View>

      {/* Banner 2 */}
      {banners[1] && (
        <TouchableOpacity style={styles.bannerContainer}>
          <Image
            source={{ uri: banners[1].image }}
            style={styles.banner}
            resizeMode="cover"
          />
          <View style={styles.bannerOverlay}>
            <Text style={styles.bannerText}>{banners[1].title}</Text>
          </View>
        </TouchableOpacity>
      )}

      {/* Product Cards Set 2 */}
      <View style={styles.cardsContainer}>
        {secondHalf.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={handleAddToCart}
            onPress={() => navigation.navigate('ProductDetail', { product })}
          />
        ))}
      </View>

      <View style={styles.footer} />
    </ScrollView>
  );
};

const ProductCard = ({
  product,
  onAddToCart,
  onPress,
}: {
  product: Product;
  onAddToCart: (product: Product) => void;
  onPress: () => void;
}) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Image source={{ uri: product.image }} style={styles.cardImage} />
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{product.name}</Text>
        <Text style={styles.cardPrice}>{product.price} د.ك</Text>
        {product.category && (
          <Text style={styles.cardCategory}>{product.category}</Text>
        )}
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => onAddToCart(product)}
        >
          <Text style={styles.addButtonText}>إضافة للسلة</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#6B7280',
  },
  emptyText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#059669',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  retryText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  bannerContainer: {
    width: width,
    marginVertical: 15,
    position: 'relative',
  },
  banner: {
    width: '100%',
    height: 180,
  },
  bannerOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 15,
  },
  bannerText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  cardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    marginBottom: 10,
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
  footer: {
    height: 20,
  },
});
