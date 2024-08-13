
import { useAuth, useUser } from "@clerk/clerk-expo";
import { Text, View, Button } from "react-native";
import React, { useState, useEffect } from "react";
import { useRouter } from "expo-router";

export default function Profile() {
  const { isLoaded, isSignedIn, signOut } = useAuth();
  const {user}=useUser()
  const router = useRouter();
  const [isSignOutComplete, setIsSignOutComplete] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  // useEffect(() => {
  //   if (isSignOutComplete) {
  //     console.log("Sign out complete, redirecting...");
  //     // router.replace("/Login"); // Ensure the route matches your setup
  //   }
  // }, [isSignOutComplete, router]);

  const handleSignOut = async () => {
    if (isButtonDisabled) return; // Prevent duplicate clicks
    setIsButtonDisabled(true);
    
    try {
      console.log("Attempting to sign out...");
      await signOut();
      return
      // router.replace("/Login")
      setIsSignOutComplete(true); // Trigger redirection
      console.log("Sign out successful");
    } catch (error) {
      console.error("Error signing out:", error);
    } finally {
      setIsButtonDisabled(false); // Re-enable button if needed
    }
  };

  if (!isLoaded) {
    return <Text>Loading...</Text>; // Show loading state while data is being fetched
  }

  if (!isSignedIn) {
    return <Text>Please sign in to access this page.</Text>; // Handle case where user is not signed in
  }

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>
        Hello, {user ? user.fullName : "User"} welcome to timesheet
      </Text>
      <Button 
        title="Sign Out" 
        onPress={handleSignOut} 
        disabled={isButtonDisabled}
      />
    </View>
  );
}
