import { View, Text, StyleSheet,  } from 'react-native'
import React from 'react'
import Model from '../../components/Modal/Model'
// import {Model} from "./../../components/Modal/Model"

export default function Profile() {
  return (
    <View style={styles.center}>
      <Text>Home</Text>
      <Model/>
      
    </View>
  )
}

const styles=StyleSheet.create({
    center:{
        flex:1,
        justifyContent:"center",
        alignItems:"center"
    }
})