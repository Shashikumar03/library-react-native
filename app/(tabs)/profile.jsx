import { useAuth, useUser } from "@clerk/clerk-expo";
import { Text, View, Button, StyleSheet } from "react-native";
import React, { useState, useEffect } from "react";
import { Redirect, useRouter } from "expo-router";
import { GetStudenDetailsByEmail } from "../../Service/StudentService/GetStudentDetailsByEmail";

export default function Profile() {
  const { isLoaded, isSignedIn, signOut } = useAuth();
  const { user } = useUser();
  const router = useRouter();
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [studentDetail, setStudentDetail] = useState(null);

  useEffect(() => {
    if (user?.primaryEmailAddress?.emailAddress) {
      GetStudenDetailsByEmail(user.primaryEmailAddress.emailAddress)
        .then((details) => setStudentDetail(details))
        .catch((error) => console.error("Error fetching student details:", error));
    }
  }, [user]);

  const handleSignOut = async () => {
    if (isButtonDisabled) return;
    setIsButtonDisabled(true);

    try {
      await signOut();
      return <Redirect href={"/(public)"}/>
    } catch (error) {
      console.error("Error signing out:", error);
    } finally {
      setIsButtonDisabled(false);
    }
  };

  if (!isLoaded) {
    return <Text>Loading...</Text>;
  }

  if (!isSignedIn) {
    return <Text>Please sign in to access this page.</Text>;
  }
  // const {isSignedIn}= useUser()

  console.log("check Signed In",isSignedIn)

  return (
    <View style={styles.container}>
      <View style={styles.profileBox}>
        <Text style={styles.greeting}>
          Hello, {studentDetail?.name ? studentDetail.name : "User"}! Welcome to your profile.
        </Text>
        {studentDetail && (
          <View>
            <Text>Name: {studentDetail.name}</Text>
            <Text>Email: {studentDetail.email}</Text>
            <Text>Address: {studentDetail.address}</Text>
            <Text>Department: {studentDetail.department}</Text>
            <Text>Gender: {studentDetail.gender}</Text>
            <Text>Phone Number: {studentDetail.phoneNumber}</Text>
            <Text>Roll: {studentDetail.roll}</Text>
            <Text>Semester: {studentDetail.semester}</Text>
            <Text>Number of Books Issued: {studentDetail.noOfBookIssue}</Text>
          </View>
        )}
        <Button title="Sign Out" onPress={handleSignOut} disabled={isButtonDisabled} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  profileBox: {
    width: '90%',
    padding: 20,
    borderRadius: 10,
    backgroundColor: "#fff",
    // Box shadow properties for iOS and Android
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5, // This is for Android box shadow
  },
  greeting: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
});
