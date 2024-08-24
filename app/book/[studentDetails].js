import { useLocalSearchParams, useNavigation } from 'expo-router';
import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, ScrollView, TouchableOpacity, Alert, ToastAndroid, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import submitBookService from '../../Service/AdminService/SubmitBookService';
import { getAdminToken } from '../../Service/Login/GetAdminToken';

export default function StudentDetails() {
  const navigation = useNavigation();
  const { studentDetails, data } = useLocalSearchParams();

  // Parse student data
  const student = JSON.parse(decodeURIComponent(data));

  // State to manage books data
  const [books, setBooks] = useState(student.booksDto);
  const [loading, setLoading] = useState(false); // State for loading
  const [error, setError] = useState('');
  const [noOfBookIssue, setNoOfBookIssue]= useState(student.noOfBookIssue)


  // Set header title
  navigation.setOptions({
    headerTitle: studentDetails,
  });

  // Function to filter books based on submission date
  const filterBooks = (booksList) => {
    const issued = booksList.filter(book => book.dateOfSubmission === null);
    const submitted = booksList.filter(book => book.dateOfSubmission !== null);
    return { issued, submitted };
  };

  const { issued: issuedBooks, submitted: submittedBooks } = filterBooks(books);

  // Function to handle book submission
  const handleSubmitBook = (bookId, studentRoll) => {
    Alert.alert(
      "Submit Book",
      `Do you want to submit the book with ID ${bookId}?`,
      [
        {
          text: "No",
          onPress: () => console.log("Book submission canceled"),
          style: "cancel"
        },
        {
          text: "Yes",
          onPress: async () => await bookSubmitService(bookId, studentRoll)
        }
      ],
      { cancelable: false }
    );
  };

  // Function to simulate book submission service
  const bookSubmitService = async (bookId, studentRoll) => {
    setLoading(true); // Show loading indicator
    try {
      const token = await getAdminToken();
      if (!token) {
        alert("Token expired");
        setLoading(false); // Hide loading indicator
        return;
      }

      // Call the API to submit the book
      const response = await submitBookService(bookId, studentRoll, token);

      // Handle the response
      if (response.success) {
        setNoOfBookIssue(response.data.noOfBookIssue)
        setBooks(response.data.booksDto); // Update the state with new books list
        ToastAndroid.show("Book submitted successfully", ToastAndroid.LONG);
      } else {
        setError(response.data.message);
        ToastAndroid.show(`Error: ${response.data.message}`, ToastAndroid.LONG);
      }
    } catch (error) {
      console.error("Failed to submit the book", error);
      ToastAndroid.show("Failed to submit the book", ToastAndroid.LONG);
    } finally {
      setLoading(false); // Hide loading indicator
    }
  };

  // Function to render a book item
  const renderBookItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleSubmitBook(item.bookId, student.roll)}>
      <View style={styles.bookItem}>
        <Text style={styles.label}>Book Id: <Text style={styles.value}>{item.bookId}</Text></Text>
        <Text style={styles.label}>Book Name: <Text style={styles.value}>{item.bookName}</Text></Text>
        <Text style={styles.label}>Author: <Text style={styles.value}>{item.bookAuthor}</Text></Text>
        <Text style={styles.label}>Semester: <Text style={styles.value}>{item.bookSemester}</Text></Text>
        <Text style={styles.label}>Year: <Text style={styles.value}>{item.bookYear}</Text></Text>
        <Text style={styles.label}>Date of Issue: <Text style={styles.value}>{item.dateOfIssue}</Text></Text>
        <Text style={styles.label}>Date of Submission: <Text style={styles.value}>{item.dateOfSubmission || 'Pending'}</Text></Text>
        <Text style={styles.label}>Fine: <Text style={styles.value}>{item.fine || 'N/A'}</Text></Text>
        {item.dateOfSubmission === null && (
          <Text style={styles.warningText}>Pending Submission</Text>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <LinearGradient
      colors={['#6DD5FA', '#2980B9']}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.card}>
          <Text style={styles.heading}>Student Details</Text>
          <View style={styles.detailsSection}>
            <Text style={styles.label}>Name: <Text style={styles.value}>{student.name}</Text></Text>
            <Text style={styles.label}>Email: <Text style={styles.value}>{student.email}</Text></Text>
            <Text style={styles.label}>Gender: <Text style={styles.value}>{student.gender}</Text></Text>
            <Text style={styles.label}>Department: <Text style={styles.value}>{student.department}</Text></Text>
            <Text style={styles.label}>Semester: <Text style={styles.value}>{student.semester}</Text></Text>
            <Text style={styles.label}>Roll Number: <Text style={styles.value}>{student.roll}</Text></Text>
            <Text style={styles.label}>Phone Number: <Text style={styles.value}>{student.phoneNumber}</Text></Text>
            <Text style={styles.label}>No. of Books Issued: <Text style={styles.value}>{noOfBookIssue}</Text></Text>
          </View>
          
          {/* <Text style={styles.heading}>Books Currently Issued:</Text> */}
          {/* {loading ? (
            <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />
          ) : (
            <FlatList
              data={issuedBooks}
              renderItem={renderBookItem}
              keyExtractor={(item) => item.bookId.toString()}
              ListEmptyComponent={() => <Text style={styles.emptyList}>No books currently issued.</Text>}
            />
          )} */}

          {/* <Text style={styles.heading}>Recently Submitted Books:</Text>
          {loading ? (
            <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />
          ) : (
            <FlatList
              data={submittedBooks}
              renderItem={renderBookItem}
              keyExtractor={(item) => item.bookId.toString()}
              ListEmptyComponent={() => <Text style={styles.emptyList}>No books recently submitted.</Text>}
            />
          )} */}
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    padding: 20,
    alignItems: 'center',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5, // Android shadow
    marginBottom: 20,
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    color: '#333',
  },
  detailsSection: {
    backgroundColor: '#e9f5f9',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    borderColor: '#b0d4e3',
    borderWidth: 1,
    width: '100%',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
  },
  value: {
    fontWeight: 'normal',
  },
  bookItem: {
    marginVertical: 10,
    padding: 15,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    borderColor: '#ddd',
    borderWidth: 1,
    width: '100%',
  },
  warningText: {
    color: 'red',
    marginTop: 5,
    fontWeight: 'bold',
  },
  loader: {
    marginVertical: 20,
  },
  emptyList: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    marginVertical: 20,
  },
});
