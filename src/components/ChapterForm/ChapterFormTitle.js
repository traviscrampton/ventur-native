import React, { Component } from "react"
import { LinearGradient } from "expo"
import { connect } from "react-redux"
import {
  StyleSheet,
  View,
  Text,
  TouchableWithoutFeedback,
  TouchableHighlight,
  TextInput,
  ImageBackground,
  Dimensions
} from "react-native"
import { setToken } from "agent"
import { createJournal } from "actions/journal_form"
import { updateChapterForm } from "actions/chapter_form"
import { SimpleLineIcons, Ionicons } from "@expo/vector-icons"

const API_ROOT = "http://192.168.7.23:3000"

const mapStateToProps = state => ({
  id: state.chapterForm.id,
  title: state.chapterForm.title,
  journalId: state.chapterForm.journalId
})

const mapDispatchToProps = dispatch => ({
  updateChapterForm: payload => dispatch(updateChapterForm(payload))
})

class ChapterFormTitle extends Component {
  constructor(props) {
    super(props)

    this.state = {
      title: this.props.title
    }
  }

  navigateBack = () => {
    this.props.navigation.navigate("Journal")
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
      title: text
    })
  }

  persistCreate = async () => {
    const token = await setToken()
    let params = { journalId: this.props.journalId, title: this.state.title, distance: 0 }
    fetch(`${API_ROOT}/chapters`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": token
      },
      body: JSON.stringify(params)
    })
      .then(response => {
        return response.json()
      })
      .then(data => {
        this.props.updateChapterForm({id: data.id, title: data.title})
        this.props.navigation.navigate("ChapterFormDistance")
      })
  }

  persistUpdate = async () => {
    // let params = { id: this.props.id, title: this.state.title }
    // fetch(`${API_ROOT}/journals/${this.props.id}`, {
    //   method: "PUT",
    //   headers: {
    //     "Content-Type": "application/json"
    //   },
    //   body: JSON.stringify(params)
    // })
    //   .then(response => {
    //     return response.json()
    //   })
    //   .then(data => {
    //     this.props.updateJournalForm({ title: data.title })
    //     this.props.navigation.navigate("JournalFormLocation")
    //   })
  }

  persistAndNavigate = () => {
    // if (this.props.id) {
    //   this.persistUpdate()
    // } else {
      this.persistCreate()
    // }
  }

  renderForm() {
    return (
      <View style={{ margin: 20 }}>
        <View style={{ marginBottom: 50 }}>
          <Text style={{ fontFamily: "playfair", fontSize: 36, color: "white" }}>What's the title of this Chapter</Text>
        </View>
        <View>
          <TextInput
            autoFocus
            multiline
            onChangeText={text => this.handleTextChange(text)}
            value={this.state.text}
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
            <View style={{ borderRadius: 30, backgroundColor: "white" }}>
              <Text
                style={{
                  color: "#067BC2",
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
    return (
      <View>
        <LinearGradient style={{ height: Dimensions.get("window").height }} colors={["#067BC2", "#032D47"]}>
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
)(ChapterFormTitle)
