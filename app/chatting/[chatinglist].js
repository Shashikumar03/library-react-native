import { View, Text, FlatList, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import getMessageOfTwoUser from '../../Service/Message/GetMessageOfTwoUsers';
import { useUser } from '@clerk/clerk-expo';
import sendMessage from '../../Service/Message/SendMessage';
// import sendMessageToUser from '../../Service/Message/SendMessageToUser'; // Assuming you have a function to send messages

export default function ChattingList() {
  const navigation = useNavigation();
  const [getUsersMessage, setGetUserMessage] = useState([]);
  const [messageText, setMessageText] = useState('');
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

  const handleSendMessage = async () => {
    if (messageText.trim()) {
      try {
        const newMessage = {
          senderId: user?.primaryEmailAddress?.emailAddress,
          receiverId: chatinglist,
          text: messageText.trim(),
        };

        // Send the message using your service
        const sendedMessageToUser =await sendMessage(newMessage)

        // Add the new message to the list
        console.log(sendedMessageToUser)
    
        setGetUserMessage((prevMessages) => [sendedMessageToUser, ...prevMessages]);
        console.log(getUsersMessage)

        // Clear the input field
        setMessageText('');
      } catch (error) {
        console.log('Error sending message:', error);
      }
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
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={90} // Adjust as needed for your app
    >
      <FlatList
        data={getUsersMessage}
        renderItem={renderItem}
        keyExtractor={(item,index) => index}
        inverted
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
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
