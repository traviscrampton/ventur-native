import React, { Component } from "react"
import { connect } from "react-redux"
import { TOGGLE_TAB_BAR } from "actions/action_types"
import { Text, TouchableWithoutFeedback, StyleSheet, View } from "react-native"
import { Header } from "components/editor/Header"
import { MaterialCommunityIcons } from "@expo/vector-icons"

const mapDispatchToProps = dispatch => ({
  toggleToolbar: payload =>
    dispatch({
      type: TOGGLE_TAB_BAR,
      payload: true
    })
})

const mapStateToProps = state => ({})

class ContentCreate extends Component {
  constructor(props) {
    super(props)
    this.openJournalForm = this.openJournalForm.bind(this)
    this.exitModal = this.exitModal.bind(this)
  }

  openJournalForm() {
    this.props.toggleToolbar(true)
    this.props.navigation.navigate("JournalForm")
  }

  exitModal() {
    this.props.navigation.dismiss()
  }

  renderHeader() {
    const headerProps = {
      goBackCta: "",
      handleGoBack: "",
      centerCta: `Create`,
      handleConfirm: "",
      confirmCta: ""
    }
    return <Header key="header" {...headerProps} />
  }

  renderExitButton() {
    return (
      <TouchableWithoutFeedback onPress={this.exitModal}>
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
              Start a new trip
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
        <View style={{ paddingLeft: 30, paddingRight: 30 }}>
          {this.renderHeader()}
          {this.renderCreateButtons()}
        </View>
      </View>
    )
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ContentCreate)
