import React, { Component } from "react"
import _ from "lodash"
import { StyleSheet, View, TouchableWithoutFeedback, Dimensions, Text } from "react-native"
import { connect } from "react-redux"
import { MapView } from "expo"
import { Ionicons, MaterialIcons } from "@expo/vector-icons"
import { MaterialIndicator } from "react-native-indicators"
import { defaultRouteViewer } from "actions/route_viewer"
import LoadingScreen from "components/shared/LoadingScreen"

const mapDispatchToProps = dispatch => ({
  defaultRouteViewer: () => dispatch(defaultRouteViewer())
})

const mapStateToProps = state => ({
  polylines: state.routeViewer.polylines,
  initialRegion: state.routeViewer.initialRegion,
  isLoading: state.common.isLoading
})

class RouteViewer extends Component {
  constructor(props) {
    super(props)
  }

  navigateBack = () => {
    this.props.defaultRouteViewer()
    this.props.navigation.goBack()
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
      return <LoadingScreen />
    }

    return (
      <View style={{ position: "relative", flex: 1 }}>
        <View style={{ flex: 1 }}>
          <MapView style={{ flex: 1, zIndex: -1 }} initialRegion={this.props.initialRegion}>
            {this.renderPolylines()}
          </MapView>
        </View>
        {this.renderFloatingBackButton()}
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
)(RouteViewer)
