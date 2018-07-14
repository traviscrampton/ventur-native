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
    this.cursorPosition = 0
    this.handleKeyPress = this.handleKeyPress.bind(this)
    this.handleReturnKey = this.handleReturnKey.bind(this)
    this.handleOnSelectionChange = this.handleOnSelectionChange.bind(this)
  }

  handleTextChange(content, index) {
    let payload

    let editableEntry = this.props.entries[index]

    const entry = { ...editableEntry, content: content }

    payload = Object.assign({}, { entry, index })
    this.props.editText(payload)
  }

  handleReturnKey(e, index) {
    const nextContent = e.nativeEvent.text.substr(this.cursorPosition)
    const previousContent = e.nativeEvent.text.substring(0, this.cursorPosition)
    console.log("CURSORPOSTION", this.cursorPosition)
    console.log("nextContent", nextContent)
    console.log("previousContent", previousContent)
    const newEntry = {
      content: nextContent,
      styles: this.props.activeAttribute
    }

    const entry = {
      content: previousContent,
      styles: this.props.activeAttribute
    }

    let newPayload = Object.assign({}, { newEntry: newEntry, newIndex: index + 1 })
    let oldPayload = Object.assign({}, { entry, index })

    this.props.editText(oldPayload)
    this.props.createNewEntry(newPayload)
    // this.refs[`textInput${index + 1}`].focus()
  }

  handleKeyPress(
    {
      nativeEvent: { key: keyValue }
    },
    index
  ) {
    if (this.cursorPosition === 0 && keyValue === "Backspace" && index > 0) {
      this.handleDeleteEntry(keyValue, index)
    }
  }

  handleDeleteEntry(keyValue, index) {
    const { activeText, previousText, previousStyles, updatedContent, pointerPosition } = this.getDeleteFormConsts(
      index
    )
    const entry = {
      content: updatedContent,
      styles: previousStyles
    }

    let oldPayload = Object.assign({}, { entry: entry, index: index - 1 })
    const keyName = `textInput${index - 1}`
    this.props.editText(oldPayload)
    this.props.deleteEntry(index)
    this.refs[keyName].focus()
    this.refs[keyName].setNativeProps({ selection: { start: pointerPosition, end: pointerPosition } })
  }

  getDeleteFormConsts(index) {
    const activeText = this.props.entries[index].content
    const previousText = this.props.entries[index - 1].content
    const previousStyles = this.props.entries[index - 1].styles
    const updatedContent = previousText.concat(activeText)
    const pointerPosition = previousText.length - activeText.length
    return { activeText, previousText, previousStyles, updatedContent, pointerPosition }
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

  handleOnSelectionChange(
    {
      nativeEvent: {
        selection: { start, end }
      }
    },
    index
  ) {
    console.log("HANDLE ON SELECTION CHANGE!", start)
    this.cursorPosition = start
  }

  handleInputFocus(e, index) {
    let style = this.props.entries[index].styles
    this.cursorPosition = this.props.entries[index].content.length
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
                  onFocus={e => this.handleInputFocus(e, index)}
                  value={entry.content}
                  multiline
                  blurOnSubmit={true}
                  onSelectionChange={e => this.handleOnSelectionChange(e, index)}
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
