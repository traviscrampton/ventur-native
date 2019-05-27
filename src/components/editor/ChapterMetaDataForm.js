import React, { Component } from "react"
import { doneUpdating, startUpdating } from "actions/editor"
import { StyleSheet, View, ScrollView, Text, TextInput, Image, TouchableWithoutFeedback } from "react-native"
import { updateChapterForm, addChapterToJournals, resetChapterForm } from "actions/chapter_form"
import { StackActions, NavigationActions } from "react-navigation"
import _ from "lodash"
import { loadChapter } from "actions/chapter"
import { updateChapter, createChapter } from "actions/chapter_form"
import { Header } from "components/editor/header"
import DatePickerDropdown from "components/editor/DatePickerDropdown"
import { MaterialIndicator } from "react-native-indicators"
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons"
import { connect } from "react-redux"
import { generateReadableDate } from "utils/chapter_form_helper"

const mapStateToProps = state => ({
  chapterForm: state.chapterForm,
  chapter: state.chapter.chapter,
  width: state.common.width,
  height: state.common.height,
  isUpdating: state.editor.isUpdating,
  currentRoot: state.common.currentBottomTab
})

const mapDispatchToProps = dispatch => ({
  startUpdating: payload => dispatch(startUpdating()),
  doneUpdating: payload => dispatch(doneUpdating()),
  updateChapterForm: payload => dispatch(updateChapterForm(payload)),
  loadChapter: payload => dispatch(loadChapter(payload)),
  addChapterToJournals: payload => dispatch(addChapterToJournals(payload)),
  resetChapterForm: () => dispatch(resetChapterForm()),
  updateChapter: (params, callback) => dispatch(updateChapter(params, callback, dispatch)),
  createChapter: (params, callback) => dispatch(createChapter(params, callback, dispatch))
})

class ChapterMetaDataForm extends Component {
  constructor(props) {
    super(props)

    this.state = {
      datePickerOpen: false
    }
  }

  componentWillUnmount() {
    this.props.resetChapterForm()
  }

  persistMetadata = async (text, field) => {
    this.props.updateChapterForm({ [field]: text })
  }

  handleGoBack = () => {
    this.props.navigation.goBack()
  }

