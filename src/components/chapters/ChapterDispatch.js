import React, { Component } from "react"
import _ from "lodash"
import { resetChapter } from "actions/chapter"
import {
  StyleSheet,
  View,
  Text,
  TouchableHighlight,
  TouchableWithoutFeedback,
  ActivityIndicator,
  Alert
} from "react-native"
import { connect } from "react-redux"
import { loadChapter } from "actions/chapter"
import { populateEntries, getInitialImageIds, resetDeletedIds } from "actions/editor"
import ChapterEditor from "components/chapters/ChapterEditor"
import ChapterShow from "components/chapters/ChapterShow"
import { updateChapterForm } from "actions/chapter_form"
import { Ionicons, Feather } from "@expo/vector-icons"
import { get, put, destroy } from "agent"

const mapStateToProps = state => ({
  journal: state.chapter.chapter.journal,
  chapter: state.chapter.chapter,
  entries: state.editor.entries,
  initialImageIds: state.editor.initialImageIds,
  deletedIds: state.editor.deletedIds,
  user: state.chapter.chapter.user,
  currentUser: state.common.currentUser,
  width: state.common.width,
  isUpdating: state.editor.isUpdating
})

const mapDispatchToProps = dispatch => ({
  updateChapterForm: payload => dispatch(updateChapterForm(payload)),
  loadChapter: payload => dispatch(loadChapter(payload)),
  populateEntries: payload => dispatch(populateEntries(payload)),
  getInitialImageIds: payload => dispatch(getInitialImageIds(payload)),
  resetDeletedIds: () => dispatch(resetDeletedIds())
})

class ChapterDispatch extends Component {
  constructor(props) {
    super(props)

    this.initialChapterForm = this.props.navigation.getParam("initialChapterForm", false)

    this.state = {
      editMode: this.initialChapterForm,
      initialChapterForm: this.initialChapterForm
    }
  }

  // componentWillMount() {
  //   get(`/chapters/2`).then(data => {
  //     this.props.loadChapter(data.chapter)
  //   })
  // }

  populateEditorAndSwitch = data => {
    const entries = data.content ? JSON.parse(data.content) : []

    this.props.populateEntries(entries)
    this.props.getInitialImageIds(entries)
    this.editMetaData()
    this.setState({
      editMode: true
    })
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

  handleCancelButtonPress = () => {
    Alert.alert(
      "Are you sure?",
      "You will lose all your blog changes",
      [{ text: "Lose blog changes", onPress: this.loseChangesAndUpdate }, { text: "Cancel", style: "cancel" }],
      { cancelable: true }
    )
  }

  handleDoneButtonPress = () => {
    const { id } = this.props.chapter.editorBlob
    put(`/editor_blobs/${id}/update_draft_to_final`, { deletedIds: this.props.deletedIds }).then(data => {
      let updatedChapter = Object.assign({}, this.props.chapter, { editorBlob: data })
      this.props.loadChapter(updatedChapter)
      this.props.resetDeletedIds()
      this.props.populateEntries([])
      this.setState({ editMode: false })
    })
  }

  loseChangesAndUpdate = () => {
    const { id } = this.props.chapter.editorBlob
    const imagesToDelete = this.getImagesToDelete()

    destroy(`/editor_blobs/${id}`, { deletedIds: imagesToDelete }).then(data => {
      this.props.populateEntries([])
      this.props.resetDeletedIds()
      this.setState({ editMode: false })
    })
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
    this.props.navigation.goBack()
  }

  getDraftContentAndEdit = () => {
    const { id } = this.props.chapter.editorBlob
    put(`/editor_blobs/${id}/update_final_to_draft`).then(data => {
      this.populateEditorAndSwitch(data)
    })
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
                padding: 5,
                borderColor: "#505050",
                borderWidth: 1,
                borderRadius: 3,
                marginRight: 10
              }}>
              ><Text style={{ color: "#505050", letterSpacing: 1.8 }}>CANCEL</Text>
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
                padding: 5,
                borderColor: "#ff8c34",
                borderWidth: 1,
                borderRadius: 3
              }}>
              ><Text style={{ color: "white", letterSpacing: 1.8 }}>DONE</Text>
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
    return 
    if (!this.state.initialChapterForm && this.props.user.id != this.props.currentUser.id) return

    if (this.state.editMode) {
      return this.renderCancelAndDoneBtns()
    } else {
      return this.renderEditBtn()
    }
  }

  renderIndicatorAndEditPortal() {
    return (
      <View style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
        {this.renderActivityIndicator()}
        {this.renderEditPortal()}
      </View>
    )
  }

  renderActivityIndicator() {
    if (!this.props.isUpdating) return

    return <ActivityIndicator size="small" color="#FF8C34" />
  }

  renderJournalName() {
    return (
      <View style={styles.journalAndUserContainer}>
        <View>
          <Text numberOfLines={1} style={[styles.journalTitle, { maxWidth: this.props.width / 1.5 }]}>
            {/*this.props.journal.title*/}
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
          <Ionicons style={styles.backIcon} name="ios-arrow-back" size={28} color="black" />
        </TouchableHighlight>
        {this.renderJournalName()}
      </View>
    )
  }

  dispatchChapter() {
    if (this.state.editMode) {
      return <ChapterEditor navigation={this.props.navigation} />
    } else {
      return <ChapterShow navigation={this.props.navigation} />
    }
  }

  render() {
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
