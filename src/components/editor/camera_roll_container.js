import React, { Component } from "react"
import { connect } from "react-redux"
import { setSelectedImages, addImagesToEntries } from "actions/editor"
import { Text, FlatList, TouchableWithoutFeedback, StyleSheet, ScrollView, View, Image, Button } from "react-native"
import CameraRollPicker from "react-native-camera-roll-picker"
import Header from "components/editor/header"

const mapStateToProps = state => ({
  selectedImages: state.editor.selectedImages
})

const mapDispatchToProps = dispatch => ({
  setSelectedImages: payload => dispatch(setSelectedImages(payload)),
  addImagesToEntries: payload => dispatch(addImagesToEntries(payload))
})
class CameraRollContainer extends Component {
  constructor(props) {
    super(props)
    this.compileSelectedImages = this.compileSelectedImages.bind(this)
    this.index = this.props.navigation.getParam("index", "NO-ID")
    this.addImagesToEntries = this.addImagesToEntries.bind(this)
    this.handleGoBack = this.handleGoBack.bind(this)
  }

  addImagesToEntries() {
    this.props.addImagesToEntries(this.index + 1)
    this.props.navigation.goBack()
  }

  compileSelectedImages(images) {
    const selectedImages = images.map((img, idx) => {
      return {
        type: "image",
        uri: img.uri,
        caption: ""
      }
    })
    this.props.setSelectedImages(selectedImages)
  }

  handleGoBack() {
    this.props.navigation.goBack()
  }

  renderHeader() {
    const headerProps = {
      goBackCta: "Cancel",
      handleGoBack: this.handleGoBack,
      centerCta: `${this.props.selectedImages.length} selected`,
      handleConfirm: this.addImagesToEntries,
      confirmCta: "Add"
    }
    return <Header key="header" {...headerProps} />
  }

  renderCameraRollPicker() {
    return (
      <CameraRollPicker
        key="cameraRollPicker"
        selected={this.props.selectedImages}
        callback={this.compileSelectedImages}
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
)(CameraRollContainer)
