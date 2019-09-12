import React, { Component } from "react"
import { View, TouchableHighlight, Text, StyleSheet, Dimensions } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import ThreeDotDropdown from "../shared/ThreeDotDropdown"

const Dropdown = props => {
  if (!props.isCurrentUser) return

  return <ThreeDotDropdown options={props.options} />
}

export const JournalChildHeader = props => {
  let buttonsWidth = 160

  return (
    <View style={styles.container}>
      <View style={styles.backIconContainer}>
        <TouchableHighlight
          underlayColor="rgba(111, 111, 111, 0.5)"
          style={styles.backButton}
          onPress={props.navigateBack}>
          <Ionicons style={styles.backIcon} name="ios-arrow-back" size={28} color="#323941" />
        </TouchableHighlight>
        <View style={styles.journalAndUserContainer}>
          <View>
            <Text numberOfLines={1} style={[styles.journalTitle, { maxWidth: props.width - buttonsWidth }]}>
              {props.title}
            </Text>
          </View>
        </View>
      </View>
      {Dropdown(props.dropdownProps)}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingRight: 20,
    height: 50,
    borderBottomWidth: 1,
    borderBottomColor: "#f8f8f8"
  },
  backIconContainer: {
    display: "flex",
    flexDirection: "row"
  },
  backButton: {
    padding: 20,
    height: 50,
    width: 50,
    marginLeft: 2,
    borderRadius: 25,
    position: "relative"
  },
  backIcon: {
    position: "absolute",
    top: 11,
    left: 18
  },
  journalAndUserContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center"
  },
  journalTitle: {
    fontFamily: "open-sans-semi",
    fontSize: 16
  }
})
