import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, SectionList, RefreshControl, TextInput, StatusBar } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { GetStudenDetailsByEmail } from '../../Service/StudentService/GetStudentDetailsByEmail';
import { useUser } from '@clerk/clerk-expo';
import AdminBooks from '../../screen/Admin/AdminBooks';

export default function Books() {
  const [studentDetails, setStudentDetails] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [sections, setSections] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [semesterFilter, setSemesterFilter] = useState('');
  const [authorFilter, setAuthorFilter] = useState('');
  const { user, isSignedIn } = useUser();

  if (user?.primaryEmailAddress?.emailAddress === "vikash@gmail.com") {
    return <AdminBooks />;
  }

  if (!isSignedIn) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Please sign in</Text>
      </View>
    );
  }

  const fetchStudentData = async () => {
    try {
      const studentData = await GetStudenDetailsByEmail(user?.primaryEmailAddress?.emailAddress);
      setStudentDetails(studentData);

      const books = studentData?.data?.booksDto || [];
      const issuedBooks = books.filter(book => book.dateOfSubmission === null);
      const submittedBooks = books.filter(book => book.dateOfSubmission !== null);

      return [
        { title: 'Issued Books', data: issuedBooks },
        { title: 'Submitted Books', data: submittedBooks },
      ];
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchStudentData().then(setSections);
    }, [])
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchStudentData().then((newSections) => {
      setSections(newSections);
      setRefreshing(false);
    });
  }, []);

  const filterAndSearchBooks = (books) => {
    return books
      .filter(book =>
        (book.bookId.toString().includes(searchQuery) ||
         book.bookName.toLowerCase().includes(searchQuery.toLowerCase()) ||
         book.bookAuthor.toLowerCase().includes(searchQuery.toLowerCase()))
      )
      .filter(book =>
        (!semesterFilter || book.bookSemester.toString() === semesterFilter) &&
        (!authorFilter || book.bookAuthor.toLowerCase().includes(authorFilter.toLowerCase()))
      );
  };

  const filteredSections = sections.map(section => ({
    ...section,
    data: filterAndSearchBooks(section.data)
  }));

  const renderBookItem = ({ item }) => (
    <View style={styles.bookItem}>
      <View style={{ flexDirection: "row", gap: 10 }}>
        <Text>Book Name:</Text>
        <Text style={[styles.bookDetail, { fontWeight: "bold" }]}>{item.bookName}</Text>
      </View>
      <Text style={styles.bookDetail}>Book ID: {item.bookId}</Text>
      <Text style={styles.bookDetail}>Author: {item.bookAuthor}</Text>
      <Text style={styles.bookDetail}>Year: {item.bookYear}</Text>
      <Text style={styles.bookDetail}>Semester: {item.bookSemester}</Text>
      <Text style={styles.bookDetail}>Date of Issue: {item.dateOfIssue}</Text>
      <Text style={styles.bookDetail}>Fine: {item.fine}</Text>
      <Text style={styles.bookDetail}>
        {item.dateOfSubmission ? `Date of Submission: ${item.dateOfSubmission}` : 'Not yet submitted'}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchBar}
        placeholder="Search by Book ID, Name, or Author"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <View style={styles.filters}>
        <TextInput
          style={styles.filterInput}
          placeholder="Filter by Semester"
          value={semesterFilter}
          onChangeText={setSemesterFilter}
        />
        <TextInput
          style={styles.filterInput}
          placeholder="Filter by Author"
          value={authorFilter}
          onChangeText={setAuthorFilter}
        />
      </View>
      <SectionList
        sections={filteredSections}
        keyExtractor={(item) => item.bookId.toString()}
        renderItem={renderBookItem}
        renderSectionHeader={({ section: { title } }) => (
          <View style={styles.sectionHeader}>
            <Text style={styles.header}>{title}</Text>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.emptyMessage}>No books found.</Text>}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop:StatusBar.currentHeight||0,
    
    paddingBottom: 20,
    backgroundColor: '#f0f0f0',
  },
  searchBar: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    paddingLeft: 10,
    margin: 10,
    backgroundColor: '#fff',
  },
  filters: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  filterInput: {
    height: 40,
    flex: 1,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    paddingLeft: 10,
    marginHorizontal: 5,
    backgroundColor: '#fff',
  },
  sectionHeader: {
    backgroundColor: '#f8f8f8',
    padding: 10,
    alignItems: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  bookItem: {
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginVertical: 7.5,
    marginHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
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
    marginTop: 20,
  },
});
