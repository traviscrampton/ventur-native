import React, { Component } from "react"
import { connect } from "react-redux"
import { setSelectedImages, addImagesToEntries } from "actions/editor"
import { Text, FlatList, TouchableWithoutFeedback, StyleSheet, ScrollView, View, Image, Button } from "react-native"
import CameraRollPicker from "react-native-camera-roll-picker"

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

  renderHeader() {
    return (
      <View
        key="header"
        style={{
          display: "flex",
          height: 60,
          alignItems: "center",
          flexDirection: "row",
          justifyContent: "space-between",
          paddingTop: 10,
          paddingLeft: 10,
          paddingRight: 10
        }}>
        <TouchableWithoutFeedback onPress={() => this.props.navigation.goBack()}>
          <View>
            <Text>Cancel</Text>
          </View>
        </TouchableWithoutFeedback>
        <View>
          <Text>{`${this.props.selectedImages.length} selected`}</Text>
        </View>
        <TouchableWithoutFeedback onPress={() => this.addImagesToEntries()}>
          <View>
            <Text>Add</Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
    )
  }

  render() {
    return [this.renderHeader(), <CameraRollPicker key="cameraRollPicker" selected={this.props.selectedImages} callback={this.compileSelectedImages} />]
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CameraRollContainer)
