import { MaterialIndicator } from "react-native-indicators"
import React, { Component } from "react"
import { View} from "react-native"

const LoadingScreen = () => {
  return (
    <View style={{ flex: 1, backgroundColor: "white", display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
      <MaterialIndicator size={40} color="#FF5423" />
    </View>
  )
}

export default LoadingScreen