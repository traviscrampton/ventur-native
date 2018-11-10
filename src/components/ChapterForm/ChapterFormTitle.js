import React, { Component } from "react"
import _ from "lodash"
import { LinearGradient } from "expo"
import { connect } from "react-redux"
import {
  StyleSheet,
  View,
  Text,
  TouchableWithoutFeedback,
  TouchableHighlight,
  TextInput,
  AsyncStorage,
  ImageBackground,
  Dimensions
} from "react-native"
import { createJournal } from "actions/journal_form"
import { updateChapterForm } from "actions/chapter_form"
import { createChapter, updateChapter } from "utils/chapter_form_helper"
import { persistChapterToAsyncStorage } from "utils/offline_helpers"
import { SimpleLineIcons, Ionicons } from "@expo/vector-icons"

const mapStateToProps = state => ({
  id: state.chapterForm.id,
  title: state.chapterForm.title,
  journalId: state.chapterForm.journalId,
  chapter: state.chapterForm
})

const mapDispatchToProps = dispatch => ({
  updateChapterForm: payload => dispatch(updateChapterForm(payload))
})

class ChapterFormTitle extends Component {
  constructor(props) {
    super(props)
  }

  navigateBack = () => {
    this.props.navigation.navigate("Journal")
  }

  handleTextChange(text) {
    this.props.updateChapterForm({ title: text })
  }

  chapterCallback = async data => {
    if (data.offline) {
      await persistChapterToAsyncStorage(data)
    }

    this.props.updateChapterForm({ id: data.id, title: data.title })
    this.props.navigation.navigate("ChapterFormDistance")
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

  persistCreate = async () => {
    if (false /* if not connected to the internet store offline is true */) {
      const chapter = await offlineChapterCreate(this.props.chapter)

      this.props.updateChapterForm({ id: chapter.id })
      this.props.navigation.navigate("ChapterFormDistance")
    } else {
      let params = { journalId: this.props.journalId, title: this.props.title }
      createChapter(params, this.chapterCallback)
    }
  }

  persistUpdate = async () => {
    if (false /* if not connected to the internet store offline is true */) {
      let chapter = _.omit(this.props.chapter, "journals")
      await persistChapterToAsyncStorage(chapter)
    } else {
      let params = { journalId: this.props.journalId, title: this.props.title }
      updateChapter(this.props.id, params, this.chapterCallback)
    }
  }

  persistAndNavigate = () => {
    if (this.props.id) {
      this.persistUpdate()
    } else {
      this.persistCreate()
    }
  }

  renderForm() {
    return (
      <View style={{ margin: 20 }}>
        <View style={{ marginBottom: 50 }}>
          <Text style={{ fontFamily: "playfair", fontSize: 36, color: "white" }}>What's the title of this Chapter</Text>
        </View>
        <View>
          <TextInput
            autoFocus
            multiline
            onChangeText={text => this.handleTextChange(text)}
            value={this.props.title}
            selectionColor="white"
            style={{
              fontSize: 28,
              borderBottomWidth: 1,
              paddingBottom: 5,
              marginBottom: 20,
              borderBottomColor: "white",
              color: "white"
            }}
          />
        </View>
        <View>
          <TouchableHighlight onPress={this.persistAndNavigate}>
            <View style={{ borderRadius: 30, backgroundColor: "white" }}>
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
        </View>
      </View>
    )
  }

  render() {
    return (
      <View>
        <LinearGradient style={{ height: Dimensions.get("window").height }} colors={["#067BC2", "#032D47"]}>
          {this.renderBackButtonHeader()}
          {this.renderForm()}
        </LinearGradient>
      </View>
    )
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ChapterFormTitle)
