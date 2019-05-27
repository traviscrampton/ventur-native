import React, { Component } from "react"
import _ from "lodash"
import { LinearGradient } from "expo"
import { connect } from "react-redux"
import {
  View,
  ScrollView,
  Text,
  TouchableWithoutFeedback,
  TouchableHighlight,
} from "react-native"
import { StackActions, NavigationActions } from "react-navigation"
import { offlineChapterCreate, generateReadableDate, createChapter, updateChapter } from "utils/chapter_form_helper"
import { persistChapterToAsyncStorage, useLocalStorage } from "utils/offline_helpers"
import { updateChapterForm, resetChapterForm } from "actions/chapter_form"
import { loadChapter } from "actions/chapter"
import { populateOfflineChapters } from "actions/user"
import { Ionicons } from "@expo/vector-icons"

const mapStateToProps = state => ({
  journals: state.chapterForm.journals,
  id: state.chapterForm.id,
  chapterForm: state.chapterForm,
  journalId: state.chapterForm.journalId,
  offline: state.chapterForm.offline,
  chapter: state.chapterForm,
  currentUser: state.common.currentUser,
  height: state.common.height,
  isOffline: state.common.isOffline
})

const mapDispatchToProps = dispatch => ({
  updateChapterForm: payload => dispatch(updateChapterForm(payload)),
  resetChapterForm: () => dispatch(resetChapterForm()),
  loadChapter: payload => dispatch(loadChapter(payload)),
  populateOfflineChapters: payload => dispatch(populateOfflineChapters(payload))
})

class ChapterFormJournals extends Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    Expo.ScreenOrientation.allow("ALL")
    this.props.resetChapterForm()
  }

  static CHAPTER_FORM_ROUTES = [
    "ChapterFormJournals",
    "ChapterFormTitle",
    "ChapterFormUpload",
    "ChapterFormDate",
    "ChapterFormDistance",
    "Chapter"
  ]

  isActiveOption(journal) {
    return journal.id == this.props.journalId
  }

  navigateBack = () => {
    this.props.navigation.goBack()
  }

  handleRedirect = () => {
    const routingInformation = this.getChapterRoutingInformation()
    const resetAction = StackActions.reset(routingInformation)
    this.props.navigation.dispatch(resetAction)
  }

  getChapterRoutingInformation() {
    let actions = []
    let obj
    let { routes } = this.props.navigation.dangerouslyGetParent().state

    routes.forEach(route => {
      if (!_.includes(ChapterFormJournals.CHAPTER_FORM_ROUTES, route.routeName)) {
        obj = { routeName: route.routeName }

        if (route.params) {
          obj["params"] = route.params
        }

        actions.push(NavigationActions.navigate(obj))
      }
    })

    actions.push(NavigationActions.navigate({ routeName: "Chapter", params: { initialChapterForm: true } }))

    return {
      index: actions.length - 1,
      actions: actions
    }
  }

  async persistUpdate() {
    let useLocal = await useLocalStorage(this.props.chapterForm.id, this.props.chapterForm.offline)
    if (useLocal /* if not connected to the internet store offline is true */) {
      let chapter = _.omit(this.props.chapterForm, "journals")
      this.chapterCallback(chapter)
    } else {
      let params = { journalId: this.props.journalId, offline: this.props.offline }
      updateChapter(this.props.id, params, this.chapterCallback)
    }
  }

  getSelectedJournal(journalId) {
    return this.props.journals.find(journal => {
      return journal.id == journalId
    })
  }

  chapterCallback = async data => {
    if (data.offline) {
      await persistChapterToAsyncStorage(data, this.props.populateOfflineChapters)
    }

    this.props.updateChapterForm({
      id: data.id,
      offline: data.offline,
      journalId: data.journal.id
    })

    this.props.loadChapter(data)
    this.handleRedirect()
  }

  persistCreate = async () => {
    if (this.props.isOffline /* if not connected to the internet store offline is true */) {
      const chapter = await offlineChapterCreate(this.props.chapterForm, this.props.populateOfflineChapters)
      let date = new Date()
      this.props.updateChapterForm({
        id: chapter.id,
        journalId: chapter.journalId,
        date: date,
        readableDate: generateReadableDate(date),
        journal: this.getSelectedJournal(chapter.journalId),
        user: this.props.currentUser
      })
      this.props.loadChapter(this.props.chapterForm)
      this.handleRedirect()
    } else {
      createChapter(this.props.chapterForm, this.chapterCallback)
    }
  }

  renderFormSubmission() {
    return (
      <TouchableHighlight onPress={this.persistCreate}>
        <View style={{ borderRadius: 30, marginRight: 20, marginLeft: 20, marginTop: 20, backgroundColor: "white" }}>
          <Text
            style={{
              color: "#3F88C5",
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
      <TouchableWithoutFeedback onPress={() => this.props.updateChapterForm({ journalId: journal.id, offline: true })}>
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
        <LinearGradient style={{ height: this.props.height }} colors={["#3F88C5", "#032D47"]}>
          {this.renderBackButtonHeader()}
          <ScrollView bounces="none" style={{ padding: 20, maxHeight: this.props.height * 0.65 }}>
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
