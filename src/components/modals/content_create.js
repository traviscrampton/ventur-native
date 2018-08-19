import React, { Component } from "react"
import { connect } from "react-redux"
import { Text, TouchableWithoutFeedback, TextInput, StyleSheet, View, Image, Dimensions } from "react-native"
import { MaterialCommunityIcons } from "@expo/vector-icons"

export default class ContentCreate extends Component {
  constructor(props) {
    super(props)
    this.openJournalForm = this.openJournalForm.bind(this)
  }

  openJournalForm() {
    this.props.exitModal()
    this.props.navigation.navigate("JournalForm")
  }

  renderExitButton() {
    return (
      <TouchableWithoutFeedback onPress={this.props.exitModal}>
        <View>
          <MaterialCommunityIcons name="window-close" size={40} color="black" />
        </View>
      </TouchableWithoutFeedback>
    )
  }

  renderCreateButtons() {
    return (
      <React.Fragment>
        <TouchableWithoutFeedback onPress={this.openJournalForm}>
          <View
            shadowColor="gray"
            shadowOffset={{ width: 0, height: 0 }}
            shadowOpacity={0.5}
            shadowRadius={2}
            style={{
              height: 100,
              marginTop: 50,
              backgroundColor: "white",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              opacity: 1
            }}>
            <Text
              style={{
                fontSize: 20,
                fontFamily: "playfair"
              }}>
              Create Journal
            </Text>
          </View>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback>
          <View
            shadowColor="gray"
            shadowOffset={{ width: 0, height: 0 }}
            shadowOpacity={0.5}
            shadowRadius={2}
            style={{
              height: 100,
              marginTop: 50,
              backgroundColor: "white",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              opacity: 1
            }}>
            <Text
              style={{
                fontSize: 20,
                fontFamily: "playfair"
              }}>
              Create Chapter
            </Text>
          </View>
        </TouchableWithoutFeedback>
      </React.Fragment>
    )
  }

  render() {
    return (
      <View
        style={{ height: "100%", position: "absolute", top: 0, width: "100%", opacity: 0.9, backgroundColor: "white" }}>
        <View style={{ padding: 30 }}>
          {this.renderExitButton()}
          {this.renderCreateButtons()}
        </View>
      </View>
    )
  }
}
