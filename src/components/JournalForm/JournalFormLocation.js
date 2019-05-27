import React, { Component } from "react"
import { LinearGradient } from "expo"
import { connect } from "react-redux"
import { StyleSheet, View, Text, TouchableHighlight, TextInput } from "react-native"
import { updateJournalForm } from "actions/journal_form"
import { Ionicons } from "@expo/vector-icons"
import { setToken, API_ROOT } from "agent"

const mapStateToProps = state => ({
  id: state.journalForm.id,
  description: state.journalForm.description,
  height: state.common.height
})

const mapDispatchToProps = dispatch => ({
  updateJournalForm: payload => dispatch(updateJournalForm(payload))
})

class JournalFormLocation extends Component {
  constructor(props) {
    super(props)

    this.state = {
      description: props.description,
      submittable: props.description.length > 0
    }
  }

  navigateBack = () => {
    this.props.navigation.goBack()
  }

  renderBackButtonHeader() {
    return (
      <View style={{ marginTop: 20, marginLeft: 20 }}>
        <TouchableHighlight underlayColor="rgba(111, 111, 111, 0.5)" onPress={this.navigateBack}>
          <Ionicons name="ios-arrow-back" size={40} color="white" />
        </TouchableHighlight>
      </View>
    )
  }
  handleTextChange(text) {
    this.setState({
      description: text,
      submittable: text.length > 0
    })
  }

  persistUpdate = async () => {
    if (!this.state.submittable) return
    const token = await setToken()
    let params = { id: this.props.id, description: this.state.description }
    fetch(`${API_ROOT}/journals/${params.id}`, {
      method: "PUT",
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
        this.props.updateJournalForm({ description: data.description })
        this.props.navigation.navigate("JournalFormStatus")
      })
  }

  renderForm() {
    return (
      <View style={{ margin: 20 }}>
        <View style={{ marginBottom: 50 }}>
          <Text style={{ fontFamily: "playfair", fontSize: 36, color: "white" }}>Where are you cycling</Text>
        </View>
        <View>
          <TextInput
            autoFocus
            multiline
            onChangeText={text => this.handleTextChange(text)}
            selectionColor="white"
            value={this.state.description}
            style={{
              fontSize: 28,
              borderBottomWidth: 1,
              paddingBottom: 5,
              marginBottom: 20,
              borderBottomColor: "white",
              color: "white"
            }}
          />
        </View>
        <View>
          <TouchableHighlight onPress={this.persistUpdate}>
            <View style={{ borderRadius: 30, backgroundColor: this.state.submittable ? "white" : "lightgray" }}>
              <Text
                style={{
                  color: "#FF5423",
                  textAlign: "center",
                  fontSize: 18,
                  paddingTop: 15,
                  paddingBottom: 15
                }}>
                CONTINUE
              </Text>
            </View>
          </TouchableHighlight>
        </View>
      </View>
    )
  }

  render() {
    return (
      <View>
        <LinearGradient style={{ height: this.props.height }} colors={["#FF5423", "#E46545"]}>
          {this.renderBackButtonHeader()}
          {this.renderForm()}
        </LinearGradient>
      </View>
    )
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(JournalFormLocation)
