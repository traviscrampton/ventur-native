import React, { Component } from "react"
import { StyleSheet, Button, View, Text, TextInput } from "react-native"
import { connect } from "react-redux"
import { UPDATE_LOGIN_FORM, SET_CURRENT_USER } from "actions/action_types"
import { loginMutation } from "graphql/mutations/auth"
import { gql } from "agent"
import { setCurrentUser } from "actions/common"
import { storeJWT } from "auth"

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
  }

  submitForm = () => {
    const { email, password } = this.props
    gql(loginMutation, { email: email, password: password }).then(res => {
      const { token, user } = res.Login
      let obj = Object.assign({}, { token: token, user: user })
      storeJWT(obj)
      this.props.setCurrentUser(user)
    })
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>EMAIL</Text>
        <TextInput
          style={styles.textInput}
          editable={true}
          autoCapitalize="none"
          maxLength={50}
          value={this.props.email}
          onChangeText={text => this.props.emailEntry(text)}
        />
        <Text>PASSWORD</Text>
        <TextInput
          style={styles.textInput}
          editable={true}
          secureTextEntry={true}
          maxLength={50}
          value={this.props.password}
          onChangeText={text => this.props.passwordEntry(text)}
        />
        <Button title="Log in" onPress={this.submitForm} />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginTop: 200
  },
  textInput: {
    height: 50,
    fontSize: 20,
    textAlign: "left",
    borderColor: "black",
    borderWidth: 1,
    width: 200,
    marginBottom: 30
  }
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Login)
