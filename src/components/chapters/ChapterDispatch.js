import React, { Component } from "react"
import { resetChapter } from "actions/chapter"
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableHighlight,
  TouchableWithoutFeedback,
  ActivityIndicator,
  Dimensions,
  Alert
} from "react-native"
import { connect } from "react-redux"
import { editChapterOfflineMode, editChapterPublished, deleteChapter } from "actions/editor"
import { populateOfflineChapters } from "actions/user"
import { persistChapterToAsyncStorage, removeChapterFromAsyncStorage } from "utils/offline_helpers"
import ChapterEditor from "components/chapters/ChapterEditor"
import ChapterShow from "components/chapters/ChapterShow"
import ChapterUserForm from "components/chapters/ChapterUserForm"
import { updateChapterForm } from "actions/chapter_form"
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons"

const mapStateToProps = state => ({
  journal: state.chapter.chapter.journal,
  chapter: state.chapter.chapter,
  user: state.chapter.chapter.user,
  currentUser: state.common.currentUser,
  isUpdating: state.editor.isUpdating
})

const mapDispatchToProps = dispatch => ({
  resetChapter: dispatch(resetChapter),
  updateChapterForm: payload => dispatch(updateChapterForm(payload)),
  editChapterOfflineMode: (chapter, offline) => editChapterOfflineMode(chapter, offline, dispatch),
  deleteChapter: (chapter, callback) => deleteChapter(chapter, callback, dispatch),
  editChapterPublished: (chapter, published) => editChapterPublished(chapter, published, dispatch),
  populateOfflineChapters: payload => dispatch(populateOfflineChapters(payload))
})

class ChapterDispatch extends Component {
  constructor(props) {
    super(props)

    this.initialChapterForm = this.props.navigation.getParam("initialChapterForm", false)

    this.state = {
      editMode: this.initialChapterForm,
      userMenuOpen: false,
      initialChapterForm: this.initialChapterForm
    }
  }

  navigateBack = () => {
    this.props.navigation.goBack()
  }

  getToggleEditCta() {
    return this.state.editMode ? "Read Mode" : "Edit Mode"
  }

  editMetaData = () => {
    let { id, title, distance, description } = this.props.chapter

    let obj = {
      id: id,
      title: title,
      distance: distance,
      description: description,
      journalId: this.props.chapter.journal.id
    }

    this.props.updateChapterForm(obj)
  }

  openDeleteAlert = () => {
    Alert.alert(
      "Are you sure?",
      "Deleting this chapter will erase all images and content",
      [{ text: "Delete Chapter", onPress: this.handleDelete }, { text: "Cancel", style: "cancel" }],
      { cancelable: true }
    )
  }

  handleDelete = async () => {
    this.props.deleteChapter(this.props.chapter, this.navigateBack)
    if (this.props.chapter.offline) {
      await removeChapterFromAsyncStorage(this.props.chapter, this.props.populateOfflineChapters)
    }
  }

  getChapterUserFormProps() {
    return [
      { type: "touchable", title: this.getToggleEditCta(), callback: this.toggleEditMode },
      { type: "touchable", title: "Delete Chapter", callback: this.openDeleteAlert },
      { type: "switch", title: "Offline Mode", value: this.props.chapter.offline, callback: this.updateOfflineStatus },
      { type: "switch", title: "Published", value: this.props.chapter.published, callback: this.updatePublishedStatus }
    ]
  }

  updateOfflineStatus = async () => {
    let { chapter } = this.props
    const { offline } = chapter
    await this.props.editChapterOfflineMode(chapter, !offline)

    if (!this.props.chapter.offline) {
      chapter = Object.assign({}, chapter, { offline: !this.props.chapter.offline })
      await persistChapterToAsyncStorage(chapter, this.props.populateOfflineChapters)
    } else {
      await removeChapterFromAsyncStorage(chapter, this.props.populateOfflineChapters)
    }
  }

  updatePublishedStatus = async () => {
    this.props.editChapterPublished(this.props.chapter, !this.props.chapter.published)
  }

  getMenuStyling() {
    let styling = { borderWidth: 1, borderColor: "white" }
    if (this.state.userMenuOpen) {
      styling = { borderWidth: 1, borderColor: "#D7D7D7", borderRadius: 4, backgroundColor: "#f8f8f8" }
    }

    return styling
  }

  toggleUserMenuOpen = () => {
    let menuOpen = this.state.userMenuOpen
    this.setState({ userMenuOpen: !menuOpen })
  }

  renderChapterNavigation() {
    return (
      <View style={styles.chapterNavigationContainer}>
        {this.renderBackIcon()}
        {this.renderDropDownAndIndicator()}
      </View>
    )
  }

  renderUserMenu() {
    if (!this.state.userMenuOpen) return

    const options = this.getChapterUserFormProps()
    return <ChapterUserForm options={options} />
  }

  renderUserDropDown() {
    if (!this.state.initialChapterForm && this.props.user.id != this.props.currentUser.id) return

    return (
      <View style={{ position: "relative" }}>
        <TouchableWithoutFeedback onPress={this.toggleUserMenuOpen}>
          <View style={[{ paddingTop: 2, width: 40, height: 40 }, this.getMenuStyling()]}>
            <MaterialCommunityIcons style={{ textAlign: "center" }} name="dots-vertical" size={32} color="#D7D7D7" />
          </View>
        </TouchableWithoutFeedback>
      </View>
    )
  }

  renderDropDownAndIndicator() {
    return (
      <View style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
        {this.renderActivityIndicator()}
        {this.renderUserDropDown()}
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
          <Text style={styles.journalTitle}>{this.props.journal.title}</Text>
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

  toggleEditMode = () => {
    let toggledEditMode = !this.state.editMode
    let toggledUserMenu = !this.state.userMenuOpen
    this.editMetaData()
    this.setState({
      editMode: toggledEditMode,
      userMenuOpen: toggledUserMenu
    })
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
        {this.renderUserMenu()}
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
    paddingTop: 20,
    marginBottom: 10,
    paddingRight: 20,
    height: 55
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
