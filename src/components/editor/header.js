import React, { Component } from "react"
import { updateActiveImageCaption, updateImageCaption, updateActiveIndex } from "actions/editor"
import { Text, TouchableWithoutFeedback, TextInput, StyleSheet, View, Image } from "react-native"

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
    display: "flex",
    height: 60,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 10,
    paddingLeft: 10,
    paddingRight: 10
  }
})
