import * as React from 'react';
import { TextInput, Button, View, TouchableOpacity, Text, ToastAndroid, ActivityIndicator } from 'react-native';
import { useSignUp } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';

export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [pendingVerification, setPendingVerification] = React.useState(false);
  const [code, setCode] = React.useState('');
  const [buttonState, setButtonState] = React.useState(false)
  const [verifyEmailButton, setVerifyEmailButton]= React.useState(false)

  const onSignUpPress = async () => {
    if (!isLoaded) {
      return;
    }
    setButtonState(true)
    try {
      await signUp.create({
        emailAddress,
        password,
      });

      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });

      setPendingVerification(true);
    } catch (err) {
      // Display the error message using ToastAndroid
      const errors = err.errors || [];
      //  errors?setButtonState(false):setButtonState(true)
      errors.forEach((error) => {
        ToastAndroid.show(error.message, ToastAndroid.LONG, ToastAndroid.TOP);
        alert(error.longMessage)
      });
    } finally {
      setButtonState(false)
    }
  };

  const onPressVerify = async () => {
    if (!isLoaded) {
      return;
    }

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });
      setVerifyEmailButton(true)

      if (completeSignUp.status === 'complete') {
        await setActive({ session: completeSignUp.createdSessionId });
        router.replace('/Home');
      } else {
        console.error(JSON.stringify(completeSignUp, null, 2));
      }
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
      const errors = err.errors || [];
      //  errors?setButtonState(false):setButtonState(true)
      errors.forEach((error) => {
        ToastAndroid.show(error.message, ToastAndroid.LONG, ToastAndroid.TOP);
        alert(error.longMessage)
      });
    }finally{
      setVerifyEmailButton(false)
    }
  };

  return (
    <View style={{
      flex: 1,
      justifyContent: "center",
    }}>
      {!pendingVerification && (
        <View style={{
          padding: 20,
          gap: 10,
        }}>
          <TextInput
            autoCapitalize="none"
            value={emailAddress}
            placeholder="Email..."
            onChangeText={(email) => setEmailAddress(email)}
            style={{
              fontWeight: "bold",
              padding: 10,
              borderWidth: 2,
              borderRadius: 8,
            }}
          />
          <TextInput
            value={password}
            placeholder="Password..."
            secureTextEntry={true}
            onChangeText={(password) => setPassword(password)}
            style={{
              fontWeight: "bold",
              padding: 10,
              borderWidth: 2,
              borderRadius: 8,
            }}
          />
          {
            buttonState ? <ActivityIndicator size="large" color="blue" /> :


              <View style={{
                alignItems: "center",
              }}>
                <TouchableOpacity onPress={onSignUpPress} style={{
                  backgroundColor: "blue",
                  padding: 10,
                  borderRadius: 8,
                  width: "50%",

                }}
                  disabled={buttonState}
                >
                  <Text style={{
                    color: "white",
                    textAlign: "center",
                    fontWeight: "bold",
                    fontSize: 16,
                  }}>Sign Up</Text>
                </TouchableOpacity>
              </View>
          }
        </View>
      )}
      {pendingVerification && (
        <View style={{
          padding: 20,
          alignItems: "center",
          width: "100%",
          backgroundColor: "pink",
          gap:10
        }}>
          <TextInput value={code}
            style={{
              borderWidth: 2,
              width:"80%",
              padding:8,
              borderRadius:10

            }} placeholder="Code..." onChangeText={(code) => setCode(code)} />
          {/* <Button title="Verify Email" onPress={onPressVerify} /> */}
          <TouchableOpacity onPress={onPressVerify}
           style={{
            backgroundColor:"blue",
            padding:2,
            borderRadius:10

           }}
           disabled={verifyEmailButton}
          >
            <Text
            style={{
              padding:10,
              color:"white",
              fontWeight:"bold",
              fontSize:16
            }}>Verify Email</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}