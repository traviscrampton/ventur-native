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
  TouchableWithoutFeedback,
  KeyboardAvoidingView
} from "react-native"
import { connect } from "react-redux"
import { UPDATE_FORMAT_BAR, CREATE_NEW_ENTRY, DELETE_ENTRY, UPDATE_ENTRY_FOCUS } from "actions/action_types"
import {
  editText,
  updateEntryFocus,
  updateFormatBar,
  handleReturnKey,
  deleteWithEdit,
  turnTextToTextInput,
  updateActiveIndex,
  updateCursorPosition
} from "actions/editor"
import Markdown from "react-native-markdown-renderer"
import EditorToolbar from "components/editor/editor_toolbar"

const mapStateToProps = state => ({
  entries: state.editor.entries,
  activeAttribute: state.editor.activeAttribute,
  focusedEntryIndex: state.editor.focusedEntryIndex,
  activeIndex: state.editor.activeIndex,
  cursorPosition: state.editor.cursorPosition
})

const mapDispatchToProps = dispatch => ({
  updateFormatBar: payload => dispatch(updateFormatBar(payload)),
  editEntry: payload => dispatch(editText(payload)),
  handleReturnKey: payload => dispatch(handleReturnKey(payload)),
  deleteWithEdit: payload => dispatch(deleteWithEdit(payload)),
  updateEntryFocus: payload => updateEntryFocus(payload),
  updateCursorPosition: payload => dispatch(updateCursorPosition(payload)),
  updateActiveIndex: payload => dispatch(updateActiveIndex(payload))
})

class Editor extends Component {
  constructor(props) {
    super(props)
    this.lastClickedKey = null
    this.handleKeyPress = this.handleKeyPress.bind(this)
    this.handleReturnKey = this.handleReturnKey.bind(this)
    this.handleOnSelectionChange = this.handleOnSelectionChange.bind(this)
  }

  componentDidUpdate(prevProps) {
    let activeRef = this.refs[`textInput${this.props.activeIndex}`]
    if (activeRef) {
      activeRef.focus()
    }
  }

  handleTextChange(content, index) {
    let payload
    let editableEntry = this.props.entries[index]
    const entry = { ...editableEntry, content: content }

    payload = Object.assign({}, { entry, index })
    this.props.editEntry(payload)
  }

  handleReturnKey(e, index) {
    const nextContent = e.nativeEvent.text.substr(this.props.cursorPosition)
    const previousContent = e.nativeEvent.text.substring(0, this.props.cursorPosition)
    const newEntry = {
      content: nextContent,
      styles: this.props.entries[index].styles
    }

    const entry = {
      content: previousContent,
      styles: this.props.entries[index].styles
    }

    let newPayload = Object.assign({}, { newEntry: newEntry, newIndex: index + 1 })

    let oldPayload = Object.assign({}, { entry, index })

    let payload = Object.assign({}, { newPayload: newPayload, oldPayload: oldPayload })
    this.props.handleReturnKey(payload)
  }

  handleKeyPress(
    {
      nativeEvent: { key: keyValue }
    },
    index
  ) {
    if (
      this.props.cursorPosition === 0 &&
      keyValue === "Backspace" &&
      this.lastClickedKey === "Backspace" &&
      index > 0
    ) {
      this.handleDeleteEntry(index)
    }
    this.lastClickedKey = keyValue
  }

  handleDeleteEntry(index) {
    const keyName = `textInput${index - 1}`
    const { activeText, previousText, previousStyles, updatedContent, pointerPosition } = this.getDeleteFormConsts(
      index
    )
    const entry = {
      content: updatedContent,
      styles: previousStyles
    }
    let instance = this
    let oldPayload = Object.assign({}, { entry: entry, index: index - 1 })
    let payload = Object.assign(
      {},
      { oldPayload: oldPayload, index: index, cursorPosition: pointerPosition, instance: instance }
    )
    this.props.deleteWithEdit(payload)
  }

  getDeleteFormConsts(index) {
    const activeText = this.props.entries[index].content
    const previousText = this.props.entries[index - 1].content
    const pointerPosition = previousText.length
    const previousStyles = this.props.entries[index - 1].styles
    const updatedContent = previousText.concat(activeText)
    return { activeText, previousText, previousStyles, updatedContent, pointerPosition }
  }

  getInputStyling(entry) {
    switch (entry.styles) {
      case "H1":
        return { fontWeight: "700", fontSize: 28 }
      case "H2":
        return { fontWeight: "700", fontSize: 24 }
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
    this.props.updateCursorPosition(start)
    this.lastClickedKey = null
  }

  handleContentSizeChange(event) {
    if (event && event.nativeEvent && event.nativeEvent.contentSize) {
      // debugger
    }
  }

  updateActiveIndex(e, index) {
    this.props.updateActiveIndex(index)
    this.refs[`textInput${index}`].setNativeProps({
      selection: { start: this.props.cursorPosition, end: this.props.cursorPosition }
    })
  }

  renderAsTextInput(entry, index) {
    return (
      <TextInput
        multiline
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
        value={entry.content}
        onFocus={e => this.updateActiveIndex(e, index)}
        blurOnSubmit={true}
        onSelectionChange={e => this.handleOnSelectionChange(e, index)}
        onContentSizeChange={event => this.handleContentSizeChange(event)}
      />
    )
  }

  render() {
    return (
      <ScrollView keyboardShouldPersistTaps={"always"}>
        <View style={{ marginTop: 50 }}>
          <View>
            {this.props.entries.map((entry, index) => {
              return this.renderAsTextInput(entry, index)
            })}
          </View>
          <View style={{ marginTop: 20, flex: 1 }}>
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
