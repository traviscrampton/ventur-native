import React, { Component } from "react"
import { doneUpdating, startUpdating } from "actions/editor"
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Image,
  Dimensions,
  DatePickerIOS,
  TouchableWithoutFeedback
} from "react-native"
import { populateOfflineChapters } from "actions/user"
import { updateChapterForm } from "actions/chapter_form"
import {
  persistChapterToAsyncStorage,
  removeChapterFromAsyncStorage,
  offlineChapterCreate
} from "utils/offline_helpers"
import _ from "lodash"
import { loadChapter } from "actions/chapter"
import { updateChapter, generateReadableDate, createChapter } from "utils/chapter_form_helper"
import DatePickerDropdown from "components/editor/DatePickerDropdown"
import { MaterialCommunityIcons, MaterialIcons, FontAwesome } from "@expo/vector-icons"
import { connect } from "react-redux"

const mapStateToProps = state => ({
  chapterForm: state.chapterForm,
  chapter: state.chapter.chapter
})

const mapDispatchToProps = dispatch => ({
  startUpdating: payload => dispatch(startUpdating()),
  doneUpdating: payload => dispatch(doneUpdating()),
  updateChapterForm: payload => dispatch(updateChapterForm(payload)),
  loadChapter: payload => dispatch(loadChapter(payload))
})

class ChapterMetaDataForm extends Component {
  constructor(props) {
    super(props)

    this.state = {
      datePickerOpen: false
    }
    this.createOrUpdate = _.debounce(this.createOrUpdate, 1000)
  }

  persistMetadata = async (text, field) => {
    this.props.startUpdating()
    this.props.updateChapterForm({ [field]: text })

    this.createOrUpdate()
  }

  uploadImage(img) {
    let imgPost = {
      uri: img.uri,
      name: img.filename,
      type: "multipart/form-data",
      needsUpload: true
    }
    this.props.updateChapterForm({ bannerImage: imgPost })

    this.createOrUpdate()
  }

  updateImage = () => {
    this.props.navigation.navigate("CameraRollContainer", {
      selectSingleItem: true,
      singleItemCallback: img => this.uploadImage(img)
    })
  }

  createOrUpdate() {
    if (this.props.chapter.id) {
      this.persistUpdate()
    } else {
      this.persistCreate()
    }
  }

  toggleDatePicker = () => {
    let { datePickerOpen } = this.state
    this.setState({ datePickerOpen: !datePickerOpen })
  }

  chapterCallback = async data => {
    if (data.offline) {
      await persistChapterToAsyncStorage(data, this.props.populateOfflineChapters)
    }

    this.props.loadChapter(data)
    this.props.doneUpdating()
  }

  chapterCreateCallback = async data => {
    this.props.updateChapterForm({ id: data.id })
    this.chapterCallback(data)
  }

  persistCreate = async () => {
    if (false /* if not connected to the internet store offline is true */) {
      const chapter = await offlineChapterCreate(this.props.chapterForm)

      this.props.updateChapterForm(this.props.chapterForm)
    } else {
      createChapter(this.props.chapterForm, this.chapterCreateCallback)
    }
  }

  persistUpdate = async () => {
    let chapter = _.omit(this.props.chapterForm, "journals")
    if (false /* if not connected to the internet store offline is true */) {
      this.chapterCallback(chapter)
    } else {
      updateChapter(this.props.chapterForm.id, chapter, this.chapterCallback)
    }
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
            keyboardType={"numeric"}
            selectionColor="white"
            value={distance.toString()}
            onChangeText={text => this.persistMetadata(text, "distance")}
            style={{ paddingRight: 5 }}
          />
          <Text style={styles.iconText}>{`MILES`}</Text>
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
    let fourthWindowWidth = Dimensions.get("window").width / 4
    const { bannerImageUrl } = this.props.chapter
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
            source={{ uri: bannerImageUrl }}
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
    backgroundColor: "#f8f8f8"
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
