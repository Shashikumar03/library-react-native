import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Text, View, TextInput, TouchableOpacity, FlatList, StyleSheet, ActivityIndicator, KeyboardAvoidingView, Platform, RefreshControl } from 'react-native';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import { useUser } from '@clerk/clerk-expo';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import getMessageOfTwoUser from '../../Service/Message/GetMessageOfTwoUsers';

const SOCKET_URL = 'http://192.168.0.189:8283/ws-message';

const Chatting = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const stompClient = useRef(null);
  const { user } = useUser();
  const { chatinglist } = useLocalSearchParams();
  const navigation = useNavigation()

  const getConversationOfUsers = async () => {
    setLoading(true);
    try {
      const fetchedMessages = await getMessageOfTwoUser(user?.primaryEmailAddress?.emailAddress, chatinglist);
      fetchedMessages.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)); // Sort messages by timestamp
      setMessages(fetchedMessages);
    } catch (err) {
      console.log('Error fetching messages:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: chatinglist,
    });
    getConversationOfUsers();

    const socket = new SockJS(SOCKET_URL);
    stompClient.current = Stomp.over(socket);

    stompClient.current.connect({}, () => {
      console.log('Connected!!');

      stompClient.current.subscribe('/topic/message', (msg) => {
        const receivedMessage = JSON.parse(msg.body);
        setMessages((prevMessages) => [receivedMessage, ...prevMessages]); // Add the new message to the top
      });
    }, (error) => {
      console.error('STOMP error:', error);
    });

    return () => {
      if (stompClient.current) {
        stompClient.current.disconnect(() => {
          console.log('Disconnected!');
        });
      }
    };
  }, []);

  const handleSendMessage = () => {
    if (stompClient.current && newMessage.trim()) {
      const chatMessage = {
        text: newMessage,
        senderId: user?.primaryEmailAddress?.emailAddress,
        receiverId: chatinglist,
        timestamp: new Date().toISOString(), // Add timestamp for consistency
      };
      stompClient.current.send('/app/sendMessage', {}, JSON.stringify(chatMessage));
      setNewMessage(''); // Clear input field
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await getConversationOfUsers();
    setRefreshing(false);
  };

  const renderMessage = useCallback(({ item }) => {
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
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 100}
    >
      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" style={styles.loader} />
      ) : (
        <>
          <FlatList
            data={messages}
            renderItem={renderMessage}
            keyExtractor={(item) => item.id.toString()}
            inverted
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          />
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Type a message..."
              value={newMessage}
              onChangeText={setNewMessage}
            />
            <TouchableOpacity onPress={handleSendMessage} style={styles.sendButton}>
              <Text style={styles.sendButtonText}>Send</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </KeyboardAvoidingView>
  );
};

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

export default Chatting;
