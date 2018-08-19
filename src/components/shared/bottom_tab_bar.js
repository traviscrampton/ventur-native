import React, { Component } from "react"
import { Feather } from "@expo/vector-icons"
import { Text, TouchableWithoutFeedback, TextInput, StyleSheet, View, Image, Dimensions } from "react-native"
import ContentCreate from "components/modals/content_create"

export default class BottomTabBar extends Component {
  constructor(props) {
    super(props)
    this.navigateToRoute = this.navigateToRoute.bind(this)
    this.toggleModal = this.toggleModal.bind(this)

    this.state = {
      showModal: false
    }
  }

  renderIcon(route, idx) {
    const color = idx === this.props.navigation.state.index ? "black" : "gray"
    return <View style={{ width: 22, borderRadius: 2, marginBottom: 2, height: 22, backgroundColor: color }} />
  }

  renderText(route) {
    return (
      <View>
        <Text style={{ fontSize: 8, fontFamily: "overpass" }}>{`${route.key}`.toUpperCase()}</Text>
      </View>
    )
  }

  navigateToRoute(route) {
    this.props.navigation.navigate(route.key)
  }

  toggleModal(bool) {
    this.setState({ showModal: bool })
  }

  renderFloatingButton(route, idx) {
    return (
      <TouchableWithoutFeedback key={idx} onPress={() => this.toggleModal(true)}>
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
          <Feather name="plus" size={32} color="black" />
        </View>
      </TouchableWithoutFeedback>
    )
  }

  renderStandardTab(route, idx) {
    return (
      <TouchableWithoutFeedback key={idx} onPress={() => this.navigateToRoute(route)}>
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

  renderToolbar() {
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

  exitModal() {}

  renderCreateModal() {
    if (!this.state.showModal) return
    return <ContentCreate exitModal={() => this.toggleModal(false)} navigation={this.props.navigation} />
  }

  render() {
    return (
      <React.Fragment>
        {this.renderToolbar()}
        {this.renderCreateModal()}
      </React.Fragment>
    )
  }
}
