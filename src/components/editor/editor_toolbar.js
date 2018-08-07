import React, { Component } from "react"
import { connect } from "react-redux"
import { UPDATE_FORMAT_BAR, EDIT_TEXT } from "actions/action_types"
import {updateFormatBar, editEntry} from "actions/editor"
import { Text, FlatList, TouchableWithoutFeedback, StyleSheet, View, Dimensions } from "react-native"

const mapStateToProps = state => ({
  toolbarOptions: state.editor.toolbarOptions,
  activeAttribute: state.editor.activeAttribute,
  activeIndex: state.editor.activeIndex,
  entries: state.editor.entries
})

const mapDispatchToProps = dispatch => ({
  updateFormatBar: payload => dispatch(updateFormatBar(payload)),
  editEntry: payload => dispatch(editEntry(payload)),
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
        <Text style={[styles.option, this.isSelectedStyle(option)]}>{option}</Text>
      </View>
    )
  }

  isSelectedStyle(option) {
    if (this.props.activeAttribute === option) {
      return {
        backgroundColor: "white",
        color: "green"
      }
    }
  }

  renderToolbar() {
    return this.props.toolbarOptions.map((option, index) => {
      return (
        <TouchableWithoutFeedback key={index} style={styles.option} onPress={() => this.handleOnPress(option)}>
          {this.renderToolbarOption(option)}
        </TouchableWithoutFeedback>
      )
    })
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
    backgroundColor: "white",
    borderWidth: 1, 
    paddingTop: 5, 
    paddingBottom: 5,
    borderColor: "green"
  },
  option: {
    fontSize: 20,
    fontWeight: "500",
    minWidth: 80
  }
})
