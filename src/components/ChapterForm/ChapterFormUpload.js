import React, { Component } from "react"
import { LinearGradient } from "expo"
import { StackActions, NavigationActions } from "react-navigation"
import { connect } from "react-redux"
import {
  StyleSheet,
  View,
  Text,
  TouchableWithoutFeedback,
  TouchableHighlight,
  TextInput,
  ImageBackground,
  AsyncStorage,
  Dimensions,
  ActivityIndicator,
  ScrollView
} from "react-native"
import { updateChapterForm, resetChapterForm } from "actions/chapter_form"
import { setToken, API_ROOT } from "agent"
import { SimpleLineIcons, Ionicons } from "@expo/vector-icons"
import { loadChapter } from "actions/chapter"
import { populateOfflineChapters } from "actions/user"
import { persistChapterToAsyncStorage } from "utils/offline_helpers"
import CameraRollPicker from "react-native-camera-roll-picker"

const mapStateToProps = state => ({
  journals: state.chapterForm.journals,
  id: state.chapterForm.id,
  journalId: state.chapterForm.journalId,
  offline: state.chapterForm.offline,
  chapter: state.chapterForm
})

const mapDispatchToProps = dispatch => ({
  updateChapterForm: payload => dispatch(updateChapterForm(payload)),
  loadChapter: payload => dispatch(loadChapter(payload)),
  populateOfflineChapters: payload => dispatch(populateOfflineChapters(payload)),
  resetChapterForm: () => dispatch(resetChapterForm())
})

class ChapterFormUpload extends Component {
  constructor(props) {
    super(props)

    this.state = {
      bannerImage: props.bannerImage,
      selectedImage: {}
    }
  }

  navigateBack = () => {
    this.props.navigation.goBack()
  }

  getSelectedImage = images => {
    if (images.length === 0) return
    let image = images[0]
    this.setState({
      selectedImage: image
    })
  }

  renderBackButtonHeader() {
    return (
      <View style={{ marginTop: 20, marginLeft: 20 }}>
        <TouchableHighlight underlayColor="rgba(111, 111, 111, 0.5)" onPress={this.navigateBack}>
          <Ionicons name="ios-arrow-back" size={40} color="white" />
        </TouchableHighlight>
      </View>
    )
  }
  handleTextChange(text) {
    this.setState({
      description: text
    })
  }

  getFirstRoute() {
    // if (this.props.currentRoot === "Profile") {
    //   return "Profile"
    // } else if (this.props.currentRoot === "Explore") {
    //   return "JournalFeed"
    // }
  }

  redirectToJournal() {
    // const journalId = this.props.id
    // const resetAction = StackActions.reset({
    //   index: 1,
    //   actions: [
    //     NavigationActions.navigate({ routeName: this.getFirstRoute() }),
    //     NavigationActions.navigate({ routeName: "Journal", params: { journalId } })
    //   ]
    // })
    // this.props.navigation.dispatch(resetAction)
  }

  syncOfflineChapters = async chapter => {
    await persistChapterToAsyncStorage(chapter)
    let offlineChapters = await AsyncStorage.getItem("chapters")
    offlineChapters = JSON.parse(offlineChapters)
    this.props.populateOfflineChapters(offlineChapters)
  }

  persistUpdate = async () => {
    if (this.state.loading) return
    if (!this.state.selectedImage.uri) {
      // redirect without an image
    }

    this.setState({ loading: true })
    let { selectedImage } = this.state
    let imgPost = {
      uri: selectedImage.uri,
      name: selectedImage.filename,
      type: "multipart/form-data"
    }

    await this.props.updateChapterForm({ banner_image: imgPost })

    if (false /* if we're in offline mode */) {
      let chapter = _.omit(this.props.chapter, "journals")
      await persistChapterToAsyncStorage(chapter)
    } else {
      const formData = new FormData()
      formData.append("banner_image", imgPost)
      let params = { id: this.props.id, banner_image: imgPost }
      const token = await setToken()

      await fetch(`${API_ROOT}/chapters/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: token
        },
        body: formData
      })
        .then(response => {
          return response.json()
        })
        .then(chapter => {
          this.setState({ loading: false })
          this.props.loadChapter(chapter)
          this.props.navigation.navigate("Chapter") // figure out the navigation to handle both
          this.props.resetChapterForm()
          return chapter
        })
        .then(chapter => {
          if (chapter.offline) {
            persistChapterToAsyncStorage(chapter, this.props.populateOfflineChapters)
          }
        })
    }
  }

  renderCameraRollPicker() {
    if (this.state.loading) {
      return (
        <ImageBackground
          style={{
            height: 350,
            width: Dimensions.get("window").width,
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-around",
            alignItems: "center"
          }}
          source={{ uri: this.state.selectedImage.uri }}>
          <ActivityIndicator size="large" color="#067BC2" />
        </ImageBackground>
      )
    } else {
      return (
        <CameraRollPicker
          selectSingleItem
          key="cameraRollPicker"
          selected={[this.state.selectedImage]}
          callback={this.getSelectedImage}
        />
      )
    }
  }

  renderForm() {
    return (
      <View style={{ margin: 20 }}>
        <View style={{ marginBottom: 20 }}>
          <Text style={{ fontFamily: "playfair", fontSize: 36, color: "white" }}>Upload a photo</Text>
        </View>
        <ScrollView
          style={{
            marginLeft: -20,
            marginBottom: 20,
            height: 350,
            width: Dimensions.get("window").width
          }}>
          {this.renderCameraRollPicker()}
        </ScrollView>
        <View>
          <TouchableHighlight onPress={this.persistUpdate}>
            <View style={{ borderRadius: 30, backgroundColor: "white" }}>
              <Text
                style={{
                  color: "#067BC2",
                  textAlign: "center",
                  fontSize: 18,
                  paddingTop: 15,
                  paddingBottom: 15
                }}>
                CONTINUE
              </Text>
            </View>
          </TouchableHighlight>
        </View>
      </View>
    )
  }

  render() {
    return (
      <View>
        <LinearGradient style={{ height: Dimensions.get("window").height }} colors={["#067BC2", "#032D47"]}>
          {this.renderBackButtonHeader()}
          {this.renderForm()}
        </LinearGradient>
      </View>
    )
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ChapterFormUpload)
