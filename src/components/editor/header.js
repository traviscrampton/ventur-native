import React, { Component } from "react"
import { Text, TouchableWithoutFeedback, StyleSheet, View } from "react-native"

export const Header = props => {
  return (
    <View key="header" style={styles.container}>
      <TouchableWithoutFeedback onPress={props.handleGoBack}>
        <View>
          <Text>{props.goBackCta}</Text>
        </View>
      </TouchableWithoutFeedback>
      <View>
        <Text>{props.centerCta}</Text>
      </View>
      <TouchableWithoutFeedback onPress={props.handleConfirm}>
        <View>
          <Text>{props.confirmCta}</Text>
        </View>
      </TouchableWithoutFeedback>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    height: 45,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingRight: 20,
    paddingLeft: 20,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#f8f8f8"
  }
})
