import React, { Component } from "react"
import { StyleSheet, Button, View, Text, TextInput, Dimensions, TouchableWithoutFeedback } from "react-native"
import { updateUserForm, populateUserForm } from "actions/user_form"
import { connect } from "react-redux"
import { LinearGradient } from "expo"
import DropDownHolder from "utils/DropdownHolder"
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons"
import { API_ROOT, setToken } from "agent"
TextInput.defaultProps.selectionColor = "white"

const mapStateToProps = state => ({
  email: state.userForm.email,
  password: state.userForm.password
})

const mapDispatchToProps = dispatch => ({
  updateUserForm: payload => dispatch(updateUserForm(payload)),
  populateUserForm: payload => dispatch(populateUserForm(payload))
})

class UserEmailPasswordForm extends Component {
  constructor(props) {
    super(props)

    this.state = {
      hidePassword: true
    }
  }

  navigateBack = () => {
    this.props.navigation.goBack()
  }

  submitForm = async () => {
    const token = await setToken()
    const params = Object.assign({}, { email: this.props.email, password: this.props.password })
    fetch(`${API_ROOT}/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token
      },
      body: JSON.stringify(params)
    })
      .then(response => {
        return response.json()
      })
      .then(data => {
        if (data.errors) {
          throw Error(data.errors.join(", "))
        }
        console.log(data)
        this.props.populateUserForm({ id: data.id, email: data.email })
        this.props.navigation.navigate("UserNameForm")
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
          Email & Password
        </Text>
      </View>
    )
  }

  renderForm() {
    return (
      <View style={styles.container}>
        <Text style={{ color: "white" }}>EMAIL</Text>
        <TextInput
          autoFocus={true}
          style={styles.textInput}
          editable={true}
          autoCapitalize="none"
          maxLength={50}
          value={this.props.email}
          onChangeText={text => this.handleEntry("email", text)}
        />
        <Text style={{ color: "white" }}>PASSWORD</Text>
        <View style={{ position: "relative", height: 50 }}>
          <TextInput
            style={styles.textInput}
            editable={true}
            secureTextEntry={this.state.hidePassword}
            maxLength={50}
            value={this.props.password}
            onChangeText={text => this.handleEntry("password", text)}
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
            <Text style={{ color: "#FF8C34", fontSize: 16 }}>CONTINUE</Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
    )
  }

  render() {
    return (
      <LinearGradient
        style={{ height: Dimensions.get("window").height, width: Dimensions.get("window").width, padding: 25 }}
        colors={["#FF8C34", "#E46545"]}>
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
)(UserEmailPasswordForm)
