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
  Dimensions
} from "react-native"
import { StackActions, NavigationActions } from "react-navigation"
import { connect } from "react-redux"
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
  resetChapter: dispatch(resetChapter)
})

class ChapterDispatch extends Component {
  constructor(props) {
    super(props)

    this.state = {
      editMode: false,
      userMenuOpen: false
    }
  }

  navigateBack = () => {
    this.props.navigation.goBack()
  }

  fillerFunc() {
    console.log("hey")
  }

  getChapterUserFormProps() {
    return [
      { type: "touchable", title: "Edit Blog Content", callback: this.toggleEditMode },
      { type: "touchable", title: "Manage content", callback: this.fillerFunc },
      { type: "switch", title: "Offline Mode", callback: this.fillerFunc },
      { type: "touchable", title: "Edit Metadata", callback: this.fillerFunc },
      { type: "touchable", title: "Delete Chapter", callback: this.fillerFunc },
      { type: "switch", title: "Publish Chapter", callback: this.fillerFunc }
    ]
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
    if (this.props.user.id != this.props.currentUser.id) return

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
    this.setState({
      editMode: toggledEditMode
    })
  }

  dispatchChapter() {
    if (this.state.editMode) {
      return <ChapterEditor toggleEditMode={this.toggleEditMode} navigation={this.props.navigation} />
    } else {
      return <ChapterShow toggleEditMode={this.toggleEditMode} navigation={this.props.navigation} />
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
    height: 60
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
