import { View, Text, FlatList, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import React, { useEffect, useState, useCallback } from 'react';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import getMessageOfTwoUser from '../../Service/Message/GetMessageOfTwoUsers';
import { useUser } from '@clerk/clerk-expo';
import sendMessage from '../../Service/Message/SendMessage';

export default function ChattingList() {
  const navigation = useNavigation();
  const [getUsersMessage, setGetUserMessage] = useState([]);
  const [messageText, setMessageText] = useState('');
  const { chatinglist } = useLocalSearchParams();
  const { user } = useUser();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: chatinglist,
    });
    getConversationOfTwoUsers();
  }, [chatinglist]);

  const getConversationOfTwoUsers = async () => {
    setLoading(true);
    try {
      console.log('Fetching messages...');
      const getMessage = await getMessageOfTwoUser(user?.primaryEmailAddress?.emailAddress, chatinglist);
      console.log('Messages fetched:', getMessage);
      // Sort messages by timestamp if they are not already sorted
      getMessage.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      setGetUserMessage(getMessage);
    } catch (err) {
      console.log('Error fetching messages:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (messageText.trim()) {
      try {
        const newMessage = {
          senderId: user?.primaryEmailAddress?.emailAddress,
          receiverId: chatinglist,
          text: messageText.trim(),
          timestamp: new Date().toISOString(), // Ensure timestamp is included
        };

        // Send the message using your service
        console.log('Sending message:', newMessage);
        const sendedMessageToUser = await sendMessage(newMessage);
        console.log('Message sent:', sendedMessageToUser);

        // Add the new message to the list
        setGetUserMessage((prevMessages) => [sendedMessageToUser, ...prevMessages]);

        // Clear the input field
        setMessageText('');
      } catch (error) {
        console.log('Error sending message:', error);
      }
    }
  };

  const renderItem = useCallback(({ item }) => {
    const isCurrentUser = item.senderId === user?.primaryEmailAddress?.emailAddress;

    return (
      <View style={[styles.messageContainer, isCurrentUser ? styles.currentUserMessage : styles.otherUserMessage]}>
        <Text style={styles.messageText}>{item.text}</Text>
        <Text style={styles.timestamp}>{new Date(item.timestamp).toLocaleTimeString()}</Text>
      </View>
    );
  }, [user?.primaryEmailAddress?.emailAddress]);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 100} // Adjust based on your header height and layout
    >
      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" style={styles.loader} />
      ) : (
        <>
          <FlatList
            data={getUsersMessage}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()} // Use unique id as key
            inverted // Ensure messages are shown from bottom to top
          />
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Type a message..."
              value={messageText}
              onChangeText={setMessageText}
            />
            <TouchableOpacity onPress={handleSendMessage} style={styles.sendButton}>
              <Text style={styles.sendButtonText}>Send</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e5ddd5',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderTopWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    height: 40,
    paddingHorizontal: 10,
    backgroundColor: '#f1f1f1',
    borderRadius: 20,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: '#007AFF',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});
