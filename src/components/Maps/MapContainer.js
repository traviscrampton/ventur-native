import React, { Component } from "react"
import { StyleSheet, View, TouchableWithoutFeedback } from "react-native"
import { connect } from "react-redux"
import { MapView } from "expo"
import { FloatingAction } from "react-native-floating-action"
import { Ionicons } from "@expo/vector-icons"

const mapDispatchToProps = dispatch => ({})

const mapStateToProps = state => ({})

class MapContainer extends Component {
  constructor(props) {
    super(props)

    this.state = {
      drawMode: true,
      positionMode: false,
      polylines: [[]],
      isDrawing: false
    }
  }

  static MAP_EDITOR_ACTIONS = [
    {
      text: "Draw Route",
      icon: "",
      name: "drawMode",
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

    const { polylines } = this.state
    const lastPolylineIndex = polylines.length - 1
    const lastPolylineArray = polylines[lastPolylineIndex]
    const updatedPolyLineCoordinates = Object.assign([], lastPolylineArray, {
      [lastPolylineArray.length]: e.nativeEvent.coordinate
    })
    const newPolylines = Object.assign([], polylines, { [lastPolylineIndex]: updatedPolyLineCoordinates })
    this.setState({ polylines: newPolylines })
  }

  navigateBack = () => {
    this.props.navigation.goBack()
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
    this.setState({ isDrawing: false, polylines: newPolylines })
  }

  renderFloatingBackButton() {
    return (
      <View
        style={{
          zIndex: 1,
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
      return <MapView.Polyline coordinates={coordinates} strokeWidth={2} strokeColor="#FF8C34" />
    })
  }

  render() {
    return (
      <View
        onMoveShouldSetResponder={this.handleOnMoveResponder}
        onResponderRelease={this.handleOnReleaseResponder}
        style={{ flex: 1, position: "relative" }}>
        {" "}
        return true
        <MapView
          style={{ flex: 1 }}
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
        <FloatingAction
          ref={ref => {
            this.floatingAction = ref
          }}
          icon="CANCEL"
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
