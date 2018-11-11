import React, { Component } from "react"
import _ from "lodash"
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
import { setToken, API_ROOT } from "agent"
import { offlineChapterCreate, createChapter, updateChapter } from "utils/chapter_form_helper"
import { persistChapterToAsyncStorage } from "utils/offline_helpers"
import { updateChapterForm } from "actions/chapter_form"
import { populateOfflineChapters } from "actions/user"
import { SimpleLineIcons, Ionicons } from "@expo/vector-icons"

const mapStateToProps = state => ({
  journals: state.chapterForm.journals,
  id: state.chapterForm.id,
  journalId: state.chapterForm.journalId,
  offline: state.chapterForm.offline,
  chapter: state.chapterForm
})

const mapDispatchToProps = dispatch => ({
  updateChapterForm: payload => dispatch(updateChapterForm(payload)),
  populateOfflineChapters: payload => dispatch(populateOfflineChapters(payload))
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

  async persistUpdate() {
    if (false /* if not connected to the internet store offline is true */) {
      let chapter = _.omit(this.props.chapter, "journals")
      await persistChapterToAsyncStorage(chapter, this.props.populateOfflineChapters)
    } else {
      let params = { journalId: this.props.journalId, offline: this.props.offline }
      updateChapter(this.props.id, params, this.chapterCallback)
    }
  }

  chapterCallback = async data => {
    if (data.offline) {
      await persistChapterToAsyncStorage(data, this.props.populateOfflineChapters)
    }
    this.props.updateChapterForm({ id: data.id, offline: data.offline, journalId: data.journal.id })
    this.props.navigation.navigate("ChapterFormTitle")
  }

  async persistCreate() {
    if (false /* if not connected to the internet store offline is true */) {
      const chapter = await offlineChapterCreate(this.props.chapter)

      this.props.updateChapterForm({ id: chapter.id })
      this.props.navigation.navigate("ChapterFormTitle")
    } else {
      let params = { journalId: this.props.journalId, offline: this.props.offline }
      createChapter(params, this.chapterCallback)
    }
  }

  persistAndNavigate = async () => {
    if (this.props.id) {
      this.persistUpdate()
    } else {
      this.persistCreate()
    }
  }

  renderFormSubmission() {
    return (
      <TouchableHighlight onPress={this.persistAndNavigate}>
        <View style={{ borderRadius: 30, marginRight: 20, marginLeft: 20, marginTop: 20, backgroundColor: "white" }}>
          <Text
            style={{
              color: "#067BC2",
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
