import React, { Component } from "react"
import { connect } from "react-redux"
import { StyleSheet, View, Text, TextInput, TouchableWithoutFeedback } from "react-native"
import { updateUserForm, resetUserForm, submitForm } from "../../actions/user_form"
import { LinearGradient } from "expo-linear-gradient"
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons"
import InputScrollView from "react-native-input-scroll-view"
import FormModal from "../shared/FormModal"

const mapStateToProps = state => ({
  email: state.userForm.email,
  password: state.userForm.password,
  width: state.common.width,
  height: state.common.height,
  visible: state.userForm.visible
})

const mapDispatchToProps = dispatch => ({
  updateUserForm: payload => dispatch(updateUserForm(payload)),
  submitForm: () => dispatch(submitForm()),
  resetUserForm: payload => dispatch(resetUserForm(payload))
})

class UserForm extends Component {
  constructor(props) {
    super(props)

    this.state = {
      hidePassword: true
    }
  }

  navigateBack = () => {
    this.props.resetUserForm()
  }

  submitForm = async () => {
    this.props.submitForm()
  }

  handleEntry = (key, text) => {
    this.props.updateUserForm({ key, text })
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
        onPress={this.navigateBack}>
        <Ionicons name="ios-arrow-back" size={35} color="white" />
      </TouchableWithoutFeedback>
    )
  }

  renderFormTitle() {
    return (
      <View>
        <Text style={styles.venturFormTitle}>Welcome to Ventur</Text>
      </View>
    )
  }

  renderEmailField() {
    return (
      <React.Fragment>
        <Text style={styles.colorWhite}>EMAIL</Text>
        <TextInput
          style={styles.textInput}
          editable={true}
          autoCapitalize="none"
          maxLength={50}
          value={this.props.email}
          onChangeText={text => this.handleEntry("email", text)}
        />
      </React.Fragment>
    )
  }

  renderPasswordField() {
    return (
      <React.Fragment>
        <Text style={styles.colorWhite}>PASSWORD</Text>
        <View style={styles.passwordFormContainer}>
          <TextInput
            style={styles.textInput}
            editable={true}
            secureTextEntry={this.state.hidePassword}
            maxLength={50}
            value={this.props.password}
            onChangeText={text => this.handleEntry("password", text)}
          />
          <TouchableWithoutFeedback onPress={this.toggleHidePassword}>
            <View style={styles.iconContainer}>
              <MaterialCommunityIcons name={this.state.hidePassword ? "eye" : "eye-off"} size={30} color="white" />
            </View>
          </TouchableWithoutFeedback>
        </View>
      </React.Fragment>
    )
  }

  renderFirstNameField() {
    return (
      <React.Fragment>
        <Text style={styles.colorWhite}>FIRST NAME</Text>
        <TextInput
          style={styles.textInput}
          editable={true}
          autoCapitalize="none"
          maxLength={50}
          value={this.props.firstName}
          onChangeText={text => this.handleEntry("firstName", text)}
        />
      </React.Fragment>
    )
  }

  renderLastNameField() {
    return (
      <React.Fragment>
        <Text style={styles.colorWhite}>LAST NAME</Text>
        <TextInput
          style={styles.textInput}
          editable={true}
          autoCapitalize="none"
          maxLength={50}
          value={this.props.lastName}
          onChangeText={text => this.handleEntry("lastName", text)}
        />
      </React.Fragment>
    )
  }

  renderSubmitField() {
    return (
      <TouchableWithoutFeedback onPress={this.submitForm}>
        <View style={styles.submitField}>
          <Text style={{ color: "#FF5423", fontSize: 16 }}>CONTINUE</Text>
        </View>
      </TouchableWithoutFeedback>
    )
  }

  renderForm() {
    return (
      <View style={styles.container}>
        {this.renderEmailField()}
        {this.renderPasswordField()}
        {this.renderFirstNameField()}
        {this.renderLastNameField()}
        {this.renderSubmitField()}
      </View>
    )
  }

  render() {
    return (
      <FormModal visible={this.props.visible} backgroundColor={"#FF5423"}>
        <LinearGradient
          style={{ height: this.props.height, width: this.props.width, padding: 25 }}
          colors={["#FF5423", "#E46545"]}>
          <InputScrollView>
            {this.renderBackButton()}
            {this.renderFormTitle()}
            {this.renderForm()}
          </InputScrollView>
        </LinearGradient>
      </FormModal>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 200
  },
  colorWhite: {
    color: "white"
  },
  venturFormTitle: {
    fontSize: 35,
    marginTop: 5,
    marginBottom: 20,
    color: "white",
    fontWeight: "bold"
  },
  positionRelative: {
    position: "relative"
  },
  textInput: {
    height: 50,
    fontSize: 20,
    color: "white",
    textAlign: "left",
    borderBottomColor: "white",
    borderBottomWidth: 1,
    marginBottom: 30
  },
  iconContainer: {
    position: "absolute",
    right: 0,
    top: 12.5
  },
  passwordFormContainer: {
    position: "relative",
    height: 50,
    marginBottom: 30
  },
  submitField: {
    backgroundColor: "white",
    borderRadius: 30,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 50,
    marginTop: 20
  }
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UserForm)
