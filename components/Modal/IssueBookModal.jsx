import React, { useState } from 'react';
import {
  View,
  TextInput,
  Button,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  ToastAndroid,
  ScrollView
} from 'react-native';
import { submitBookService } from '../../Service/AdminService/SubmitBookService';

export default function IssueBookModal({ token }) {
  // Modal visibility state
  const [modalVisible, setModalVisible] = useState(false);
  const [roll, setRoll] = useState('');

  // Form data state
  const [formData, setFormData] = useState({
    bookId: '',
    bookName: '',
    bookAuthor: '',
    bookYear: '',
    bookSemester: '',
  });

  // Error state for each field
  const [errors, setErrors] = useState({
    bookId: '',
    bookName: '',
    bookAuthor: '',
    bookYear: '',
    bookSemester: '',
    roll: '',
    message:''
  });

  // Handle input change
  const handleInputChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
    setErrors({
      ...errors,
      message:'',
      [name]: '' // Clear error when user changes input
    });
  };

  // Handle form submission
  const handleSubmit = async () => {
    const { bookId, bookName, bookAuthor, bookYear, bookSemester } = formData;

    const payload = {
      bookId: parseInt(bookId),
      bookName,
      bookAuthor,
      bookYear: parseInt(bookYear),
      bookSemester: parseInt(bookSemester),
    };

    const response = await submitBookService(payload, token, roll);

    if (response.success) {
      if (response.status === 201) {
        ToastAndroid.show('Book submitted successfully. Check your mail for confirmation.', ToastAndroid.LONG);
        setModalVisible(false);
      } else {
        ToastAndroid.show('Book submission successful.', ToastAndroid.LONG);
      }
    } else {
      // Handle and set errors based on the response
      const errorData = response.data;
    //   console.log("jjjjjjjj")
      console.log(errorData)
      const newErrors = {
        bookId: errorData.bookId || '',
        bookName: errorData.bookName || '',
        bookAuthor: errorData.bookAuthor || '',
        bookYear: errorData.bookYear || '',
        bookSemester: errorData.bookSemester || '',
        roll: errorData.roll || '',
        message:errorData.message || ''
      };
      setErrors(newErrors);
      ToastAndroid.show('Failed to issue book.', ToastAndroid.LONG);
    }
  };

  return (
    
    <View style={styles.container}>
      <Button title="Issue Book" onPress={() => setModalVisible(true)} />
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
      {/* <ScrollView> */}

        
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Issue Book</Text>
            {errors.message ? <Text style={styles.errorText}>{errors.message}</Text> : null}

            
            <TextInput
              placeholder="Book ID..."
              value={formData.bookId}
              onChangeText={(value) => handleInputChange('bookId', value)}
              style={styles.input}
              keyboardType="numeric"
            />
            {errors.bookId ? <Text style={styles.errorText}>{errors.bookId}</Text> : null}

            <TextInput
              placeholder="Book Name..."
              value={formData.bookName}
              onChangeText={(value) => handleInputChange('bookName', value)}
              style={styles.input}
            />
            {errors.bookName ? <Text style={styles.errorText}>{errors.bookName}</Text> : null}

            <TextInput
              placeholder="Book Author..."
              value={formData.bookAuthor}
              onChangeText={(value) => handleInputChange('bookAuthor', value)}
              style={styles.input}
            />
            {errors.bookAuthor ? <Text style={styles.errorText}>{errors.bookAuthor}</Text> : null}

            <TextInput
              placeholder="Book Year..."
              value={formData.bookYear}
              onChangeText={(value) => handleInputChange('bookYear', value)}
              style={styles.input}
              keyboardType="numeric"
            />
            {errors.bookYear ? <Text style={styles.errorText}>{errors.bookYear}</Text> : null}

            <TextInput
              placeholder="Book Semester..."
              value={formData.bookSemester}
              onChangeText={(value) => handleInputChange('bookSemester', value)}
              style={styles.input}
              keyboardType="numeric"
            />
            {errors.bookSemester ? <Text style={styles.errorText}>{errors.bookSemester}</Text> : null}

            <TextInput
              placeholder="Roll Number..."
              value={roll}
              onChangeText={(value) => setRoll(value)}
              style={styles.input}
              keyboardType="numeric"
            />
            {errors.roll ? <Text style={styles.errorText}>{errors.roll}</Text> : null}
        {/* </ScrollView> */}


            <Button title="Submit" onPress={handleSubmit} />

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
        {/* </ScrollView> */}
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
  errorText: {
    color: 'red',
    fontSize: 12,
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
