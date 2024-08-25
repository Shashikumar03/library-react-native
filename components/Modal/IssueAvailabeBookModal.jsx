import React, { useEffect, useState } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ToastAndroid, ActivityIndicator } from 'react-native';
import { getAdminToken } from '../../Service/Login/GetAdminToken';
import { issueAvailableBookService } from '../../Service/AdminService/IssueAvailableBookService';

export default function IssueAvailableBookModal({ visible, onClose, book, fetchBook }) {
  const [rollNumber, setRollNumber] = useState('');
  const [token, setToken] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getAdminLoginToken();
  }, []);

  const getAdminLoginToken = async () => {
    try {
      const token = await getAdminToken();
      setToken(token);
    } catch (error) {
      setErrorMessage('Failed to fetch token.');
    }
  };

  const handleIssueBook = () => {
    // Confirmation alert
    Alert.alert(
      'Confirm Issue',
      `Are you sure you want to issue book with ID: ${book.bookId} to Roll Number: ${rollNumber}?`,
      [
        {
          text: 'No',
          onPress: () => console.log('Issue cancelled'),
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: issueAvailableBook,
        },
      ],
      { cancelable: false }
    );
  };

  const issueAvailableBook = async () => {
    setLoading(true);
    setErrorMessage('');

    try {
      const response = await issueAvailableBookService(book.bookId, rollNumber, token);

      if (response.success) {
        ToastAndroid.show(`Book successfully assigned to roll number: ${rollNumber}`, ToastAndroid.SHORT);
        fetchBook();
        onClose(); // Close the modal on success
      } else {
        setErrorMessage(response?.data?.message || 'Failed to issue book.');
      }
    } catch (error) {
      setErrorMessage('An error occurred while issuing the book.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} transparent={true} animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Issue Book</Text>
          {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
          <Text>Book ID: {book?.bookId}</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Roll Number"
            value={rollNumber}
            keyboardType="numeric"
            onChangeText={setRollNumber}
          />
          {loading ? (
            <ActivityIndicator size="large" color="#007bff" />
          ) : (
            <>
              <TouchableOpacity onPress={handleIssueBook} style={styles.issueButton}>
                <Text style={styles.issueButtonText}>Issue Book</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={onClose} style={styles.cancelButton}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    marginBottom: 10,
  },
  issueButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  issueButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  cancelButton: {
    padding: 10,
  },
  cancelButtonText: {
    color: '#007bff',
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
});
