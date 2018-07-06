import React, { Component } from "react"
import { StyleSheet, Button, View, Text, List, Form, TextInput } from "react-native"
import { connect } from "react-redux"
import request from "superagent"
import { UPDATE_LOGIN_FORM } from "actions/action_types"
import { loginMutation } from "graphql/mutations/auth"
import { gql } from "agent"

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
  }
})

class Login extends Component {
  constructor(props) {
    super(props)
    this.submitForm = this.submitForm.bind(this)
  }

  submitForm() {
    const { email, password } = this.props
    gql(loginMutation, {email: email, password: password}).then(res => {
      // some callback to make it happen
    })
  }

  render() {
    return (
      <View style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: 200 }}>
        <Text>EMAIL</Text>
        <TextInput
          style={{
            height: 50,
            fontSize: 20,
            textAlign: "left",
            borderColor: "black",
            borderWidth: 1,
            width: 200,
            marginBottom: 30
          }}
          editable={true}
          autoCapitalize="none"
          maxLength={50}
          value={this.props.email}
          onChangeText={text => this.props.emailEntry(text)}
        />
        <Text>PASSWORD</Text>
        <TextInput
          style={{
            height: 50,
            fontSize: 20,
            textAlign: "left",
            borderColor: "black",
            borderWidth: 1,
            width: 200,
            marginBottom: 30
          }}
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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Login)
