import React, { Component } from "react"
import { Text, TouchableWithoutFeedback, StyleSheet, View } from "react-native"

export const Header = props => {
  return (
    <View key="header" style={styles.container}>
      <View>
        <TouchableWithoutFeedback onPress={props.handleGoBack}>
          <View
            style={{
              height: "100%",
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center"
            }}>
            <Text style={{ fontFamily: "open-sans-regular", fontWeight: "bold", fontSize: 14, color: "#323941" }}>{props.goBackCta}</Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
      <View>
        <Text>{props.centerCta}</Text>
      </View>
      <View>
        <TouchableWithoutFeedback onPress={props.handleConfirm}>
          <View
            style={{
              height: "100%",
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center"
            }}>
            <Text style={{ fontFamily: "open-sans-regular", fontWeight: "bold", fontSize: 14, color: "#323941" }}>{props.confirmCta}</Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
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
