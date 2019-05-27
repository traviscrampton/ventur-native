import React, { Component } from "react"
import { LinearGradient } from "expo"
import { StackActions, NavigationActions } from "react-navigation"
import { connect } from "react-redux"
import {
  StyleSheet,
  View,
  Text,
  TouchableHighlight,
  ActivityIndicator,
  ImageBackground,
  ScrollView
} from "react-native"
import { addJournalEverywhere, resetJournalForm } from "actions/journal_form"
import { setToken, API_ROOT } from "agent"
import { Ionicons } from "@expo/vector-icons"
import CameraRollPicker from "react-native-camera-roll-picker"

const mapStateToProps = state => ({
  id: state.journalForm.id,
  currentRoot: state.common.currentBottomTab,
  height: state.common.height,
  width: state.common.width
})

const mapDispatchToProps = dispatch => ({
  addJournalEverywhere: payload => dispatch(addJournalEverywhere(payload)),
  resetJournalForm: () => dispatch(resetJournalForm())
})

class JournalFormLocation extends Component {
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
    if (this.props.currentRoot === "Profile") {
      return "Profile"
    } else if (this.props.currentRoot === "Explore") {
      return "JournalFeed"
    }
  }

  redirectToJournal() {
    const journalId = this.props.id
    const resetAction = StackActions.reset({
      index: 1,
      actions: [
        NavigationActions.navigate({ routeName: this.getFirstRoute() }),
        NavigationActions.navigate({ routeName: "Journal", params: { journalId } })
      ]
    })
    this.props.navigation.dispatch(resetAction)
  }

  persistUpdate = async () => {
    if (this.state.loading) return

    this.setState({ loading: true })
    if (!this.state.selectedImage.uri) {
      this.redirectToJournal()
      this.props.resetJournalForm()
      this.setState({ loading: false })
      return
    }
    const formData = new FormData()
    let { selectedImage } = this.state
    let imgPost = {
      uri: selectedImage.uri,
      name: selectedImage.filename,
      type: "multipart/form-data"
    }
    formData.append("banner_image", imgPost)
    let params = { id: this.props.id, banner_image: imgPost }
    const token = await setToken()
    fetch(`${API_ROOT}/journals/${params.id}`, {
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
      .then(data => {
        this.setState({ loading: false })
        this.props.addJournalEverywhere(data)
        this.redirectToJournal()
        this.props.resetJournalForm()
      })
  }

  renderCameraPicker() {
    if (this.state.loading) {
      return (
        <ImageBackground
          style={{
            height: 350,
            width: this.props.width,
            backgroundColor: "white",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-around",
            alignItems: "center"
          }}
          source={{ uri: this.state.selectedImage.uri }}>
          <ActivityIndicator size="large" color="#E46545" />
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
          <Text style={{ fontFamily: "playfair", fontSize: 36, color: "white" }}>Upload A Cover Photo</Text>
        </View>
        <ScrollView
          style={{
            marginLeft: -20,
            marginBottom: 20,
            height: 350,
            width: this.props.width
          }}>
          {this.renderCameraPicker()}
        </ScrollView>
        <View>
          <TouchableHighlight onPress={this.persistUpdate}>
            <View style={{ borderRadius: 30, backgroundColor: "white" }}>
              <Text
                style={{
                  color: "#FF5423",
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
        <LinearGradient style={{ height: this.props.height }} colors={["#FF5423", "#E46545"]}>
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
)(JournalFormLocation)
