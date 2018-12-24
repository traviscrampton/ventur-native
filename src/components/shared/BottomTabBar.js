import React, { Component } from "react"
import { connect } from "react-redux"
import { MaterialIcons, Feather, Ionicons, Entypo } from "@expo/vector-icons"
import { updateCurrentBottomTab } from "actions/common"
import { Text, TouchableWithoutFeedback, StyleSheet, View, Dimensions } from "react-native"


const mapStateToProps = state => ({
  hideToolbar: state.common.hideToolbar
})

const mapDispatchToProps = dispatch => ({
  updateCurrentBottomTab: payload => dispatch(updateCurrentBottomTab(payload))
})

class BottomTabBar extends Component {
  constructor(props) {
    super(props)
    this.navigateToRoute = this.navigateToRoute.bind(this)
  }

  renderIcon(route, idx) {
    const color = idx === this.props.navigation.state.index ? "black" : "gray"
    switch (route.key) {
      case "Explore":
        return <MaterialIcons name="explore" color={color} size={30} />
      case "Profile":
        return <Feather name="user" color={color} size={30} />
      case "My Trips":
        return <Ionicons name="ios-bicycle" color={color} size={30} />
      case "Gear":
        return <Entypo name="tools" color={color} size={30} />
    }
  }

  renderText(route) {
    return (
      <View>
        <Text style={styles.iconText}>{`${route.key}`.toUpperCase()}</Text>
      </View>
    )
  }

  navigateToRoute(route) {
    this.props.updateCurrentBottomTab(route.key)
    this.props.navigation.navigate(route.key)
  }

  renderStandardTab(route, idx) {
    return (
      <TouchableWithoutFeedback key={idx} onPress={() => this.navigateToRoute(route)}>
        <View style={styles.standardTab}>
          {this.renderIcon(route, idx)}
          {this.renderText(route)}
        </View>
      </TouchableWithoutFeedback>
    )
  }

  dontRenderToolbar() {
    return this.props.hideToolbar
  }

  renderToolbar() {
    return (
      <View shadowColor="#d3d3d3" shadowOffset={{ width: 0, height: 1 }} shadowOpacity={0.7} style={styles.outerContainer}>
        <View style={styles.innerContainer}>
          {this.props.navigation.state.routes.map((route, idx) => {
            return this.renderStandardTab(route, idx)
          })}
        </View>
      </View>
    )
  }

  render() {
    return this.renderToolbar()
  }
}

const styles = StyleSheet.create({
  outerContainer: {
    height: 50,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    backgroundColor: "white"
  },
  innerContainer: {
    maxWidth: 450,
    height: 50,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    width: Dimensions.get("window").width,
    position: "relative",
    alignItems: "center",
    paddingLeft: 25,
    paddingRight: 25
  },
  standardTab: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-around",
    alignItems: "center"
  },
  containerFiller: {
    width: 22,
    borderRadius: 2,
    marginBottom: 2,
    height: 22
  },
  iconText: {
    fontSize: 8,
    fontFamily: "overpass"
  },
  floatingButton: {
    width: 50,
    borderRadius: 50,
    height: 50,
    position: "relative",
    top: -20,
    backgroundColor: "white",
    zIndex: 10,
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  }
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BottomTabBar)
