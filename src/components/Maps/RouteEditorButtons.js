import React, { Component } from "react"
import _ from "lodash"
import { StyleSheet, View, TouchableWithoutFeedback, Dimensions, Text } from "react-native"
import { connect } from "react-redux"
import { MapView } from "expo"
import { FloatingAction } from "react-native-floating-action"
import { Ionicons, MaterialIcons } from "@expo/vector-icons"
import { toggleDrawMode, togglePositionMode, setShownIndex, persistRoute, eraseRoute } from "actions/route_editor"
import { loadInitialStravaData } from "actions/strava_activity_import"
import { MaterialIndicator } from "react-native-indicators"

const mapDispatchToProps = dispatch => ({
  toggleDrawMode: () => dispatch(toggleDrawMode()),
  togglePositionMode: () => dispatch(togglePositionMode()),
  setShownIndex: payload => dispatch(setShownIndex(payload)),
  persistRoute: () => dispatch(persistRoute()),
  eraseRoute: () => dispatch(eraseRoute()),
  loadInitialStravaData: () => dispatch(loadInitialStravaData()),
})

const mapStateToProps = state => ({
  stravaAuthToken: state.common.currentUser.stravaAuthToken,
  polylineEditor: state.routeEditor.polylineEditor,
  drawMode: state.routeEditor.drawMode,
  shownIndex: state.routeEditor.shownIndex,
  positionMode: state.routeEditor.positionMode,
  polylines: state.routeEditor.polylines,
  initialRegion: state.routeEditor.initialRegion,
  initialPolylineLength: state.routeEditor.initialPolylineLength,
  isDrawing: state.routeEditor.isDrawing,
  isSaving: state.routeEditor.isSaving
})

class RouteEditorButtons extends Component {
  constructor(props) {
    super(props)
  }

  dontRenderUndoButton() {
    const { initialPolylineLength, shownIndex } = this.props
    if (this.props.polylines.length === 2 && this.props.polylines[1].length === 0) return true
    if (!this.props.drawMode || shownIndex === 0) return true
    if (shownIndex < initialPolylineLength) return true

    return false
  }

  dontRenderRedoButton() {
    const { shownIndex, polylines } = this.props
    if (!this.props.drawMode) return true
    if (polylines.length === 2 && polylines[1].length === 0) return true
    if (polylines[shownIndex + 1] && polylines[shownIndex + 1].length === 0) return true
    if (shownIndex === polylines.length - 1) {
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

    let newIndex = shownIndex - skip < 0 ? 0 : shownIndex - skip
    this.props.setShownIndex(newIndex)
  }

  handleRedoPress = () => {
    const { shownIndex, polylines } = this.props
    let skip = 1

    if (polylines[shownIndex].length === 0) {
      skip += 1
    }

    this.props.setShownIndex(shownIndex + 1)
  }

  loadStravaAndNavigate = () => {
    this.props.navigation.navigate("StravaRouteSelector")
    this.props.loadInitialStravaData()
  }

  renderUndoButton() {
    if (this.dontRenderUndoButton()) return

    return (
      <View shadowColor="#323941" shadowOffset={{ width: 0, height: 0 }} shadowOpacity={0.5} shadowRadius={2}>
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
            <Ionicons name="ios-undo" size={25} color={"#323941"} />
          </View>
        </TouchableWithoutFeedback>
      </View>
    )
  }

  renderRedoButton() {
    if (this.dontRenderRedoButton()) return

    return (
      <View shadowColor="#323941" shadowOffset={{ width: 0, height: 0 }} shadowOpacity={0.5} shadowRadius={2}>
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
            <Ionicons name="ios-redo" size={25} color={"#323941"} />
          </View>
        </TouchableWithoutFeedback>
      </View>
    )
  }

  isInitialRoute() {
    return this.props.polylines.length > this.props.initialPolylineLength
  }

  eraseRoute = async () => {
    this.props.eraseRoute()
  }

  renderDrawButton() {
    if (!this.props.polylineEditor || this.props.positionMode) return

    const { drawMode } = this.props
    const buttonBackground = drawMode ? { backgroundColor: "#FF5423" } : {}
    const pencilColor = drawMode ? "white" : "#FF5423"

    return (
      <View shadowColor="#323941" shadowOffset={{ width: 0, height: 0 }} shadowOpacity={0.5} shadowRadius={2}>
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
    if (this.props.drawMode || this.props.positionMode) return
    let icon = this.props.isSaving ? (
      <MaterialIndicator size={25} color="#FF5423" />
    ) : (
      <MaterialIcons name="save" size={25} color={"#323941"} />
    )

    return (
      <View shadowColor="#323941" shadowOffset={{ width: 0, height: 0 }} shadowOpacity={0.5} shadowRadius={2}>
        <TouchableWithoutFeedback onPress={this.props.persistRoute}>
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
            {icon}
          </View>
        </TouchableWithoutFeedback>
      </View>
    )
  }

  renderCropButton() {
    if (this.props.drawMode) return
    const { positionMode } = this.props
    const backgroundColor = positionMode ? "#3F88C5" : "white"
    const iconColor = positionMode ? "white" : "#3F88C5"

    return (
      <View shadowColor="#323941" shadowOffset={{ width: 0, height: 0 }} shadowOpacity={0.5} shadowRadius={2}>
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

  renderStravaCta() {
    if (!this.props.stravaAuthToken) return

        return (
      <View
        shadowColor="#323941"
        shadowOffset={{ width: 0, height: 0 }}
        shadowOpacity={0.5}
        shadowRadius={2}
        style={{ position: "absolute", bottom: 100, right: 30 }}>
        <TouchableWithoutFeedback onPress={this.loadStravaAndNavigate}>
          <View
            style={{
              height: 35,
              width: 35,
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "white",
              borderRadius: "50%"
            }}>
            <Text>S</Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
    )  

  }

  renderEraseButton() {
    if (this.props.positionMode) return

    return (
      <View
        shadowColor="#323941"
        shadowOffset={{ width: 0, height: 0 }}
        shadowOpacity={0.5}
        shadowRadius={2}
        style={{ position: "absolute", bottom: 30, right: 30 }}>
        <TouchableWithoutFeedback onPress={() => this.eraseRoute()}>
          <View
            style={{
              height: 35,
              width: 35,
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "white",
              borderRadius: "50%"
            }}>
            <MaterialIcons name="delete" size={25} color={"#323941"} />
          </View>
        </TouchableWithoutFeedback>
      </View>
    )
  }

  render() {
    if (!this.props.polylineEditor) return
    const cropPosition = this.props.positionMode ? { top: 60 } : {}

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
          style={[
            {
              position: "absolute",
              right: 28,
              top: 120,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "flex-end"
            },
            cropPosition
          ]}>
          {this.renderSaveButton()}
          {this.renderCropButton()}
        </View>
        {this.renderStravaCta()}
        {this.renderEraseButton()}
      </React.Fragment>
    )
  }
}

const styles = StyleSheet.create({})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RouteEditorButtons)
