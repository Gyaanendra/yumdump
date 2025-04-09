import React from 'react';
import { StyleSheet, View, Text, ScrollView, Image, TextInput, TouchableOpacity, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';

const categories = [
  { id: '1', name: 'Italian' },
  { id: '2', name: 'Western' },
  { id: '3', name: 'Japanese' },
  { id: '4', name: 'Indian' },
];

const restaurants = [
  {
    id: '1',
    name: 'ABC Pizzeria',
    address: '123 Market, India',
    phone: '08123456789',
    rating: 5.0,
    image: require('@/assets/images/pizza.png'),
  },
  {
    id: '2',
    name: 'ABC Pizzeria',
    address: '123 Market, India',
    phone: '08123456789',
    rating: 5.0,
    image: require('@/assets/images/pizza.png'),
  },
  
  // You can add more restaurants here
];

export default function TabOneScreen() {
  const colorScheme = useColorScheme();

  const renderCategoryItem = ({ item }) => (
    <TouchableOpacity style={styles.categoryButton}>
      <Text style={styles.categoryText}>{item.name}</Text>
    </TouchableOpacity>
  );

  const renderRestaurantItem = ({ item }) => (
    <View style={styles.restaurantCard}>
      <Image source={item.image} style={styles.restaurantImage} />
      <View style={styles.restaurantInfo}>
        <Text style={styles.restaurantName}>{item.name}</Text>
        <Text style={styles.restaurantAddress}>{item.address}</Text>
        <Text style={styles.restaurantPhone}>{item.phone}</Text>
      </View>
      <View style={styles.ratingContainer}>
        <Ionicons name="star" size={16} color="#F9A11B" />
        <Text style={styles.ratingText}>{item.rating.toFixed(1)}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Ionicons name="restaurant-outline" size={24} color="#F9A11B" />
          <Text style={styles.logoText}>Hello! Garvita</Text>
        </View>
        <TouchableOpacity>
          <Ionicons name="notifications-outline" size={24} color="#F9A11B" />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={20} color="#999" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search here"
          placeholderTextColor="#999"
        />
      </View>

      <Text style={styles.sectionTitle}>What do you want to eat?</Text>

      <FlatList
        horizontal
        data={categories}
        renderItem={renderCategoryItem}
        keyExtractor={item => item.id}
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesList}
      />

      <FlatList
        data={restaurants}
        renderItem={renderRestaurantItem}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        style={styles.restaurantsList}
      />

      {/* Bottom tab bar removed */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    marginHorizontal: 20,
    paddingHorizontal: 15,
    marginVertical: 15,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 20,
    marginTop: 10,
    marginBottom: 15,
  },
  categoriesList: {
    paddingLeft: 15,
    marginBottom: 15,
  },
  categoryButton: {
    backgroundColor: '#F9A11B',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginHorizontal: 5,
  },
  categoryText: {
    color: 'white',
    fontWeight: '500',
  },
  restaurantsList: {
    paddingHorizontal: 20,
  },
  restaurantCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    marginBottom: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  restaurantImage: {
    width: '100%',
    height: 180,
    resizeMode: 'cover',
  },
  restaurantInfo: {
    padding: 15,
  },
  restaurantName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  restaurantAddress: {
    fontSize: 14,
    color: '#666',
    marginBottom: 3,
  },
  restaurantPhone: {
    fontSize: 14,
    color: '#666',
  },
  ratingContainer: {
    position: 'absolute',
    top: 15,
    right: 15,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  ratingText: {
    marginLeft: 4,
    fontWeight: 'bold',
    color: '#F9A11B',
  },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    width: 50,
  },
});
