import React, { Component } from "react"
import {
  StyleSheet,
  View,
  Text,
  Picker,
  ScrollView,
  TouchableWithoutFeedback,
  TextInput,
  Image,
  ImageBackground,
  Dimensions
} from "react-native"
import { gql } from "agent"
import { setToken } from "agent"
import { connect } from "react-redux"
import { SimpleLineIcons } from "@expo/vector-icons"
import { journalCreate } from "graphql/mutations/journal"
import { updateJournalForm, cancelJournalForm, populateJournal } from "actions/journal_form"
import { Header } from "components/editor/header"
import request from "superagent"
const defaultImage = require("assets/images/mountain-sketch.png")
const API_ROOT = "http://192.168.7.23:3000"
const bannerImageWidth = Dimensions.get("window").width
const bannerImageHeight = Math.round(bannerImageWidth * (150 / 300))

const mapStateToProps = state => ({
  bannerImage: state.journalForm.form.bannerImage,
  title: state.journalForm.form.title,
  description: state.journalForm.form.description,
  status: state.journalForm.form.status,
  stage: state.journalForm.form.stage
})

const mapDispatchToProps = dispatch => ({
  updateJournalForm: payload => dispatch(updateJournalForm(payload)),
  cancelJournalForm: () => dispatch(cancelJournalForm()),
  populateJournal: payload => dispatch(populateJournal(payload))
})

class JournalForm extends Component {
  constructor(props) {
    super(props)
    this.dismissForm = this.dismissForm.bind(this)
    this.openCameraRoll = this.openCameraRoll.bind(this)
    this.persistForm = this.persistForm.bind(this)
  }

  static STATUS_OPTIONS = [
    { text: "NOT STARTED", enum: "not_started" },
    { text: "ACTIVE", enum: "active" },
    { text: "PAUSED", enum: "paused" },
    { text: "FINISHED", enum: "completed" }
  ]

  updateForm(key, value) {
    const payload = { key: key, value: value }
    this.props.updateJournalForm(payload)
  }

  noUploadedImage() {
    return this.props.bannerImage.uri.length === 0
  }

  renderUploadImageCta() {
    return (
      <TouchableWithoutFeedback onPress={this.openCameraRoll}>
        <View
          shadowColor="gray"
          shadowOffset={{ width: 0, height: 0 }}
          shadowOpacity={0.5}
          shadowRadius={2}
          style={{
            height: 50,
            backgroundColor: "white",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            paddingLeft: 10,
            paddingRight: 10
          }}>
          <Text style={{ fontFamily: "open-sans-regular" }}>
            {this.noUploadedImage() ? "Upload Image" : "Upload Different Image"}
          </Text>
        </View>
      </TouchableWithoutFeedback>
    )
  }

  renderBannerImage() {
    return (
      <ImageBackground
        source={this.noUploadedImage() ? defaultImage : { uri: this.props.bannerImage.uri }}
        style={{
          height: bannerImageHeight,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          width: bannerImageWidth
        }}>
        {this.renderUploadImageCta()}
      </ImageBackground>
    )
  }

  renderTitleInput() {
    return (
      <TextInput
        multiline
        onChangeText={text => this.journalTitle(text)}
        style={{
          fontSize: 20,
          fontFamily: "playfair",
          marginBottom: 10
        }}
        placeholder={"Enter the title"}
        value={this.props.title}
      />
    )
  }

  renderDescriptionInput() {
    return (
      <View style={{ display: "flex", flexDirection: "row", marginTop: 10, marginBottom: 10 }}>
        <SimpleLineIcons name="location-pin" style={{ marginRight: 10 }} size={22} color="black" />
        <TextInput
          style={{
            fontSize: 14,
            fontFamily: "open-sans-regular",
            marginBottom: 10
          }}
          placeholder={"Location"}
          onChangeText={text => this.journalDescription(text)}
          value={this.props.description}
        />
      </View>
    )
  }

  renderRadioButtons() {
    return (
      <View style={{ display: "flex", marginTop: 10, flexDirection: "row", justifyContent: "space-around" }}>
        {this.renderStatusInput()}
      </View>
    )
  }

  openCameraRoll() {
    this.props.navigation.navigate("BannerImagePicker")
  }

  journalStatus(option) {
    this.updateForm("status", option.enum)
  }

  journalTitle(text) {
    this.updateForm("title", text)
  }

  journalDescription(text) {
    this.updateForm("description", text)
  }

  journalImage() {}

  isSelectedTab(option) {
    if (option.enum !== this.props.status) {
      return {}
    }

    return {
      backgroundColor: "gray"
    }
  }

  renderStatusInput() {
    let isSelectedTab
    return JournalForm.STATUS_OPTIONS.map((option, index) => {
      isSelectedTab = this.props.status === option.enum
      return (
        <TouchableWithoutFeedback onPress={() => this.journalStatus(option)}>
          <View
            style={[
              isSelectedTab ? { backgroundColor: "gray" } : {},
              {
                borderWidth: 1,
                paddingLeft: 2,
                borderRadius: 3,
                paddingRight: 2,
                paddingTop: 2,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center"
              }
            ]}>
            <Text style={[isSelectedTab ? { color: "white" } : {}, { fontSize: 10, fontFamily: "overpass" }]}>
              {option.text}
            </Text>
          </View>
        </TouchableWithoutFeedback>
      )
    })
  }

  dismissForm() {
    this.props.cancelJournalForm()
    this.props.navigation.goBack()
  }

  async persistForm() {
    const formData = new FormData()
    let { title, description, status, stage, bannerImage } = this.props
    let imgPost = {
      uri: bannerImage.uri,
      name: bannerImage.filename,
      type: "multipart/form-data"
    }
    formData.append("title", title)
    formData.append("description", description)
    formData.append("status", status)
    formData.append("stage", stage)
    formData.append("banner_image", imgPost)
    const token = await setToken()
    fetch(`${API_ROOT}/journals`, {
      method: "POST",
      headers: {
        Authorization: token,
        "Content-Type": "multipart/form-data"
      },
      body: formData
    })
      .then(response => {
        return response.json()
      })
      .then(data => {
        //would rather just use the json that i pass back, come back and investigate.
        // there's a componentDidMount on the journal show page, that seems
        // reasonable to remove so we can reuse this component.
        let journalId = data.id
        this.props.navigation.navigate("Journal", { journalId })
        this.props.populateJournal(data)
      })
  }

  renderHeader() {
    const headerProps = {
      goBackCta: "Cancel",
      handleGoBack: this.dismissForm,
      centerCta: ``,
      handleConfirm: this.persistForm,
      confirmCta: "Save"
    }
    return <Header key="header" {...headerProps} />
  }

  renderStageInput() {}

  render() {
    return (
      <View style={{ backgroundColor: "white", height: "100%" }}>
        {this.renderHeader()}
        {this.renderBannerImage()}
        <View style={{ padding: 16 }}>
          {this.renderTitleInput()}
          {this.renderDescriptionInput()}
          {this.renderRadioButtons()}
          {this.renderStageInput()}
        </View>
      </View>
    )
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(JournalForm)
