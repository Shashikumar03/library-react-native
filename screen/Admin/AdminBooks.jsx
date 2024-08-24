import React, { useEffect, useCallback, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, ActivityIndicator, ToastAndroid } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { GetStudenDetailsByEmail } from '../../Service/StudentService/GetStudentDetailsByEmail';
import { useRouter } from 'expo-router';
import { getAdminToken } from '../../Service/Login/GetAdminToken';
import IssueBookModal from '../../components/Modal/IssueBookModal';
import SubmitBookModal from '../../components/Modal/SubmitBookModal';

export default function AdminBooks() {
    const [token, setToken] = useState('');
    const [studentEmail, setStudentEmail] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    useEffect(() => {
        const fetchToken = async () => {
            const loginToken = await getAdminToken();
            setToken(loginToken);
        };

        fetchToken();
    }, []);

    const isValidEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleSearchStudent = async () => {
        if (!studentEmail.trim()) {
            setError('Email field cannot be empty.');
            return;
        }

        if (!isValidEmail(studentEmail)) {
            setError('Please enter a valid email address.');
            return;
        }

        setLoading(true);
        setError('');

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
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            setSearchResults([]);
            setStudentEmail('');
        }, [])
    );

    const handleStudentDetails = (student) => {
        const studentData = encodeURIComponent(JSON.stringify(student));
        router.push(`/student/${student.email}?data=${studentData}`);
    };

    return (
        <View style={styles.mainContainer}>
            <View style={styles.modalContainer}>
                <IssueBookModal token={token} />
                <SubmitBookModal token={token} />
            </View>
            <View style={styles.searchContainer}>
                <Text style={styles.title}>Search Student</Text>
                <TextInput
                    placeholder="Enter student email..."
                    value={studentEmail}
                    onChangeText={setStudentEmail}
                    style={styles.input}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />
                {loading ? (
                    <ActivityIndicator size="small" color="#007bff" />
                ) : (
                    <>
                        {error ? <Text style={styles.errorText}>{error}</Text> : null}
                        <TouchableOpacity onPress={handleSearchStudent} style={styles.button}>
                            <Text style={styles.buttonText}>Search</Text>
                        </TouchableOpacity>
                    </>
                )}
            </View>
            <FlatList
                data={searchResults}
                keyExtractor={(item) => item.email}
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => handleStudentDetails(item)}>
                        <View style={styles.resultItem}>
                            <Text style={styles.resultLabel}>Email: <Text style={styles.resultValue}>{item.email}</Text></Text>
                            <Text style={styles.resultLabel}>Name: <Text style={styles.resultValue}>{item.name}</Text></Text>
                            <Text style={styles.resultLabel}>Semester: <Text style={styles.resultValue}>{item.semester}</Text></Text>
                            <Text style={styles.resultLabel}>Gender: <Text style={styles.resultValue}>{item.gender}</Text></Text>
                            <Text style={styles.resultLabel}>Department: <Text style={styles.resultValue}>{item.department}</Text></Text>
                        </View>
                    </TouchableOpacity>
                )}
                ListEmptyComponent={() => (
                    !loading && <Text style={styles.noResultsText}>No results found</Text>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: 'lightgray',
        padding: 20,
    },
    modalContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    searchContainer: {
        marginBottom: 20,
        padding: 15,
        backgroundColor: '#fff',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333',
    },
    input: {
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        padding: 12,
        marginBottom: 10,
        backgroundColor: '#fff',
    },
    button: {
        backgroundColor: '#007bff',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    errorText: {
        color: '#d9534f',
        marginBottom: 10,
        textAlign: 'center',
    },
    resultItem: {
        backgroundColor: '#fff',
        padding: 15,
        marginBottom: 10,
        borderRadius: 8,
        borderColor: '#ddd',
        borderWidth: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    resultLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 5,
    },
    resultValue: {
        fontSize: 16,
        color: '#555',
    },
    noResultsText: {
        textAlign: 'center',
        marginTop: 20,
        fontSize: 16,
        color: '#999',
    },
});
