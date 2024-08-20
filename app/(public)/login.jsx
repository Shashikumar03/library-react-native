import { useSignIn } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import { Text, TextInput, Button, View, TouchableOpacity, StyleSheet, ToastAndroid, ActivityIndicator } from 'react-native';
import React, { useState } from 'react';
import { Adminlogin } from '../../Service/Login/AdminLogin';

export default function Login() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();
 

  const [emailAddress, setEmailAddress] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [buttonDisable, setButtonDisable]= useState(false)
  const [message, setMessage]= useState(false)

  const onSignInPress = React.useCallback(async () => {
    if (!isLoaded) {
      console.log('Sign-in not yet loaded');
      return;
    }
    setButtonDisable(true)
    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      });

      if (signInAttempt.status === 'complete') {
        await setActive({ session: signInAttempt.createdSessionId });
        console.log('Login successful');
        Adminlogin(emailAddress,password,setMessage)
        console.log(message)
        router.replace('/home');
        // retu rn
        // Redirect to home
        
      } else {
        console.error('Sign-in attempt incomplete:', JSON.stringify(signInAttempt, null, 2));
      }
    } catch (err) {
      console.error('Sign-in error:', JSON.stringify(err, null, 2));
      const errors = err.errors || [];
      //  errors?setButtonState(false):setButtonState(true)
      errors.forEach((error) => {
        ToastAndroid.show(error.message, ToastAndroid.LONG, ToastAndroid.TOP);
        
        alert(error.longMessage)
      });
    }finally{
      setButtonDisable(false)
    }
  }, [isLoaded, emailAddress, password, signIn, setActive, router]);

  return (
    <View style={styles.container}>
      <TextInput
        autoCapitalize="none"
        value={emailAddress}
        placeholder="Email..."
        onChangeText={setEmailAddress}
        style={styles.input}
      />
      <TextInput
        value={password}
        placeholder="Password..."
        secureTextEntry
        onChangeText={setPassword}
        style={styles.input}
      />
     {
      
      buttonDisable?<ActivityIndicator size="large" color="blue" />: <TouchableOpacity onPress={onSignInPress} style={{backgroundColor:"blue",padding:10, borderRadius:8}} disabled={buttonDisable}>
      <Text style={{color:"white",fontSize:16, fontWeight:"bold", }}>Sign In</Text>
    </TouchableOpacity>
     }
      {/* <Button title="Sign In" onPress={onSignInPress} /> */}
      <View style={styles.signupContainer}>
        <Text>Don't have an account?</Text>
        <TouchableOpacity  style={{borderRadius:10,backgroundColor:"lightpink"}}onPress={() => router.push("/register")}>
          <Text style={styles.signupText}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 5,
    padding: 20,
  },
  input: {
    borderWidth: 2,
    borderColor: 'gray',
    width: '80%',
    height: 40,
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  signupContainer: {
    marginTop: 10,
    alignItems: 'center',
    borderRadius:10,
    gap:5
    
  },
  signupText: {
    color: '#0066cc',
    padding:10,
    fontWeight:"bold",
    textAlign:"center",
    color:"white"


  },
});