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
import { EDIT_TEXT, UPDATE_FORMAT_BAR, CREATE_NEW_ENTRY, DELETE_ENTRY, UPDATE_ENTRY_FOCUS } from "actions/action_types"
import Markdown from "react-native-markdown-renderer"
import EditorToolbar from "components/editor/editor_toolbar"

const mapStateToProps = state => ({
  entries: state.editor.entries,
  blob: state.editor.blob,
  activeAttribute: state.editor.activeAttribute
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
  },

  updateEntryFocus: payload => {
    dispatch({ type: UPDATE_ENTRY_FOCUS, payload })
  }
})

class Editor extends Component {
  constructor(props) {
    super(props)

    this.handleKeyPress = this.handleKeyPress.bind(this)
    this.handleReturnKey = this.handleReturnKey.bind(this)
  }

  handleTextChange(content, index) {
    let payload

    let editableEntry = this.props.entries[index]

    const entry = { ...editableEntry, content: content }

    payload = Object.assign({}, { entry, index })
    this.props.editText(payload)
  }

  handleReturnKey(e, index) {
    const newEntry = {
      content: "",
      styles: this.props.activeAttribute
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

  getInputStyling(entry) {
    switch (entry.styles) {
      case "H1":
        return { fontWeight: "700", fontSize: 32 }
      case "H2":
        return { fontWeight: "700", fontSize: 28 }
      default:
        return {}
    }
  }

  handleOnSelectionChange({
    nativeEvent: {
      selection: { start, end }
    }
  }) {}

  handleContentSize({
    nativeEvent: {
      contentSize: { width, height }
    }
  }) {
    console.log("WIDTH", width)
    console.log("HEIGHT", height)
  }

  handleInputFocus(index) {
    let style = this.props.entries[index].styles
    this.props.updateEntryFocus(index)
    this.props.updateFormatBar(style)
  }

  render() {
    return (
      <ScrollView keyboardShouldPersistTaps={"always"}>
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
                    this.getInputStyling(entry)
                  ]}
                  onKeyPress={e => this.handleKeyPress(e, index)}
                  onChangeText={text => this.handleTextChange(text, index)}
                  onSubmitEditing={e => this.handleReturnKey(e, index)}
                  onFocus={() => this.handleInputFocus(index)}
                  multiline
                  blurOnSubmit={true}
                  value={entry.content}
                  onSelectionChange={this.handleOnSelectionChange}
                />
              )
            })}
          </View>
          <View style={{ marginTop: 20 }}>
            <EditorToolbar />
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
