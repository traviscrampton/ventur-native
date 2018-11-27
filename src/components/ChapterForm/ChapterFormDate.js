import React, { Component } from "react"
import { LinearGradient } from "expo"
import { connect } from "react-redux"
import {
  StyleSheet,
  View,
  Text,
  TouchableWithoutFeedback,
  TouchableHighlight,
  TextInput,
  DatePickerIOS,
  ImageBackground,
  Dimensions
} from "react-native"
import _ from "lodash"
import { updateChapterForm } from "actions/chapter_form"
import { SimpleLineIcons, Ionicons } from "@expo/vector-icons"
import { populateOfflineChapters } from "actions/user"
import { updateChapter, generateReadableDate } from "utils/chapter_form_helper"
import { persistChapterToAsyncStorage } from "utils/offline_helpers"

const mapStateToProps = state => ({
  id: state.chapterForm.id,
  date: state.chapterForm.date,
  chapter: state.chapterForm
})

const mapDispatchToProps = dispatch => ({
  updateChapterForm: payload => dispatch(updateChapterForm(payload)),
  populateOfflineChapters: payload => dispatch(populateOfflineChapters(payload))
})

class ChapterFormDate extends Component {
  constructor(props) {
    super(props)
  }

  navigateBack = () => {
    this.props.navigation.goBack()
  }

  chapterCallback = async data => {
    if (data.offline) {
      await persistChapterToAsyncStorage(data, this.props.populateOfflineChapters)
    }

    this.props.updateChapterForm({ date: data.date, readableDate: generateReadableDate(new Date(data.date)) })
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

  handleDateChange = date => {
    this.props.updateChapterForm({ date: date })
  }

  persistUpdate = async () => {
    if (false /* if not connected to the internet store offline is true */) {
      let chapter = _.omit(this.props.chapter, "journals")
      this.chapterCallback(chapter)
    } else {
      let params = { date: this.props.date }
      updateChapter(this.props.id, params, this.chapterCallback)
    }
  }

  renderForm() {
    let { date } = this.props
    if (typeof this.props.date === "number") {
      date = new Date(this.props.date)
    }
    return (
      <View style={{ margin: 20 }}>
        <View style={{ marginBottom: 50 }}>
          <Text style={{ fontFamily: "playfair", fontSize: 36, color: "white" }}>When was this?</Text>
        </View>
        <View style={{ backgroundColor: "white", borderRadius: 4, marginBottom: 15 }}>
          <DatePickerIOS style={{ color: "white" }} mode={"date"} date={date} onDateChange={this.handleDateChange} />
        </View>
        <View>
          <TouchableHighlight onPress={this.persistUpdate}>
            <View style={{ borderRadius: 30, backgroundColor: "white" }}>
              <Text
                style={{
                  color: "#067BC2",
                  textAlign: "center",
                  fontSize: 18,
                  paddingTop: 15,
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
)(ChapterFormDate)
