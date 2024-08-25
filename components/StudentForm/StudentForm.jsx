import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  Button, 
  Switch, 
  StyleSheet, 
  KeyboardAvoidingView, 
  Platform, 
  ScrollView, 
  ToastAndroid, 
  ActivityIndicator 
} from 'react-native';
import createStudent from '../../Service/StudentService/CreateStudent';
import { useUser } from '@clerk/clerk-expo';

export default function StudentForm({ openClose }) {
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState('');
  const { user } = useUser();

  const [studentForm, setStudentForm] = useState({
    name: "",
    email: user?.primaryEmailAddress?.emailAddress || '',
    password: "",
    phoneNumber: "",
    gender: true, // true for Male, false for Female
    semester: "",
    address: "",
    department: "ECE"
  });

  const handleGenderToggle = () => {
    setStudentForm(prevState => ({
      ...prevState,
      gender: !prevState.gender,
    }));
  };

  const handleChange = (field, value) => {
    setStudentForm(prevState => ({
      ...prevState,
      [field]: value,
    }));
    setErrors(prevErrors => ({
      ...prevErrors,
      [field]: '',
    }));
  };

  const handleSubmit = async () => {
    setErrorMessage("");
    setIsSubmitting(true);

    try {
      const gender = studentForm.gender ? 'Male' : 'Female';
      const responseData = await createStudent({
        ...studentForm,
        gender,
      });

      if (responseData.success) {
        console.log('Student Data:', responseData.data);
        setIsSubmitting(false); 
        openClose(!isModalOpen); 
      } else {
        setErrors(responseData.data);
        setErrorMessage(responseData?.data?.message)
        ToastAndroid.show("Please correct the errors before submitting", ToastAndroid.LONG);
        setIsSubmitting(false); 
      }
    } catch (error) {
      console.error('Error creating student:', error);
      setErrorMessage("An unexpected error occurred.");
      setIsSubmitting(false); 
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      {errorMessage && <Text style={{ color: "red" }}>{errorMessage}</Text>}
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.label}>Student Name..</Text>
        <TextInput
          style={styles.input}
          value={studentForm.name}
          onChangeText={(value) => handleChange('name', value)}
          placeholder="Enter student name"
        />
        {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}

        <Text style={styles.label}>App Pwd (must be ur login)</Text>
        <TextInput
          style={styles.input}
          value={studentForm.password}
          onChangeText={(value) => handleChange('password', value)}
          placeholder="Enter password"
          secureTextEntry
        />
        {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

        <Text style={styles.label}>Mobile Number....</Text>
        <TextInput
          style={styles.input}
          value={studentForm.phoneNumber}
          onChangeText={(value) => handleChange('phoneNumber', value)}
          placeholder="Enter mobile number"
          keyboardType="numeric"
        />
        {errors.phoneNumber && <Text style={styles.errorText}>{errors.phoneNumber}</Text>}

        <View style={styles.genderContainer}>
          <Text style={styles.label}>Gender</Text>
          <View style={styles.toggleContainer}>
            <Text>{studentForm.gender ? 'Male' : 'Female'}</Text>
            <Switch
              value={studentForm.gender}
              onValueChange={handleGenderToggle}
              trackColor={{ false: '#767577', true: '#81b0ff' }}
              thumbColor={studentForm.gender ? '#f5dd4b' : '#f4f3f4'}
            />
          </View>
        </View>

        <Text style={styles.label}>Address.....</Text>
        <TextInput
          style={styles.input}
          value={studentForm.address}
          onChangeText={(value) => handleChange('address', value)}
          placeholder="Enter address"
        />
        {errors.address && <Text style={styles.errorText}>{errors.address}</Text>}

        {isSubmitting ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <Button title="Submit" onPress={handleSubmit} />
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    flexGrow: 1,
  },
  label: {
    marginBottom: 5,
    fontSize: 16,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  genderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
});
