import { MaterialIndicator } from "react-native-indicators"
import React, { Component } from "react"
import { View, StyleSheet } from "react-native"

const LoadingScreen = () => {
  return (
    <View style={styles.container}>
      <MaterialIndicator size={40} color="#FF5423" />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center"
  }
})

export default LoadingScreen
