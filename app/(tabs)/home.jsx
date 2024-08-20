import { View, Text, StyleSheet, StatusBar, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
import Model from '../../components/Modal/Model';
import { useSignIn, useUser } from '@clerk/clerk-expo';
// import ChatScreen from '../../screen/chatScreen/ChatScreen';
import { useRouter } from 'expo-router';
import AdminScreen from '../../screen/Admin/AdminScreen';

export default function Home() {
  const [showChat, setShowChat] = useState(false);
  const { user,isSignedIn } = useUser();
  const router= useRouter()
  console.log("check Signed In", isSignedIn);
  if(user?.primaryEmailAddress?.emailAddress=="vikash@gmail.com"){
    return(<AdminScreen/>)

  }
  if (!isSignedIn) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Please sign in</Text>
      </View>
    );
  }

  useEffect(() => {
    // Additional logic can be added here if needed
  }, []);

  const handleChatScreen = () => {
    setShowChat(true);
  };

  if (showChat) {
    router.push("/chatting/ChatScreen")
    // return <ChatScreen />;
  }

  return (
    <View style={styles.center}>
      <Text>Welcome to Library Management</Text>
      <Model />
      <TouchableOpacity style={styles.questionPaper} onPress={() => alert("This feature is coming soon")}>
        <Text style={{ fontWeight: "bold" }}>Download Previous Year Question Paper</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.questionPaper} onPress={handleChatScreen}>
        <Text style={{ fontWeight: "bold" }}>Chatting</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: "center",
    marginTop: StatusBar.currentHeight, // Adjust for the status bar height
  },
  questionPaper: {
    backgroundColor: "lightpink",
    padding: 10,
    borderRadius: 10,
    marginTop: 10
  }
});
