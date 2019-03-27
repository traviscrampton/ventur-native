import React, { Component } from "react"
import _ from "lodash"
import { StyleSheet, View, TouchableWithoutFeedback, Dimensions, Text } from "react-native"
import { connect } from "react-redux"
import { MapView } from "expo"
import { FloatingAction } from "react-native-floating-action"
import RouteEditorButtons from "components/Maps/RouteEditorButtons"
import { Ionicons, MaterialIcons } from "@expo/vector-icons"
import { MaterialIndicator } from "react-native-indicators"
import {
  setIsDrawing,
  drawLine,
  setupNextDraw,
  persistCoordinates,
  updateRegionCoordinates,
  defaultRouteEditor
} from "actions/route_editor"
import LoadingScreen from "components/shared/LoadingScreen"

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
  changedRegion: state.routeEditor.changedRegion
})

class RouteEditor extends Component {
  constructor(props) {
    super(props)
  }

  onPanDrag = e => {
    if (!this.props.drawMode || !this.props.isDrawing) return
    this.props.drawLine(e.nativeEvent.coordinate)
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
      buttonContent = <MaterialIndicator size={20} color="#FF8C34" />
    } else if (this.isChangedRegionDifferent()) {
      buttonContent = <Text style={{ color: "#FF8C34" }}>SAVED</Text>
    } else {
      buttonContent = <Text style={{ color: "#FF8C34" }}>SAVE POSITION</Text>
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
        style={{
          position: "absolute",
          top: 60,
          left: 20,
          backgroundColor: "white",
          borderRadius: "50%"
        }}>
        <TouchableWithoutFeedback onPress={this.navigateBack}>
          <View
            style={{
              height: 40,
              width: 40,
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center"
            }}>
            <Ionicons name="ios-arrow-back" size={30} />
          </View>
        </TouchableWithoutFeedback>
      </View>
    )
  }

  renderPolylines() {
    return this.props.polylines.map((coordinates, index) => {
      if (index > this.props.shownIndex) return

      return <MapView.Polyline style={{ zIndex: 10 }} coordinates={coordinates} strokeWidth={2} strokeColor="#FF8C34" />
    })
  }

  renderPreviousPolylines() {
    return this.props.previousPolylines.map((coordinates, index) => {
      return <MapView.Polyline style={{ zIndex: 9 }} coordinates={coordinates} strokeWidth={2} strokeColor="#067BC2" />
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
        <RouteEditorButtons />
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
