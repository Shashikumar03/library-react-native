import React, { useState } from 'react';
import {
  View,
  TextInput,
  Button,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  ToastAndroid
} from 'react-native';
import { submitBookService } from '../../Service/AdminService/SubmitBookService';
import { Slot } from 'expo-router';
// import { bookSubmitService } from './bookSubmitService';

export default function IssueBookModal({token}) {
  // Modal visibility state
  const [modalVisible, setModalVisible] = useState(false);
  const [roll, setRoll]= useState('')

  // Form data state
  const [formData, setFormData] = useState({
    bookId: '',
    bookName: '',
    bookAuthor: '',
    bookYear: '',
    bookSemester: '',
    
  });

  const [message, setMessage] = useState('');

  // Handle input change
  const handleInputChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };
console.log("roll,", roll)
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

    // await bookSubmitService(payload, roll, setMessage);
    const response=await submitBookService(payload, token, roll);
    if (response.status=="201"){
        ToastAndroid.show('book submitted successfully check your mail for confirmation', ToastAndroid.LONG);
        setModalVisible(false);
    }
    else{
        // ToastAndroid.show(`${response.data.message}`,ToastAndroid.LONG)
        // console.log(response.data)
        if (response.data.message)
            alert(response.data.message)
        else{
            console.log(response.data)
        }
    
    }

    // Close the modal after submission
   
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
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Issue Book</Text>

            <TextInput
              placeholder="Book ID..."
              value={formData.bookId}
              onChangeText={(value) => handleInputChange('bookId', value)}
              style={styles.input}
              keyboardType="numeric"
            />
            <TextInput
              placeholder="Book Name..."
              value={formData.bookName}
              onChangeText={(value) => handleInputChange('bookName', value)}
              style={styles.input}
            />
            <TextInput
              placeholder="Book Author..."
              value={formData.bookAuthor}
              onChangeText={(value) => handleInputChange('bookAuthor', value)}
              style={styles.input}
            />
            <TextInput
              placeholder="Book Year..."
              value={formData.bookYear}
              onChangeText={(value) => handleInputChange('bookYear', value)}
              style={styles.input}
              keyboardType="numeric"
            />
            <TextInput
              placeholder="Book Semester..."
              value={formData.bookSemester}
              onChangeText={(value) => handleInputChange('bookSemester', value)}
              style={styles.input}
              keyboardType="numeric"
            />
            <TextInput
              placeholder="Roll Number.."
              value={roll}
              onChangeText={(value) => setRoll(value)}
              style={styles.input}
              keyboardType="numeric"
            />

            <Button title="Submit" onPress={handleSubmit} />

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
    // flex: 1,
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
    borderRadius:10,
  },
  input: {
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
    borderRadius:10
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
