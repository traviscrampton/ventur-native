import React, { Component } from "react"
import { getCurrentUser } from "auth"
import { initialAppLoaded, setCurrentUser } from "actions/common"
import { Font } from "expo"
import { AsyncStorage, View } from "react-native"
import { RootNavigator } from "navigation"
import { connect } from "react-redux"

const mapStateToProps = state => ({
  currentUser: state.common.currentUser,
  appLoaded: state.common.initialAppLoaded
})

const mapDispatchToProps = dispatch => ({
  initialAppLoaded: () => dispatch(initialAppLoaded()),
  setCurrentUser: payload => dispatch(setCurrentUser(payload))
})

class Ventur extends Component {
  componentWillMount() {
    this.setUpFonts()
    this.setCurrentUser()
    this.setChaptersForAsyncStorage()
  }

  async setChaptersForAsyncStorage() {
    let chapters = await AsyncStorage.getItem("chapters")
    let journals = await AsyncStorage.getItem("journals")
    // await AsyncStorage.setItem("chapters", JSON.stringify([]))
    if (!chapters) {
      await AsyncStorage.setItem("chapters", JSON.stringify([]))
    } else if (!journals) {
      await AsyncStorage.setItem("journals", JSON.stringify([]))
    }
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
      "open-sans-regular": require("assets/fonts/Open_Sans/OpenSans-Regular.ttf"),
      playfair: require("assets/fonts/Playfair_Display/PlayfairDisplay-Bold.ttf"),
      overpass: require("assets/fonts/Overpass_Mono/OverpassMono-Regular.ttf"),
      "open-sans-bold": require("assets/fonts/Open_Sans/OpenSans-Bold.ttf"),
      "open-sans-semi": require("assets/fonts/Lato/Lato-Light.ttf")
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
