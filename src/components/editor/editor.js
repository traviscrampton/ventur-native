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
import { UPDATE_FORMAT_BAR, CREATE_NEW_ENTRY, DELETE_ENTRY, UPDATE_ENTRY_FOCUS } from "actions/action_types"
import {
  editText,
  updateEntryFocus,
  updateFormatBar,
  updateFocusAndFormat,
  handleReturnKey,
  deleteWithEdit
} from "actions/editor"
import Markdown from "react-native-markdown-renderer"
import EditorToolbar from "components/editor/editor_toolbar"

const mapStateToProps = state => ({
  entries: state.editor.entries,
  activeAttribute: state.editor.activeAttribute
})

const mapDispatchToProps = dispatch => ({
  updateFormatBar: payload => dispatch(updateFormatBar(payload)),

  updateFocusAndFormat: payload => dispatch(updateFocusAndFormat(payload)),

  editEntry: payload => dispatch(editText(payload)),

  handleReturnKey: payload => dispatch(handleReturnKey(payload)),

  deleteWithEdit: payload => dispatch(deleteWithEdit(payload)),

  updateEntryFocus: payload => updateEntryFocus(payload)
})

class Editor extends Component {
  constructor(props) {
    super(props)
    this.cursorPointer = 0
    this.lastClickedKey = null
    this.handleKeyPress = this.handleKeyPress.bind(this)
    this.handleReturnKey = this.handleReturnKey.bind(this)
    this.handleOnSelectionChange = this.handleOnSelectionChange.bind(this)
  }

  handleTextChange(content, index) {
    let payload
    let editableEntry = this.props.entries[index]
    const entry = { ...editableEntry, content: content }

    payload = Object.assign({}, { entry, index })
    this.props.editEntry(payload)
  }

  handleReturnKey(e, index) {
    const nextContent = e.nativeEvent.text.substr(this.cursorPointer)
    const previousContent = e.nativeEvent.text.substring(0, this.cursorPointer)
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

    let payload = Object.assign({}, { newPayload: newPayload, oldPayload: oldPayload })
    this.props.handleReturnKey(payload)
    // this.refs[`textInput${index + 1}`].focus()
  }

  handleKeyPress(
    {
      nativeEvent: { key: keyValue }
    },
    index
  ) {
    if (this.cursorPointer === 0 && keyValue === "Backspace" && this.lastClickedKey === "Backspace" && index > 0) {
      this.handleDeleteEntry(index)
    }
    this.lastClickedKey = keyValue
  }

  handleDeleteEntry(index) {
    const { activeText, previousText, previousStyles, updatedContent, pointerPosition } = this.getDeleteFormConsts(
      index
    )
    const entry = {
      content: updatedContent,
      styles: previousStyles
    }

    let oldPayload = Object.assign({}, { entry: entry, index: index - 1 })
    const keyName = `textInput${index - 1}`
    let payload = Object.assign({}, { index: index, oldPayload: oldPayload })
    this.props.deleteWithEdit(payload)
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
      case "QUOTE":
        return {
          fontStyle: "italic",
          borderLeftWidth: 5,
          paddingTop: 10,
          paddingBottom: 10
        }
      case "QUOTE-2":
        return {
          fontStyle: "italic",
          paddingRight: 40,
          paddingLeft: 40
        }
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
    this.cursorPointer = start
    this.lastClickedKey = null
  }

  handleInputFocus(e, index) {
    let style = this.props.entries[index].styles
    this.cursorPointer = this.props.entries[index].content.length
    let payload = Object.assign({}, { index: index, style: style })
    this.props.updateFocusAndFormat(payload)
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
                      paddingLeft: 10,
                      paddingRight: 10,
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
