import React, { Component } from "react"
import { LinearGradient } from "expo"
import { connect } from "react-redux"
import { StyleSheet, View, Text, TouchableHighlight, TextInput } from "react-native"
import { setToken, API_ROOT } from "agent"
import { updateJournalForm } from "actions/journal_form"
import { Ionicons } from "@expo/vector-icons"

const mapStateToProps = state => ({
  id: state.journalForm.id,
  title: state.journalForm.title,
  height: state.common.height
})

const mapDispatchToProps = dispatch => ({
  updateJournalForm: payload => dispatch(updateJournalForm(payload))
})

class JournalFormTitle extends Component {
  constructor(props) {
    super(props)

    this.state = {
      title: this.props.title,
      submittable: this.props.title.length > 0
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
      title: text,
      submittable: text.length > 0
    })
  }

  persistCreate = async () => {
    let params = { title: this.state.title }
    const token = await setToken()
    fetch(`${API_ROOT}/journals`, {
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
        this.props.updateJournalForm({ id: data.id, title: data.title })
        this.props.navigation.navigate("JournalFormLocation")
      })
  }

  persistUpdate = async () => {
    let params = { id: this.props.id, title: this.state.title }
    const token = await setToken()
    fetch(`${API_ROOT}/journals/${this.props.id}`, {
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
        this.props.updateJournalForm({ title: data.title })
        this.props.navigation.navigate("JournalFormLocation")
      })
  }

  persistAndNavigate = () => {
    if (!this.state.submittable) return
    if (this.props.id) {
      this.persistUpdate()
    } else {
      this.persistCreate()
    }
  }

  renderForm() {
    return (
      <View style={{ margin: 20 }}>
        <View style={{ marginBottom: 50 }}>
          <Text style={{ fontFamily: "playfair", fontSize: 36, color: "white" }}>Whats the name of your trip?</Text>
        </View>
        <View>
          <TextInput
            autoFocus
            multiline
            onChangeText={text => this.handleTextChange(text)}
            value={this.state.title}
            selectionColor="white"
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
          <TouchableHighlight onPress={this.persistAndNavigate}>
            <View style={{ borderRadius: 30, backgroundColor: this.state.submittable ? "white" : "lightgray" }}>
              <Text
                style={{
                  color: "#FF8C34",
                  textAlign: "center",
                  paddingTop: 15,
                  fontSize: 18,
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
    // chapters ["#067BC2", "#032D47"]
    return (
      <View>
        <LinearGradient style={{ height: this.props.height }} colors={["#FF8C34", "#E46545"]}>
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
)(JournalFormTitle)
