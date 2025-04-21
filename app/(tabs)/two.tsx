import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Dimensions, Modal, Image, ScrollView } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE, Callout } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';

export default function TabTwoScreen() {
  // Delhi coordinates (centered around Connaught Place)
  const [region, setRegion] = useState({
    latitude: 28.6304,
    longitude: 77.2177,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });

  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [detailVisible, setDetailVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);

  // Enhanced restaurant data
  const restaurants = [
    {
      id: '1',
      coordinate: { latitude: 28.6304, longitude: 77.2177 },
      title: 'ABC Pizzeria',
      address: '123 Market, Delhi',
      phone: '08123456789',
      rating: 4.8,
      image: require('@/assets/images/pizza.png'),
      color: '#F9A11B',
      description: 'Authentic Italian pizzas made with fresh ingredients and traditional recipes.',
      menu: [
        { name: 'Margherita Pizza', price: '₹299' },
        { name: 'Pepperoni Pizza', price: '₹399' },
        { name: 'Garlic Bread', price: '₹149' }
      ]
    },
    {
      id: '2',
      coordinate: { latitude: 28.6324, longitude: 77.2197 },
      title: 'Delhi Spice',
      address: '45 Connaught Place, Delhi',
      phone: '09876543210',
      rating: 4.5,
      image: require('@/assets/images/pizza.png'),
      color: '#F9A11B',
      description: 'Authentic North Indian cuisine with a modern twist.',
      menu: [
        { name: 'Butter Chicken', price: '₹350' },
        { name: 'Paneer Tikka', price: '₹299' },
        { name: 'Naan', price: '₹50' }
      ]
    },
    {
      id: '3',
      coordinate: { latitude: 28.6284, longitude: 77.2157 },
      title: 'Sushi House',
      address: '78 Rajpath, Delhi',
      phone: '07654321098',
      rating: 4.7,
      image: require('@/assets/images/pizza.png'),
      color: '#F9A11B',
      description: 'Fresh and authentic Japanese cuisine in the heart of Delhi.',
      menu: [
        { name: 'Salmon Sushi', price: '₹499' },
        { name: 'Miso Soup', price: '₹199' },
        { name: 'Tempura', price: '₹349' }
      ]
    },
    {
      id: '4',
      coordinate: { latitude: 28.6314, longitude: 77.2137 },
      title: 'Cafe Italiano',
      address: '22 Janpath, Delhi',
      phone: '09988776655',
      rating: 4.3,
      image: require('@/assets/images/pizza.png'),
      color: '#F9A11B',
      description: 'Cozy Italian cafe serving pasta, coffee, and desserts.',
      menu: [
        { name: 'Pasta Alfredo', price: '₹349' },
        { name: 'Tiramisu', price: '₹249' },
        { name: 'Cappuccino', price: '₹149' }
      ]
    },
  ];

  // Categories for filter
  const categories = [
    { id: '1', name: 'Italian' },
    { id: '2', name: 'Western' },
    { id: '3', name: 'Javanese' },
    { id: '4', name: 'Indian' },
  ];

  const handleMarkerPress = (restaurant) => {
    setSelectedRestaurant(restaurant);
    setDetailVisible(true);
  };

  const renderRestaurantDetail = () => {
    if (!selectedRestaurant) return null;
    
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={detailVisible}
        onRequestClose={() => setDetailVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.restaurantDetailCard}>
            <ScrollView>
              <Image source={selectedRestaurant.image} style={styles.restaurantImage} />
              
              <View style={styles.restaurantInfo}>
                <Text style={styles.restaurantName}>{selectedRestaurant.title}</Text>
                <Text style={styles.restaurantAddress}>{selectedRestaurant.address}</Text>
                <Text style={styles.restaurantPhone}>{selectedRestaurant.phone}</Text>
                
                <View style={styles.ratingContainer}>
                  <Ionicons name="star" size={16} color="#F9A11B" />
                  <Text style={styles.ratingText}>{selectedRestaurant.rating.toFixed(1)}</Text>
                </View>
                
                <Text style={styles.descriptionTitle}>Description</Text>
                <Text style={styles.description}>{selectedRestaurant.description}</Text>
                
                <Text style={styles.menuTitle}>Menu</Text>
                {selectedRestaurant.menu.map((item, index) => (
                  <View key={index} style={styles.menuItem}>
                    <Text style={styles.menuItemName}>{item.name}</Text>
                    <Text style={styles.menuItemPrice}>{item.price}</Text>
                  </View>
                ))}
              </View>
            </ScrollView>
            
            <View style={styles.buttonContainer}>
              <TouchableOpacity 
                style={styles.viewDetailButton}
                onPress={() => setDetailVisible(false)}
              >
                <Text style={styles.viewDetailText}>View Detail</Text>
              </TouchableOpacity>
            </View>
            
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setDetailVisible(false)}
            >
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  };

  // Update filtered restaurants when search query changes
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredRestaurants(restaurants);
    } else {
      const query = searchQuery.toLowerCase().trim();
      const filtered = restaurants.filter(restaurant => 
        restaurant.title.toLowerCase().includes(query) || 
        restaurant.description.toLowerCase().includes(query) ||
        restaurant.menu.some(item => item.name.toLowerCase().includes(query))
      );
      setFilteredRestaurants(filtered);
    }
  }, [searchQuery]);

  // Initialize filtered restaurants with all restaurants
  useEffect(() => {
    setFilteredRestaurants(restaurants);
  }, []);

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={region}
        onRegionChangeComplete={setRegion}
      >
        {/* User location marker (blue) */}
        <Marker
          coordinate={{ latitude: 28.6304, longitude: 77.2167 }}
          pinColor="blue"
        />
        
        {/* Restaurant markers - now using filtered restaurants */}
        {filteredRestaurants.map(restaurant => (
          <Marker
            key={restaurant.id}
            coordinate={restaurant.coordinate}
            title={restaurant.title}
            pinColor={restaurant.color}
            onPress={() => handleMarkerPress(restaurant)}
          />
        ))}
      </MapView>
      
      {/* Search bar overlay with working functionality */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search restaurants"
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color="#999" />
            </TouchableOpacity>
          )}
        </View>
      </View>
      
      {/* Categories filter - moved down */}
      <View style={styles.categoriesContainer}>
        {categories.map(category => (
          <TouchableOpacity 
            key={category.id} 
            style={styles.categoryButton}
            onPress={() => setSearchQuery(category.name)}
          >
            <Text style={styles.categoryText}>{category.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
      
      {/* Bottom navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navButton}>
          <Ionicons name="home-outline" size={24} color="#999" />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.navButton, styles.activeNavButton]}>
          <Ionicons name="location" size={24} color="#F9A11B" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton}>
          <Ionicons name="person-outline" size={24} color="#999" />
        </TouchableOpacity>
      </View>
      
      {/* Restaurant detail modal */}
      {renderRestaurantDetail()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  searchContainer: {
    position: 'absolute',
    top: 40,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  categoriesContainer: {
    position: 'absolute',
    top: 120, // Moved down from 100
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 10,
  },
  categoryButton: {
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  categoryText: {
    color: '#F9A11B',
    fontWeight: '600',
  },
  bottomNav: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 30,
    paddingVertical: 10,
    paddingHorizontal: 20,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  navButton: {
    padding: 10,
  },
  activeNavButton: {
    backgroundColor: 'white',
  },
  // Restaurant detail modal styles
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  restaurantDetailCard: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: '70%',
    paddingBottom: 20,
  },
  restaurantImage: {
    width: '100%',
    height: 200,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  restaurantInfo: {
    padding: 20,
  },
  restaurantName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  restaurantAddress: {
    fontSize: 16,
    color: '#666',
    marginBottom: 3,
  },
  restaurantPhone: {
    fontSize: 16,
    color: '#666',
    marginBottom: 15,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  ratingText: {
    marginLeft: 5,
    fontWeight: 'bold',
    color: '#F9A11B',
  },
  descriptionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  description: {
    fontSize: 16,
    color: '#666',
    lineHeight: 22,
    marginBottom: 15,
  },
  menuTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  menuItemName: {
    fontSize: 16,
    color: '#333',
  },
  menuItemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#F9A11B',
  },
  buttonContainer: {
    padding: 20,
    paddingTop: 0,
  },
  viewDetailButton: {
    backgroundColor: '#F9A11B',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  viewDetailText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  closeButton: {
    position: 'absolute',
    top: 15,
    right: 15,
    backgroundColor: 'white',
    borderRadius: 15,
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 5,
  },
});
