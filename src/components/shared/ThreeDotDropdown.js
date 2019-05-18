import React, { Component } from "react"
import { connect } from "react-redux"
import { View, TouchableWithoutFeedback, Alert } from "react-native"
import { setToken, API_ROOT } from "agent"
import DropDownHolder from "utils/DropdownHolder"
import { editChapterPublished, deleteChapter } from "actions/editor"
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons"
import ChapterUserForm from "components/chapters/ChapterUserForm"
import { persistChapterToAsyncStorage, removeChapterFromAsyncStorage } from "utils/offline_helpers"

const mapStateToProps = state => ({
  chapter: state.chapter.chapter
})

const mapDispatchToProps = dispatch => ({
  editChapterPublished: (chapter, published) => editChapterPublished(chapter, published, dispatch),
  deleteChapter: (chapter, callback) => deleteChapter(chapter, callback, dispatch)
})

class ThreeDotDropdown extends Component {
  constructor(props) {
    super(props)

    this.state = {
      userMenuOpen: false
    }
  }

  // openDeleteAlert = () => {
  //   Alert.alert(
  //     "Are you sure?",
  //     "Deleting this chapter will erase all images and content",
  //     [{ text: "Delete Chapter", onPress: this.handleDelete }, { text: "Cancel", style: "cancel" }],
  //     { cancelable: true }
  //   )
  // }

  navigateBack = () => {
    this.props.navigation.goBack()
  }

  // handleDelete = async () => {
  //   this.props.deleteChapter(this.props.chapter, this.navigateBack)
  //   if (this.props.chapter.offline) {
  //     await removeChapterFromAsyncStorage(this.props.chapter, this.props.populateOfflineChapters)
  //   }
  // }

  // sendEmails = async () => {
  //   if (this.props.chapter.emailSent) return
  //   const token = await setToken()
  //   fetch(`${API_ROOT}/journal_follows/${this.props.chapter.id}/send_chapter_emails`, {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //       Authorization: token
  //     }
  //   })
  //     .then(response => {
  //       return response.json()
  //     })
  //     .then(data => {
  //       if (data.errors) {
  //         throw Error(data.errors.join(", "))
  //       }

  //       this.props.loadChapter(data)
  //     })
  //     .catch(err => {
  //       DropDownHolder.alert("error", "Error", err)
  //     })
  // }

  toggleUserMenuOpen = () => {
    let menuOpen = this.state.userMenuOpen
    this.setState({ userMenuOpen: !menuOpen })
  }

  // getEmailToggle() {
  //   if (this.props.chapter.emailSent) {
  //     return "Email Sent"
  //   } else {
  //     return "Send Email"
  //   }
  // }

  // getChapterUserFormProps() {
  //   let optionsProps = [
  //     { type: "touchable", title: "Delete Chapter", callback: this.openDeleteAlert },
  //     { type: "switch", title: "Published", value: this.props.chapter.published, callback: this.updatePublishedStatus }
  //   ]

  //   if (this.props.chapter.published) {
  //     const emailOption = { type: "touchable", title: this.getEmailToggle(), callback: this.sendEmails }
  //     optionsProps.push(emailOption)
  //   }

  //   return optionsProps
  // }

  // updatePublishedStatus = async () => {
  //   this.props.editChapterPublished(this.props.chapter, !this.props.chapter.published)
  //   if (this.props.chapter.offline) {
  //     let chapter = Object.assign({}, this.props.chapter, { published: !this.props.chapter.published })
  //     await persistChapterToAsyncStorage(chapter, this.props.populateOfflineChapters)
  //   }
  // }

  getMenuStyling() {
    let styling = { borderWidth: 1, borderColor: "white" }
    if (this.state.userMenuOpen) {
      styling = { borderWidth: 1, borderColor: "#D7D7D7", borderRadius: 4, backgroundColor: "#f8f8f8" }
    }

    return styling
  }

  renderUserMenu() {
    if (!this.state.userMenuOpen) return

    return <ChapterUserForm options={this.props.options} />
  }

  renderUserDropDown() {
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

  render() {
    return (
      <React.Fragment>
        {this.renderUserMenu()}
        {this.renderUserDropDown()}
      </React.Fragment>
    )
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ThreeDotDropdown)
