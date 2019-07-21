import React, { Component } from "react"
import { connect } from "react-redux"
import { createNewTextEntry, updateActiveCreator } from "../../actions/editor"
import { Text, TouchableWithoutFeedback, StyleSheet, View } from "react-native"
import { MaterialIcons, Entypo } from "@expo/vector-icons"

const mapStateToProps = state => ({
  activeContentCreator: state.editor.activeContentCreator,
  uploadIsImage: state.editor.uploadIsImage
})

const mapDispatchToProps = dispatch => ({
  createNewTextEntry: payload => dispatch(createNewTextEntry(payload)),
  updateActiveCreator: payload => dispatch(updateActiveCreator(payload))
})
class ContentCreator extends Component {
  constructor(props) {
    super(props)

    this.state = {
      initialState: true
    }
  }

  createNewTextEntry() {
    let entry = {
      content: "",
      styles: "",
      type: "text"
    }

    let payload = { newEntry: entry, newIndex: this.props.index }
    this.props.createNewTextEntry(payload)
    this.props.updateActiveCreator(null)
  }

  openCameraRoll = e => {
    this.props.navigation.navigate("CameraRollContainer", {
      index: this.props.index,
      selectSingleItem: true
    })
  }

  updateActiveCreator = () => {
    if (this.props.uploadIsImage) return

    this.props.updateActiveCreator(this.props.index)
  }

  renderOptionState() {
    return (
      <View style={styles.optionState}>
        <TouchableWithoutFeedback onPress={() => this.createNewTextEntry()}>
          <View style={styles.optionContainer}>
            <Text style={styles.grayText}>+ ADD CONTENT</Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
    )
  }

  renderInitialState() {
    return (
      <TouchableWithoutFeedback style={{ width: this.props.width }} onPress={this.updateActiveCreator}>
        <View style={[styles.initialState, { display: "flex", flexDirection: "row", alignItems: "center" }]}>
          <MaterialIcons style={{ marginRight: 7 }} color="#d3d3d3" name="add-circle-outline" size={20} />
          <Text style={{ color: "#d3d3d3" }}>Add Content</Text>
        </View>
      </TouchableWithoutFeedback>
    )
  }

  renderTextOrImage() {
    return (
      <View
        style={[
          styles.initialState,
          { display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-around" }
        ]}>
        <TouchableWithoutFeedback onPress={() => this.createNewTextEntry()}>
          <View style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
            <MaterialIcons style={{ marginRight: 4 }} color="darkgray" name="text-fields" size={20} />
            <Text style={{ color: "darkgray" }}>Text</Text>
          </View>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback onPress={this.openCameraRoll}>
          <View style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
            <Entypo style={{ marginRight: 4 }} name="image" size={20} color={"darkgray"} />
            <Text style={{ color: "darkgray" }}>Image</Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
    )
  }

  renderOrHidden() {
    return null
    // return this.renderOptionState()
  }

  render() {
    if (this.props.activeContentCreator === this.props.index) {
      return this.renderTextOrImage()
    } else {
      return this.renderInitialState()
    }
  }
}

const styles = StyleSheet.create({
  initialState: {
    paddingTop: 10,
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 10,
    backgroundColor: "white",
    height: 50
  },
  optionState: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingLeft: 20,
    height: 50
  },
  optionContainer: {
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: "white"
  },
  grayText: {
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: "white"
  }
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ContentCreator)
