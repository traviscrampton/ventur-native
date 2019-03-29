import React, { Component } from "react"
import _ from "lodash"
import { resetChapter } from "actions/chapter"
import { StyleSheet, View, Text, TouchableHighlight, TouchableWithoutFeedback, Alert } from "react-native"
import { MaterialIndicator } from "react-native-indicators"
import { connect } from "react-redux"
import { loadChapter, setEditMode } from "actions/chapter"
import {
  populateEntries,
  getInitialImageIds,
  resetDeletedIds,
  doneEditingAndPersist,
  loseChangesAndUpdate
} from "actions/editor"
import ChapterEditor from "components/chapters/ChapterEditor"
import ChapterShow from "components/chapters/ChapterShow"
import { updateChapterForm, resetChapterForm } from "actions/chapter_form"
import { Ionicons, Feather } from "@expo/vector-icons"
import { get, put, destroy } from "agent"
import LoadingScreen from "components/shared/LoadingScreen"

const mapStateToProps = state => ({
  journal: state.chapter.chapter.journal,
  chapter: state.chapter.chapter,
  entries: state.editor.entries,
  initialImageIds: state.editor.initialImageIds,
  deletedIds: state.editor.deletedIds,
  user: state.chapter.chapter.user,
  currentUser: state.common.currentUser,
  width: state.common.width,
  isUpdating: state.editor.isUpdating,
  isLoading: state.common.isLoading,
  editMode: state.chapter.editMode,
  initialEntries: state.editor.initialEntries
})

const mapDispatchToProps = dispatch => ({
  updateChapterForm: payload => dispatch(updateChapterForm(payload)),
  loadChapter: payload => dispatch(loadChapter(payload)),
  populateEntries: payload => dispatch(populateEntries(payload)),
  getInitialImageIds: payload => dispatch(getInitialImageIds(payload)),
  resetDeletedIds: () => dispatch(resetDeletedIds()),
  doneEditingAndPersist: () => dispatch(doneEditingAndPersist()),
  setEditMode: payload => dispatch(setEditMode(payload)),
  loseChangesAndUpdate: payload => dispatch(loseChangesAndUpdate(payload)),
  resetChapter: () => dispatch(resetChapter()),
  resetChapterForm: () => dispatch(resetChapterForm())
})

class ChapterDispatch extends Component {
  constructor(props) {
    super(props)

    this.initialChapterForm = this.props.navigation.getParam("initialChapterForm", false)

    this.state = {
      initialChapterForm: this.initialChapterForm
    }
  }

  componentWillMount() {
    if (!this.state.initialChapterForm) return
    this.props.setEditMode(true)
  }

  populateEditorAndSwitch = content => {
    let entries = content
    if (entries === null) {
      entries = []
    }
    if (!Array.isArray(content)) {
      entries = Array.from(entries)
    }

    this.props.populateEntries(entries)
    this.props.getInitialImageIds(entries)
    this.editMetaData()
    this.props.setEditMode(true)
  }

  editMetaData = () => {
    let { id, title, distance, description, journal, imageUrl } = this.props.chapter

    let obj = {
      id: id,
      title: title,
      distance: distance,
      description: description,
      imageUrl: imageUrl,
      journalId: journal.id
    }

    this.props.updateChapterForm(obj)
  }

  editorIsSaved() {
    return JSON.stringify(this.props.entries) === JSON.stringify(this.props.initialEntries)
  }

  handleCancelButtonPress = () => {
    if (this.editorIsSaved()) {
      this.loseChangesAndUpdate()
    } else {
      Alert.alert(
        "Are you sure?",
        "You will lose all your blog changes",
        [{ text: "Lose blog changes", onPress: this.loseChangesAndUpdate }, { text: "Cancel", style: "cancel" }],
        { cancelable: true }
      )
    }
  }

  handleDoneButtonPress = () => {
    if (this.props.isUpdating) return
    this.props.doneEditingAndPersist()
    this.props.resetChapterForm()
  }

  loseChangesAndUpdate = () => {
    const { id } = this.props.chapter.editorBlob
    const deletedIds = this.getImagesToDelete()
    const payload = Object.assign({}, { id, deletedIds })
    this.props.loseChangesAndUpdate(payload)
    this.props.resetChapterForm()
  }

  getImagesToDelete() {
    const allImageIds = this.getAllImageIds()
    const { initialImageIds } = this.props

    const diff = _.xor(initialImageIds, allImageIds)
    return diff
  }

  getAllImageIds = () => {
    let entries = this.props.entries
      .filter(entry => entry.type === "image")
      .map(entry => {
        return entry.id
      })
    return entries
  }

