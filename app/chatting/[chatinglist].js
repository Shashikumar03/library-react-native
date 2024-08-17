import { View, Text, FlatList, StyleSheet } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import getMessageOfTwoUser from '../../Service/Message/GetMessageOfTwoUsers';
import { useUser } from '@clerk/clerk-expo';

export default function ChattingList() {
  const navigation = useNavigation();
  const [getUsersMessage, setGetUserMessage] = useState([]);
  const { chatinglist } = useLocalSearchParams();
  const { user } = useUser();

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: chatinglist,
    });
    getConversationOfTwoUsers();
  }, []);

  const getConversationOfTwoUsers = async () => {
    try {
      const getMessage = await getMessageOfTwoUser(user?.primaryEmailAddress?.emailAddress, chatinglist);
      setGetUserMessage(getMessage);
    } catch (err) {
      console.log(err);
    }
  };

  const renderItem = ({ item }) => {
    const isCurrentUser = item.senderId === user?.primaryEmailAddress?.emailAddress;

    return (
      <View style={[styles.messageContainer, isCurrentUser ? styles.currentUserMessage : styles.otherUserMessage]}>
        <Text style={styles.messageText}>{item.text}</Text>
        <Text style={styles.timestamp}>{new Date(item.timestamp).toLocaleTimeString()}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={getUsersMessage}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        inverted // This will reverse the FlatList so the most recent message appears at the bottom
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#e5ddd5',
  },
  messageContainer: {
    marginVertical: 5,
    padding: 10,
    borderRadius: 10,
    maxWidth: '80%',
  },
  currentUserMessage: {
    backgroundColor: '#dcf8c6',
    alignSelf: 'flex-end',
  },
  otherUserMessage: {
    backgroundColor: '#ffffff',
    alignSelf: 'flex-start',
  },
  messageText: {
    fontSize: 16,
  },
  timestamp: {
    fontSize: 12,
    color: 'gray',
    alignSelf: 'flex-end',
  },
});
