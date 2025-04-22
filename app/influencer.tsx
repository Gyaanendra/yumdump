import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, TextInput, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { router } from 'expo-router';
import { useUser } from '@clerk/clerk-expo'; // Import useUser
import { Stack } from 'expo-router';

export default function InfluencerScreen() {
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);
  
  const [bio, setBio] = useState('');
  const { user } = useUser(); // Get user data from Clerk
  const userName = user?.fullName || user?.primaryEmailAddress?.emailAddress?.split('@')[0] || 'User'; // Get user name or fallback

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Become an Influencer</Text>
        </View>
        
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <Image 
              source={require('@/assets/images/logo.png')} 
              style={styles.avatar}
            />
          </View>
          
          <Text style={styles.userName}>{userName}</Text>
          <Text style={styles.userType}>Normal User</Text>
        </View>
        
        <View style={styles.infoContainer}>
          <Text style={styles.sectionTitle}>Influencer Program</Text>
          <Text style={styles.description}>
            Join our influencer program to share your food experiences and earn rewards. 
            As an influencer, you can post reviews, share photos, and help others discover 
            great food places.
          </Text>
          
          <View style={styles.switchContainer}>
            <Text style={styles.switchLabel}>Enable Influencer Mode</Text>
            <Switch
              trackColor={{ false: "#767577", true: "#F9A11B" }}
              thumbColor={isEnabled ? "#fff" : "#f4f3f4"}
              ios_backgroundColor="#3e3e3e"
              onValueChange={toggleSwitch}
              value={isEnabled}
            />
          </View>
          
          {isEnabled && (
            <View style={styles.influencerForm}>
              <Text style={styles.formLabel}>Tell us about yourself</Text>
              <TextInput
                style={styles.bioInput}
                placeholder="Write a short bio about your food preferences and experiences..."
                multiline={true}
                numberOfLines={4}
                value={bio}
                onChangeText={setBio}
              />
              
              <Text style={styles.formLabel}>Social Media Links (Optional)</Text>
              <View style={styles.socialInput}>
                <FontAwesome5 name="instagram" size={20} color="#C13584" style={styles.socialIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Your Instagram username"
                />
              </View>
              
              <View style={styles.socialInput}>
                <FontAwesome5 name="twitter" size={20} color="#1DA1F2" style={styles.socialIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Your Twitter username"
                />
              </View>
              
              <TouchableOpacity style={styles.submitButton}>
                <Text style={styles.submitButtonText}>Submit Application</Text>
              </TouchableOpacity>
            </View>
          )}
          
          <View style={styles.benefitsContainer}>
            <Text style={styles.benefitsTitle}>Benefits</Text>
            <View style={styles.benefitItem}>
              <Ionicons name="star" size={20} color="#F9A11B" style={styles.benefitIcon} />
              <Text style={styles.benefitText}>Earn rewards for popular reviews</Text>
            </View>
            <View style={styles.benefitItem}>
              <Ionicons name="restaurant" size={20} color="#F9A11B" style={styles.benefitIcon} />
              <Text style={styles.benefitText}>Get invited to exclusive food events</Text>
            </View>
            <View style={styles.benefitItem}>
              <Ionicons name="gift" size={20} color="#F9A11B" style={styles.benefitIcon} />
              <Text style={styles.benefitText}>Receive special offers from restaurants</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </>
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
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
  },
  backButton: {
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
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
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  userType: {
    fontSize: 14,
    color: '#F9A11B',
  },
  infoContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  description: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
    marginBottom: 20,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 20,
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
  },
  switchLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  influencerForm: {
    marginTop: 10,
    marginBottom: 30,
  },
  formLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 10,
  },
  bioInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
    textAlignVertical: 'top',
    minHeight: 100,
    marginBottom: 20,
  },
  socialInput: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  socialIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: '#F9A11B',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  submitButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  benefitsContainer: {
    marginTop: 20,
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    padding: 20,
  },
  benefitsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  benefitIcon: {
    marginRight: 10,
  },
  benefitText: {
    fontSize: 16,
    color: '#555',
  },
});