import React, { Component } from "react"
import { StyleSheet, View, Text, Switch, TouchableWithoutFeedback } from "react-native"
import { MaterialIcons } from "@expo/vector-icons"
import { connect } from "react-redux"

const mapStateToProps = state => ({})

const mapDispatchToProps = dispatch => ({})

class ChapterUserForm extends Component {
  constructor(props) {
    super(props)
  }

  stylePosition() {
    let styles = Object.assign(
      {},
      {
        position: "absolute",
        borderRadius: 4,
        right: 20,
        zIndex: 100,
        width: 250,
        backgroundColor: "#323941"
      }
    )

    if (this.props.menuPosition === "below") {
      styles["top"] = 50
    } else {
      styles["bottom"] = 50
    }

    return styles
  }

  handleOptionCallback = option => {
    if (option.closeMenuOnClick) {
      this.props.toggleUserMenuOpen()
    }

    option.callback()
  }

  renderTouchableOption(option, index) {
    return (
      <TouchableWithoutFeedback onPress={() => this.handleOptionCallback(option)} key={option.title}>
        <View style={{ display: "flex", flexDirection: "row", alignItems: "center", height: 40, paddingLeft: 10 }}>
          <MaterialIcons name={option.iconName} style={{ marginRight: 10 }} color={"white"} size={16} />
          <Text style={{ color: "white", fontSize: 16 }}>{option.title}</Text>
        </View>
      </TouchableWithoutFeedback>
    )
  }

  renderSwitchOption(option, index) {
    return (
      <View
        key={option.title}
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          height: 40,
          paddingLeft: 10,
          paddingRight: 10,
          justifyContent: "space-between"
        }}>
        <View style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
          <MaterialIcons name={option.iconName} style={{ marginRight: 10 }} color={"white"} size={16} />
          <Text style={{ color: "white", fontSize: 16 }}>{option.title}</Text>
        </View>
        <Switch
          value={option.value}
          style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
          onValueChange={option.callback}
        />
      </View>
    )
  }

  dispatchOption(option, index) {
    switch (option.type) {
      case "touchable":
        return this.renderTouchableOption(option, index)
      case "switch":
        return this.renderSwitchOption(option, index)
      default:
        console.log("what option is this")
    }
  }

  renderChapterOptions() {
    return this.props.options.map((option, index) => {
      return this.dispatchOption(option, index)
    })
  }

  render() {
    return (
      <View
        shadowColor="gray"
        shadowOffset={{ width: 2, height: 2 }}
        shadowOpacity={0.5}
        shadowRadius={2}
        style={this.stylePosition()}>
        {this.renderChapterOptions()}
      </View>
    )
  }
}

const styles = StyleSheet.create({})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ChapterUserForm)
