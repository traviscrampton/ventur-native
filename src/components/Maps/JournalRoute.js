import React, { Component } from "react"
import _ from "lodash"
import { StyleSheet, View, TouchableWithoutFeedback, Dimensions, Text } from "react-native"
import { connect } from "react-redux"
import { MapView } from "expo"
import { Ionicons, MaterialIcons } from "@expo/vector-icons"
import { MaterialIndicator } from "react-native-indicators"
import {
  updateRegionCoordinates,
  togglePositionMode,
  persistCoordinates,
  defaultRouteEditor
} from "actions/route_editor"
import { defaultJournalRoute } from "actions/journal_route"
import LoadingScreen from "components/shared/LoadingScreen"

const mapDispatchToProps = dispatch => ({
  defaultJournalRoute: () => dispatch(defaultJournalRoute()),
  updateRegionCoordinates: payload => dispatch(updateRegionCoordinates(payload)),
  togglePositionMode: () => dispatch(togglePositionMode()),
  persistCoordinates: () => dispatch(persistCoordinates()),
  defaultRouteEditor: () => dispatch(defaultRouteEditor())
})

const mapStateToProps = state => ({
  polylines: state.journalRoute.polylines,
  initialRegion: state.journalRoute.initialRegion,
  editorInitialRegion: state.routeEditor.initialRegion,
  isLoading: state.common.isLoading,
  positionMode: state.routeEditor.positionMode,
  changedRegion: state.routeEditor.changedRegion,
  isSaving: state.routeEditor.isSaving,
  currentUser: state.common.currentUser,
  journalUser: state.journal.journal.user
})

class JournalRoute extends Component {
  constructor(props) {
    super(props)
  }

  navigateBack = () => {
    this.props.defaultJournalRoute()
    this.props.defaultRouteEditor()
    this.props.navigation.goBack()
  }

  isCurrentUser() {
    return this.props.currentUser.id == this.props.journalUser.id
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
        <TouchableWithoutFeedback onPress={this.navigateBack}>
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
            <Ionicons name="ios-arrow-back" color={"#323941"} size={30} />
          </View>
        </TouchableWithoutFeedback>
      </View>
    )
  }

  renderCropButton() {
    if (!this.isCurrentUser()) return

    const { positionMode } = this.props
    const backgroundColor = positionMode ? "#067BC2" : "white"
    const iconColor = positionMode ? "white" : "#067BC2"

    return (
      <View style={{ position: "absolute", top: 60, right: 30 }}>
        <TouchableWithoutFeedback onPress={this.props.togglePositionMode}>
          <View
            shadowColor="#323941"
            shadowOffset={{ width: 0, height: 0 }}
            shadowOpacity={0.5}
            shadowRadius={2}
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

  async handleRegionChange(coordinates) {
    if (!this.props.positionMode || !this.isCurrentUser()) return

    this.props.updateRegionCoordinates(coordinates)
  }

  isChangedRegionDifferent() {
    return JSON.stringify(this.props.editorInitialRegion) === JSON.stringify(this.props.changedRegion)
  }

  renderSavingButton() {
    if (!this.props.positionMode || !this.isCurrentUser()) return
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

  renderPolylines() {
    return this.props.polylines.map((polylines, index) => {
      return polylines.map((coordinates, index) => {
        return (
          <MapView.Polyline style={{ zIndex: 10 }} coordinates={coordinates} strokeWidth={2} strokeColor="#FF8C34" />
        )
      })
    })
  }

  render() {
    if (this.props.isLoading) {
      return <LoadingScreen />
    }

    return (
      <View style={{ position: "relative", flex: 1 }}>
        <View style={{ flex: 1 }}>
          <MapView
            style={{ flex: 1, zIndex: -1 }}
            onRegionChangeComplete={e => this.handleRegionChange(e)}
            initialRegion={this.props.initialRegion}>
            {this.renderPolylines()}
          </MapView>
        </View>
        {this.renderFloatingBackButton()}
        {this.renderCropButton()}
        {this.renderSavingButton()}
      </View>
    )
  }
}

const styles = StyleSheet.create({})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(JournalRoute)
