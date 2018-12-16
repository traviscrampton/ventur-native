import React, { Component } from "react"
import { StyleSheet, View, Text, Image, Dimensions, Switch, TouchableWithoutFeedback } from "react-native"
import { connect } from "react-redux"
import { updateChapterForm } from "actions/chapter_form"
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons"

const mapStateToProps = state => ({})

const mapDispatchToProps = dispatch => ({})

class ChapterUserForm extends Component {
  constructor(props) {
    super(props)
  }

  renderTouchableOption(option, index) {
    return (
      <TouchableWithoutFeedback onPress={option.callback} key={option.title}>
        <View style={{ display: "flex", flexDirection: "row", alignItems: "center", height: 40, paddingLeft: 10 }}>
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
        <Text style={{ color: "white", fontSize: 16 }}>{option.title}</Text>
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
        style={[{
                  position: "absolute",
                  top: 60,
                  borderRadius: 4,
                  right: 20,
                  zIndex: 10,
                  width: 250,
                  backgroundColor: "black",
                  opacity: 0.85
                }, this.props.styles]}>
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
