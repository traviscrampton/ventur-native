import React, { Component } from "react"
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  ImageBackground,
  ActivityIndicator,
  Dimensions,
  TouchableWithoutFeedback
} from "react-native"
import { updateUserForm, populateUserForm, resetUserForm } from "actions/user_form"
import { setCurrentUser } from "actions/common"
import { connect } from "react-redux"
import { LinearGradient } from "expo"
import DropDownHolder from "utils/DropdownHolder"
import { Ionicons } from "@expo/vector-icons"
import CameraRollPicker from "react-native-camera-roll-picker"
import { storeJWT } from "auth"
import { API_ROOT, setToken } from "agent"
import { post } from "agent"

const mapStateToProps = state => ({
  id: state.userForm.id,
  email: state.userForm.email,
  password: state.userForm.password
})

const mapDispatchToProps = dispatch => ({
  updateUserForm: payload => dispatch(updateUserForm(payload)),
  populateUserForm: payload => dispatch(populateUserForm(payload)),
  setCurrentUser: payload => dispatch(setCurrentUser(payload)),
  resetUserForm: () => dispatch(resetUserForm())
})

class UserAvatarForm extends Component {
  constructor(props) {
    super(props)

    this.state = {
      bannerImage: props.bannerImage,
      selectedImage: {}
    }
  }

  getSelectedImage = images => {
    if (images.length === 0) return
    let image = images[0]
    this.setState({
      selectedImage: image
    })
  }

  navigateBack = () => {
    this.props.navigation.goBack()
  }

  loginAndReroute = async () => {
    const { email, password } = this.props

    post("/users/login", { email, password }).then(login => {
      storeJWT(login)
      this.props.setCurrentUser(login.user)
      this.props.resetUserForm()
    })
  }

  submitForm = async () => {
    if (!this.state.selectedImage.uri) {
      return this.loginAndReroute()
    }

    this.setState({ loading: true })
    const formData = new FormData()
    let { selectedImage } = this.state
    let imgPost = {
      uri: selectedImage.uri,
      name: selectedImage.filename,
      type: "multipart/form-data"
    }
    formData.append("avatar", imgPost)
    const token = await setToken()
    const params = Object.assign({}, { id: this.props.id })
    fetch(`${API_ROOT}/users/${params.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: token
      },
      body: formData
    })
      .then(response => {
        return response.json()
      })
      .then(data => {
        if (data.errors) {
          throw Error(data.errors.join(", "))
        }
        this.setState({ loading: false })
        this.loginAndReroute()
      })
      .catch(err => {
        DropDownHolder.alert("error", "Error", err)
      })
  }

  handleEntry = (key, text) => {
    this.props.updateUserForm({ key: key, text: text })
  }

  toggleHidePassword = () => {
    let { hidePassword } = this.state
    this.setState({ hidePassword: !hidePassword })
  }

  renderBackButton() {
    return (
      <TouchableWithoutFeedback
        underlayColor="rgba(111, 111, 111, 0.5)"
        style={{
          position: "relative"
        }}
        onPress={this.navigateBack}>
        <Ionicons name="ios-arrow-back" size={35} color="white" />
      </TouchableWithoutFeedback>
    )
  }

  renderFormTitle() {
    return (
      <View>
        <Text style={{ fontSize: 35, marginTop: 5, marginBottom: 20, color: "white", fontWeight: "bold" }}>
          Choose a profile photo
        </Text>
      </View>
    )
  }

  renderCameraPicker() {
    if (this.state.loading) {
      return (
        <ImageBackground
          style={{
            height: 350,
            width: Dimensions.get("window").width,
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

  render() {
    return (
      <LinearGradient
        style={{
          height: Dimensions.get("window").height,
          width: Dimensions.get("window").width,
          position: "relative",
          paddingTop: 25
        }}
        colors={["#FF8C34", "#E46545"]}>
        <View style={{ paddingLeft: 25 }}>
          {this.renderBackButton()}
          {this.renderFormTitle()}
        </View>
        <TouchableWithoutFeedback onPress={this.submitForm}>
          <View
            style={{
              backgroundColor: "#FF8C34",
              width: Dimensions.get("window").width - 50,
              borderRadius: 30,
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              height: 50,
              marginTop: 20,
              position: "absolute",
              bottom: 20,
              zIndex: 1,
              left: 25
            }}>
            <Text style={{ color: "white", fontSize: 16, fontWeight: "bold" }}>CONTINUE</Text>
          </View>
        </TouchableWithoutFeedback>
        {this.renderCameraPicker()}
      </LinearGradient>
    )
  }
}

const styles = StyleSheet.create({
  container: {},
  textInput: {
    height: 50,
    fontSize: 20,
    color: "white",
    textAlign: "left",
    borderBottomColor: "white",
    borderBottomWidth: 1,
    marginBottom: 30
  }
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UserAvatarForm)
