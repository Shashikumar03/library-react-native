import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { searchBookByAdminNameOrBookName } from '../../Service/Books/SearchBookBySerachTerm';
import { useFocusEffect } from '@react-navigation/native';

export default function AdminScreen() {
  const [bookSearchItem, setBookSearchItem] = useState('');
  const [bookSearchResult, setBookSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchBookError, setSearchBookError] = useState('');
  const [refreshing, setRefreshing] = useState(false); // State for pull-to-refresh
  const router = useRouter();

  // Fetch books
  const fetchBooks = async () => {
    setLoading(true);
    try {
      const response = await searchBookByAdminNameOrBookName(bookSearchItem);
      if (response.success) {
        setBookSearchResult(response.data);
      } else {
        setSearchBookError(response.data.message);
      }
    } catch (error) {
      console.error('Error during book search:', error);
      setSearchBookError('An error occurred');
    } finally {
      setLoading(false);
      setRefreshing(false); // Stop refreshing animation
    }
  };

  // Use focus effect to fetch data when the screen is focused
  useFocusEffect(
    useCallback(() => {
      fetchBooks();
    }, [])
  );

  // Handle manual refresh
  const handleRefresh = () => {
    setRefreshing(true); // Start refreshing animation
    fetchBooks();
  };

  const handleStudentWithBook = (student) => {
    if (student == null) {
      alert("this book is not assigned to anyone.")
    } else {
      const studentData = encodeURIComponent(JSON.stringify(student));
      router.push(`/book/${student.email}?data=${studentData}`);
    }

  };

  return (
    <View style={styles.mainContainer}>
      {/* Refresh button */}
      {/* You can keep this if you want a manual refresh button */}
      {/* <TouchableOpacity onPress={handleRefresh} style={styles.refreshButton}>
        <Text style={styles.refreshButtonText}>Refresh</Text>
      </TouchableOpacity> */}

      {/* Display book search results */}
      <Text style={styles.sectionTitle}>All Books</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#007bff" />
      ) : (
        <FlatList
          data={bookSearchResult}
          keyExtractor={(item) => item.bookId}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleStudentWithBook(item?.studentDto)}>
              <View style={styles.bookItem}>
                <Text style={styles.label}>Book Id: <Text style={styles.value}>{item.bookId}</Text></Text>
                <Text style={styles.label}>Book Name: <Text style={styles.value}>{item.bookName}</Text></Text>
                <Text style={styles.label}>Author: <Text style={styles.value}>{item.bookAuthor}</Text></Text>
                <Text style={styles.label}>Semester: <Text style={styles.value}>{item.bookSemester}</Text></Text>
                <Text style={styles.label}>Year: <Text style={styles.value}>{item.bookYear}</Text></Text>
                <Text style={styles.label}>Date of Issue: <Text style={styles.value}>{item.dateOfIssue}</Text></Text>
                <Text style={styles.label}>Date of Submission: <Text style={styles.value}>{item.dateOfSubmission || 'N/A'}</Text></Text>
                <Text style={styles.label}>Fine: <Text style={styles.value}>{item.fine || 'N/A'}</Text></Text>
              </View>
            </TouchableOpacity>
          )}
          ListEmptyComponent={() => (
            <Text style={styles.noResultsText}>No books found</Text>
          )}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={['#007bff']} // Optional: Customize the color of the refresh spinner
            />
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#f4f4f4',
    padding: 15,
  },
  refreshButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
    alignItems: 'center',
  },
  refreshButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
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
    elevation: 3,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  value: {
    fontSize: 14,
    color: '#555',
  },
  noResultsText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#999',
  },
});
