import React, { Component } from "react"
import _ from "lodash"
import { StyleSheet, ScrollView, View, TouchableWithoutFeedback, Dimensions, Text } from "react-native"
import { connect } from "react-redux"
import { MapView } from "expo"
import { MaterialIndicator } from "react-native-indicators"
import { addToSelectedIds, removeFromSelectedIds } from "../../actions/strava_activity_import"
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons"

const mapDispatchToProps = dispatch => ({
  addToSelectedIds: payload => dispatch(addToSelectedIds(payload)),
  removeFromSelectedIds: payload => dispatch(removeFromSelectedIds(payload))
})

const mapStateToProps = state => ({
  activities: state.stravaActivityImport.activities,
  selectedIds: state.stravaActivityImport.selectedIds
})

class StravaRouteSelector extends Component {
  constructor(props) {
    super(props)
  }

  handlePanelClick(activityId, isIncluded) {
    if (isIncluded) {
      this.props.removeFromSelectedIds(activityId)
    } else {
      this.props.addToSelectedIds(activityId)
    }
  }

  checkMarkColor(isIncluded) {
    return isIncluded ? "#82CA9C" : "lightgray"
  }

  renderShadowColor(isIncluded) {
    return isIncluded ? "black" : "gray"
  }

  renderActivity(activity) {
    let isIncluded = this.props.selectedIds.includes(activity.id)

    return (
      <TouchableWithoutFeedback key={activity.id} onPress={() => this.handlePanelClick(activity.id, isIncluded)}>
        <View
          style={{
            marginBottom: 20,
            padding: 10,
            backgroundColor: "white",
            borderRadius: 5,
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center"
          }}
          shadowColor={this.renderShadowColor(isIncluded)}
          shadowOffset={{ width: 0, height: 0 }}
          shadowOpacity={0.5}
          shadowRadius={2}>
          <View>
            <Text
              numberOfLines={1}
              style={{
                maxWidth: Dimensions.get("window").width - 140,
                fontFamily: "open-sans-regular",
                color: "#323941",
                fontSize: 18,
                marginBottom: 10
              }}>
              {activity.name}
            </Text>
            <View style={{ display: "flex", flexDirection: "row" }}>
              <MaterialCommunityIcons name="calendar" size={18} style={styles.iconMargin} />
              <Text style={styles.textStats}>{`${activity.date}`.toUpperCase()}</Text>
            </View>
            <View style={{ display: "flex", flexDirection: "row" }}>
              <MaterialIcons style={styles.iconMargin} name="directions-bike" size={16} />
              <Text style={styles.textStats}>{`${activity.distance}`.toUpperCase()}</Text>
            </View>
          </View>
          <View>
            <MaterialCommunityIcons name={"check-circle-outline"} size={40} color={this.checkMarkColor(isIncluded)} />
          </View>
        </View>
      </TouchableWithoutFeedback>
    )
  }

  renderStravaActivities() {
    return this.props.activities.map((activity, index) => {
      return this.renderActivity(activity)
    })
  }

  render() {
    return <ScrollView style={{ padding: 20, backgroundColor: "white" }}>{this.renderStravaActivities()}</ScrollView>
  }
}

const styles = StyleSheet.create({
  iconMargin: {
    marginRight: 5
  },
  textStats: {
    fontFamily: "overpass",
    fontSize: 14
  }
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(StravaRouteSelector)
