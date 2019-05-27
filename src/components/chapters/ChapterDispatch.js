import React, { Component } from "react"
import _ from "lodash"
import { resetChapter } from "actions/chapter"
import { StyleSheet, View, Text, TouchableHighlight, TouchableWithoutFeedback, Alert } from "react-native"
import { MaterialIndicator } from "react-native-indicators"
import { connect } from "react-redux"
import { loadChapter, setEditMode } from "actions/chapter"
import { populateEntries, getInitialImageIds, loseChangesAndUpdate } from "actions/editor"
import ChapterEditor from "components/chapters/ChapterEditor"
import ChapterShow from "components/chapters/ChapterShow"
import { updateChapterForm, resetChapterForm } from "actions/chapter_form"
import { Ionicons, Feather, MaterialIcons } from "@expo/vector-icons"
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
  editMode: state.chapter.editMode,
})

const mapDispatchToProps = dispatch => ({
  updateChapterForm: payload => dispatch(updateChapterForm(payload)),
  loadChapter: payload => dispatch(loadChapter(payload)),
  populateEntries: payload => dispatch(populateEntries(payload)),
  getInitialImageIds: payload => dispatch(getInitialImageIds(payload)),
  setEditMode: payload => dispatch(setEditMode(payload)),
  loseChangesAndUpdate: payload => dispatch(loseChangesAndUpdate(payload)),
  resetChapter: () => dispatch(resetChapter()),
  resetChapterForm: () => dispatch(resetChapterForm())
})

class ChapterDispatch extends Component {
  constructor(props) {
    super(props)

    this.state = {
      initialChapterForm: this.initialChapterForm
    }
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
  }

  navigateBack = () => {
    this.props.resetChapter()
    this.props.navigation.goBack()
  }

  navigateToEditor = () => {
    const { content } = this.props.chapter.editorBlob
    this.populateEditorAndSwitch(content)
    this.props.navigation.navigate("ChapterEditor")
  }

  renderChapterNavigation() {
    return <View style={styles.chapterNavigationContainer}>{this.renderBackIcon()}</View>
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

  renderEditorFloatingButton() {
    if (this.props.currentUser.id != this.props.user.id) return 
      
    return (
      <TouchableWithoutFeedback onPress={this.navigateToEditor}>
        <View
          shadowColor="gray"
          shadowOffset={{ width: 1, height: 1 }}
          shadowOpacity={0.5}
          shadowRadius={2}
          style={{
            position: "absolute",
            backgroundColor: "#FF5423",
            width: 60,
            height: 60,
            borderRadius: 30,
            bottom: 30,
            right: 20,
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}>
          <MaterialIcons name="edit" size={32} color="white" />
        </View>
      </TouchableWithoutFeedback>
    )
  }

  render() {
    if (!this.props.chapter.id) {
      return <LoadingScreen />
    }

    return (
      <View style={styles.chapterDispatchContainer}>
        {this.renderChapterNavigation()}
        <ChapterShow navigation={this.props.navigation} />
        {this.renderEditorFloatingButton()}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  chapterDispatchContainer: {
    backgroundColor: "white",
    position: "relative",
    height: "100%"
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
