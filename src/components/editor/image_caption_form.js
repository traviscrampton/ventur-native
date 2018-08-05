import React, { Component } from "react"
import { connect } from "react-redux"
import { Header } from "components/editor/header"
import { updateActiveImageCaption, updateImageCaption, updateActiveIndex } from "actions/editor"
import { Text, TouchableWithoutFeedback, TextInput, StyleSheet, View, Image, Dimensions } from "react-native"

const mapStateToProps = state => ({
  entries: state.editor.entries,
  activeCaption: state.editor.activeCaption
})

const mapDispatchToProps = dispatch => ({
  updateImageCaption: payload => dispatch(updateImageCaption(payload)),
  updateActiveIndex: payload => dispatch(updateActiveIndex(payload)),
  updateActiveImageCaption: payload => dispatch(updateActiveImageCaption(payload))
})

class ImageCaptionForm extends Component {
  constructor(props) {
    super(props)
    this.index = this.props.navigation.getParam("index", "NO-ID")
    this.handleGoBack = this.handleGoBack.bind(this)
    this.saveCaption = this.saveCaption.bind(this)
  }

  saveCaption() {
    const entry = { ...this.props.entries[this.index], caption: this.props.activeCaption }
    const payload = { entry: entry, index: this.index }
    this.props.updateImageCaption(payload)
    this.props.navigation.goBack()
  }

  handleGoBack() {
    this.props.updateActiveImageCaption("")
    this.props.updateActiveIndex(null)
    this.props.navigation.goBack()
  }

  renderHeader() {
    const headerProps = {
      goBackCta: "Cancel",
      handleGoBack: this.handleGoBack,
      centerCta: "Add Caption",
      handleConfirm: this.saveCaption,
      confirmCta: "Add"
    }
    return <Header key="header" {...headerProps} />
  }

  renderImage() {
    const image = this.props.entries[this.index]
    return (
      <Image key="image" style={{ width: Dimensions.get("window").width, height: 250 }} source={{ uri: image.uri }} />
    )
  }

  updateActiveImageCaption(text) {
    this.props.updateActiveImageCaption(text)
  }

  renderForm() {
    return (
      <View key="captionForm">
        <View>
          <Text>{this.props.activeCaption.length}/200</Text>
        </View>
        <TextInput
          autoFocus
          multiline
          value={this.props.activeCaption}
          maxLength={200}
          onChangeText={text => this.updateActiveImageCaption(text)}
        />
      </View>
    )
  }

  render() {
    return [this.renderHeader(), this.renderImage(), this.renderForm()]
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ImageCaptionForm)
