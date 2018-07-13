import React, { Component } from "react"
import { connect } from "react-redux"
import { UPDATE_FORMAT_BAR, EDIT_TEXT } from "actions/action_types"
import { Text, FlatList, TouchableWithoutFeedback, StyleSheet, View } from "react-native"

const mapStateToProps = state => ({
  toolbarOptions: state.editor.toolbarOptions,
  activeAttribute: state.editor.activeAttribute,
  focusedEntryIndex: state.editor.focusedEntryIndex,
  entries: state.editor.entries
})

const mapDispatchToProps = dispatch => ({
  updateFormatBar: payload => {
    dispatch({ type: UPDATE_FORMAT_BAR, payload })
  },

  editText: payload => {
    dispatch({ type: EDIT_TEXT, payload })
  }
})

class EditorToolbar extends Component {
  handleOnPress(option) {
    let entry = { ...this.props.entries[this.props.focusedEntryIndex], styles: option }
    let payload = { entry: entry, index: this.props.focusedEntryIndex }
    this.props.updateFormatBar(option)
    this.props.editText(payload)
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
        backgroundColor: "green",
        color: "white"
      }
    }
  }

  render() {
    return this.props.toolbarOptions.map((option, index) => {
      return (
        <TouchableWithoutFeedback key={index} onPress={() => this.handleOnPress(option)}>
          {this.renderToolbarOption(option)}
        </TouchableWithoutFeedback>
      )
    })
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EditorToolbar)

// <View>
//   <TouchableWithoutFeedback onPress={() => this.handleOnPress("H1")}>
//     <View>
//       <Text style={[styles.option, this.isSelectedStyle("H1")]}>{"H1"}</Text>
//     </View>
//   </TouchableWithoutFeedback>
//   <TouchableWithoutFeedback onPress={() => this.handleOnPress("H2")}>
//     <View>
//       <Text style={[styles.option, this.isSelectedStyle("H2")]}>{"H2"}</Text>
//     </View>
//   </TouchableWithoutFeedback>
// </View>
const styles = StyleSheet.create({
  toolbarContainer: {
    marginTop: 20
  },
  option: {
    borderWidth: 1,
    borderColor: "green",
    fontSize: 20,
    marginRight: 5
  }
})
