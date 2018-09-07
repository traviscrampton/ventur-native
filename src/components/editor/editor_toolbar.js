import React, { Component } from "react"
import { connect } from "react-redux"
import { updateFormatBar, editEntry } from "actions/editor"
import { Text, TouchableWithoutFeedback, StyleSheet, View } from "react-native"
import { MaterialIcons, Entypo } from "@expo/vector-icons"

const mapStateToProps = state => ({
  toolbarOptions: state.editor.toolbarOptions,
  activeAttribute: state.editor.activeAttribute,
  activeIndex: state.editor.activeIndex,
  entries: state.editor.entries,
  keyboardShowing: state.editor.keyboardShowing
})

const mapDispatchToProps = dispatch => ({
  updateFormatBar: payload => dispatch(updateFormatBar(payload)),
  editEntry: payload => dispatch(editEntry(payload))
})

class EditorToolbar extends Component {
  handleOnPress(option) {
    let styling = this.getProperStyling(option)
    let entry = { ...this.props.entries[this.props.activeIndex], styles: styling }
    let payload = { entry: entry, index: this.props.activeIndex }
    this.props.updateFormatBar(styling)
    this.props.editEntry(payload)
  }

  getProperStyling(option) {
    if (this.props.entries[this.props.activeIndex].styles === option) {
      return ""
    } else {
      return option
    }
  }

  renderToolbarOption(option) {
    return (
      <View>
        <Text style={[styles.option, this.isSelectedStyle(option)]}>{this.get_icon(option)}</Text>
      </View>
    )
  }

  get_icon(option) {
    if (option === "H1") {
      return <MaterialIcons color={this.isSelectedStyle(option)} name="text-fields" size={24} />
    } else if (option === "QUOTE") {
      return <Entypo name={"quote"} size={24} color={this.isSelectedStyle(option)} />
    } else {
      return <Entypo name={"text"} size={24} color={this.isSelectedStyle(option)} />
    }
  }

  isSelectedStyle(option) {
    if (this.props.activeAttribute === option) {
      return "#CF5300"
    } else {
      return "black"
    }
  }

  handleManageContentPress() {}

  renderTextStyler() {
    return this.props.toolbarOptions.map((option, index) => {
      return (
        <TouchableWithoutFeedback key={index} style={styles.option} onPress={() => this.handleOnPress(option)}>
          {this.renderToolbarOption(option)}
        </TouchableWithoutFeedback>
      )
    })
  }

  renderManageContent() {
    return (
      <TouchableWithoutFeedback onPress={this.props.openManageContent}>
        <View>
          <Text style={styles.option}>MANAGE CONTENT</Text>
        </View>
      </TouchableWithoutFeedback>
    )
  }

  renderToolbar() {
    if (this.props.keyboardShowing) {
      return this.renderTextStyler()
    } else {
      return this.renderManageContent()
    }
  }

  render() {
    return <View style={styles.toolbarContainer}>{this.renderToolbar()}</View>
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EditorToolbar)

const styles = StyleSheet.create({
  toolbarContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    // backgroundColor: "white",
    paddingTop: 5,
    paddingBottom: 5,
    backgroundColor: "#efefef",
    height: 40,
    // shadowColor: "#d3d3d3",
    // shadowOffset: {
    //   width: 0,
    //   height: 3
    // },
    // shadowRadius: 5,
    // shadowOpacity: 1.0
  },
  option: {
    fontSize: 20,
    fontWeight: "500",
    minWidth: 80,
    textAlign: "center"
  }
})
