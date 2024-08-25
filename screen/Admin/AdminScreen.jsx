import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, RefreshControl, TextInput, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import { searchBookByAdminNameOrBookName } from '../../Service/Books/SearchBookBySerachTerm';
import { useFocusEffect } from '@react-navigation/native';
import CustomRadioButton from '../../components/CustomRadioButton';
import debounce from 'lodash.debounce'; // Make sure to install lodash.debounce
import Slider from '@react-native-community/slider'; // Import the slider component

export default function AdminScreen() {
  const [bookSearchResult, setBookSearchResult] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchBookError, setSearchBookError] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('id_asc');
  const [modalVisible, setModalVisible] = useState(false);
  const [semester, setSemester] = useState(0); // State for the semester slider
  const router = useRouter();

  // Fetch books from server
  const fetchBooks = async () => {
    setLoading(true);
    try {
      const response = await searchBookByAdminNameOrBookName('');
      if (response.success) {
        setBookSearchResult(response.data);
        applyFiltersAndSort(response.data, searchQuery);
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

  // Debounce function to limit the rate of filtering operations
  const debouncedApplyFiltersAndSort = useCallback(debounce((query) => applyFiltersAndSort(bookSearchResult, query), 300), [bookSearchResult]);

  // Apply filter and sorting on the books data
  const applyFiltersAndSort = (books, query = '') => {
    let filtered = books
      .filter((item) => {
        // Search operation
        if (query) {
          const lowerQuery = query.toLowerCase();
          return (
            item.bookName.toLowerCase().includes(lowerQuery) ||
            item.bookId.toString().toLowerCase().includes(lowerQuery) ||
            item.bookAuthor.toLowerCase().includes(lowerQuery)
          );
        }
        return true;
      })
      .filter((item) => {
        // Filter operation
        switch (filter) {
          case 'available':
            return item.dateOfIssue && item.dateOfSubmission || !item.dateOfIssue && !item.dateOfSubmission;
          case 'unavailable':
            return item.dateOfIssue && !item.dateOfSubmission;
          default:
            return true; // Show all books
        }
      })
      .filter((item) => {
        // Semester filter
        return semester === 0 || item.bookSemester === semester;
      });

    // Apply sorting
    filtered.sort((a, b) => {
      const valueA = sortOption.includes('semester') ? String(a.bookSemester) : String(a.bookId);
      const valueB = sortOption.includes('semester') ? String(b.bookSemester) : String(b.bookId);

      if (sortOption.includes('asc')) {
        return valueA.localeCompare(valueB, undefined, { numeric: true });
      } else {
        return valueB.localeCompare(valueA, undefined, { numeric: true });
      }
    });

    setFilteredBooks(filtered);
  };

  // Use effect to fetch books when the component mounts
  useEffect(() => {
    fetchBooks();
    setSearchQuery("");
  }, []);

  // Use focus effect to fetch data when the screen is focused
  useFocusEffect(
    useCallback(() => {
      fetchBooks();
      // setSearchQuery("")
    }, [])
  );

  // Handle manual refresh
  const handleRefresh = () => {
    setRefreshing(true); // Start refreshing animation
    fetchBooks();
    setSearchQuery("");
  };

  // Handle student with book
  const handleStudentWithBook = (student) => {
    if (student == null) {
      alert("This book is not assigned to anyone.");
    } else {
      const studentData = encodeURIComponent(JSON.stringify(student));
      router.push(`/book/${student.email}?data=${studentData}`);
    }
  };

  // Handle search query change with debounce
  const handleSearchQueryChange = (query) => {
    setSearchQuery(query);
    debouncedApplyFiltersAndSort(query);
  };

  // Handle filter and sort option changes
  useEffect(() => {
    applyFiltersAndSort(bookSearchResult, searchQuery);
  }, [searchQuery, filter, sortOption, bookSearchResult, semester]);

  // Determine the section title based on filter
  const sectionTitle = filter === 'all' ? 'Books' :
    filter === 'available' ? 'Available Books' : 'Unavailable Books';

  return (
    <View style={styles.mainContainer}>
      {/* Search Bar */}
      <TextInput
        style={styles.searchInput}
        placeholder="Search by book name, book ID, or author"
        value={searchQuery}
        onChangeText={handleSearchQueryChange}
      />

      {/* Custom Radio Buttons for Filtering */}
      <View style={styles.radioGroup}>
        <CustomRadioButton
          options={[
            { id: 'all', label: 'All', value: 'all' },
            { id: 'available', label: 'Available', value: 'available' },
            { id: 'unavailable', label: 'Unavailable', value: 'unavailable' },
          ]}
          selectedValue={filter}
          onSelect={setFilter}
        />
      </View>

      {/* Semester Slider */}
      <View style={styles.sliderContainer}>
        <Text style={styles.sliderLabel}>Semester: {semester}</Text>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={8}
          step={1}
          value={semester}
          onValueChange={setSemester}
          minimumTrackTintColor="#007bff"
          maximumTrackTintColor="#ddd"
          thumbTintColor="#007bff"
        />
      </View>

      {/* Sort Button */}
      <TouchableOpacity style={styles.sortButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.sortButtonText}>Sort Options</Text>
      </TouchableOpacity>

      {/* Sort Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity onPress={() => { setSortOption('id_asc'); setModalVisible(false); }}>
              <Text style={styles.modalOption}>Sort by ID Ascending</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { setSortOption('id_desc'); setModalVisible(false); }}>
              <Text style={styles.modalOption}>Sort by ID Descending</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { setSortOption('semester_asc'); setModalVisible(false); }}>
              <Text style={styles.modalOption}>Sort by Semester Ascending</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { setSortOption('semester_desc'); setModalVisible(false); }}>
              <Text style={styles.modalOption}>Sort by Semester Descending</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Display book search results */}
      <Text style={styles.sectionTitle}>Total {sectionTitle}: {filteredBooks.length}</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#007bff" />
      ) : (
        <FlatList
          data={filteredBooks}
          keyExtractor={(item) => item.bookId}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleStudentWithBook(item?.studentDto)}>
              <View style={styles.bookItem}>
                <Text style={styles.label}>Book Id: <Text style={styles.value}>{item.bookId}</Text></Text>
                <Text style={styles.label}>Book Name: <Text style={styles.value}>{item.bookName}</Text></Text>
                <Text style={styles.label}>Author: <Text style={styles.value}>{item.bookAuthor}</Text></Text>
                <Text style={styles.label}>Semester: <Text style={styles.value}>{item.bookSemester}</Text></Text>
                <Text style={styles.label}>Year: <Text style={styles.value}>{item.bookYear}</Text></Text>
                <Text style={styles.label}>Date of Issue: <Text style={styles.value}>{item.dateOfIssue || 'N/A'}</Text></Text>
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
  searchInput: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  radioGroup: {
    marginBottom: 15,
  },
  sliderContainer: {
    marginBottom: 15,
  },
  sliderLabel: {
    fontSize: 16,
    marginBottom: 5,
    color: '#333',
  },
  slider: {
    width: '100%',
    height: 60,
    
  },
  sortButton: {
    padding: 10,
    backgroundColor: '#007bff',
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 15,
  },
  sortButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    width: '80%',
    alignItems: 'center',
  },
  modalOption: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
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
