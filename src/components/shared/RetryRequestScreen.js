import React, { Component } from "react"
import { View, TouchableWithoutFeedback, Text } from "react-native"
import { MaterialCommunityIcons } from "@expo/vector-icons"

const RetryRequesetScreen = props => {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "white",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center"
      }}>
      <TouchableWithoutFeedback onPress={props.reload}>
        <View style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <MaterialCommunityIcons name="reload" size={50} />
          <Text>Something went wrong, try again.</Text>
        </View>
      </TouchableWithoutFeedback>
    </View>
  )
}

export default RetryRequesetScreen
