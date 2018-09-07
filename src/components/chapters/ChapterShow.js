import React, { Component } from "react"
import { resetChapter } from "actions/chapter"
import { StyleSheet, View, Text, ScrollView, Image, Dimensions } from "react-native"
import { connect } from "react-redux"
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons"

const mapStateToProps = state => ({
  chapter: state.chapter.chapter,
  loaded: state.chapter.loaded,
  currentUser: state.common.currentUser
})

const mapDispatchToProps = dispatch => ({
  resetChapter: dispatch(resetChapter)
})

class ChapterShow extends Component {
  constructor(props) {
    super(props)
  }

  navigateBack() {
    this.props.navigation.goBack()
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
    return (
      <View style={{ minHeight: Dimensions.get("window").height / 2 }}>
        <Text>{this.props.chapter.content}</Text>
      </View>
    )
  }

  render() {
    return (
      <ScrollView bounces={"none"} style={{ backgroundColor: "white" }}>
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
)(ChapterShow)
