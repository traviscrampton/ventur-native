import React, { Component } from "react"
import { StyleSheet, TouchableWithoutFeedback, View, Text, ImageBackground, Dimensions } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { toggleLoginModal } from "../../actions/login"
import { toggleUserFormModal } from "../../actions/user_form"
import { connect } from "react-redux"
import Login from "./Login"
import UserForm from "./UserForm"
const GabeBolivia = require("../../assets/images/Gabe_in_Bolivia.jpg")

const mapStateToProps = state => ({
  width: state.common.width,
  height: state.common.height
})

const mapDispatchToProps = dispatch => ({
  toggleLoginModal: payload => dispatch(toggleLoginModal(payload)),
  toggleUserFormModal: payload => dispatch(toggleUserFormModal(payload))
})

class HomeLoggedOut extends Component {
  constructor(props) {
    super(props)
  }

  toggleLoginModal = () => {
    this.props.toggleLoginModal(true)
  }

  navigateToSignUp = () => {
    this.props.toggleUserFormModal(true)
  }

  renderTitleAndSubTitle() {
    return (
      <View style={{ marginTop: this.props.height / 7 }}>
        <View>
          <Text style={{ fontSize: 60, color: "white", textAlign: "center" }}>Ventur</Text>
        </View>
        <View style={{ padding: 40, paddingTop: 10 }}>
          <Text style={{ fontSize: 22, color: "white", textAlign: "center" }}>Bike touring built for you</Text>
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
      <TouchableWithoutFeedback onPress={this.toggleLoginModal}>
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
            width: this.props.width - 40,
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
      <ImageBackground style={{ height: this.props.height, width: this.props.width }} source={GabeBolivia}>
        <View
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.4)",
            height: this.props.height,
            width: this.props.width,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between"
          }}>
          {this.renderTitleAndSubTitle()}
          {this.renderSignUpAndSignIn()}
        </View>
        <Login />
        <UserForm />
      </ImageBackground>
    )
  }
}

const styles = StyleSheet.create({})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HomeLoggedOut)
