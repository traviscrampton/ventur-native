import React, { Component } from "react"
import _ from "lodash"
import { StyleSheet, View, TouchableWithoutFeedback, Dimensions, Text, Alert } from "react-native"
import { connect } from "react-redux"
import MapView from "react-native-maps"
import { FloatingAction } from "react-native-floating-action"
import RouteEditorButtons from "../Maps/RouteEditorButtons"
import {
  toggleDrawMode,
  togglePositionMode,
  setShownIndex,
  persistRoute,
  eraseRoute,
  cancelAllModes
} from "../../actions/route_editor"
import { Ionicons, MaterialIcons } from "@expo/vector-icons"
import { MaterialIndicator } from "react-native-indicators"
import {
  setIsDrawing,
  drawLine,
  setupNextDraw,
  persistCoordinates,
  updateRegionCoordinates,
  defaultRouteEditor
} from "../../actions/route_editor"
import LoadingScreen from "../shared/LoadingScreen"

const mapDispatchToProps = dispatch => ({
  setIsDrawing: payload => dispatch(setIsDrawing(payload)),
  toggleDrawMode: () => dispatch(toggleDrawMode()),
  togglePositionMode: () => dispatch(togglePositionMode()),
  drawLine: payload => dispatch(drawLine(payload)),
  setupNextDraw: () => dispatch(setupNextDraw()),
  persistRoute: () => dispatch(persistRoute()),
  eraseRoute: () => dispatch(eraseRoute()),
  persistCoordinates: () => dispatch(persistCoordinates()),
  cancelAllModes: () => dispatch(cancelAllModes()),
  defaultRouteEditor: () => dispatch(defaultRouteEditor()),
  updateRegionCoordinates: coordinates => dispatch(updateRegionCoordinates(coordinates))
})

const mapStateToProps = state => ({
  polylineEditor: state.routeEditor.polylineEditor,
  width: state.common.width,
  drawMode: state.routeEditor.drawMode,
  shownIndex: state.routeEditor.shownIndex,
  positionMode: state.routeEditor.positionMode,
  polylines: state.routeEditor.polylines,
  previousPolylines: state.routeEditor.previousPolylines,
  initialRegion: state.routeEditor.initialRegion,
  isDrawing: state.routeEditor.isDrawing,
  isLoading: state.common.isLoading,
  isSaving: state.routeEditor.isSaving,
  changedRegion: state.routeEditor.changedRegion,
  startingPolylines: state.routeEditor.startingPolylines,
  canDraw: state.routeEditor.canDraw
})

class RouteEditor extends Component {
  constructor(props) {
    super(props)
  }

  static actions = [
    {
      text: "Draw Route",
      icon: <MaterialIcons name={"edit"} color="white" size={20} />,
      name: "draw_route",
      position: 0,
      color: "#FF5423"
    },
    {
      text: "Position Map",
      icon: <MaterialIcons name={"crop-free"} color="white" size={20} />,
      name: "position_map",
      position: 1,
      color: "#3F88C5"
    },
    {
      text: "Upload Strava Routes",
      icon: <MaterialIcons name={"directions-bike"} color="white" size={20} />,
      name: "upload_strava",
      position: 2,
      color: "#FF5423"
    },
    {
      text: "Clear Route",
      icon: <MaterialIcons name="delete" color="white" size={20} />,
      name: "erase_route",
      position: 3,
      color: "#FF5423"
    }
  ]

  onPanDrag = e => {
    const { drawMode, canDraw, isDrawing } = this.props

    if (!drawMode || !canDraw || !isDrawing) return
    let coordinates = [e.nativeEvent.coordinate.latitude, e.nativeEvent.coordinate.longitude]
    this.props.drawLine(coordinates)
  }

