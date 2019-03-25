import React, { Component } from "react"
import _ from "lodash"
import { StyleSheet, View, TouchableWithoutFeedback, Dimensions } from "react-native"
import { connect } from "react-redux"
import { MapView } from "expo"
import { FloatingAction } from "react-native-floating-action"
import { Ionicons, MaterialIcons } from "@expo/vector-icons"
import { toggleDrawMode, togglePositionMode, setShownIndex } from "actions/route_editor"

const mapDispatchToProps = dispatch => ({
  toggleDrawMode: () => dispatch(toggleDrawMode()),
  togglePositionMode: () => dispatch(togglePositionMode()),
  setShownIndex: payload => dispatch(setShownIndex(payload))
})

const mapStateToProps = state => ({
  polylineEditor: state.routeEditor.polylineEditor,
  drawMode: state.routeEditor.drawMode,
  shownIndex: state.routeEditor.shownIndex,
  positionMode: state.routeEditor.positionMode,
  polylines: state.routeEditor.polylines,
  initialRegion: state.routeEditor.initialRegion,
  isDrawing: state.routeEditor.isDrawing
})

class RouteEditorButtons extends Component {
  constructor(props) {
    super(props)
  }

  dontRenderUndoButton() {
    if (!this.props.drawMode) return true
    if (this.props.shownIndex === 0) return true

    if (this.props.shownIndex === 1) {
      return this.props.polylines[1].length === 0
    }

    return false
  }

  dontRenderRedoButton() {
    if (!this.props.drawMode) return true

    if (this.props.shownIndex === this.props.polylines.length - 1) {
      return true
    }

    return false
  }

  handleUndoPress = () => {
    let { shownIndex, polylines } = this.props
    let skip = 1

    if (polylines[shownIndex].length === 0) {
      skip += 1
    }

    this.props.setShownIndex(shownIndex - skip)
  }

  handleRedoPress = () => {
    const { shownIndex, polylines } = this.props
    let skip = 1

    if (polylines[shownIndex].length === 0) {
      skip += 1
    }

    this.props.setShownIndex(shownIndex + 1)
  }

  renderUndoButton() {
    if (this.dontRenderUndoButton()) return

    return (
      <View>
        <TouchableWithoutFeedback onPress={this.handleUndoPress}>
          <View
            style={[
              {
                backgroundColor: "white",
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                height: 35,
                width: 35,
                borderRadius: "50%"
              }
            ]}>
            <Ionicons name="ios-undo" size={25} color={"black"} />
          </View>
        </TouchableWithoutFeedback>
      </View>
    )
  }

  renderRedoButton() {
    if (this.dontRenderRedoButton()) return

    return (
      <View>
        <TouchableWithoutFeedback onPress={this.handleRedoPress}>
          <View
            style={[
              {
                backgroundColor: "white",
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                height: 35,
                width: 35,
                borderRadius: "50%",
                marginLeft: 10
              }
            ]}>
            <Ionicons name="ios-redo" size={25} color={"black"} />
          </View>
        </TouchableWithoutFeedback>
      </View>
    )
  }

  isInitialRoute() {
    return this.props.shownIndex === 1 && this.props.polylines[1].length === 0
  }

  renderDrawButton() {
    if (!this.props.polylineEditor) return

    const { drawMode } = this.props
    const buttonBackground = drawMode ? { backgroundColor: "#FF8C34" } : {}
    const pencilColor = drawMode ? "white" : "#FF8C34"

    return (
      <View>
        <TouchableWithoutFeedback onPress={this.props.toggleDrawMode}>
          <View
            style={[
              {
                backgroundColor: "white",
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                height: 50,
                width: 50,
                marginLeft: 10,
                borderRadius: "50%"
              },
              buttonBackground
            ]}>
            <MaterialIcons name="edit" size={30} color={pencilColor} />
          </View>
        </TouchableWithoutFeedback>
      </View>
    )
  }

  renderSaveButton() {
    if (this.props.drawMode || this.isInitialRoute()) return

    return (
      <View>
        <TouchableWithoutFeedback onPress={() => console.log("WAT")}>
          <View
            style={[
              {
                backgroundColor: "white",
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                height: 35,
                width: 35,
                borderRadius: "50%",
                marginBottom: 10
              }
            ]}>
            <MaterialIcons name="save" size={25} color={"black"} />
          </View>
        </TouchableWithoutFeedback>
      </View>
    )
  }

  renderDeleteButton() {
    if (this.props.drawMode || this.isInitialRoute()) return

    return (
      <View>
        <TouchableWithoutFeedback onPress={() => console.log("DELETE!")}>
          <View
            style={[
              {
                backgroundColor: "white",
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                height: 35,
                width: 35,
                borderRadius: "50%",
                marginBottom: 10
              }
            ]}>
            <MaterialIcons name="delete" size={25} color={"black"} />
          </View>
        </TouchableWithoutFeedback>
      </View>
    )
  }

  renderCropButton() {
    if (this.props.drawMode) return
    const { positionMode } = this.props
    const backgroundColor = positionMode ? "blue" : "white"
    const iconColor = positionMode ? "white" : "blue"

    return (
      <View>
        <TouchableWithoutFeedback onPress={this.props.togglePositionMode}>
          <View
            style={[
              {
                backgroundColor: backgroundColor,
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                height: 35,
                width: 35,
                borderRadius: "50%",
                marginBottom: 10
              }
            ]}>
            <MaterialIcons name="crop-free" size={25} color={iconColor} />
          </View>
        </TouchableWithoutFeedback>
      </View>
    )
  }

  render() {
    if (!this.props.polylineEditor) return

    return (
      <React.Fragment>
        <View
          style={{
            position: "absolute",
            right: 20,
            top: 60,
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "flex-end"
          }}>
          {this.renderUndoButton()}
          {this.renderRedoButton()}
          {this.renderDrawButton()}
        </View>
        <View
          style={{
            position: "absolute",
            right: 30,
            top: 120,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "flex-end"
          }}>
          >{this.renderSaveButton()}
          {this.renderDeleteButton()}
          {this.renderCropButton()}
        </View>
      </React.Fragment>
    )
  }
}

const styles = StyleSheet.create({})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RouteEditorButtons)
