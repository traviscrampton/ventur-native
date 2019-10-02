import React, { Component } from "react"
import { connect } from "react-redux"
import { doneUpdating, startUpdating } from "../../actions/editor"
import {
  StyleSheet,
  View,
  SafeAreaView,
  ScrollView,
  Modal,
  Text,
  TextInput,
  Image,
  TouchableWithoutFeedback
} from "react-native"
import {
  updateChapterForm,
  addChapterToJournals,
  resetChapterForm,
  toggleChapterModal
} from "../../actions/chapter_form"
import { StackActions, NavigationActions } from "react-navigation"
import _ from "lodash"
import { loadChapter } from "../../actions/chapter"
import { updateChapter, createChapter } from "../../actions/chapter_form"
import { Header } from "./header"
import DatePickerDropdown from "./DatePickerDropdown"
import { MaterialIndicator } from "react-native-indicators"
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons"
import { generateReadableDate } from "../../utils/chapter_form_helper"
import FormModal from "../shared/FormModal"

const mapStateToProps = state => ({
  chapterForm: state.chapterForm,
  chapter: state.chapter.chapter,
  width: state.common.width,
  height: state.common.height,
  isUpdating: state.editor.isUpdating,
  currentRoot: state.common.currentBottomTab,
  visible: state.chapterForm.modalVisible
})

const mapDispatchToProps = dispatch => ({
  startUpdating: payload => dispatch(startUpdating()),
  doneUpdating: payload => dispatch(doneUpdating()),
  updateChapterForm: payload => dispatch(updateChapterForm(payload)),
  toggleChapterModal: payload => dispatch(toggleChapterModal(payload)),
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
    this.props.toggleChapterModal(false)
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

  getTitleText() {
    return this.props.chapterForm.id ? "Edit Chapter" : "New Chapter"
  }

  navigateToChapter = () => {
    if (this.props.navigateToChapter) {
      this.props.navigateToChapter(this.props.chapter.id)
    }

    this.props.toggleChapterModal(false)
  }

  renderDateField() {
    let readableDate = generateReadableDate(this.props.chapterForm.date)

    return (
      <View>
        <Text style={{ fontFamily: "playfair", color: "#323941", marginBottom: 5, fontSize: 16 }}>Date</Text>
        <TouchableWithoutFeedback onPress={this.toggleDatePicker}>
          <View
            shadowColor="gray"
            shadowOffset={{ width: 0, height: 0 }}
            shadowOpacity={0.5}
            shadowRadius={2}
            style={styles.iconsAndText}>
            <MaterialCommunityIcons name="calendar" size={18} style={styles.iconPositioning} />
            <Text style={styles.iconText}>{`${readableDate}`.toUpperCase()}</Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
    )
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

  renderDistanceField() {
    const { distance, readableDistanceType } = this.props.chapterForm

    return (
      <View style={{ marginTop: 15 }}>
        <Text style={{ fontFamily: "playfair", color: "#323941", marginBottom: 5, fontSize: 16 }}>Distance</Text>
        <TouchableWithoutFeedback onPress={() => this.focusDistanceTextInput()}>
          <View
            shadowColor="gray"
            shadowOffset={{ width: 0, height: 0 }}
            shadowOpacity={0.5}
            shadowRadius={2}
            style={styles.iconsAndText}>
            <MaterialIcons
              style={styles.iconPositioning}
              name="directions-bike"
              style={styles.iconPositioning}
              size={18}
            />
            <TextInput
              shadowColor="gray"
              shadowOffset={{ width: 0, height: 0 }}
              shadowOpacity={0.5}
              shadowRadius={2}
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

  renderStatistics() {
    return (
      <View style={styles.statsContainer}>
        {this.renderDateField()}
        {this.renderDatePicker()}
        {this.renderDistanceField()}
      </View>
    )
  }

  renderTitleAndDescription() {
    const { title } = this.props.chapterForm
    return (
      <View style={styles.titleAndDescriptionContainer}>
        <View>
          <Text style={{ fontFamily: "playfair", color: "#323941", marginBottom: 5, fontSize: 16 }}>Title</Text>
        </View>
        <TextInput
          multiline
          selectionColor={"#FF5423"}
          shadowColor="gray"
          shadowOffset={{ width: 0, height: 0 }}
          shadowOpacity={0.5}
          shadowRadius={2}
          selectionColor="#FF5423"
          style={styles.title}
          value={title}
          onChangeText={text => this.persistMetadata(text, "title")}
        />
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

  renderFormTitle() {
    return (
      <View style={{ padding: 20, marginBottom: 10 }}>
        <Text style={{ fontFamily: "playfair", color: "#323941", fontSize: 28 }}>{this.getTitleText()}</Text>
      </View>
    )
  }

  render() {
    return (
      <FormModal visible={this.props.visible}>
        {this.renderHeader()}
        <ScrollView>
          {this.renderFormTitle()}
          {this.renderTitleAndDescription()}
          {this.renderStatistics()}
        </ScrollView>
      </FormModal>
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
    backgroundColor: "white",
    fontSize: 18,
    borderWidth: 1,
    fontFamily: "open-sans-regular",
    padding: 10,
    borderRadius: 5,
    borderColor: "#d3d3d3"
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
    paddingBottom: 10,
    marginBottom: 15
  }
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ChapterMetaDataForm)