  checkForSaveAndNavigateBack = () => {
    if (this.isSaved()) {
      this.navigateBack()
    } else {
      Alert.alert(
        "Are you sure?",
        "You have unsaved changes",
        [{ text: "Continue Unsaved", onPress: () => this.navigateBack() }, { text: "Cancel", style: "cancel" }],
        { cancelable: true }
      )
    }
  }

  navigateBack = () => {
    this.props.defaultRouteEditor()
    this.props.navigation.goBack()
  }

  handleOnMoveResponder = () => {
    if (!this.props.canDraw) return

    if (!this.props.isDrawing) {
      this.props.setIsDrawing(true)
    }

    return true
  }

  isSaved() {
    let { polylines, startingPolylines } = this.props

    return JSON.stringify(polylines) === JSON.stringify(startingPolylines)
  }

  routeNeedsSaving() {
    const { polylines, startingPolylines } = this.props

    if (polylines.length !== startingPolylines.length) {
      return true
    }

    return !this.isSaved()
  }

  handleOnReleaseResponder = () => {
    if (!this.props.canDraw) return

    this.props.setupNextDraw()
  }

  async handleRegionChange(coordinates) {
    this.props.updateRegionCoordinates(coordinates)
  }

  isChangedRegionDifferent() {
    return JSON.stringify(this.props.initialRegion) !== JSON.stringify(this.props.changedRegion)
  }

  handlePressItem(name) {
    switch (name) {
      case "draw_route":
        return this.props.toggleDrawMode()
      case "position_map":
        return this.props.togglePositionMode()
      case "erase_route":
        return this.props.eraseRoute()
      default:
        console.log("wat in tarnation")
    }
  }

  getSaveButtonProps(drawMode, positionMode) {
    if (drawMode) {
      return Object.assign(
        {},
        { onPress: this.props.persistRoute, saved: "SAVED", needsSaving: "SAVE ROUTE", color: "#FF5423" }
      )
    } else if (positionMode) {
      return Object.assign(
        {},
        { onPress: this.props.persistCoordinates, saved: "SAVED", needsSaving: "SAVE POSITION", color: "#3F88C5" }
      )
    } else {
      return Object.assign({}, {})
    }
  }

  needsSaving(drawMode, positionMode) {
    if (!drawMode && !positionMode) return

    if (positionMode) {
      return this.isChangedRegionDifferent()
    } else if (drawMode) {
      return this.routeNeedsSaving()
    }

    return false
  }

  cancelAllModes = () => {
    this.props.cancelAllModes()
  }

  renderSavingButton() {
    const { drawMode, positionMode } = this.props
    if (!drawMode && !positionMode) return
    const { onPress, saved, needsSaving, color } = this.getSaveButtonProps(drawMode, positionMode)
    let buttonContent

    if (this.props.isSaving) {
      buttonContent = <MaterialIndicator size={20} color={color} />
    } else if (this.needsSaving(drawMode, positionMode)) {
      buttonContent = <Text style={{ color: color }}>{needsSaving}</Text>
    } else {
      buttonContent = <Text style={{ color: color }}>{saved}</Text>
    }
    return (
      <View
        shadowColor="#323941"
        shadowOffset={{ width: 0, height: 0 }}
        shadowOpacity={0.7}
        shadowRadius={2}
        style={{
          position: "absolute",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          bottom: 65,
          left: 60
        }}>
        <TouchableWithoutFeedback onPress={onPress}>
          <View
            style={{
              width: this.props.width / 2,
              borderRadius: 30,
              height: 40,
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "white"
            }}>
            {buttonContent}
          </View>
        </TouchableWithoutFeedback>
      </View>
    )
  }

  renderFloatingBackButton() {
    return (
      <View
        shadowColor="#323941"
        shadowOffset={{ width: 0, height: 0 }}
        shadowOpacity={0.5}
        shadowRadius={2}
        style={{
          position: "absolute",
          top: 60,
          left: 20,
          backgroundColor: "white",
          borderRadius: "50%"
        }}>
        <TouchableWithoutFeedback onPress={this.checkForSaveAndNavigateBack}>
          <View
            style={{
              height: 40,
              width: 40,
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              paddingRight: 2,
              paddingTop: 1
            }}>
            <Ionicons name="ios-arrow-back" size={30} />
          </View>
        </TouchableWithoutFeedback>
      </View>
    )
  }

