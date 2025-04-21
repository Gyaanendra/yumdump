import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useUser } from '@clerk/clerk-expo';

export default function InfluencerScreen() {
  const { user } = useUser();
  const userName = user?.fullName || user?.primaryEmailAddress?.emailAddress?.split('@')[0] || 'User';

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Influencer Profile</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <Image 
              source={require('@/assets/images/logo.png')} 
              style={styles.avatar}
            />
          </View>
          
          <Text style={styles.userName}>{userName}</Text>
          <Text style={styles.userType}>Food Influencer</Text>
          
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>124</Text>
              <Text style={styles.statLabel}>Posts</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>23.4k</Text>
              <Text style={styles.statLabel}>Followers</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>348</Text>
              <Text style={styles.statLabel}>Following</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.divider} />
        
        <View style={styles.bioSection}>
          <Text style={styles.bioTitle}>About Me</Text>
          <Text style={styles.bioText}>
            Food enthusiast and culinary explorer. I love discovering new restaurants and sharing my experiences with my followers. Join me on my food journey!
          </Text>
        </View>
        
        <View style={styles.divider} />
        
        <View style={styles.contentSection}>
          <Text style={styles.sectionTitle}>Recent Reviews</Text>
          
          <View style={styles.reviewCard}>
            <Image 
              source={require('@/assets/images/pizza.png')} 
              style={styles.reviewImage}
            />
            <View style={styles.reviewContent}>
              <Text style={styles.reviewTitle}>ABC Pizzeria</Text>
              <View style={styles.ratingContainer}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Ionicons 
                    key={star} 
                    name="star" 
                    size={16} 
                    color={star <= 4 ? "#F9A11B" : "#ddd"} 
                    style={{ marginRight: 2 }}
                  />
                ))}
                <Text style={styles.ratingText}>4.0</Text>
              </View>
              <Text style={styles.reviewText}>
                The pizza was amazing! Perfectly crispy crust and generous toppings.
              </Text>
              <Text style={styles.reviewDate}>2 days ago</Text>
            </View>
          </View>
          
          <View style={styles.reviewCard}>
            <Image 
              source={require('@/assets/images/pizza.png')} 
              style={styles.reviewImage}
            />
            <View style={styles.reviewContent}>
              <Text style={styles.reviewTitle}>Sushi House</Text>
              <View style={styles.ratingContainer}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Ionicons 
                    key={star} 
                    name="star" 
                    size={16} 
                    color={star <= 5 ? "#F9A11B" : "#ddd"} 
                    style={{ marginRight: 2 }}
                  />
                ))}
                <Text style={styles.ratingText}>5.0</Text>
              </View>
              <Text style={styles.reviewText}>
                Fresh and delicious sushi. The service was excellent too!
              </Text>
              <Text style={styles.reviewDate}>1 week ago</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  content: {
    flex: 1,
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#F9A11B',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  avatar: {
    width: 60,
    height: 60,
    tintColor: 'white',
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  userType: {
    fontSize: 16,
    color: '#F9A11B',
    marginBottom: 15,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '80%',
    marginTop: 10,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  divider: {
    height: 8,
    backgroundColor: '#f8f8f8',
  },
  bioSection: {
    padding: 20,
  },
  bioTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  bioText: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  contentSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  reviewCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 15,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  reviewImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 15,
  },
  reviewContent: {
    flex: 1,
  },
  reviewTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  ratingText: {
    marginLeft: 5,
    fontSize: 14,
    color: '#666',
  },
  reviewText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    lineHeight: 20,
  },
  reviewDate: {
    fontSize: 12,
    color: '#999',
  },
});