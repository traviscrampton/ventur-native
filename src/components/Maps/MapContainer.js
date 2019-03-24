import React, { Component } from "react"
import _ from "lodash"
import { StyleSheet, View, TouchableWithoutFeedback, Dimensions } from "react-native"
import { connect } from "react-redux"
import { MapView } from "expo"
import { FloatingAction } from "react-native-floating-action"
import { Ionicons, MaterialIcons } from "@expo/vector-icons"

const mapDispatchToProps = dispatch => ({})

const mapStateToProps = state => ({})

class MapContainer extends Component {
  constructor(props) {
    super(props)

    this.state = {
      polylineEditor: false,
      drawMode: false,
      shownIndex: 1,
      positionMode: false,
      polylines: [[], []],
      isDrawing: false
    }
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

  updateMapMode = name => {
    const newState = Object.assign({}, this.state, { [name]: true })
    this.setState(newState)
  }

  onPanDrag = e => {
    if (!this.state.drawMode || !this.state.isDrawing) return
    // here we need to draw a new route the index is positioned differently.  
    const { polylines } = this.state
    let newPolylines
    const lastPolylineIndex = polylines.length - 1
    const lastPolylineArray = polylines[lastPolylineIndex]
    const updatedPolyLineCoordinates = Object.assign([], lastPolylineArray, {
      [lastPolylineArray.length]: e.nativeEvent.coordinate
    })
    newPolylines = Object.assign([], polylines, { [lastPolylineIndex]: updatedPolyLineCoordinates })
    this.setState({ polylines: newPolylines, shownIndex: lastPolylineIndex })
  }

  navigateBack = () => {
    this.props.navigation.goBack()
  }

  toggleDrawMode = () => {
    const { drawMode } = this.state
    this.setState({
      drawMode: !drawMode
    })
  }

  handleOnMoveResponder = () => {
    if (!this.state.drawMode) return

    if (!this.state.isDrawing) {
      this.setState({ isDrawing: true })
    }

    return true
  }

  handleOnReleaseResponder = () => {
    if (!this.state.drawMode) return

    const newPolylines = [...this.state.polylines, []]
    this.setState({ isDrawing: false, polylines: newPolylines, shownIndex: this.state.polylines.length })
  }

  dontRenderUndoButton() {
    if (!this.state.drawMode) return true
    if (this.state.shownIndex === 0) return true

    if (this.state.shownIndex === 1) {
      return this.state.polylines[1].length === 0
    }

    return false
  }

  dontRenderRedoButton() {
    if (!this.state.drawMode) return true

    if (this.state.shownIndex === this.state.polylines.length - 1) {
      return true
    } 
    
  
    return false
  }

  handleUndoPress = () => {
    const { shownIndex } = this.state
    let skip = 1

    if (this.state.polylines[shownIndex].length === 0) {
      skip += 1
    }

    this.setState({
      shownIndex: shownIndex - skip
    })
  }

  handleRedoPress = () => {
    const { shownIndex } = this.state
    let skip = 1

    if (this.state.polylines[shownIndex].length === 0) {
      skip += 1
    }

    this.setState({
      shownIndex: shownIndex + 1
    })
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

  renderDrawButton() {
    if (!this.state.polylineEditor) return

    const { drawMode } = this.state
    const buttonBackground = drawMode ? { backgroundColor: "#FF8C34" } : {}
    const pencilColor = drawMode ? "white" : "#FF8C34"

    return (
      <View>
        <TouchableWithoutFeedback onPress={this.toggleDrawMode}>
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

  renderPolylineEditorButtons() {
    if (!this.state.polylineEditor) return

    return (
      <View
        style={{
          position: "absolute",
          right: 20,
          top: 20,
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "flex-end"
        }}>
        {this.renderUndoButton()}
        {this.renderRedoButton()}
        {this.renderDrawButton()}
      </View>
    )
  }

  renderFloatingBackButton() {
    return (
      <View
        style={{
          position: "absolute",
          top: 20,
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
    return this.state.polylines.map((coordinates, index) => {
      if (index > this.state.shownIndex) return

      return <MapView.Polyline coordinates={coordinates} strokeWidth={2} strokeColor="#FF8C34" />
    })
  }

  render() {
    return (
      <View style={{ position: "relative", flex: 1 }}>
        <View
          onMoveShouldSetResponder={this.handleOnMoveResponder}
          onResponderRelease={this.handleOnReleaseResponder}
          style={{ flex: 1 }}>
          <MapView
            style={{ flex: 1, zIndex: -1 }}
            scrollEnabled={!this.state.drawMode}
            onPanDrag={e => this.onPanDrag(e)}
            initialRegion={{
              latitude: 37.78825,
              longitude: -122.4324,
              latitudeDelta: 0.03,
              longitudeDelta: 0.03
            }}>
            {this.renderPolylines()}
          </MapView>
        </View>
        {this.renderPolylineEditorButtons()}
        <FloatingAction
          ref={ref => {
            this.floatingAction = ref
          }}
          actions={MapContainer.MAP_EDITOR_ACTIONS}
          onPressItem={this.updateMapMode}
        />
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
)(MapContainer)
