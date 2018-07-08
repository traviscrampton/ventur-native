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
import Markdown from "react-native-markdown-renderer"
import { connect } from "react-redux"
import { EDIT_TEXT, UPDATE_FORMAT_BAR, CREATE_NEW_ENTRY } from "actions/action_types"

const mapStateToProps = state => ({
  entries: state.editor.entries,
  textObj: state.editor.textObj,
  markdownBlob: state.editor.markdownBlob,
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
  }
})

class Editor extends Component {
  constructor(props) {
    super(props)

    this.addAttribute = this.addAttribute.bind(this)
    this.handleReturnKey = this.handleReturnKey.bind(this)
  }

  addText(text, index) {
    const entry = {
      markdown: this.props.activeAttributes,
      text: text
    }

    const entries = [...this.props.entries]
    entries[index] = entry
    this.props.editText(entries)
  }

  handleReturnKey(index) {
    const newEntry = {
      markdown: "",
      content: ""
    }

    let payload = Object.assign({}, { newEntry: newEntry, newIndex: index + 1 })

    this.props.createNewEntry(payload)
  }

  updateMarkdownBlob(textObj) {
    return `${textObj.markdown} ${textObj.text}`
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
                style={{ height: 40, borderColor: "gray", borderWidth: 1, marginBottom: 5 }}
                onChangeText={text => this.addText(text, index)}
                value={entry.content}
                onSubmitEditing={() => this.handleReturnKey(index)}
              />
            )
          })}
          <Markdown>{this.props.markdownBlob}</Markdown>
          <View style={{ marginTop: 100 }}>
            <Text style={{ marginBottom: 20 }}>Editor Styles</Text>
            <TouchableWithoutFeedback onPress={() => this.addAttribute("#")}>
              <View style={{ marginLeft: 10, marginBottom: 10 }}>
                <Text style={{ fontSize: 20 }}>H1</Text>
              </View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback onPress={() => this.addAttribute("##")}>
              <View style={{ marginLeft: 10, marginBottom: 10 }}>
                <Text style={{ fontSize: 20 }}>H2</Text>
              </View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback onPress={() => this.addAttribute(">")}>
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
