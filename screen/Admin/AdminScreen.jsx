import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, ActivityIndicator, ToastAndroid } from 'react-native';
import { useFocusEffect } from '@react-navigation/native'; // Import useFocusEffect from @react-navigation/native
import { GetStudenDetailsByEmail } from '../../Service/StudentService/GetStudentDetailsByEmail';
import { useRouter } from 'expo-router';
import { searchBookByAdminNameOrBookName } from '../../Service/Books/SearchBookBySerachTerm';

export default function AdminScreen() {
  const [studentEmail, setStudentEmail] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [bookSearchItem, setBookSearchItem] = useState('');
  const [bookSearchResult, setBookSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const [searchBookError, setSearchBookError] = useState('');
  const [searchBookMessage, setSearchBookMessage] = useState('');

  // Function to validate email
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Handle search student by email
  const handleSearchStudent = async () => {
    if (!studentEmail.trim()) {
      setError('Email field cannot be empty.');
      return;
    }

    if (!isValidEmail(studentEmail)) {
      setError('Please enter a valid email address.');
      return;
    }

    setLoading(true); // Show ActivityIndicator while searching
    setError(''); // Clear previous errors

    try {
      const response = await GetStudenDetailsByEmail(studentEmail);
      if (response.success) {
        setSearchResults([response.data]);
        setStudentEmail(''); // Clear the input after successful search
      } else {
        setSearchResults([]);
        setError(response.data.message);
      }
    } catch (err) {
      setError('Error fetching student data.');
    } finally {
      setLoading(false); // Hide ActivityIndicator when done
    }
  };

  // Clear search results and input field when the screen is focused
  useFocusEffect(
    useCallback(() => {
      // Reset the search results and input field
      setSearchResults([]);
      setStudentEmail('');
    }, [])
  );

  const handleStudentDetails = (student) => {
    const studentData = encodeURIComponent(JSON.stringify(student));
    router.push(`/student/${student.email}?data=${studentData}`);
  };

  const handleSearchBook = async () => {
    try {
      const response = await searchBookByAdminNameOrBookName(bookSearchItem);
      if (response.success) {
        ToastAndroid.show('Successfully fetched the data', ToastAndroid.LONG);
        setBookSearchResult(response.data);
      } else {
        setSearchBookError(response.data);
        ToastAndroid.show('Invalid search', ToastAndroid.LONG);
        setSearchBookMessage(response.data.message);
      }
    } catch (error) {
      console.error('Error during book search:', error);
      ToastAndroid.show('An error occurred', ToastAndroid.LONG);
    }
  };
  const handleStudentWithBook=(student)=>{
    const studentData = encodeURIComponent(JSON.stringify(student));
    router.push(`/book/${student.email}?data=${studentData}`);

  }

  return (
    <View style={styles.mainContainer}>
      {/* Search for student by email */}
      <View style={styles.searchContainer}>
        <TextInput
          placeholder="Search student by email..."
          value={studentEmail}
          onChangeText={setStudentEmail}
          style={styles.input}
        />
        {/* Show ActivityIndicator while loading */}
        {loading ? (
          <ActivityIndicator size="small" color="#0000ff" />
        ) : (
          <>
            {/* Display error if it exists */}
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
            <TouchableOpacity onPress={handleSearchStudent} style={styles.button}>
              <Text style={styles.buttonText}>Search Student</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
      <View style={styles.bookSearchContainer}>
        {/* Search for books by name or author */}
        <TextInput
          placeholder="Search book by book name or book author"
          value={bookSearchItem}
          onChangeText={setBookSearchItem}
          style={styles.input}
        />
        <TouchableOpacity onPress={handleSearchBook} style={styles.button}>
          <Text style={styles.buttonText}>Search Book</Text>
        </TouchableOpacity>
      </View>

      {/* Display student search results */}
      <FlatList
        data={searchResults}
        keyExtractor={(item) => item.email} // Use email as unique key
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleStudentDetails(item)}>
            <View style={styles.resultItem}>
              <Text>Email: {item.email}</Text>
              <Text>Name: {item.name}</Text>
              <Text>Semester: {item.semester}</Text>
              <Text>Gender: {item.gender}</Text>
              <Text>Department: {item.department}</Text>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={() => (
          !loading && <Text style={styles.noResultsText}>No results found</Text>
        )}
      />

      {/* Display book search results */}
      <FlatList
        data={bookSearchResult}
        keyExtractor={(item) => item.bookId}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={()=>handleStudentWithBook(item?.studentDto)}>
          <View style={styles.bookItem}>
            <Text style={styles.label}>Book Id: <Text style={styles.value}>{item.bookId}</Text></Text>
            
            <Text style={styles.label}>Book Name: <Text style={styles.value}>{item.bookName}</Text></Text>
            
            <Text style={styles.label}>Author: <Text style={styles.value}>{item.bookAuthor}</Text></Text>
            
            <Text style={styles.label}>Semester:<Text style={styles.value}>{item.bookSemester}</Text></Text>
            
            <Text style={styles.label}>Year: <Text style={styles.value}>{item.bookYear}</Text></Text>
           
            <Text style={styles.label}>Date of Issue:<Text style={styles.value}>{item.dateOfIssue}</Text></Text>
            
            <Text style={styles.label}>Date of Submission:<Text style={styles.value}>{item.dateOfSubmission || 'N/A'}</Text></Text>
            
            <Text style={styles.label}>Fine:<Text style={styles.value}>{item.fine || 'N/A'}</Text></Text>
            
         
          </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={() => (
          <Text style={styles.noResultsText}>No books found</Text>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: 'lightgray',
    padding: 10,
  },
  searchContainer: {
    marginBottom: 20,
  },
  bookSearchContainer: {
    marginBottom: 20,
  },
  input: {
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    backgroundColor: 'white',
  },
  button: {
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
  resultItem: {
    backgroundColor: 'white',
    padding: 10,
    marginBottom: 10,
    borderRadius: 10,
  },
  noResultsText: {
    textAlign: 'center',
    marginTop: 20,
    color: 'gray',
  },
  bookItem: {
    marginVertical: 10,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderColor: '#ddd',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3, // For Android shadow
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
  },
  value: {
    fontSize: 14,
    fontWeight: 'normal',
    marginBottom: 10,
  },
});
