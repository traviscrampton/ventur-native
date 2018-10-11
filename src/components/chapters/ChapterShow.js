import React, { Component } from "react"
import { resetChapter } from "actions/chapter"
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Image,
  Dimensions,
  ImageBackground,
  TouchableHighlight
} from "react-native"
import { connect } from "react-redux"
import { updateChapterForm } from "actions/chapter_form"
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons"

const mapStateToProps = state => ({
  chapter: state.chapter.chapter,
  loaded: state.chapter.loaded,
  user: state.chapter.chapter.user,
  currentUser: state.common.currentUser
})

const mapDispatchToProps = dispatch => ({
  resetChapter: dispatch(resetChapter),
  updateChapterForm: payload => dispatch(updateChapterForm(payload))
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
        <View
          style={{
            display: "flex",
            justifyContent: "space-between",
            flexDirection: "row",
            alignItems: "center"
          }}>
          <Text style={styles.title}>{title}</Text>
          {this.renderEditCta()}
        </View>
        <View>
          <Text style={styles.description}>{description}</Text>
        </View>
      </View>
    )
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
    this.props.navigation.navigate("ChapterFormTitle")
  }

  renderEditCta() {
    if (this.props.currentUser.id === this.props.user.id) {
      return (
        <TouchableHighlight onPress={this.editMetaData}>
          <View>
            <Text>EDIT</Text>
          </View>
        </TouchableHighlight>
      )
    }
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
    const { bannerImageUrl } = this.props.chapter
    return <Image style={{ width: Dimensions.get("window").width, height: 200 }} source={{ uri: bannerImageUrl }} />
  }

  getInputStyling(entry) {
    switch (entry.styles) {
      case "H1":
        return {
          fontFamily: "playfair",
          fontSize: 22
        }
      case "QUOTE":
        return {
          fontStyle: "italic",
          borderLeftWidth: 5,
          paddingTop: 10,
          paddingBottom: 10
        }
      default:
        return {}
    }
  }

  renderImageCaption(entry) {
    if (entry.caption.length === 0) return

    return (
      <View
        style={{
          paddingLeft: 20,
          paddingRight: 20
        }}>
        <Text style={{ textAlign: "center" }}>{entry.caption}</Text>
      </View>
    )
  }

  getImageHeight(aspectRatio) {
    return aspectRatio * Dimensions.get("window").width
  }

  renderImageEntry(entry, index) {
    return (
      <View key={`image${index}`} style={{ position: "relative", marginBottom: 20 }}>
        <ImageBackground
          style={{ width: Dimensions.get("window").width, height: this.getImageHeight(entry.aspectRatio) }}
          source={{ uri: entry.uri }}
        />
        {this.renderImageCaption(entry)}
      </View>
    )
  }

  renderTextEntry(entry, index) {
    return (
      <View
        style={{
          padding: 20
        }}>
        <Text
          multiline
          key={index}
          style={[
            {
              fontSize: 20,
              fontFamily: "open-sans-regular"
            },
            this.getInputStyling(entry)
          ]}>
          {entry.content}
        </Text>
      </View>
    )
  }

  renderEntry(entry, index) {
    switch (entry.type) {
      case "text":
        return this.renderTextEntry(entry, index)
      case "image":
        return this.renderImageEntry(entry, index)
      default:
        console.log("WHAT IS IT", entry)
    }
  }

  renderBodyContent() {
    if (!this.props.chapter.content) return

    const entries = JSON.parse(this.props.chapter.content)
    return entries.map((entry, index) => {
      return this.renderEntry(entry, index)
    })
  }

  renderToggleEdit() {
    if (this.props.user.id !== this.props.currentUser.id) return

    return (
      <TouchableHighlight onPress={this.props.toggleEditMode}>
        <View
          style={{
            height: 50,
            backgroundColor: "#f8f8f8",
            width: Dimensions.get("window").width,
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center"
          }}>
          <Text style={{ fontSize: 18 }}>Edit Content</Text>
        </View>
      </TouchableHighlight>
    )
  }

  render() {
    return (
      <ScrollView style={styles.container}>
        {this.renderTitleAndDescription()}
        {this.renderStatistics()}
        {this.renderBannerImage()}
        {this.renderToggleEdit()}
        {this.renderBodyContent()}
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    marginBottom: 100,
    minHeight: Dimensions.get("window").height
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