  renderExitButton() {
    if (!this.props.drawMode && !this.props.positionMode) return

    return (
      <View
        shadowColor="#323941"
        shadowOffset={{ width: 0, height: 0 }}
        shadowOpacity={0.5}
        shadowRadius={2}
        style={{
          position: "absolute",
          bottom: 60,
          right: 30,
          backgroundColor: "#FF5423",
          borderRadius: "50%",
          overflow: "hidden"
        }}>
        <TouchableWithoutFeedback onPress={this.cancelAllModes}>
          <View
            style={{
              height: 57,
              width: 57,
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center"
            }}>
            <MaterialIcons name="close" size={30} color={"white"} />
          </View>
        </TouchableWithoutFeedback>
      </View>
    )
  }

  renderPolylines() {
    let coordinates
    return this.props.polylines.map((coordinateArrays, index) => {
      if (index > this.props.shownIndex) return

      coordinates = coordinateArrays.map(coordinate => {
        return Object.assign({}, { latitude: coordinate[0], longitude: coordinate[1] })
      })

      return <MapView.Polyline style={{ zIndex: 10 }} coordinates={coordinates} strokeWidth={2} strokeColor="#FF5423" />
    })
  }

  renderPreviousPolylines() {
    return this.props.previousPolylines.map((coordinates, index) => {
      return <MapView.Polyline style={{ zIndex: 9 }} coordinates={coordinates} strokeWidth={2} strokeColor="#3F88C5" />
    })
  }

  renderPositionCoordinates() {
    if (!this.props.positionMode) return

    const { latitude, longitude, latitudeDelta, longitudeDelta } = this.props.changedRegion
    return (
      <View
        style={{
          position: "absolute",
          backgroundColor: "rgba(111, 111, 111, 0.3)",
          padding: 5,
          borderRadius: 5,
          top: 60,
          right: 30
        }}>
        <View>
          <Text style={{ color: "black" }}>Latitude: {latitude}</Text>
        </View>
        <View>
          <Text style={{ color: "black" }}>Longitude: {longitude}</Text>
        </View>
        <View>
          <Text style={{ color: "black" }}>Lat Delta: {latitudeDelta}</Text>
        </View>
        <View>
          <Text style={{ color: "black" }}>Long Delta: {longitudeDelta}</Text>
        </View>
      </View>
    )
  }

  render() {
    if (this.props.isLoading) {
      return <LoadingScreen />
    }

    return (
      <View style={{ position: "relative", flex: 1 }}>
        <View
          onMoveShouldSetResponder={this.handleOnMoveResponder}
          onResponderRelease={this.handleOnReleaseResponder}
          style={{ flex: 1 }}>
          <MapView
            onRegionChangeComplete={e => this.handleRegionChange(e)}
            style={{ flex: 1, zIndex: -1 }}
            scrollEnabled={!this.props.canDraw}
            onPanDrag={e => this.onPanDrag(e)}
            initialRegion={this.props.initialRegion}>
            {this.renderPreviousPolylines()}
            {this.renderPolylines()}
          </MapView>
        </View>
        {this.renderFloatingBackButton()}
        <FloatingAction
          color={"#FF5423"}
          distanceToEdge={{ vertical: 60, horizontal: 30 }}
          actions={RouteEditor.actions}
          onPressItem={name => {
            this.handlePressItem(name)
          }}
        />
        {this.renderExitButton()}
        {this.renderSavingButton()}
        {this.renderPositionCoordinates()}
        <RouteEditorButtons navigation={this.props.navigation} />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    backgroundColor: "white",
    paddingBottom: 50
  }
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RouteEditor)
