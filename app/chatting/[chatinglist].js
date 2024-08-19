import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Text, View, TextInput, TouchableOpacity, FlatList, StyleSheet, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
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
  const [typingStatus, setTypingStatus] = useState(null);
  const stompClient = useRef(null);
  const { user } = useUser();
  const { chatinglist } = useLocalSearchParams();
  const navigation = useNavigation();
  const typingTimeoutRef = useRef(null);

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
    // Set the initial header title
    updateHeaderTitle(chatinglist);

    getConversationOfUsers();

    const socket = new SockJS(SOCKET_URL);
    stompClient.current = Stomp.over(socket);

    stompClient.current.connect({}, () => {
      console.log('Connected!!');

      // Subscribe to messages
      stompClient.current.subscribe('/topic/message', (msg) => {
        const receivedMessage = JSON.parse(msg.body);
        setMessages((prevMessages) => [receivedMessage, ...prevMessages]); // Add the new message to the top
      });

      // Subscribe to typing status
      stompClient.current.subscribe('/topic/typing', (msg) => {
        const typingData = JSON.parse(msg.body);
        if (typingData.senderId !== user?.primaryEmailAddress?.emailAddress && typingData.receiverId === user?.primaryEmailAddress?.emailAddress) {
          setTypingStatus(`${typingData.senderId} is typing...`);
          updateHeaderTitle(`${typingData.senderId} is typing...`, true);
        }
      });

      // Subscribe to stop typing status
      stompClient.current.subscribe('/topic/stopTyping', (msg) => {
        const typingData = JSON.parse(msg.body);
        if (typingData.senderId !== user?.primaryEmailAddress?.emailAddress && typingData.receiverId === user?.primaryEmailAddress?.emailAddress) {
          setTypingStatus(null);
          updateHeaderTitle(chatinglist, false);
        }
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

  const updateHeaderTitle = (title, isTyping = false) => {
    navigation.setOptions({
      headerTitle: () => (
        <Text style={{ color: isTyping ? 'blue' : 'black' }}>{title}</Text>
      ),
    });
  };

  const handleTyping = () => {
    if (stompClient.current && newMessage.trim()) {
      const typingMessage = {
        senderId: user?.primaryEmailAddress?.emailAddress,
        receiverId: chatinglist,
        isTyping: true,
      };
      stompClient.current.send('/app/typing', {}, JSON.stringify(typingMessage));

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      typingTimeoutRef.current = setTimeout(() => {
        const stopTypingMessage = {
          senderId: user?.primaryEmailAddress?.emailAddress,
          receiverId: chatinglist,
          isTyping: false,
        };
        stompClient.current.send('/app/stopTyping', {}, JSON.stringify(stopTypingMessage));
      }, 3000);
    }
  };

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
      setTypingStatus(null); // Clear typing status
    }
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
          />
        
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Type a message..."
              value={newMessage}
              onChangeText={(text) => {
                setNewMessage(text);
                handleTyping();
              }}
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