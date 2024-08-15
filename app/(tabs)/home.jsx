import { View, Text, StyleSheet, StatusBar, TouchableOpacity } from 'react-native'
import React, { useEffect } from 'react'
import Model from '../../components/Modal/Model'
// import GetStudentById from '../../Service/StudentService/GetStudentById'
// import { GetStudenDetailsByEmail } from '../../Service/StudentService/GetStudentDetailsByEmail'

export default function Profile() {
  useEffect(() => {
    // GetStudenDetailsByEmail()
  }, [])
  return (
    <View style={styles.center}>
      <Text>Welcome to Library management</Text>
      <Model />
      <TouchableOpacity style={[styles.questionPaper]} onPress={()=>alert("this features will come in version 2.O")}>
        <Text style={{ fontWeight: "bold" }}>Download Previous year question paper</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.questionPaper]} onPress={()=>alert("this features will come in version 3.O")}>
        <Text style={{ fontWeight: "bold" }}>Chatting</Text>
      </TouchableOpacity>
    </View>
  )
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
})
