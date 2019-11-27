import React, { Component } from "react"
import { StyleSheet, View, TouchableWithoutFeedback, Text } from "react-native"
import { connect } from "react-redux"
import { MapView } from "expo"
import { FloatingAction } from "react-native-floating-action"
import { Ionicons, MaterialIcons } from "@expo/vector-icons"
import { togglePositionMode, setShownIndex, persistRoute, eraseRoute, setCanDraw } from "../../actions/route_editor"
import { checkForExpiredToken, setStravaLoadingTrue } from "../../actions/strava_activity_import"
import { MaterialIndicator } from "react-native-indicators"

const mapDispatchToProps = dispatch => ({
  togglePositionMode: () => dispatch(togglePositionMode()),
  setShownIndex: payload => dispatch(setShownIndex(payload)),
  persistRoute: () => dispatch(persistRoute()),
  eraseRoute: () => dispatch(eraseRoute()),
  checkForExpiredToken: () => dispatch(checkForExpiredToken()),
  setCanDraw: payload => dispatch(setCanDraw(payload)),
  setStravaLoadingTrue: () => dispatch(setStravaLoadingTrue())
})

const mapStateToProps = state => ({
  stravaAccessToken: state.common.currentUser.stravaAccessToken,
  polylineEditor: state.routeEditor.polylineEditor,
  drawMode: state.routeEditor.drawMode,
  shownIndex: state.routeEditor.shownIndex,
  positionMode: state.routeEditor.positionMode,
  polylines: state.routeEditor.polylines,
  initialRegion: state.routeEditor.initialRegion,
  initialPolylineLength: state.routeEditor.initialPolylineLength,
  isDrawing: state.routeEditor.isDrawing,
  isSaving: state.routeEditor.isSaving,
  canDraw: state.routeEditor.canDraw
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
    this.props.setStravaLoadingTrue()
    this.props.navigation.navigate("StravaRouteSelector")
    this.props.checkForExpiredToken()
  }

  renderUndoButton() {
    if (this.dontRenderUndoButton()) return

    return (
      <View shadowColor="#323941" shadowOffset={{ width: 0, height: 0 }} shadowOpacity={0.5} shadowRadius={2}>
        <TouchableWithoutFeedback onPress={this.handleUndoPress}>
          <View style={styles.undoButton}>
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
          <View style={styles.redoButton}>
            <Ionicons name="ios-redo" size={25} color={"#323941"} />
          </View>
        </TouchableWithoutFeedback>
      </View>
    )
  }

  setCanDraw = () => {
    const { canDraw } = this.props
    this.props.setCanDraw(!canDraw)
  }

  isInitialRoute() {
    return this.props.polylines.length > this.props.initialPolylineLength
  }

  eraseRoute = async () => {
    this.props.eraseRoute()
  }

  renderDrawButton() {
    if (!this.props.drawMode) return

    const { canDraw } = this.props
    const buttonBackground = canDraw ? { backgroundColor: "#FF5423" } : {}
    const pencilColor = canDraw ? "white" : "#FF5423"

    return (
      <View shadowColor="#323941" shadowOffset={{ width: 0, height: 0 }} shadowOpacity={0.5} shadowRadius={2}>
        <TouchableWithoutFeedback onPress={this.setCanDraw}>
          <View style={[styles.drawButton, buttonBackground]}>
            <MaterialIcons name="edit" size={30} color={pencilColor} />
          </View>
        </TouchableWithoutFeedback>
      </View>
    )
  }

  renderCropButton() {
    return
    if (this.props.drawMode) return
    const { positionMode } = this.props
    const backgroundColor = positionMode ? "#3F88C5" : "white"
    const iconColor = positionMode ? "white" : "#3F88C5"

    return (
      <View shadowColor="#323941" shadowOffset={{ width: 0, height: 0 }} shadowOpacity={0.5} shadowRadius={2}>
        <TouchableWithoutFeedback onPress={this.props.togglePositionMode}>
          <View style={[styles.cropButton, { backgroundColor: backgroundColor }]}>
            <MaterialIcons name="crop-free" size={25} color={iconColor} />
          </View>
        </TouchableWithoutFeedback>
      </View>
    )
  }

  renderStravaCta() {
    if (!this.props.stravaAccessToken) return

    return (
      <View
        shadowColor="#323941"
        shadowOffset={{ width: 0, height: 0 }}
        shadowOpacity={0.5}
        shadowRadius={2}
        style={styles.stravaButtonContainer}>
        <TouchableWithoutFeedback onPress={this.loadStravaAndNavigate}>
          <View style={styles.stravaCtaInner}>
            <Text>S</Text>
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
        <View style={styles.container}>
          {this.renderUndoButton()}
          {this.renderRedoButton()}
          {this.renderDrawButton()}
        </View>
        <View style={[styles.mainAim, cropPosition]}>{this.renderCropButton()}</View>
        {this.renderStravaCta()}
      </React.Fragment>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    right: 20,
    top: 60,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end"
  },
  mainAim: {
    position: "absolute",
    right: 28,
    top: 120,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-end"
  },
  undoButton: {
    backgroundColor: "white",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 35,
    width: 35,
    borderRadius: "50%"
  },
  redoButton: {
    backgroundColor: "white",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 35,
    width: 35,
    borderRadius: "50%",
    marginLeft: 10
  },
  drawButton: {
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
  stravaCtaInner: {
    height: 35,
    width: 35,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    borderRadius: "50%"
  },
  cropButton: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 35,
    width: 35,
    borderRadius: "50%",
    marginBottom: 10
  },
  stravaButtonContainer: {
    position: "absolute",
    bottom: 100,
    right: 30
  }
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RouteEditorButtons)
