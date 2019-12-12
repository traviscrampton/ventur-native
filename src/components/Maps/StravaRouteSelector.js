import React, { Component } from "react";
import {
  StyleSheet,
  ScrollView,
  View,
  TouchableWithoutFeedback,
  SafeAreaView,
  Text
} from "react-native";
import { connect } from "react-redux";
import {
  addToSelectedIds,
  removeFromSelectedIds,
  importStravaActivites
} from "../../actions/strava_activity_import";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Header } from "../editor/header";
import LoadingScreen from "../shared/LoadingScreen";

const mapDispatchToProps = dispatch => ({
  addToSelectedIds: payload => dispatch(addToSelectedIds(payload)),
  removeFromSelectedIds: payload => dispatch(removeFromSelectedIds(payload)),
  importStravaActivites: payload => dispatch(importStravaActivites(payload))
});

const mapStateToProps = state => ({
  activities: state.stravaActivityImport.activities,
  selectedIds: state.stravaActivityImport.selectedIds,
  stravaLoading: state.stravaActivityImport.stravaLoading,
  width: state.common.width
});

class StravaRouteSelector extends Component {
  constructor(props) {
    super(props);
  }

  handlePanelClick(activityId, isIncluded) {
    if (isIncluded) {
      this.props.removeFromSelectedIds(activityId);
    } else {
      this.props.addToSelectedIds(activityId);
    }
  }

  handleCancelButtonPress = () => {
    this.props.navigation.goBack();
  };

  handleDoneButtonPress = () => {
    this.props.importStravaActivites({ goBack: this.props.navigation.goBack });
  };

  renderHeader() {
    const headerProps = Object.assign(
      {},
      {
        goBackCta: "Cancel",
        handleGoBack: this.handleCancelButtonPress,
        centerCta: "",
        handleConfirm: this.handleDoneButtonPress,
        confirmCta: "Save"
      }
    );
    return <Header key="header" {...headerProps} />;
  }

  checkMarkColor(isIncluded) {
    return isIncluded ? "#82CA9C" : "lightgray";
  }

  renderShadowColor(isIncluded) {
    return isIncluded ? "black" : "gray";
  }

  renderActivity(activity) {
    let isIncluded = this.props.selectedIds.includes(activity.id);

    return (
      <TouchableWithoutFeedback
        key={activity.id}
        onPress={() => this.handlePanelClick(activity.id, isIncluded)}
      >
        <View
          style={styles.activityContainer}
          shadowColor={this.renderShadowColor(isIncluded)}
          shadowOffset={{ width: 0, height: 0 }}
          shadowOpacity={0.5}
          shadowRadius={2}
        >
          <View>
            <Text
              numberOfLines={1}
              style={[
                styles.activityInner,
                { maxWidth: this.props.width - 140 }
              ]}
            >
              {activity.name}
            </Text>
            <View style={styles.flexRow}>
              <MaterialCommunityIcons
                name="calendar"
                size={18}
                style={styles.iconMargin}
              />
              <Text style={styles.textStats}>
                {`${activity.date}`.toUpperCase()}
              </Text>
            </View>
            <View style={styles.flexRow}>
              <MaterialIcons
                style={styles.iconMargin}
                name="directions-bike"
                size={16}
              />
              <Text style={styles.textStats}>
                {`${activity.distance}`.toUpperCase()}
              </Text>
            </View>
          </View>
          <View>
            <MaterialCommunityIcons
              name={"check-circle-outline"}
              size={40}
              color={this.checkMarkColor(isIncluded)}
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  }

  renderStravaActivities() {
    return this.props.activities.map((activity, index) => {
      return this.renderActivity(activity);
    });
  }

  render() {
    if (this.props.stravaLoading) {
      return <LoadingScreen />;
    }

    return (
      <SafeAreaView style={styles.safeAreaView}>
        <View style={styles.hunnit}>
          {this.renderHeader()}
          <ScrollView style={styles.whitePadding}>
            {this.renderStravaActivities()}
          </ScrollView>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  iconMargin: {
    marginRight: 5
  },
  safeAreaView: {
    flex: 1,
    backgroundColor: "white"
  },
  whitePadding: {
    padding: 20,
    backgroundColor: "white"
  },
  activityContainer: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: "white",
    borderRadius: 5,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  hunnit: {
    backgroundColor: "white",
    height: "100%"
  },
  flexRow: {
    display: "flex",
    flexDirection: "row"
  },
  activityInner: {
    fontFamily: "open-sans-regular",
    color: "#323941",
    fontSize: 18,
    marginBottom: 10
  },
  textStats: {
    fontFamily: "overpass",
    fontSize: 14
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(StravaRouteSelector);
