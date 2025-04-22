import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, Image, TouchableOpacity, FlatList, ActivityIndicator, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, router, Stack } from 'expo-router';
import { API_BASE_URL, API_ENDPOINTS } from '@/config/env';
import { Restaurant, UserReview, VideoLink, MenuItem } from '@/types/restaurant';
import { Video } from 'expo-av';

export default function RestaurantDetailScreen() {
  const { id } = useLocalSearchParams();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('Description');
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRestaurantDetails() {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.restaurantById(id)}`);
        if (!response.ok) {
          throw new Error('Failed to fetch restaurant details');
        }
        const data = await response.json();
        setRestaurant(data);
        setError(null);
      } catch (err) {
        setError('Failed to load restaurant details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchRestaurantDetails();
    }
  }, [id]);

  const renderReviewItem = ({ item }: { item: UserReview }) => (
    <View style={styles.reviewItem}>
      <View style={styles.reviewHeader}>
        <Text style={styles.reviewUsername}>{item.username}</Text>
        <View style={styles.starsContainer}>
          {[...Array(5)].map((_, i) => (
            <Ionicons 
              key={i} 
              name={i < item.stars ? "star" : "star-outline"} 
              size={16} 
              color="#F9A11B" 
              style={styles.starIcon}
            />
          ))}
        </View>
      </View>
      <Text style={styles.reviewText}>{item.review}</Text>
    </View>
  );

  const renderVideoItem = ({ item }: { item: VideoLink }) => (
    <View style={styles.videoItem}>
      <View style={styles.videoCard}>
        <TouchableOpacity 
          style={styles.videoThumbnail}
          onPress={() => setActiveVideo(item.link)}
        >
          {activeVideo === item.link ? (
            <Video
              source={{ uri: item.link }}
              rate={1.0}
              volume={1.0}
              isMuted={false}
              resizeMode="cover"
              shouldPlay
              useNativeControls
              style={styles.videoPlayer}
            />
          ) : (
            <>
              <Image 
                source={{ uri: restaurant?.thumbnail.replace(/\s|`/g, '') }} 
                style={styles.videoThumbnailImage} 
              />
              <View style={styles.videoOverlay}>
                <Ionicons name="play-circle" size={50} color="#fff" style={styles.playIcon} />
              </View>
            </>
          )}
        </TouchableOpacity>
        <View style={styles.videoInfo}>
          <Text style={styles.videoTitle}>{item.title}</Text>
          <Text style={styles.videoSubtitle}>{item.subtitle}</Text>
        </View>
      </View>
    </View>
  );

  const renderMenuItem = ({ item }: { item: MenuItem }) => (
    <View style={styles.menuItem}>
      <Image 
        source={{ uri: item.image_link.replace(/\s|`/g, '') }} 
        style={styles.menuItemImage} 
      />
      <View style={styles.menuItemInfo}>
        <Text style={styles.menuItemName}>{item.name}</Text>
        <Text style={styles.menuItemPrice}>${item.price.toFixed(2)}</Text>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#F9A11B" />
        <Text style={styles.loadingText}>Loading restaurant details...</Text>
      </View>
    );
  }

  if (error || !restaurant) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={48} color="#F9A11B" />
        <Text style={styles.errorText}>{error || 'Restaurant not found'}</Text>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={() => router.back()}
        >
          <Text style={styles.retryButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView style={styles.container}>
        {/* Header with restaurant image */}
        <View style={styles.header}>
          <Image 
            source={{ uri: restaurant.thumbnail.replace(/\s|`/g, '') }} 
            style={styles.headerImage} 
          />
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          
          {/* Overlay gradient for better text visibility */}
          <View style={styles.headerOverlay} />
          
          <View style={styles.restaurantHeaderInfo}>
            <Text style={styles.restaurantName}>{restaurant.name}</Text>
            <Text style={styles.restaurantLocation}>{restaurant.location}</Text>
            <Text style={styles.restaurantPhone}>{restaurant.phone_number}</Text>
          </View>
        </View>

      {/* Tab navigation */}
      <View style={styles.tabContainer}>
        {['Description', 'Menu', 'Review', 'Video'].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[
              styles.tabButton,
              activeTab === tab && styles.activeTabButton,
            ]}
            onPress={() => setActiveTab(tab)}
          >
            <Text
              style={[
                styles.tabButtonText,
                activeTab === tab && styles.activeTabButtonText,
              ]}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Tab content */}
      <View style={styles.contentContainer}>
        {activeTab === 'Description' && (
          <View style={styles.descriptionContainer}>
            {/* Gallery - Moved above description */}
            <View style={styles.galleryContainer}>
              <Text style={styles.galleryTitle}>Photo Gallery</Text>
              <FlatList
                horizontal
                data={restaurant.image_links}
                keyExtractor={(item, index) => `image-${index}`}
                renderItem={({ item }) => (
                  <Image 
                    source={{ uri: item.replace(/\s|`/g, '') }} 
                    style={styles.galleryImage} 
                  />
                )}
                showsHorizontalScrollIndicator={false}
              />
            </View>
            
            <Text style={styles.descriptionTitle}>About</Text>
            <Text style={styles.descriptionText}>{restaurant.description}</Text>
          </View>
        )}

        {activeTab === 'Review' && (
          <View style={styles.reviewsContainer}>
            <View style={styles.reviewsHeader}>
              <Text style={styles.reviewsTitle}>Customer Reviews</Text>
              <Text style={styles.reviewsCount}>{restaurant.total_reviews} reviews</Text>
            </View>
            <FlatList
              data={restaurant.user_reviews}
              keyExtractor={(item) => item.user_id}
              renderItem={renderReviewItem}
              scrollEnabled={false}
            />
          </View>
        )}

        {activeTab === 'Video' && (
          <View style={styles.videosContainer}>
            <FlatList
              data={restaurant.video_links}
              keyExtractor={(item, index) => `video-${index}`}
              renderItem={renderVideoItem}
              scrollEnabled={false}
            />
          </View>
        )}

        {activeTab === 'Menu' && (
          <View style={styles.menuContainer}>
            <Image 
              source={{ uri: restaurant.menu_image_link.replace(/\s|`/g, '') }} 
              style={styles.menuImage} 
            />
            <Text style={styles.menuTitle}>Menu Items</Text>
            <FlatList
              data={restaurant.order.menu_items}
              keyExtractor={(item) => item.item_id}
              renderItem={renderMenuItem}
              scrollEnabled={false}
            />
          </View>
        )}
      </View>
    </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#F9A11B',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  header: {
    position: 'relative',
    height: 250, // Increased from 200
  },
  headerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  headerOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 120,
    backgroundColor: 'rgba(0,0,0,0.5)', // Semi-transparent gradient overlay
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  restaurantHeaderInfo: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    zIndex: 5,
  },
  restaurantName: {
    fontSize: 28, // Increased from 24
    fontWeight: 'bold',
    color: 'white',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  restaurantLocation: {
    fontSize: 16, // Increased from 14
    color: 'white',
    marginTop: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  restaurantPhone: {
    fontSize: 16, // Increased from 14
    color: 'white',
    marginTop: 2,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  directionButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#F9A11B',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  directionButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 15,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  tabButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  activeTabButton: {
    backgroundColor: '#F9A11B',
  },
  tabButtonText: {
    color: '#666',
    fontWeight: '500',
  },
  activeTabButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  contentContainer: {
    padding: 15,
  },
  descriptionContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  descriptionText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
    marginBottom: 15,
  },
  galleryContainer: {
    marginTop: 10,
    marginBottom: 20,
  },
  galleryTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  galleryImage: {
    width: 280,
    height: 180,
    borderRadius: 10,
    marginRight: 10,
  },
  descriptionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  reviewsContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
  },
  reviewsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  reviewsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  reviewsCount: {
    fontSize: 14,
    color: '#666',
  },
  reviewItem: {
    marginBottom: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  reviewUsername: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  starsContainer: {
    flexDirection: 'row',
  },
  starIcon: {
    marginLeft: 2,
  },
  reviewText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  videosContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
  },
  videoItem: {
    marginBottom: 15,
  },
  videoCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  videoThumbnail: {
    width: '100%',
    height: 200,
    position: 'relative',
  },
  videoThumbnailImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  videoOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  playIcon: {
    opacity: 1,
  },
  videoPlayer: {
    width: '100%',
    height: '100%',
  },
  videoInfo: {
    padding: 12,
  },
  videoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  videoSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  menuContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
  },
  menuImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 15,
  },
  menuTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  menuItem: {
    flexDirection: 'row',
    marginBottom: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  menuItemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  menuItemInfo: {
    flex: 1,
    marginLeft: 15,
    justifyContent: 'center',
  },
  menuItemName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 5,
  },
  menuItemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#F9A11B',
  },
});