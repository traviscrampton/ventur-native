import React, { Component } from "react"
import _ from "lodash"
import { StyleSheet, View, TouchableWithoutFeedback, Dimensions, Text } from "react-native"
import { connect } from "react-redux"
import { MapView } from "expo"
import { FloatingAction } from "react-native-floating-action"
import RouteEditorButtons from "components/Maps/RouteEditorButtons"
import { Ionicons, MaterialIcons } from "@expo/vector-icons"
import { setIsDrawing, drawLine, setupNextDraw } from "actions/route_editor"

const mapDispatchToProps = dispatch => ({
  setIsDrawing: payload => dispatch(setIsDrawing(payload)),
  drawLine: payload => dispatch(drawLine(payload)),
  setupNextDraw: () => dispatch(setupNextDraw()),
})

const mapStateToProps = state => ({
  polylineEditor: state.routeEditor.polylineEditor,
  drawMode: state.routeEditor.drawMode,
  shownIndex: state.routeEditor.shownIndex,
  positionMode: state.routeEditor.positionMode,
  polylines: state.routeEditor.polylines,
  initialRegion: state.routeEditor.initialRegion,
  isDrawing: state.routeEditor.isDrawing,
  isLoading: state.common.isLoading
})

class MapContainer extends Component {
  // Goals here.
  // 3. Give it ability to set ratios and position.
  // 3. set up server to take data
  // 4. set up endpoint
  // 5. Make request to server converting to base 64
  constructor(props) {
    super(props)
  }

  static MAP_EDITOR_ACTIONS = [
    {
      text: "Draw Route",
      icon: "",
      name: "polylineEditor",
      position: 2
    },
    {
      text: "Position Map",
      icon: "",
      name: "positionMode",
      position: 1
    }
  ]

  onPanDrag = e => {
    if (!this.props.drawMode || !this.props.isDrawing) return
    this.props.drawLine(e.nativeEvent.coordinate)
  }

  navigateBack = () => {
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

  isInitialRoute() {
    return this.props.shownIndex === 1 && this.props.polylines[1].length === 0
  }

  handleRegionChange(e) {
    if (!this.props.positionMode) return
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

  render() {
    if (this.props.isLoading) {
      return <Text>LOADING...</Text>
    }

    return (
      <View style={{ position: "relative", flex: 1 }}>
        <View
          onMoveShouldSetResponder={this.handleOnMoveResponder}
          onResponderRelease={this.handleOnReleaseResponder}
          style={{ flex: 1 }}>
          <MapView
            // provider={MapView.PROVIDER_GOOGLE}
            onRegionChangeComplete={e => this.handleRegionChange(e)}
            style={{ flex: 1, zIndex: -1 }}
            scrollEnabled={!this.props.drawMode}
            onPanDrag={e => this.onPanDrag(e)}
            initialRegion={this.props.initialRegion}>
            {this.renderPolylines()}
          </MapView>
        </View>
        {this.renderFloatingBackButton()}
        <RouteEditorButtons />
      </View>
    )
  }
}

// <FloatingAction
// ref={ref => {
// this.floatingAction = ref
// }}
// actions={MapContainer.MAP_EDITOR_ACTIONS}
// onPressItem={this.updateMapMode}
// />

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
)(MapContainer)
