import { StyleSheet } from 'react-native';
import { Text, View } from 'react-native';
import EditScreenInfo from '@/components/EditScreenInfo';

export default function TabThreeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      <View style={styles.separator} />
      <EditScreenInfo path="app/(tabs)/three.tsx" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff', // Set white background
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000', // Set text color to black
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
    backgroundColor: '#eee', // Set separator color
  },
});