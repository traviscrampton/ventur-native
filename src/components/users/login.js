import React, { Component } from "react"
import { connect } from "react-redux"
import { StyleSheet, View, Text, TextInput, TouchableWithoutFeedback } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { updateLoginForm, submitForm, toggleLoginModal, resetLoginForm } from "../../actions/login"
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons"
import FormModal from "../shared/FormModal"
TextInput.defaultProps.selectionColor = "white"

const mapStateToProps = state => ({
  email: state.login.email,
  password: state.login.password,
  visible: state.login.visible,
  width: state.common.width,
  height: state.common.height
})

const mapDispatchToProps = dispatch => ({
  updateLoginForm: payload => dispatch(updateLoginForm(payload)),
  submitForm: () => dispatch(submitForm()),
  toggleLoginModal: payload => dispatch(toggleLoginModal(payload)),
  resetLoginForm: () => dispatch(resetLoginForm())
})

class Login extends Component {
  constructor(props) {
    super(props)

    this.state = {
      hidePassword: true
    }
  }

  toggleLoginModal = () => {
    this.props.resetLoginForm()
  }

  updateLoginForm = (value, key) => {
    const payload = Object.assign({}, { value, key })
    this.props.updateLoginForm(payload)
  }

  submitForm = () => {
    this.props.submitForm()
  }

  toggleHidePassword = () => {
    let { hidePassword } = this.state
    this.setState({ hidePassword: !hidePassword })
  }

  renderBackButton() {
    return (
      <TouchableWithoutFeedback
        underlayColor="rgba(111, 111, 111, 0.5)"
        style={styles.positionRelative}
        onPress={this.toggleLoginModal}>
        <Ionicons name="ios-arrow-back" size={35} color="white" />
      </TouchableWithoutFeedback>
    )
  }

  renderFormTitle() {
    return (
      <View>
        <Text style={styles.formTitle}>Login</Text>
      </View>
    )
  }

  renderForm() {
    return (
      <View style={styles.container}>
        <Text style={styles.colorWhite}>EMAIL</Text>
        <TextInput
          style={styles.textInput}
          editable={true}
          autoCapitalize="none"
          maxLength={50}
          value={this.props.email}
          onChangeText={text => this.updateLoginForm(text, "email")}
        />
        <Text style={styles.colorWhite}>PASSWORD</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.textInput}
            editable={true}
            secureTextEntry={this.state.hidePassword}
            maxLength={50}
            value={this.props.password}
            onChangeText={text => this.updateLoginForm(text, "password")}
          />
          <TouchableWithoutFeedback onPress={this.toggleHidePassword}>
            <View style={styles.iconContainer}>
              <MaterialCommunityIcons name={this.state.hidePassword ? "eye" : "eye-off"} size={30} color="white" />
            </View>
          </TouchableWithoutFeedback>
        </View>
        <TouchableWithoutFeedback onPress={this.submitForm}>
          <View style={styles.continueContainer}>
            <Text style={styles.continueText}>CONTINUE</Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
    )
  }

  render() {
    return (
      <FormModal visible={this.props.visible} backgroundColor={"#FF5423"}>
        <LinearGradient
          style={{ height: this.props.height, width: this.props.width, padding: 25 }}
          colors={["#FF5423", "#E46545"]}>
          {this.renderBackButton()}
          {this.renderFormTitle()}
          {this.renderForm()}
        </LinearGradient>
      </FormModal>
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
  },
  continueContainer: {
    backgroundColor: "white",
    borderRadius: 30,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 50,
    marginTop: 20
  },
  passwordContainer: {
    position: "relative",
    height: 50
  },
  positionRelative: {
    position: "relative"
  },
  continueText: {
    color: "#FF5423",
    fontSize: 16
  },
  iconContainer: {
    position: "absolute",
    right: 0,
    top: 12.5
  },
  colorWhite: {
    color: "white "
  },
  formTitle: {
    fontSize: 35,
    marginTop: 5,
    marginBottom: 20,
    color: "white",
    fontWeight: "bold"
  }
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Login)
