import React, { Component } from "react"
import _ from "lodash"
import { StyleSheet, View, TouchableWithoutFeedback, Dimensions, Text, Alert } from "react-native"
import { connect } from "react-redux"
import { MapView } from "expo"
import { FloatingAction } from "react-native-floating-action"
import RouteEditorButtons from "../Maps/RouteEditorButtons"
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
  drawLine: payload => dispatch(drawLine(payload)),
  setupNextDraw: () => dispatch(setupNextDraw()),
  persistCoordinates: () => dispatch(persistCoordinates()),
  defaultRouteEditor: () => dispatch(defaultRouteEditor()),
  updateRegionCoordinates: coordinates => dispatch(updateRegionCoordinates(coordinates))
})

const mapStateToProps = state => ({
  polylineEditor: state.routeEditor.polylineEditor,
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
  startingPolylines: state.routeEditor.startingPolylines
})

class RouteEditor extends Component {
  constructor(props) {
    super(props)
  }

  onPanDrag = e => {
    if (!this.props.drawMode || !this.props.isDrawing) return
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
    if (!this.props.drawMode) return

    if (!this.props.isDrawing) {
      this.props.setIsDrawing(true)
    }

    return true
  }

  isSaved() {
    let { polylines, startingPolylines, shownIndex } = this.props

    return JSON.stringify(polylines) === JSON.stringify(startingPolylines)
  }

  handleOnReleaseResponder = () => {
    if (!this.props.drawMode) return

    this.props.setupNextDraw()
  }

  async handleRegionChange(coordinates) {
    this.props.updateRegionCoordinates(coordinates)
  }

  isChangedRegionDifferent() {
    return JSON.stringify(this.props.initialRegion) === JSON.stringify(this.props.changedRegion)
  }

  renderSavingButton() {
    if (!this.props.positionMode) return
    let buttonContent

    if (this.props.isSaving) {
      buttonContent = <MaterialIndicator size={20} color="#FF5423" />
    } else if (this.isChangedRegionDifferent()) {
      buttonContent = <Text style={{ color: "#FF5423" }}>SAVED</Text>
    } else {
      buttonContent = <Text style={{ color: "#FF5423" }}>SAVE POSITION</Text>
    }

    return (
      <View
        style={{
          position: "absolute",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          bottom: 30,
          width: Dimensions.get("window").width
        }}>
        <TouchableWithoutFeedback onPress={this.props.persistCoordinates}>
          <View
            style={{
              width: Dimensions.get("window").width / 2,
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
            scrollEnabled={!this.props.drawMode}
            onPanDrag={e => this.onPanDrag(e)}
            initialRegion={this.props.initialRegion}>
            {this.renderPreviousPolylines()}
            {this.renderPolylines()}
          </MapView>
        </View>
        {this.renderFloatingBackButton()}
        <RouteEditorButtons navigation={this.props.navigation} />
        {this.renderSavingButton()}
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
