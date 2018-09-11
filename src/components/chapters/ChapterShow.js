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
      <View style={styles.titleDescriptionContainer}>
        <View>
          <Text style={styles.title}>{title}</Text>
        </View>
        <View>
          <Text style={styles.description}>{description}</Text>
        </View>
      </View>
    )
  }

  renderStatistics() {
    const { dateCreated, distance } = this.props.chapter
    return (
      <View style={styles.statisticsPadding}>
        <View style={styles.statisticsContainer}>
          <MaterialCommunityIcons name="calendar" size={18} style={styles.iconPosition} />
          <Text style={styles.statisticsText}>{`${dateCreated}`.toUpperCase()}</Text>
        </View>
        <View style={styles.statisticsContainer}>
          <MaterialIcons style={styles.iconPosition} name="directions-bike" size={16} />
          <Text style={styles.statisticsText}>{`${distance} miles`.toUpperCase()}</Text>
        </View>
      </View>
    )
  }

  renderBannerImage() {
    // not ready yet
    const { bannerImageUrl } = this.props.chapter
    return <Image style={{ width: Dimensions.get("window").width, height: 200 }} source={{ uri: bannerImageUrl }} />
  }

  renderBodyContent() {
    // this isn't ready yet
    let content = JSON.parse(this.props.chapter.content)
    return (
      <View style={{ minHeight: Dimensions.get("window").height / 2 }}>
        <Text>{this.props.chapter.content}</Text>
      </View>
    )
  }

  render() {
    return (
      <ScrollView bounces={"none"} style={styles.container}>
        {this.renderTitleAndDescription()}
        {this.renderStatistics()}
        {this.renderBannerImage()}
        {this.renderBodyContent()}
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white"
  },
  titleDescriptionContainer: {
    padding: 20,
    paddingTop: 0,
    paddingBottom: 10
  },
  title: {
    fontSize: 28,
    fontFamily: "playfair",
    color: "black"
  },
  description: {
    fontSize: 18,
    color: "#c3c3c3",
    fontFamily: "open-sans-semi"
  },
  statisticsContainer: {
    display: "flex",
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "#f8f8f8",
    paddingTop: 10
  },
  iconPosition: {
    marginRight: 5
  },
  statisticsPadding: {
    padding: 20,
    paddingTop: 0
  },
  statisticsText: {
    fontFamily: "overpass",
    fontSize: 14
  }
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ChapterShow)
