import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, Image, TextInput, TouchableOpacity, FlatList, Modal, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import { router } from 'expo-router';
import { useUser } from '@clerk/clerk-expo';
import { fetchRestaurants } from '@/services/restaurantService';
import { Restaurant } from '@/types/restaurant';

const categories = [
  { id: '1', name: 'Italian' },
  { id: '2', name: 'Western' },
  { id: '3', name: 'Japanese' },
  { id: '4', name: 'Indian' },
  { id: '5', name: 'Thai' },
  { id: '6', name: 'Mediterranean' },
];

interface Notification {
  id: string;
  type: string;
  icon: string;
  iconColor: string;
  message: string;
  time: string;
}

interface Category {
  id: string;
  name: string;
}

export default function TabOneScreen() {
  const colorScheme = useColorScheme();
  const { user } = useUser();
  const [notificationModalVisible, setNotificationModalVisible] = useState(false);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Sample notifications data
  const notifications: Notification[] = [
    {
      id: '1',
      type: 'review',
      icon: 'chatbubble-ellipses-outline',
      iconColor: '#F9A11B',
      message: 'You got 10 new review reply',
      time: '2h ago'
    },
    {
      id: '2',
      type: 'video',
      icon: 'play',
      iconColor: '#3498db',
      message: 'Your video submission is approved!',
      time: '5h ago'
    },
    {
      id: '3',
      type: 'recommendation',
      icon: 'restaurant-outline',
      iconColor: '#F9A11B',
      message: 'Try something new! We have curated the...',
      time: '1d ago'
    }
  ];

  useEffect(() => {
    async function loadRestaurants() {
      try {
        setLoading(true);
        const data = await fetchRestaurants();
        setRestaurants(data);
        setFilteredRestaurants(data); // Initialize filtered restaurants with all restaurants
        setError(null);
      } catch (err) {
        setError('Failed to load restaurants');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadRestaurants();
  }, []);

  // Add search functionality
  const handleSearch = (text: string) => {
    setSearchQuery(text);
    if (text.trim() === '') {
      setFilteredRestaurants(restaurants);
    } else {
      const filtered = restaurants.filter(restaurant => 
        restaurant.name.toLowerCase().includes(text.toLowerCase()) ||
        restaurant.location.toLowerCase().includes(text.toLowerCase()) ||
        restaurant.description?.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredRestaurants(filtered);
    }
  };

  // Filter by category
  const handleCategoryPress = (categoryId: string, categoryName: string) => {
    if (categoryId === 'all') {
      setFilteredRestaurants(restaurants);
    } else {
      const filtered = restaurants.filter(restaurant => 
        restaurant.cuisine_type?.toLowerCase() === categoryName.toLowerCase()
      );
      setFilteredRestaurants(filtered.length > 0 ? filtered : restaurants);
    }
  };

  const renderCategoryItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.categoryButton}
      onPress={() => handleCategoryPress(item.id, item.name)}
    >
      <Text style={styles.categoryText}>{item.name}</Text>
    </TouchableOpacity>
  );

  const renderRestaurantItem = ({ item }: { item: Restaurant }) => (
    <TouchableOpacity 
      style={styles.restaurantCard}
      onPress={() => router.push(`/restaurant/${item.restaurant_id}`)}
    >
      <Image 
        source={{ uri: item.thumbnail.replace(/\s|`/g, '') }} 
        style={styles.restaurantImage} 
        defaultSource={require('@/assets/images/pizza.png')}
      />
      <View style={styles.restaurantInfo}>
        <Text style={styles.restaurantName}>{item.name}</Text>
        <Text style={styles.restaurantAddress}>{item.location}</Text>
        <Text style={styles.restaurantPhone}>{item.phone_number}</Text>
      </View>
      <View style={styles.ratingContainer}>
        <Ionicons name="star" size={16} color="#F9A11B" />
        <Text style={styles.ratingText}>
          {item.user_reviews.length > 0 
            ? (item.user_reviews.reduce((acc, review) => acc + review.stars, 0) / item.user_reviews.length).toFixed(1)
            : 'N/A'}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderNotificationItem = ({ item }: { item: Notification }) => (
    <TouchableOpacity style={styles.notificationItem}>
      <View style={[styles.notificationIconContainer, { backgroundColor: item.iconColor + '20' }]}>
        <Ionicons name={item.icon} size={24} color={item.iconColor} />
      </View>
      <View style={styles.notificationContent}>
        <Text style={styles.notificationMessage}>{item.message}</Text>
        <Text style={styles.notificationTime}>{item.time}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Ionicons name="restaurant-outline" size={24} color="#F9A11B" />
          <Text style={styles.logoText}>Hello! {user?.firstName || user?.primaryEmailAddress?.emailAddress?.split('@')[0] || 'User'}</Text>
        </View>
        <TouchableOpacity onPress={() => setNotificationModalVisible(true)}>
          <Ionicons name="notifications-outline" size={24} color="#F9A11B" />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={20} color="#999" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search here"
          placeholderTextColor="#999"
          value={searchQuery}
          onChangeText={handleSearch}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => handleSearch('')}>
            <Ionicons name="close-circle" size={20} color="#999" />
          </TouchableOpacity>
        )}
      </View>

      <Text style={styles.sectionTitle}>What do you want to eat?</Text>

      <FlatList
        horizontal
        data={categories}
        renderItem={renderCategoryItem}
        keyExtractor={item => item.id}
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesList}
        contentContainerStyle={styles.categoriesContentContainer}
      />

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#F9A11B" />
          <Text style={styles.loadingText}>Loading restaurants...</Text>
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={48} color="#F9A11B" />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={() => fetchRestaurants().then(setRestaurants)}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={filteredRestaurants}
          renderItem={renderRestaurantItem}
          keyExtractor={item => item.restaurant_id.toString()}
          showsVerticalScrollIndicator={false}
          style={styles.restaurantsList}
          ListEmptyComponent={
            <View style={styles.emptyResultContainer}>
              <Ionicons name="search-outline" size={48} color="#F9A11B" />
              <Text style={styles.emptyResultText}>No restaurants found</Text>
            </View>
          }
        />
      )}

      {/* Notification Modal */}
      <Modal
        animationType="slide"
        transparent={false}
        visible={notificationModalVisible}
        onRequestClose={() => setNotificationModalVisible(false)}
      >
        <View style={styles.notificationContainer}>
          <View style={styles.notificationHeader}>
            <TouchableOpacity onPress={() => setNotificationModalVisible(false)}>
              <Ionicons name="arrow-back" size={24} color="#F9A11B" />
            </TouchableOpacity>
            <Text style={styles.notificationTitle}>Notification</Text>
            <View style={{ width: 24 }} />
          </View>
          
          {loading ? (
            <View style={styles.modalLoadingContainer}>
              <ActivityIndicator size="large" color="#F9A11B" />
              <Text style={styles.loadingText}>Loading notifications...</Text>
            </View>
          ) : (
            <FlatList
              data={notifications}
              renderItem={renderNotificationItem}
              keyExtractor={item => item.id}
              contentContainerStyle={styles.notificationList}
            />
          )}
        </View>
      </Modal>
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
    marginBottom: 5,
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
    height: 60, // Add fixed height to ensure proper rendering
    paddingBottom:15,
  },
  categoriesContentContainer: {
    paddingRight: 15,
    paddingVertical: 1, // Add padding to prevent cutting
  },
  categoryButton: {
    backgroundColor: '#F9A11B',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    marginHorizontal: 8,
    minWidth: 100,
    alignItems: 'center',
    justifyContent: 'center',
    height: 45, // Slightly reduced height
    overflow: 'hidden', // Change from 'visible' to 'hidden'
  },
  categoryText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
    textAlign: 'center',
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  restaurantsList: {
    paddingHorizontal: 20,
    paddingTop: 10,
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
  notificationContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  notificationTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  notificationList: {
    paddingVertical: 10,
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  notificationIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  notificationContent: {
    flex: 1,
  },
  notificationMessage: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
  notificationTime: {
    fontSize: 14,
    color: '#999',
  },
  modalLoadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyResultContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyResultText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});

