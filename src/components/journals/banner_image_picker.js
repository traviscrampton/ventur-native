import React, { Component } from "react"
import { connect } from "react-redux"
import { updateJournalForm } from "actions/journal_form"
import { Text, FlatList, TouchableWithoutFeedback, StyleSheet, ScrollView, View, Image, Button } from "react-native"
import CameraRollPicker from "react-native-camera-roll-picker"
import { Header } from "components/editor/header"

const mapStateToProps = state => ({})
const mapDispatchToProps = dispatch => ({
  updateJournalForm: payload => dispatch(updateJournalForm(payload))
})

class BannerImagePicker extends Component {
  constructor(props) {
    super(props)
    this.handleGoBack = this.handleGoBack.bind(this)
    this.getSelectedImage = this.getSelectedImage.bind(this)
    this.journalImage = this.journalImage.bind(this)

    this.state = {
      selectedImage: {}
    }
  }

  handleGoBack() {
    this.setState({
      selectedImage: {}
    })
    this.props.navigation.goBack()
  }

  getSelectedImage(images) {
    if (images.length === 0) return
    let image = images[0]
    this.setState({
      selectedImage: image
    })
  }

  renderHeader() {
    const headerProps = {
      goBackCta: "Cancel",
      handleGoBack: this.handleGoBack,
      centerCta: `Banner Image`,
      handleConfirm: this.journalImage,
      confirmCta: "Add"
    }
    return <Header key="header" {...headerProps} />
  }

  journalImage() {
    let payload = { key: "cardImageUrl", value: this.state.selectedImage.uri }
    this.props.updateJournalForm(payload)
    this.props.navigation.goBack()
  }

  renderCameraRollPicker() {
    return (
      <CameraRollPicker
        selectSingleItem
        key="cameraRollPicker"
        selected={[this.state.selectedImage]}
        callback={this.getSelectedImage}
      />
    )
  }

  render() {
    return [this.renderHeader(), this.renderCameraRollPicker()]
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BannerImagePicker)
