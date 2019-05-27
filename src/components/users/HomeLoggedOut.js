import React, { Component } from "react"
import { StyleSheet, TouchableWithoutFeedback, View, Text, ImageBackground, Dimensions } from "react-native"
import { LinearGradient } from "expo"
import { connect } from "react-redux"
const GabeBolivia = require("assets/images/Gabe_in_Bolivia.jpg")

const mapStateToProps = state => ({})

const mapDispatchToProps = dispatch => ({})

class HomeLoggedOut extends Component {
  constructor(props) {
    super(props)
  }

  navigateToSignIn = () => {
    this.props.navigation.navigate("Login")
  }

  navigateToSignUp = () => {
    this.props.navigation.navigate("UserEmailPasswordForm")
  }

  renderTitleAndSubTitle() {
    return (
      <View style={{ marginTop: Dimensions.get("window").height / 7 }}>
        <View>
          <Text style={{ fontSize: 60, color: "white", textAlign: "center" }}>Ventur</Text>
        </View>
        <View style={{ padding: 40, paddingTop: 10 }}>
          <Text style={{ fontSize: 22, color: "white", textAlign: "center" }}>
            Bike touring built for you, online and offline
          </Text>
        </View>
      </View>
    )
  }

  renderAgreementText() {
    return (
      <View>
        <Text style={{ color: "white", textAlign: "center", fontSize: 8 }}>
          *By tapping get started, you agree to our privacy policy and service agreement.
        </Text>
      </View>
    )
  }

  renderSignIn() {
    return (
      <TouchableWithoutFeedback onPress={this.navigateToSignIn}>
        <View>
          <Text style={{ fontSize: 20, color: "white", fontWeight: "bold" }}>Sign in</Text>
        </View>
      </TouchableWithoutFeedback>
    )
  }

  renderSignUp() {
    return (
      <TouchableWithoutFeedback onPress={this.navigateToSignUp}>
        <LinearGradient
          style={{
            marginTop: 10,
            marginBottom: 20,
            width: Dimensions.get("window").width - 40,
            height: 50,
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 30
          }}
          colors={["#FF5423", "#E46545"]}>
          <Text style={{ textAlign: "center", color: "white", fontWeight: "bold", fontSize: 20 }}>Get Started</Text>
        </LinearGradient>
      </TouchableWithoutFeedback>
    )
  }

  renderSignUpAndSignIn() {
    return (
      <View style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 10 }}>
        {this.renderSignIn()}
        {this.renderSignUp()}
        {this.renderAgreementText()}
      </View>
    )
  }

  render() {
    return (
      <ImageBackground
        style={{ height: Dimensions.get("window").height, width: Dimensions.get("window").width }}
        source={GabeBolivia}>
        <View
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.4)",
            height: Dimensions.get("window").height,
            width: Dimensions.get("window").width,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between"
          }}>
          {this.renderTitleAndSubTitle()}
          {this.renderSignUpAndSignIn()}
        </View>
      </ImageBackground>
    )
  }
}

const styles = StyleSheet.create({})

export default connect(
  null,
  null
)(HomeLoggedOut)
