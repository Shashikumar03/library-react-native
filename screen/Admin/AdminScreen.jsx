import { View, Text, StyleSheet, StatusBar, TouchableOpacity } from 'react-native';
import React, { useLayoutEffect } from 'react';
import { useNavigation } from '@react-navigation/native';

export default function AdminScreen() {
  

  return (
    <View style={styles.mainContainer}>
      <Text>AdminScreen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: 'lightgray',
    justifyContent: 'center',
    alignItems: 'center',
    padding:10
  },
  booksText:{
    fontWeight:"bold",
    padding:10,
    borderWidth:1,
    borderRadius:10,
    width:"50%",
    color:"white",
    backgroundColor:"green",
    textAlign:"center"
  },
  textContainer:{
    gap:5,
  }
});
