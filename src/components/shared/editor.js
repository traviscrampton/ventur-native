import React, { Component } from "react"
import {
  StyleSheet,
  FlatList,
  View,
  Text,
  TextInput,
  ScrollView,
  Image,
  Dimensions,
  TouchableWithoutFeedback
} from "react-native"
import { connect } from "react-redux"
import { EDIT_TEXT, UPDATE_FORMAT_BAR, CREATE_NEW_ENTRY, DELETE_ENTRY } from "actions/action_types"
import { MarkdownRender } from "components/shared/markdown_render"

const mapStateToProps = state => ({
  entries: state.editor.entries,
  blob: state.editor.blob,
  activeAttributes: state.editor.activeAttributes
})

const mapDispatchToProps = dispatch => ({
  updateFormatBar: payload => {
    dispatch({ type: UPDATE_FORMAT_BAR, payload })
  },

  editText: payload => {
    dispatch({ type: EDIT_TEXT, payload })
  },

  createNewEntry: payload => {
    dispatch({ type: CREATE_NEW_ENTRY, payload })
  },

  deleteEntry: payload => {
    dispatch({ type: DELETE_ENTRY, payload })
  }
})

class Editor extends Component {
  constructor(props) {
    super(props)

    this.addAttribute = this.addAttribute.bind(this)
    this.handleKeyPress = this.handleKeyPress.bind(this)
    this.handleReturnKey = this.handleReturnKey.bind(this)
  }

  handleTextChange(content, index) {
    let payload
    const entry = {
      markdown: this.props.activeAttributes,
      content: content
    }
    const blob = this.compileMarkdownBlob()

    payload = Object.assign({}, { entry, index, blob })
    this.props.editText(payload)
  }

  handleReturnKey(index) {
    const newEntry = {
      markdown: "",
      content: ""
    }

    let payload = Object.assign({}, { newEntry: newEntry, newIndex: index + 1 })

    this.props.createNewEntry(payload)
  }

  handleKeyPress(
    {
      nativeEvent: { key: keyValue }
    },
    index
  ) {
    if (index === 0) {
      return
    }

    const activeText = this.props.entries[index].content

    if (keyValue === "Backspace" && activeText.length === 0) {
      const keyName = `textInput${index - 1}`
      this.refs[keyName].focus()
      this.props.deleteEntry(index)
    }
  }

  compileMarkdownBlob() {
    let markdownBlob = ``
    if (!this.props.entries) {
      return " "
    }
    for (let entry of this.props.entries) {
      markdownBlob += `${entry.markdown} ${entry.content} \n`
    }
    return markdownBlob
  }

  addAttribute(attribute) {
    this.props.updateFormatBar(attribute)
  }

  render() {
    return (
      <ScrollView>
        <View style={{ marginTop: 50 }}>
          {this.props.entries.map((entry, index) => {
            return (
              <TextInput
                key={index}
                autoFocus={true}
                ref={`textInput${index}`}
                style={{ height: 40, marginBottom: 5, paddingLeft: 5, paddingRight: 5, fontSize: 20 }}
                onKeyPress={e => this.handleKeyPress(e, index)}
                onChangeText={text => this.handleTextChange(text, index)}
                value={entry.content}
                onSubmitEditing={() => this.handleReturnKey(index)}
              />
            )
          })}
          <MarkdownRender content={this.props.blob} />
          <View style={{ marginTop: 100 }}>
            <Text style={{ marginBottom: 20 }}>Editor Styles</Text>
            <TouchableWithoutFeedback onPress={() => this.props.updateFormatBar("#")}>
              <View style={{ marginLeft: 10, marginBottom: 10 }}>
                <Text style={{ fontSize: 20 }}>H1</Text>
              </View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback onPress={() => this.props.updateFormatBar("##")}>
              <View style={{ marginLeft: 10, marginBottom: 10 }}>
                <Text style={{ fontSize: 20 }}>H2</Text>
              </View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback onPress={() => this.props.updateFormatBar(">")}>
              <View style={{ marginLeft: 10, marginBottom: 10 }}>
                <Text style={{ fontSize: 20 }}>BQ</Text>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </View>
      </ScrollView>
    )
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Editor)
