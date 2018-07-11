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
import Markdown from "react-native-markdown-renderer"

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

    let editableEntry = this.props.entries[index]

    const entry = { ...editableEntry, content: content }
    const blob = this.compileMarkdownBlob()

    payload = Object.assign({}, { entry, index, blob })
    this.props.editText(payload)
  }

  handleReturnKey(e, index) {
    e.preventDefault()
    const newEntry = {
      content: "",
      styles: { ...this.props.activeAttributes }
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

  getStyling() {
    return {
      fontWeight: "600"
    }
  }

  renderTextStuff() {
    return (
      <Text>
        Hello good <Text style={this.getStyling()}>world</Text>
      </Text>
    )
  }
  handleOnSelectionChange({
    nativeEvent: {
      selection: { start, end }
    }
  }) {
    console.log("START", start)
    console.log("end", end)
  }

  entryStuff(entry, index) {
    return <Text>{entry.content}</Text>
  }

  handleContentSize({
    nativeEvent: {
      contentSize: { width, height }
    }
  }) {
    console.log("WIDTH", width)
    console.log("HEIGHT", height)
  }

  render() {
    return (
      <ScrollView>
        <View style={{ marginTop: 50 }}>
          <View>
            {this.props.entries.map((entry, index) => {
              return (
                <TextInput
                  key={index}
                  autoFocus={true}
                  ref={`textInput${index}`}
                  style={[
                    {
                      marginBottom: 5,
                      paddingLeft: 5,
                      paddingRight: 5,
                      fontSize: 20
                    },
                    entry.styles
                  ]}
                  onKeyPress={e => this.handleKeyPress(e, index)}
                  onChangeText={text => this.handleTextChange(text, index)}
                  // onSubmitEditing={e => this.handleReturnKey(e, index)}
                  multiline
                  value={entry.content}
                  onSelectionChange={this.handleOnSelectionChange}
                />
              )
            })}
          </View>
          <View style={{ marginTop: 100 }}>
            <Text style={{ marginBottom: 20 }}>Editor Styles</Text>
            <TouchableWithoutFeedback onPress={() => this.props.updateFormatBar({ fontWeight: "700", fontSize: 35 })}>
              <View style={{ marginLeft: 10, marginBottom: 10 }}>
                <Text style={{ fontSize: 20 }}>BOLD</Text>
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