  navigateBack = () => {
    this.props.resetChapter()
    this.props.navigation.goBack()
  }

  getDraftContentAndEdit = () => {
    const { content } = this.props.chapter.editorBlob
    this.populateEditorAndSwitch(content)
  }

  renderChapterNavigation() {
    return (
      <View style={styles.chapterNavigationContainer}>
        {this.renderBackIcon()}
        {this.renderIndicatorAndEditPortal()}
      </View>
    )
  }

  renderCancelAndDoneBtns() {
    const doneContent = this.props.isUpdating ? (
      <MaterialIndicator size={18} color="white" />
    ) : (
      <Text style={{ color: "white", letterSpacing: 1.8 }}>DONE</Text>
    )
    return (
      <View style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
        <View>
          <TouchableWithoutFeedback onPress={this.handleCancelButtonPress}>
            <View
              style={{
                backgroundColor: "#fafafa",
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                borderColor: "#505050",
                borderWidth: 1,
                borderRadius: 3,
                marginRight: 10,
                paddingLeft: 5,
                paddingRight: 5,
                height: 30
              }}>
              <Text style={{ color: "#505050", letterSpacing: 1.8 }}>CANCEL</Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
        <View>
          <TouchableWithoutFeedback onPress={this.handleDoneButtonPress}>
            <View
              style={{
                backgroundColor: "#ff8c34",
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                borderColor: "#ff8c34",
                borderWidth: 1,
                borderRadius: 3,
                minWidth: 70,
                height: 30
              }}>
              {doneContent}
            </View>
          </TouchableWithoutFeedback>
        </View>
      </View>
    )
  }

  renderEditBtn() {
    return (
      <View>
        <TouchableWithoutFeedback onPress={this.getDraftContentAndEdit}>
          <View
            style={{
              backgroundColor: "#fafafa",
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              padding: 5,
              borderColor: "#505050",
              borderWidth: 1,
              borderRadius: 3
            }}>
            <Feather name="edit-3" size={12} color="#505050" style={{ marginRight: 3 }} />
            <Text style={{ letterSpacing: 1.8, color: "#505050" }}>EDIT</Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
    )
  }

  renderEditPortal() {
    if (!this.state.initialChapterForm && this.props.user.id != this.props.currentUser.id) return

    if (this.props.editMode) {
      return this.renderCancelAndDoneBtns()
    } else {
      return this.renderEditBtn()
    }
  }

  renderIndicatorAndEditPortal() {
    return (
      <View style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>{this.renderEditPortal()}</View>
    )
  }

  renderJournalName() {
    let buttonsWidth = this.props.editMode ? 250 : 160

    return (
      <View style={styles.journalAndUserContainer}>
        <View>
          <Text numberOfLines={1} style={[styles.journalTitle, { maxWidth: this.props.width - buttonsWidth }]}>
            {this.props.journal.title}
          </Text>
        </View>
      </View>
    )
  }

  renderBackIcon() {
    return (
      <View style={styles.backIconContainer}>
        <TouchableHighlight
          underlayColor="rgba(111, 111, 111, 0.5)"
          style={styles.backButton}
          onPress={this.navigateBack}>
          <Ionicons style={styles.backIcon} name="ios-arrow-back" size={28} color="#323941" />
        </TouchableHighlight>
        {this.renderJournalName()}
      </View>
    )
  }

  dispatchChapter() {
    if (this.props.editMode) {
      return <ChapterEditor navigation={this.props.navigation} />
    } else {
      return <ChapterShow navigation={this.props.navigation} />
    }
  }

  render() {
    if (!this.props.chapter.id) {
      return <LoadingScreen />
    }

    return (
      <View style={styles.chapterDispatchContainer}>
        {this.renderChapterNavigation()}
        {this.dispatchChapter()}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  chapterDispatchContainer: {
    backgroundColor: "white"
  },
  chapterNavigationContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingRight: 20,
    height: 45,
    borderBottomWidth: 1,
    borderBottomColor: "#f8f8f8"
  },
  journalAndUserContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center"
  },
  journalImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 5
  },
  journalTitle: {
    fontFamily: "open-sans-semi",
    fontSize: 16
  },
  backIconContainer: {
    display: "flex",
    flexDirection: "row"
  },
  backButton: {
    padding: 20,
    height: 50,
    width: 50,
    marginLeft: 2,
    borderRadius: "50%",
    position: "relative"
  },
  backIcon: {
    position: "absolute",
    top: 11,
    left: 18
  },
  userCtaPosition: {
    paddingRight: 20
  }
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ChapterDispatch)
