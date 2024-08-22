import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  Button,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  ToastAndroid,
  ActivityIndicator
} from 'react-native';
import submitBookService from '../../Service/AdminService/SubmitBookService';

export default function SubmitBookModal({ token }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false); // Add loading state

  // Single state object for input values and errors
  const [formState, setFormState] = useState({
    roll: '',
    bookId: '',
  });

  const [errors, setErrors] = useState({});

  // Effect to clear form fields when modal becomes visible
  useEffect(() => {
    if (modalVisible) {
      setFormState({
        roll: '',
        bookId: '',
      });
      setErrors({});
      setMessage('');
    }
  }, [modalVisible]);

  // Handle input change
  const handleInputChange = (name, value) => {
    setMessage("");
    // Allow only positive integers
    if (value && !/^\d+$/.test(value)) {
      setErrors((prevState) => ({
        ...prevState,
        [name]: 'Only positive integers are allowed',
      }));
      return;
    }

    setFormState((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    // Clear errors for the current field
    setErrors((prevState) => ({
      ...prevState,
      [name]: '',
    }));
  };

  // Handle form submission
  const handleSubmit = async () => {
    const { bookId, roll } = formState;

    // Validate inputs
    if (!bookId) {
      setErrors((prevState) => ({
        ...prevState,
        bookId: 'Book ID is required',
      }));
    }

    if (!roll) {
      setErrors((prevState) => ({
        ...prevState,
        roll: 'Roll number is required',
      }));
    }

    // Check for positive integers
    if (Number(bookId) <= 0 || !Number.isInteger(Number(bookId))) {
      setErrors((prevState) => ({
        ...prevState,
        bookId: 'Book ID must be a positive integer',
      }));
      return;
    }

    if (Number(roll) <= 0 || !Number.isInteger(Number(roll))) {
      setErrors((prevState) => ({
        ...prevState,
        roll: 'Roll number must be a positive integer',
      }));
      return;
    }

    // Start loading
    setLoading(true);

    const response = await submitBookService(bookId, roll, token);

    // Stop loading
    setLoading(false);

    if (response.success) {
      ToastAndroid.show('Book submitted successfully!', ToastAndroid.LONG);
      setModalVisible(false);
    } else {
      // Handle errors by setting them in the errors state
      setMessage(response.data.message);
      setErrors(response.data);
      ToastAndroid.show('Failed to submit book. Please check the errors.', ToastAndroid.LONG);
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Submit Book" onPress={() => setModalVisible(true)} />

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Submit Book</Text>
            {message && <Text style={styles.errorText}>{message}</Text>}

            <TextInput
              placeholder="Book ID"
              value={formState.bookId}
              onChangeText={(value) => handleInputChange('bookId', value)}
              style={[styles.input, errors.bookId && styles.errorInput]}
              keyboardType="numeric"
            />
            {errors.bookId && <Text style={styles.errorText}>{errors.bookId}</Text>}

            <TextInput
              placeholder="Roll Number"
              value={formState.roll}
              onChangeText={(value) => handleInputChange('roll', value)}
              style={[styles.input, errors.roll && styles.errorInput]}
              keyboardType="numeric"
            />
            {errors.roll && <Text style={styles.errorText}>{errors.roll}</Text>}

            {loading ? (
              <ActivityIndicator size="large" color="#0000ff" />
            ) : (
              <Button title="Submit" onPress={handleSubmit} />
            )}

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  input: {
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
    borderRadius: 10,
  },
  errorInput: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
  closeButton: {
    marginTop: 15,
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'red',
    fontWeight: 'bold',
  },
});
