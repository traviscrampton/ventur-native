import React, { Component } from "react"
import { doneUpdating, startUpdating } from "actions/editor"
import { StyleSheet, View, Text, TextInput, Image, DatePickerIOS, TouchableWithoutFeedback } from "react-native"
import { populateOfflineChapters } from "actions/user"
import { updateChapterForm, addChapterToJournals, resetChapterForm } from "actions/chapter_form"
import {
  persistChapterToAsyncStorage,
  removeChapterFromAsyncStorage,
  offlineChapterCreate,
  useLocalStorage
} from "utils/offline_helpers"
import _ from "lodash"
import { loadChapter } from "actions/chapter"
import { updateChapter, generateReadableDate, createChapter } from "utils/chapter_form_helper"
import DatePickerDropdown from "components/editor/DatePickerDropdown"
import { MaterialCommunityIcons, MaterialIcons, FontAwesome } from "@expo/vector-icons"
import { connect } from "react-redux"

const mapStateToProps = state => ({
  chapterForm: state.chapterForm,
  chapter: state.chapter.chapter,
  width: state.common.width,
  height: state.common.height
})

const mapDispatchToProps = dispatch => ({
  startUpdating: payload => dispatch(startUpdating()),
  doneUpdating: payload => dispatch(doneUpdating()),
  updateChapterForm: payload => dispatch(updateChapterForm(payload)),
  loadChapter: payload => dispatch(loadChapter(payload)),
  populateOfflineChapters: payload => dispatch(populateOfflineChapters(payload)),
  addChapterToJournals: payload => dispatch(addChapterToJournals(payload)),
  resetChapterForm: () => dispatch(resetChapterForm())
})

class ChapterMetaDataForm extends Component {
  constructor(props) {
    super(props)

    this.state = {
      datePickerOpen: false
    }
    this.persistUpdate = _.debounce(this.persistUpdate, 1000)
  }

  componentWillUnmount() {
    this.props.resetChapterForm()
  }

  persistMetadata = async (text, field) => {
    this.props.startUpdating()
    this.props.updateChapterForm({ [field]: text })

    this.persistUpdate()
  }

  uploadImage(img) {
    this.props.startUpdating()

    let imgPost = {
      uri: img.uri,
      name: img.filename,
      type: "multipart/form-data",
      needsUpload: true
    }
    this.props.updateChapterForm({ bannerImage: imgPost })

    this.persistUpdate()
  }

  updateImage = () => {
    this.props.navigation.navigate("CameraRollContainer", {
      selectSingleItem: true,
      singleItemCallback: img => this.uploadImage(img)
    })
  }

  toggleDatePicker = () => {
    let { datePickerOpen } = this.state
    this.setState({ datePickerOpen: !datePickerOpen })
  }

  chapterCallback = async data => {
    this.props.addChapterToJournals(data)
    this.props.loadChapter(data)
    this.props.doneUpdating()
  }

  persistUpdate = async () => {
    let chapter = _.omit(this.props.chapterForm, "journals")
    updateChapter(this.props.chapterForm.id, chapter, this.chapterCallback)
  }

  renderDatePicker() {
    if (!this.state.datePickerOpen) return
    return (
      <DatePickerDropdown
        date={this.props.chapter.date}
        toggleDatePicker={this.toggleDatePicker}
        persistMetadata={date => this.persistMetadata(date, "date")}
      />
    )
  }

  renderStatistics() {
    const { distance } = this.props.chapterForm
    return (
      <View style={styles.statsContainer}>
        <TouchableWithoutFeedback onPress={this.toggleDatePicker}>
          <View style={styles.iconsAndText}>
            <MaterialCommunityIcons name="calendar" size={18} style={styles.iconPositioning} />
            <Text style={styles.iconText}>{`${this.props.chapter.readableDate}`.toUpperCase()}</Text>
          </View>
        </TouchableWithoutFeedback>
        {this.renderDatePicker()}
        <View style={styles.iconsAndText}>
          <MaterialIcons style={styles.iconPositioning} name="directions-bike" size={16} />
          <TextInput
            selectionColor={"#FF8C34"}
            keyboardType={"numeric"}
            maxLength={6}
            value={distance.toString()}
            onChangeText={text => this.persistMetadata(text, "distance")}
            style={{ textAlign: "right", marginRight: 5, paddingBottom: 2 }}
          />
          <Text style={styles.iconText}>KILOMETERS</Text>
        </View>
      </View>
    )
  }

  renderTitleAndDescription() {
    const { title } = this.props.chapterForm
    return (
      <View style={styles.titleAndDescriptionContainer}>
        <View>
          <TextInput
            multiline
            selectionColor={"#FF8C34"}
            placeholder={"Chapter Title"}
            style={styles.title}
            value={title}
            onChangeText={text => this.persistMetadata(text, "title")}
          />
        </View>
      </View>
    )
  }

  renderChapterImage() {
    let fourthWindowWidth = this.props.width / 4
    let { imageUrl } = this.props.chapter
    return (
      <View style={{ position: "relative", margin: 20, height: fourthWindowWidth, width: fourthWindowWidth }}>
        <TouchableWithoutFeedback onPress={this.updateImage}>
          <Image
            style={{
              width: fourthWindowWidth,
              height: fourthWindowWidth,
              backgroundColor: "#f8f8f8",
              borderColor: "#f8f8f8",
              borderWidth: 1,
              borderRadius: fourthWindowWidth / 2
            }}
            source={{ uri: imageUrl }}
          />
        </TouchableWithoutFeedback>
      </View>
    )
  }

  render() {
    return (
      <View style={styles.marginBottom20}>
        {this.renderChapterImage()}
        {this.renderTitleAndDescription()}
        {this.renderStatistics()}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  statsContainer: {
    padding: 20,
    paddingTop: 0
  },
  iconPositioning: {
    marginRight: 5
  },
  title: {
    fontSize: 28,
    fontFamily: "playfair",
    color: "black",
    backgroundColor: "#f8f8f8"
  },
  iconsAndText: {
    display: "flex",
    flexDirection: "row",
    paddingTop: 5,
    backgroundColor: "#f8f8f8",
    marginBottom: 10,
    alignItem: "middle"
  },
  iconText: {
    fontFamily: "overpass",
    fontSize: 14
  },
  titleAndDescriptionContainer: {
    padding: 20,
    paddingTop: 0,
    paddingBottom: 10
  }
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ChapterMetaDataForm)
