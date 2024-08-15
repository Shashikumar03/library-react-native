import { View, Text, StyleSheet, StatusBar, FlatList, ScrollView, RefreshControl } from 'react-native'
import React, { useEffect, useState, useCallback } from 'react'
import { useFocusEffect } from '@react-navigation/native';
import { GetStudenDetailsByEmail } from '../../Service/StudentService/GetStudentDetailsByEmail'
import { useUser } from '@clerk/clerk-expo';

export default function Books() {
  const [studentDetails, setStudentDetails] = useState(null)
  const [issuedBooks, setIssuedBooks] = useState([])
  const [submittedBooks, setSubmittedBooks] = useState([])
  const [refreshing, setRefreshing] = useState(false)
  const {user}=useUser()

  const fetchStudentData = async () => {
    try {
      const studentData = await GetStudenDetailsByEmail(user?.primaryEmailAddress?.emailAddress);
      setStudentDetails(studentData);
      const books = studentData.booksDto || [];

      const issued = books.filter(book => book.dateOfSubmission === null);
      const submitted = books.filter(book => book.dateOfSubmission !== null);

      setIssuedBooks(issued);
      setSubmittedBooks(submitted);
    } catch (error) {
      console.error(error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchStudentData();
    }, [])
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchStudentData().finally(() => setRefreshing(false));
  }, []);

  const renderBookItem = ({ item }) => (
    <View style={styles.bookItem}>
      <View style={{ flexDirection: "row", gap: 10 }}>
        <Text>bookName</Text>
        <Text style={[styles.bookDetail, { fontWeight: "bold" }]}>{item.bookName}</Text>
      </View>
      <Text style={styles.bookDetail}>bookId: {item.bookId}</Text>
      <Text style={styles.bookDetail}>Author: {item.bookAuthor}</Text>
      <Text style={styles.bookDetail}>Year: {item.bookYear}</Text>
      <Text style={styles.bookDetail}>Semester: {item.bookSemester}</Text>
      <Text style={styles.bookDetail}>Date of Issue: {item.dateOfIssue}</Text>
      <Text style={styles.bookDetail}>Fine: {item.fine}</Text>
      <Text style={styles.bookDetail}>{item.dateOfSubmission ? `Date of Submission: ${item.dateOfSubmission}` : 'Not yet submitted'}</Text>
    </View>
  );

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={{ backgroundColor: "lightpink", alignItems: "center", justifyContent: "center", padding: 10 }}>
        <Text style={styles.header}>Issued Books</Text>
        <FlatList
          data={issuedBooks}
          renderItem={renderBookItem}
          keyExtractor={(item) => item.bookId.toString()}
          ListEmptyComponent={<Text style={styles.emptyMessage}>No issued books found.</Text>}
        />
      </View>
      <View style={{ backgroundColor: "lightgreen", alignItems: "center", justifyContent: "center", padding: 10 }}>
        <Text style={styles.header}>Submitted Books</Text>
        <FlatList
          data={submittedBooks}
          renderItem={renderBookItem}
          keyExtractor={(item) => item.bookId.toString()}
          ListEmptyComponent={<Text style={styles.emptyMessage}>No submitted books found.</Text>}
        />
      </View>
      <View style={{ height: 25, marginBottom: 20 }}>
        <Text style={styles.endMessage}>END</Text>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  bookItem: {
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
    width: "100%"
  },
  bookDetail: {
    fontSize: 16,
    color: '#555',
    marginBottom: 5,
  },
  emptyMessage: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    marginTop: 10,
  },
  endMessage: {
    textAlign: "center",
    fontSize: 16,
    color: '#555',
  },
});
