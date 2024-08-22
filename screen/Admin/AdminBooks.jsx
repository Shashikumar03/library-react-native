import { View, Text, StyleSheet, StatusBar, TouchableOpacity } from 'react-native';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { getAdminToken } from '../../Service/Login/GetAdminToken';
import { useFocusEffect } from 'expo-router';
import IssueBookModal from '../../components/Modal/IssueBookModal';
import SubmitBookModal from '../../components/Modal/SubmitBookModal';
// import React from 'react'

export default function AdminBooks() {
    const [token, setToken] = useState('')

    useEffect(() => {
        adminLoginToken()
    }, [])
    const adminLoginToken = async () => {
        const loginToken = await getAdminToken();
        console.log("login token", loginToken)
        setToken(loginToken)

    }
    return (
        <View style={styles.mainContainer}>
            {/* <Text>AdminScreen</Text> */}
            <View style={styles.textContainer} >
                <IssueBookModal token={token} />
                <SubmitBookModal token={token} />

            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: 'lightgray',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10
    },
    booksText: {
        fontWeight: "bold",
        padding: 10,
        borderWidth: 1,
        borderRadius: 10,
        // width:"50",
        color: "white",
        backgroundColor: "green",
        textAlign: "center"
    },
    textContainer: {
        gap: 5,
    }
});