  uploadImage(img) {
    let imgPost = {
      uri: img.uri,
      name: img.filename,
      type: "multipart/form-data",
      needsUpload: true
    }

    this.props.updateChapterForm({ bannerImage: imgPost })
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

  chapterCallback = async () => {
    this.navigateToChapter()
  }

  persistUpdate = async () => {
    this.props.startUpdating()
    let { id } = this.props.chapterForm

    if (id) {
      this.props.updateChapter(this.props.chapterForm, this.chapterCallback)
    } else {
      this.props.createChapter(this.props.chapterForm, this.chapterCallback)
    }
  }

  focusDistanceTextInput = () => {
    this.distanceTextInput.focus()
  }

  getFirstRoute() {
    if (this.props.currentRoot === "Profile") {
      return "Profile"
    } else if (this.props.currentRoot === "Explore") {
      return "JournalFeed"
    }
  }

  navigateToChapter = () => {
    const { journalId, id } = this.props.chapterForm
    const resetAction = StackActions.reset({
      index: 2,
      actions: [
        NavigationActions.navigate({ routeName: this.getFirstRoute() }),
        NavigationActions.navigate({ routeName: "Journal", params: { journalId } }),
        NavigationActions.navigate({ routeName: "Chapter" })
      ]
    })
    this.props.navigation.dispatch(resetAction)
  }

  renderDatePicker() {
    if (!this.state.datePickerOpen) return

    return (
      <DatePickerDropdown
        date={this.props.chapterForm.date}
        toggleDatePicker={this.toggleDatePicker}
        persistMetadata={date => this.persistMetadata(date, "date")}
      />
    )
  }

  renderStatistics() {
    const { distance, readableDistanceType } = this.props.chapterForm
    let readableDate = generateReadableDate(this.props.chapterForm.date)

    return (
      <View style={styles.statsContainer}>
        <TouchableWithoutFeedback onPress={this.toggleDatePicker}>
          <View style={styles.iconsAndText}>
            <MaterialCommunityIcons name="calendar" size={18} style={styles.iconPositioning} />
            <Text style={styles.iconText}>{`${readableDate}`.toUpperCase()}</Text>
          </View>
        </TouchableWithoutFeedback>
        {this.renderDatePicker()}
        <TouchableWithoutFeedback onPress={() => this.focusDistanceTextInput()}>
          <View style={styles.iconsAndText}>
            <MaterialIcons
              style={styles.iconPositioning}
              name="directions-bike"
              style={styles.iconPositioning}
              size={18}
            />
            <TextInput
              selectionColor={"#FF5423"}
              ref={input => {
                this.distanceTextInput = input
              }}
              keyboardType={"numeric"}
              maxLength={6}
              value={distance.toString()}
              onChangeText={text => this.persistMetadata(text, "distance")}
              style={{ textAlign: "right", fontSize: 20, marginRight: 5, paddingBottom: 6 }}
            />
            <Text style={styles.iconText}>{`${readableDistanceType}`.toUpperCase()}</Text>
          </View>
        </TouchableWithoutFeedback>
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
            selectionColor={"#FF5423"}
            placeholder={"Chapter Title"}
            style={styles.title}
            value={title}
            onChangeText={text => this.persistMetadata(text, "title")}
          />
        </View>
      </View>
    )
  }

  renderHeader() {
    const headerProps = Object.assign(
      {},
      {
        goBackCta: "Cancel",
        handleGoBack: this.handleGoBack,
        centerCta: "",
        handleConfirm: this.persistUpdate,
        confirmCta: "Save"
      }
    )
    return <Header key="header" {...headerProps} />
  }

  renderLoadingSpinner(fourthWindowWidth) {
    if (this.props.isUpdating && this.props.chapterForm.bannerImage.needsUpload) {
      return (
        <View style={{ position: "absolute", zIndex: 200, width: this.props.width, top: fourthWindowWidth / 3 }}>
          <MaterialIndicator size={40} color="#FF5423" />
        </View>
      )
    }
  }

  renderChapterImage() {
    let fourthWindowWidth = this.props.width / 2.5
    let { uri } = this.props.chapterForm.bannerImage
    const spinner = this.renderLoadingSpinner(fourthWindowWidth)

    return (
      <View style={{ position: "relative", marginBottom: 20, height: fourthWindowWidth, width: this.props.width }}>
        <View
          style={{
            position: "absolute",
            borderColor: "#323941",
            borderRadius: "50%",
            borderWidth: 1,
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "white",
            width: 50,
            height: 50,
            bottom: 20,
            right: 20,
            zIndex: 10
          }}>
          <TouchableWithoutFeedback onPress={this.updateImage}>
            <MaterialIcons name="cloud-upload" color="#323941" size={30} />
          </TouchableWithoutFeedback>
        </View>
        {spinner}
        <TouchableWithoutFeedback onPress={this.updateImage}>
          <Image
            style={{
              width: this.props.width,
              height: fourthWindowWidth,
              backgroundColor: "#f8f8f8"
            }}
            source={{ uri: uri }}
          />
        </TouchableWithoutFeedback>
      </View>
    )
  }

  render() {
    return (
      <View style={styles.container}>
        {this.renderHeader()}
        <ScrollView>
          {this.renderChapterImage()}
          {this.renderTitleAndDescription()}
          {this.renderStatistics()}
        </ScrollView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    height: "100%",
    backgroundColor: "white"
  },
  statsContainer: {
    padding: 20,
    paddingTop: 0
  },
  iconPositioning: {
    marginRight: 5,
    paddingBottom: 2
  },
  title: {
    fontSize: 28,
    fontFamily: "playfair",
    color: "#323941",
    borderColor: "#d3d3d3",
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: "white",
    padding: 5
  },
  iconsAndText: {
    display: "flex",
    flexDirection: "row",
    padding: 5,
    borderWidth: 1,
    borderColor: "#d3d3d3",
    borderRadius: 5,
    backgroundColor: "white",
    marginBottom: 10,
    alignItems: "center",
    paddingBottom: 3
  },
  iconText: {
    fontFamily: "overpass",
    fontSize: 20
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
