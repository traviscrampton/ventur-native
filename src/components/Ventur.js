import React, { Component } from "react"
import {
  initialAppLoaded,
  setCurrentUser,
  setWindowDimensions,
  updateConnectionType,
  addApiCredentials
} from "../actions/common"
import * as Font from "expo-font"
import { SafeAreaView } from "react-native"
import { AsyncStorage, Dimensions, NetInfo, StatusBar, Linking } from "react-native"
import { RootNavigator } from "../navigation"
import { connect } from "react-redux"
import { get, getCredentials } from "../agent"
import Expo from "expo"

const mapStateToProps = state => ({
  currentUser: state.common.currentUser,
  appLoaded: state.common.initialAppLoaded,
  isOffline: state.common.isOffline,
  awsAccessKey: state.common.awsAccessKey,
  awsSecretKey: state.common.awsSecretKey
})

const mapDispatchToProps = dispatch => ({
  initialAppLoaded: () => dispatch(initialAppLoaded()),
  setCurrentUser: payload => dispatch(setCurrentUser(payload)),
  setWindowDimensions: payload => dispatch(setWindowDimensions(payload)),
  updateConnectionType: payload => dispatch(updateConnectionType(payload)),
  addApiCredentials: payload => dispatch(addApiCredentials(payload))
})

class Ventur extends Component {
  async componentWillMount() {
    await this.setUpFonts()
    await this.getAWSCredentials()
    this.setupDimensionsListener()
    this.setCurrentUser()
    this.setUpConnectionListener()
  }

  setupDimensionsListener() {
    Dimensions.addEventListener("change", this.handleDimensionChange)
  }

  setUpConnectionListener() {
    NetInfo.addEventListener("connectionChange", this.handleConnectionChange)
  }

  async getAWSCredentials() {
    return
    getCredentials().then(response => {
      this.props.addApiCredentials(response)
    })
  }

  handleConnectionChange = connectionInfo => {
    let isOffline = connectionInfo.type === "none"

    this.props.updateConnectionType(isOffline)
  }

  handleDimensionChange = dim => {
    let heightAndWidth = { width: dim.window.width, height: dim.window.height }
    this.props.setWindowDimensions(heightAndWidth)
  }

  async setCurrentUser() {
    try {
      let user = await AsyncStorage.getItem("currentUser")
      user = JSON.parse(user)
      this.props.setCurrentUser(user)
      this.props.initialAppLoaded()
    } catch (err) {
      this.props.setCurrentUser(null)
    }
  }

  async setUpFonts() {
    await Font.loadAsync({
      "open-sans-regular": require("../assets/fonts/Lato/Lato-Regular.ttf"),
      playfair: require("../assets/fonts/Lato/Lato-Bold.ttf"),
      overpass: require("../assets/fonts/Overpass_Mono/OverpassMono-Light.ttf"),
      "open-sans-bold": require("../assets/fonts/Lato/Lato-Black.ttf"),
      "open-sans-semi": require("../assets/fonts/Lato/Lato-Light.ttf")
    })
  }

  render() {
    let isCurrentUser = this.props.currentUser !== null
    const VNTR = RootNavigator(isCurrentUser)

    if (!this.props.appLoaded) {
      return null
    }

    return <VNTR />
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Ventur)
