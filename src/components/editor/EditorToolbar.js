import React, { Component } from "react"
import { connect } from "react-redux"
import { updateFormatBar, editEntry } from "actions/editor"
import { Text, TouchableWithoutFeedback, StyleSheet, View } from "react-native"
import { MaterialIcons, Entypo, EvilIcons } from "@expo/vector-icons"

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
        <Text style={[styles.option, this.isSelectedStyle(option)]}>{this.getIcon(option)}</Text>
      </View>
    )
  }

  getIcon(option) {
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
        <View style={{ textAlign: "center" }}>
          <Text style={{ fontSize: 18 }}>MANAGE CONTENT</Text>
        </View>
      </TouchableWithoutFeedback>
    )
  }

  renderAddImageCta() {
    return (
      <TouchableWithoutFeedback onPress={this.props.openCameraRoll}>
        <Entypo name="image" size={27} color={"black"} />
      </TouchableWithoutFeedback>
    )
  }

  dispatchRender() {
    if (this.props.keyboardShowing) {
      return (
        <React.Fragment>
          <View style={styles.textEditButtons}>{this.renderTextStyler()}</View>
          <View>{this.renderAddImageCta()}</View>
        </React.Fragment>
      )
    } else {
      return this.renderManageContent()
    }
  }

  render() {
    return <View style={styles.toolbarContainer}>{this.dispatchRender()}</View>
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
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 20,
    paddingRight: 20,
    backgroundColor: "#efefef",
    height: 40
  },
  textEditButtons: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  option: {
    fontSize: 20,
    fontWeight: "500",
    minWidth: 50,
    textAlign: "left"
  }
})
