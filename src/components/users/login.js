import React, { Component } from "react"
import _ from "lodash"
import { StyleSheet, View, Text, TextInput, Dimensions, TouchableWithoutFeedback } from "react-native"
import { connect } from "react-redux"
import { LinearGradient } from "expo"
import { UPDATE_LOGIN_FORM, SET_CURRENT_USER } from "../../actions/action_types"
import { post } from "../../agent"
import { setCurrentUser } from "../../actions/common"
import DropDownHolder from "../../utils/DropdownHolder"
import { storeJWT } from "../../auth"
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons"
TextInput.defaultProps.selectionColor = "white"

const mapStateToProps = state => ({
  email: state.login.email,
  password: state.login.password
})

const mapDispatchToProps = dispatch => ({
  emailEntry: text => {
    dispatch({ type: UPDATE_LOGIN_FORM, key: "email", value: text })
  },

  passwordEntry: text => {
    dispatch({ type: UPDATE_LOGIN_FORM, key: "password", value: text })
  },

  setCurrentUser: payload => dispatch(setCurrentUser(payload))
})

class Login extends Component {
  constructor(props) {
    super(props)

    this.state = {
      hidePassword: true
    }
  }

  navigateBack = () => {
    this.props.navigation.goBack()
  }

  submitForm = () => {
    const { email, password } = this.props
    post("/users/login", { email, password }).then(login => {
      storeJWT(login)
      this.props.setCurrentUser(login.user)
    })
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
        <Text style={{ fontSize: 35, marginTop: 5, marginBottom: 20, color: "white", fontWeight: "bold" }}>Login</Text>
      </View>
    )
  }

  renderForm() {
    return (
      <View style={styles.container}>
        <Text style={{ color: "white" }}>EMAIL</Text>
        <TextInput
          style={styles.textInput}
          editable={true}
          autoCapitalize="none"
          maxLength={50}
          value={this.props.email}
          onChangeText={text => this.props.emailEntry(text)}
        />
        <Text style={{ color: "white" }}>PASSWORD</Text>
        <View style={{ position: "relative", height: 50 }}>
          <TextInput
            style={styles.textInput}
            editable={true}
            secureTextEntry={this.state.hidePassword}
            maxLength={50}
            value={this.props.password}
            onChangeText={text => this.props.passwordEntry(text)}
          />
          <TouchableWithoutFeedback onPress={this.toggleHidePassword}>
            <View style={{ position: "absolute", right: 0, top: 50 / 4 }}>
              <MaterialCommunityIcons name={this.state.hidePassword ? "eye" : "eye-off"} size={30} color="white" />
            </View>
          </TouchableWithoutFeedback>
        </View>
        <TouchableWithoutFeedback onPress={this.submitForm}>
          <View
            style={{
              backgroundColor: "white",
              borderRadius: 30,
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              height: 50,
              marginTop: 20
            }}>
            <Text style={{ color: "#FF5423", fontSize: 16 }}>CONTINUE</Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
    )
  }

  render() {
    return (
      <LinearGradient
        style={{ height: Dimensions.get("window").height, width: Dimensions.get("window").width, padding: 25 }}
        colors={["#FF5423", "#E46545"]}>
        {this.renderBackButton()}
        {this.renderFormTitle()}
        {this.renderForm()}
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
)(Login)
