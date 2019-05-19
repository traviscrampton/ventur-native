import React, { Component } from "react"
import { connect } from "react-redux"
import { View, TouchableWithoutFeedback, Alert } from "react-native"
import { setToken, API_ROOT } from "agent"
import DropDownHolder from "utils/DropdownHolder"
import { editChapterPublished, deleteChapter } from "actions/editor"
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons"
import ChapterUserForm from "components/chapters/ChapterUserForm"

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

  navigateBack = () => {
    this.props.navigation.goBack()
  }

  toggleUserMenuOpen = () => {
    let menuOpen = this.state.userMenuOpen
    this.setState({ userMenuOpen: !menuOpen })
  }

  getMenuStyling() {
    let styling = {}
    if (this.state.userMenuOpen) {
      styling = this.props.openMenuStyling
    }

    return styling
  }

  renderUserMenu() {
    if (!this.state.userMenuOpen) return

    return <ChapterUserForm menuPosition={this.props.menuPosition} options={this.props.options} toggleUserMenuOpen={this.toggleUserMenuOpen} />
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
