import React, { Component } from "react"
import { Text, TouchableWithoutFeedback, TextInput, StyleSheet, View, Image, Dimensions } from "react-native"

export default class BottomTabBar extends Component {
  constructor(props) {
    super(props)
  }

  renderIcon(route, idx) {
    const color = idx === 0 ? "black" : "gray"
    return <View style={{ width: 22, borderRadius: 2, marginBottom: 2, height: 22, backgroundColor: color }} />
  }

  renderText(route) {
    return (
      <View>
        <Text style={{ fontSize: 8, fontFamily: "overpass" }}>{`${route.key}`.toUpperCase()}</Text>
      </View>
    )
  }

  renderFloatingButton(route, idx) {
    return (
      <TouchableWithoutFeedback key={idx}>
        <View
          shadowColor="#000"
          shadowOffset={{ width: 0, height: 2 }}
          shadowOpacity={0.7}
          shadowRadius={2}
          style={{
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
          }}>
          <Text style={{ fontSize: 30, lineHeight: 32, fontWeight: "700" }}>+</Text>
        </View>
      </TouchableWithoutFeedback>
    )
  }

  renderStandardTab(route, idx) {
    return (
      <TouchableWithoutFeedback key={idx}>
        <View
          style={{ display: "flex", flexDirection: "column", justifyContent: "space-around", alignItems: "center" }}>
          {this.renderIcon(route, idx)}
          {this.renderText(route)}
        </View>
      </TouchableWithoutFeedback>
    )
  }

  renderTab(route, idx) {
    if (route.key === "Add") {
      return this.renderFloatingButton(route, idx)
    } else {
      return this.renderStandardTab(route, idx)
    }
  }

  render() {
    return (
      <View
        shadowColor="#000"
        shadowOffset={{ width: 0, height: 1 }}
        shadowOpacity={0.7}
        style={{
          height: 50,
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          width: Dimensions.get("window").width,
          position: "relative",
          alignItems: "center",
          paddingLeft: 15,
          paddingRight: 15, 
          backgroundColor: "white"
        }}>
        {this.props.navigation.state.routes.map((route, idx) => {
          return this.renderTab(route, idx)
        })}
      </View>
    )
  }
}
