import React, { Component } from "react"
import { connect } from "react-redux"
import { createNewTextEntry, updateActiveCreator } from "actions/editor"
import { Text, FlatList, TouchableWithoutFeedback, StyleSheet, View } from "react-native"

const mapStateToProps = state => ({
  activeContentCreator: state.editor.activeContentCreator
})

const mapDispatchToProps = dispatch => ({
  createNewTextEntry: payload => dispatch(createNewTextEntry(payload)),
  updateActiveCreator: payload => dispatch(updateActiveCreator(payload))
})
class ContentCreator extends Component {
  constructor(props) {
    super(props)
  }
  createNewEntry(index) {
    let entry = {
      content: "",
      styles: ""
    }

    let payload = { newEntry: entry, newIndex: index }
    this.props.createNewTextEntry(payload)
    this.props.updateActiveCreator(null)
  }

  renderOptionState() {
    return (
      <View style={{ display: "flex", flexDirection: "row" }}>
        <TouchableWithoutFeedback onPress={() => this.createNewEntry(this.props.index + 1)}>
          <View style={{ paddingTop: 10, paddingBottom: 10, backgroundColor: "blue" }}>
            <Text style={{ color: "white" }}>Add Text</Text>
          </View>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback>
          <View style={{ paddingTop: 10, paddingBottom: 10, backgroundColor: "blue" }}>
            <Text style={{ color: "white" }}>Add Image</Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
    )
  }

  renderInitialState() {
    return (
      <TouchableWithoutFeedback onPress={() => this.props.updateActiveCreator(this.props.index)}>
        <View style={{ paddingTop: 10, paddingBottom: 10, backgroundColor: "blue" }}>
          <Text style={{ color: "white" }}>+ ADD CONTENT</Text>
        </View>
      </TouchableWithoutFeedback>
    )
  }

  renderOrHidden() {
    return this.renderOptionState()
  }

  renderProperCreator() {
    if (this.props.activeContentCreator === this.props.index) {
      return this.renderOrHidden()
    } else {
      return this.renderInitialState()
    }
  }

  render() {
    return this.renderProperCreator()
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ContentCreator)
