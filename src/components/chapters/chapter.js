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
import Editor from "components/editor/editor"
import { MaterialCommunityIcons, MaterialIcons, Ionicons } from "@expo/vector-icons"

const mapStateToProps = state => ({
  chapter: state.chapter.chapter,
  loaded: state.chapter.loaded,
  currentUser: state.common.currentUser
})

const mapDispatchToProps = dispatch => ({
  resetChapter: dispatch(resetChapter)
})

class Chapter extends Component {
  constructor(props) {
    super(props)
    this.navigateBack = this.navigateBack.bind(this)
  }

  navigateBack() {
    this.props.navigation.goBack()
  }

  renderJournalAndUser() {
    return (
      <View style={{display: "flex", flexDirection: "row", alignItems: "center"}}>
        <Image
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            marginRight: 5
          }}
          source={{ uri: this.props.chapter.journal.miniBannerImageUrl }}
        />
        <View>
          <Text style={{fontFamily: "open-sans-semi"}}>{this.props.chapter.journal.title}</Text>
          <Text>{this.props.chapter.user.fullName}</Text>
        </View>
      </View>
    )
  }

  renderBackIcon() {
    return (
      <View style={{display: "flex", flexDirection: "row"}}>
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
    if (this.props.currentUser.id === this.props.chapter.user.id) {
      return <Text>EDIT</Text>
    }
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
          paddingBottom: 20
        }}>
        {this.renderBackIcon()}
        {this.renderEditButton()}
      </View>
    )
  }

  renderTitleAndDescription() {
    const { title, description } = this.props.chapter
    return (
      <View style={{ padding: 20, paddingTop: 0, paddingBottom: 10 }}>
        <View>
          <Text
            style={{
              fontSize: 28,
              fontFamily: "playfair",
              color: "black"
            }}>
            {title}
          </Text>
        </View>
        <View>
          <Text style={{ fontSize: 18, color: "#c3c3c3", fontFamily: "open-sans-semi" }}>{description}</Text>
        </View>
      </View>
    )
  }

  renderStatistics() {
    const { dateCreated, distance } = this.props.chapter
    return (
      <View style={{ padding: 20, paddingTop: 0 }}>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            borderTopWidth: 1,
            borderTopColor: "#f8f8f8",
            paddingTop: 10
          }}>
          <MaterialCommunityIcons name="calendar" size={18} style={{ marginRight: 5 }} />
          <Text style={{ fontFamily: "overpass", fontSize: 14 }}>{`${dateCreated}`.toUpperCase()}</Text>
        </View>
        <View style={{ display: "flex", flexDirection: "row" }}>
          <MaterialIcons style={{ marginRight: 5 }} name="directions-bike" size={16} />
          <Text style={{ fontFamily: "overpass", fontSize: 14 }}>{`${distance} miles`.toUpperCase()}</Text>
        </View>
      </View>
    )
  }

  renderBannerImage() {
    const { bannerImageUrl } = this.props.chapter
    return <Image style={{ width: Dimensions.get("window").width, height: 200 }} source={{ uri: bannerImageUrl }} />
  }

  renderBodyContent() {
    let content = JSON.parse(this.props.chapter.content)
    return <Text>{this.props.chapter.content}</Text>
  }

  render() {
    return (
      <ScrollView bounces={"none"} style={{ backgroundColor: "white" }}>
        {this.renderChapterNavigation()}
        {this.renderTitleAndDescription()}
        {this.renderStatistics()}
        {this.renderBannerImage()}
        {this.renderBodyContent()}
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Chapter)
