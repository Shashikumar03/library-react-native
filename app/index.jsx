import { useUser } from "@clerk/clerk-expo";
import { Redirect } from "expo-router";
import { Text, View } from "react-native";

export default function Index() {
  const { isLoaded, isSignedIn } = useUser();
  console.log(isSignedIn)
  return (
   
    <Redirect href={isSignedIn ? '/home' : '/login'} />
  );
}
