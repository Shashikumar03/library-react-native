import { View, Text, FlatList, StyleSheet, RefreshControl, TouchableOpacity, StatusBar } from 'react-native';
import React, { useEffect, useState, useCallback } from 'react';
import GetAllStudents from '../../Service/StudentService/GetAllStudents'
import { useNavigation } from '@react-navigation/native';
import { useUser } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';

export default function ChatScreen() {
  const [studentDetails, setStudentDetails] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const {isSignedIn}=useUser()
  const router=useRouter()

  const navigation = useNavigation();

  const fetchStudentDetails = async () => {
    try {
      const allStudentsDetails = await GetAllStudents();
      setStudentDetails(allStudentsDetails);
    } catch (error) {
      console.error('Error fetching student details:', error);
    }
  };

  useEffect(() => {
    fetchStudentDetails();
    navigation.setOptions({
      headerTitle: "chatting page"
    });
    
  
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchStudentDetails();
    setRefreshing(false);
  }, []);

  const goBack = () => {
    // alert("vghbjnk")
    navigation.goBack(); // Navigate back to the previous screen
  };
  const  onCategoryPressHandler=(item)=>{
    
      router.push('/chatting/' + item.email)
    
}

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={()=>onCategoryPressHandler(item)}>
    <View style={styles.itemContainer}>
     
     <Text style={styles.itemText}>{item.name}</Text>
     <Text style={styles.itemText}>{item.department}</Text>
     
     
      {/* Adjust based on the structure of your student details */}
    </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
       <TouchableOpacity onPress={goBack}>
        <Text>Go Back</Text>
      </TouchableOpacity>
      <FlatList
        data={studentDetails}
        renderItem={renderItem}
        keyExtractor={(item) => item?.email} // Adjust if your item has a different unique identifier
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No student details available</Text>
          </View>
        }
        // refreshControl={
        //   <RefreshControl
        //     refreshing={refreshing}
        //     onRefresh={onRefresh}
        //   />
        // }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    marginTop:StatusBar.currentHeight
  },
  itemContainer: {
    padding: 10,
    marginVertical: 5,
    backgroundColor: '#f9f9f9',
    borderRadius: 5,
  },
  itemText: {
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  emptyText: {
    fontSize: 16,
    color: 'gray',
  },
});
