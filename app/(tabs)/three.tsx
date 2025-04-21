import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, Modal, TextInput, Alert, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { router } from 'expo-router';
import { useAuth, useUser } from '@clerk/clerk-expo';

export default function TabThreeScreen() {
  const { signOut } = useAuth();
  const { user } = useUser();
  const [modalVisible, setModalVisible] = useState(false);
  const [userData, setUserData] = useState({
    name: '',
    phone: '',
    email: '',
    address: ''
  });
  const [editData, setEditData] = useState({...userData});

  // Update user data when Clerk user info is available
  useEffect(() => {
    if (user) {
      setUserData({
        name: user.fullName || user.primaryEmailAddress?.emailAddress?.split('@')[0] || '',
        phone: user.phoneNumbers?.[0]?.phoneNumber || '',
        email: user.primaryEmailAddress?.emailAddress || '',
        address: ''
      });
      setEditData({
        name: user.fullName || user.primaryEmailAddress?.emailAddress?.split('@')[0] || '',
        phone: user.phoneNumbers?.[0]?.phoneNumber || '',
        email: user.primaryEmailAddress?.emailAddress || '',
        address: ''
      });
    }
  }, [user]);

  const handleSave = () => {
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(editData.email)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address');
      return;
    }

    // Validate phone number (simple validation)
    if (editData.phone.length < 10) {
      Alert.alert('Invalid Phone Number', 'Please enter a valid phone number');
      return;
    }

    // Update user data
    setUserData({...editData});
    setModalVisible(false);
    Alert.alert('Success', 'Profile updated successfully');
  };

  const handleLogout = async () => {
    try {
      Alert.alert(
        "Logout",
        "Are you sure you want to logout?",
        [
          {
            text: "Cancel",
            style: "cancel"
          },
          {
            text: "Logout",
            onPress: async () => {
              await signOut();
              router.replace('/(auth)/login');
            }
          }
        ]
      );
    } catch (error) {
      console.error('Error signing out:', error);
      Alert.alert('Error', 'Failed to sign out. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Profile</Text>
      
      <View style={styles.profileSection}>
        <View style={styles.avatarContainer}>
          <Image 
            source={require('@/assets/images/logo.png')} 
            style={styles.avatar}
            defaultSource={require('@/assets/images/logo.png')}
          />
        </View>
        
        <Text style={styles.userName}>{userData.name}</Text>
        <Text style={styles.userType}>Normal User</Text>
        
        <Text style={styles.userContact}>{userData.phone}</Text>
        <Text style={styles.userEmail}>{userData.email}</Text>
      </View>
      
      <View style={styles.divider} />
      
      <View style={styles.optionsContainer}>
        <TouchableOpacity 
          style={styles.optionButton}
          onPress={() => {
            setEditData({...userData});
            setModalVisible(true);
          }}
        >
          <FontAwesome5 name="pen" size={20} color="#F9A11B" style={styles.optionIcon} />
          <Text style={styles.optionText}>Edit Profile</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.optionButton}
          onPress={() => router.push('/influencer')}
        >
          <FontAwesome5 name="play" size={20} color="#0099FF" style={styles.optionIcon} />
          <Text style={styles.optionText}>YumpDump influencer</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.optionButton}
          onPress={handleLogout}
        >
          <FontAwesome5 name="sign-out-alt" size={20} color="#FF6B6B" style={styles.optionIcon} />
          <Text style={styles.optionText}>Log Out</Text>
        </TouchableOpacity>
      </View>

      {/* Fixed Edit Profile Modal */}
      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.newModalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
            <Text style={styles.newModalTitle}>Edit Profile</Text>
            <View style={{ width: 24 }} />
          </View>
          
          <ScrollView style={styles.newModalContent}>
            <View style={styles.profileImageContainer}>
              <Image 
                source={require('@/assets/images/logo.png')} 
                style={styles.profileImage}
              />
              <TouchableOpacity style={styles.cameraButton}>
                <Ionicons name="camera" size={18} color="white" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Name</Text>
              <TextInput
                style={styles.formInput}
                value={editData.name}
                onChangeText={(text) => setEditData({...editData, name: text})}
                placeholder="Enter your name"
              />
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Phone</Text>
              <TextInput
                style={styles.formInput}
                value={editData.phone}
                onChangeText={(text) => setEditData({...editData, phone: text})}
                placeholder="Enter your phone number"
                keyboardType="phone-pad"
              />
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Email</Text>
              <TextInput
                style={styles.formInput}
                value={editData.email}
                onChangeText={(text) => setEditData({...editData, email: text})}
                placeholder="Enter your email"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Address</Text>
              <TextInput
                style={[styles.formInput, styles.addressInput]}
                value={editData.address}
                onChangeText={(text) => setEditData({...editData, address: text})}
                placeholder="Enter your address"
                multiline
                numberOfLines={4}
              />
            </View>
            
            <TouchableOpacity 
              style={styles.updateButton}
              onPress={handleSave}
            >
              <Text style={styles.updateButtonText}>Update Profile</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 30,
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#F9A11B',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  avatar: {
    width: 70,
    height: 70,
    tintColor: 'white',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  userType: {
    fontSize: 16,
    color: '#F9A11B',
    marginBottom: 15,
  },
  userContact: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 16,
    color: '#666',
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 20,
  },
  optionsContainer: {
    marginTop: 10,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 10,
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  optionIcon: {
    marginRight: 15,
  },
  optionText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  // New modal styles to match the image
  newModalContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  newModalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  newModalContent: {
    flex: 1,
    padding: 20,
  },
  profileImageContainer: {
    alignItems: 'center',
    marginVertical: 20,
    position: 'relative',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#F9A11B',
    tintColor: 'white',
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: '35%',
    backgroundColor: '#3498db',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  formGroup: {
    marginBottom: 20,
  },
  formLabel: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
    fontWeight: '500',
  },
  formInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
  },
  addressInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  updateButton: {
    backgroundColor: '#F9A11B',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  updateButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  
  // Keep existing styles
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 30,
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#F9A11B',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  avatar: {
    width: 70,
    height: 70,
    tintColor: 'white',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  userType: {
    fontSize: 16,
    color: '#F9A11B',
    marginBottom: 15,
  },
  userContact: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 16,
    color: '#666',
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 20,
  },
  optionsContainer: {
    marginTop: 10,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 10,
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  optionIcon: {
    marginRight: 15,
  },
  optionText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  // Original modal styles (keeping for reference)
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '85%',
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  modalButton: {
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    width: '48%',
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f2f2f2',
  },
  saveButton: {
    backgroundColor: '#F9A11B',
  },
  cancelButtonText: {
    color: '#666',
    fontWeight: '600',
  },
  saveButtonText: {
    color: 'white',
    fontWeight: '600',
  },
});