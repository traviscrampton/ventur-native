import React, { Component } from "react"
import { connect } from "react-redux"
import { createNewTextEntry, updateActiveCreator } from "actions/editor"
import { Text, TouchableWithoutFeedback, StyleSheet, View } from "react-native"

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
      styles: "",
      type: "text"
    }

    let payload = { newEntry: entry, newIndex: index }
    this.props.createNewTextEntry(payload)
    this.props.updateActiveCreator(null)
  }

  renderOptionState() {
    return (
      <View style={styles.optionState}>
        <TouchableWithoutFeedback onPress={() => this.createNewEntry(this.props.index + 1)}>
          <View style={styles.optionContainer}>
            <Text style={styles.grayText}>Add Text</Text>
          </View>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback onPress={this.props.openCameraRoll}>
          <View style={styles.optionContainer}>
            <Text style={styles.grayText}>Add Image</Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
    )
  }

  renderInitialState() {
    return (
      <TouchableWithoutFeedback onPress={() => this.props.updateActiveCreator(this.props.index)}>
        <View style={styles.initialState} />
      </TouchableWithoutFeedback>
    )
  }

  renderOrHidden() {
    return this.renderOptionState()
  }

  render() {
    if (this.props.activeContentCreator === this.props.index) {
      return this.renderOrHidden()
    } else {
      return this.renderInitialState()
    }
  }
}

const styles = StyleSheet.create({
  initialState: {
    paddingTop: 10,
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 10,
    backgroundColor: "white",
    height: 50
  },
  optionState: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingLeft: 50,
    paddingRight: 50,
    height: 50
  },
  optionContainer: {
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: "white"
  },
  grayText: {
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: "white"
  }
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ContentCreator)
