import React, { Component } from "react"
import { LinearGradient } from "expo"
import { connect } from "react-redux"
import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  TouchableWithoutFeedback,
  TouchableHighlight,
  TextInput,
  ImageBackground,
  Dimensions
} from "react-native"
import { setToken } from "agent"
import { createJournal } from "actions/journal_form"
import { updateChapterForm } from "actions/chapter_form"
import { SimpleLineIcons, Ionicons } from "@expo/vector-icons"

const API_ROOT = "http://192.168.7.23:3000"

const mapStateToProps = state => ({
  journals: state.chapterForm.journals,
  journalId: state.chapterForm.journalId
})

const mapDispatchToProps = dispatch => ({
  updateChapterForm: payload => dispatch(updateChapterForm(payload))
})

class ChapterFormJournals extends Component {
  constructor(props) {
    super(props)
  }

  isActiveOption(journal) {
    return journal.id == this.props.journalId
  }

  navigateBack = () => {
    this.props.navigation.goBack()
  }

  persistAndNavigate = () => {
    // this.checkForOfflineMode()
    this.props.navigation.navigate("ChapterFormTitle")
  }

  renderFormSubmission() {
    return (
      <TouchableHighlight onPress={this.persistAndNavigate}>
        <View style={{ borderRadius: 30, marginRight: 20, marginLeft: 20, marginTop: 20, backgroundColor: "white" }}>
          <Text
            style={{
              color: "#032D47",
              textAlign: "center",
              paddingTop: 15,
              fontSize: 18,
              paddingBottom: 15
            }}>
            CONTINUE
          </Text>
        </View>
      </TouchableHighlight>
    )
  }

  renderBackButtonHeader() {
    return (
      <View style={{ marginTop: 20, marginLeft: 20 }}>
        <TouchableHighlight underlayColor="rgba(111, 111, 111, 0.5)" onPress={this.navigateBack}>
          <Ionicons name="ios-arrow-back" size={40} color="white" />
        </TouchableHighlight>
      </View>
    )
  }

  renderRadioButton(isActive) {
    if (isActive) {
      return (
        <View
          style={{
            height: 20,
            width: 20,
            backgroundColor: "white",
            borderColor: "#032D47",
            borderWidth: 1,
            marginRight: 20,
            borderRadius: 10,
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
          }}>
          <View style={{ height: 12, width: 12, backgroundColor: "#032D47", borderRadius: 6 }} />
        </View>
      )
    } else {
      return (
        <View
          style={{ height: 20, width: 20, marginRight: 10, borderRadius: 10, borderWidth: 1, borderColor: "white" }}
        />
      )
    }
  }

  renderJournalOption(journal, index) {
    const isActive = this.isActiveOption(journal)
    return (
      <TouchableWithoutFeedback onPress={() => this.props.updateChapterForm({ journalId: journal.id })}>
        <View
          style={[
            {
              backgroundColor: "transparent",
              borderColor: "white",
              borderWidth: 1,
              borderRadius: 6,
              height: 52,
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              paddingLeft: 10,
              paddingRight: 10,
              marginBottom: 10
            },
            isActive ? { backgroundColor: "white" } : {}
          ]}>
          {this.renderRadioButton(isActive)}
          <View>
            <Text style={[{ fontSize: 24 }, isActive ? { color: "#032D47" } : { color: "white" }]}>
              {journal.title}
            </Text>
          </View>
        </View>
      </TouchableWithoutFeedback>
    )
  }

  renderForm() {
    return this.props.journals.map((journal, index) => {
      return this.renderJournalOption(journal, index)
    })
  }

  render() {
    return (
      <View>
        <LinearGradient style={{ height: Dimensions.get("window").height }} colors={["#067BC2", "#032D47"]}>
          {this.renderBackButtonHeader()}
          <ScrollView bounces="none" style={{ padding: 20, maxHeight: Dimensions.get("window").height * 0.65 }}>
            {this.renderForm()}
          </ScrollView>
          {this.renderFormSubmission()}
        </LinearGradient>
      </View>
    )
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ChapterFormJournals)
