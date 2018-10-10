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
import { updateChapterForm } from "actions/chapter_form"
import { SimpleLineIcons, Ionicons } from "@expo/vector-icons"
import { setToken } from "agent"
const API_ROOT = "http://192.168.7.23:3000"

const mapStateToProps = state => ({
  id: state.chapterForm.id,
  distance: state.chapterForm.distance
})

const mapDispatchToProps = dispatch => ({
  updateChapterForm: payload => dispatch(updateChapterForm(payload))
})

class ChapterFormDistance extends Component {
  constructor(props) {
    super(props)

    this.state = {
      distance: props.distance
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
      distance: text
    })
  }

  persistUpdate = async () => {
    const token = await setToken()
    let params = { id: this.props.id, distance: this.state.distance }
    fetch(`${API_ROOT}/chapters/${params.id}`, {
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
        this.props.updateChapterForm({ distance: data.distance })
        this.props.navigation.navigate("BannerImagePicker")
      })
  }

  renderForm() {
    return (
      <View style={{ margin: 20 }}>
        <View style={{ marginBottom: 50 }}>
          <Text style={{ fontFamily: "playfair", fontSize: 36, color: "white" }}>How far did you cycle?</Text>
        </View>
        <View>
          <TextInput
            autoFocus
            keyboardType={"numeric"}
            onChangeText={text => this.handleTextChange(text)}
            selectionColor="white"
            value={this.state.distance.toString()}
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
                  color: "#FF8C34",
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
)(ChapterFormDistance)
