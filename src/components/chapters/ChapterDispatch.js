import React, { Component } from "react"
import { resetChapter } from "actions/chapter"
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Image,
  ImageBackground,
  TouchableHighlight,
  Dimensions
} from "react-native"
import { gql } from "agent"
import { connect } from "react-redux"
import ChapterEditor from "components/chapters/ChapterEditor"
import ChapterShow from "components/chapters/ChapterShow"
import { MaterialCommunityIcons, MaterialIcons, Ionicons } from "@expo/vector-icons"

const mapStateToProps = state => ({
  journal: state.chapter.chapter.journal,
  user: state.chapter.chapter.user,
  currentUser: state.common.currentUser
})

const mapDispatchToProps = dispatch => ({
  resetChapter: dispatch(resetChapter)
})

class ChapterDispatch extends Component {
  constructor(props) {
    super(props)
    this.navigateBack = this.navigateBack.bind(this)
  }

  navigateBack() {
    this.props.navigation.goBack()
  }

  renderChapterNavigation() {
    return (
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingTop: 20,
          height: 80
        }}>
        {this.renderBackIcon()}
        {this.renderEditButton()}
      </View>
    )
  }

  renderJournalAndUser() {
    return (
      <View style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
        <Image
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            marginRight: 5
          }}
          source={{ uri: this.props.journal.miniBannerImageUrl }}
        />
        <View>
          <Text style={{ fontFamily: "open-sans-semi" }}>{this.props.journal.title}</Text>
          <Text>{this.props.user.fullName}</Text>
        </View>
      </View>
    )
  }

  renderBackIcon() {
    return (
      <View style={{ display: "flex", flexDirection: "row" }}>
        <TouchableHighlight
          underlayColor="rgba(111, 111, 111, 0.5)"
          style={{
            padding: 20,
            height: 50,
            width: 50,
            marginLeft: 2,
            borderRadius: "50%",
            position: "relative"
          }}
          onPress={this.navigateBack}>
          <Ionicons style={{ position: "absolute", top: 11, left: 18 }} name="ios-arrow-back" size={28} color="black" />
        </TouchableHighlight>
        {this.renderJournalAndUser()}
      </View>
    )
  }

  renderEditButton() {
    return <View style={{ paddingRight: 20 }}>{this.getUserCta()}</View>
  }

  getUserCta() {
    if (this.props.currentUser.id === this.props.user.id) {
      return <Text>Saving...</Text>
    }
  }

  dispatchChapter() {
    return <ChapterEditor navigation={this.props.navigation}/>
  }

  render() {
    return (
      <View style={{ backgroundColor: "white" }}>
        {this.renderChapterNavigation()}
        {this.dispatchChapter()}
      </View>
    )
  }
}

const styles = StyleSheet.create({})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ChapterDispatch)
