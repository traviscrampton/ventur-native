import React, { Component } from "react"
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  ScrollView,
  Image,
  Dimensions,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView
} from "react-native"
import { connect } from "react-redux"
import { UPDATE_FORMAT_BAR, CREATE_NEW_ENTRY, DELETE_ENTRY, UPDATE_ENTRY_FOCUS } from "actions/action_types"
import {
  editEntry,
  updateFormatBar,
  turnTextToTextInput,
  updateActiveIndex,
  removeEntryAndFocus,
  updateActiveImageCaption,
  updateContainerHeight
} from "actions/editor"
import ContentCreator from "components/editor/content_creator"
import EditorToolbar from "components/editor/editor_toolbar"

const mapStateToProps = state => ({
  entries: state.editor.entries,
  activeAttribute: state.editor.activeAttribute,
  focusedEntryIndex: state.editor.focusedEntryIndex,
  activeIndex: state.editor.activeIndex,
  cursorPosition: state.editor.cursorPosition,
  containerHeight: state.editor.containerHeight,
  nextIndex: state.editor.nextIndex
})

const mapDispatchToProps = dispatch => ({
  updateFormatBar: payload => dispatch(updateFormatBar(payload)),
  updateActiveImageCaption: payload => dispatch(updateActiveImageCaption(payload)),
  editEntry: payload => dispatch(editEntry(payload)),
  updateActiveIndex: payload => dispatch(updateActiveIndex(payload)),
  updateContainerHeight: payload => dispatch(updateContainerHeight(payload)),
  removeEntryAndFocus: payload => dispatch(removeEntryAndFocus(payload))
})

class Editor extends Component {
  constructor(props) {
    super(props)
    this.openCameraRoll = this.openCameraRoll.bind(this)
    this.handleLayoutChange = this.handleLayoutChange.bind(this)
  }

  componentWillMount() {
    this.keyboardDidShowListener = Keyboard.addListener("keyboardDidShow", this.keyboardDidShow.bind(this))
    this.keyboardDidHideListener = Keyboard.addListener("keyboardDidHide", this.keyboardDidHide.bind(this))
  }

  componentDidUpdate(prevProps) {
    // let activeIndex = this.refs[`textInput${this.props.activeIndex}`]
    // if (activeIndex) {
    //   activeIndex.focus()
    // }
  }

  keyboardDidShow(e) {
    let newSize = Dimensions.get("window").height - e.endCoordinates.height - 80
    this.props.updateContainerHeight(newSize)
  }

  keyboardDidHide() {
    let newSize = Dimensions.get("window").height - 80
    this.props.updateContainerHeight(newSize)
  }

  handleTextChange(content, index) {
    let payload
    let editableEntry = this.props.entries[index]
    const entry = { ...editableEntry, content: content }

    payload = Object.assign({}, { entry, index })
    this.props.editEntry(payload)
  }

  getInputStyling(entry) {
    switch (entry.styles) {
      case "H1":
        return { fontWeight: "700", fontSize: 24 }
      case "QUOTE":
        return {
          fontStyle: "italic",
          borderLeftWidth: 5,
          paddingTop: 10,
          paddingBottom: 10
        }
      default:
        return {}
    }
  }

  updateActiveIndex(e, index) {
    this.props.updateActiveIndex(index)
  }

  handleLayoutChange(e, index) {
    let editableEntry = this.props.entries[index]
    const entry = { ...editableEntry, height: e.nativeEvent.layout.height + 10 }
    if (editableEntry.height + 10 !== entry.height) {
      payload = Object.assign({}, { entry, index })
      this.props.editEntry(payload)
    }
  }

  deleteIfEmpty(index) {
    const entry = this.props.entries[index]
    if (entry.content.length === 0) {
      this.props.removeEntryAndFocus(index)
    }
  }

  renderAsTheText(entry, index) {
    return (
      <TouchableWithoutFeedback onPress={e => this.updateActiveIndex(e, index)} key={index}>
        <View
          style={{
            marginBottom: 5,
            paddingLeft: 10,
            paddingRight: 10,
            paddingTop: 0,
            paddingBottom: 0
          }}>
          <Text
            style={[
              {
                fontSize: 22,
                lineHeight: 30
              },
              this.getInputStyling(entry)
            ]}>
            {entry.content}
          </Text>
        </View>
      </TouchableWithoutFeedback>
    )
  }

  TextOrTextInput(entry, index) {
    if (this.props.activeIndex === index) {
      return this.renderAsTextInput(entry, index)
    } else {
      return this.renderAsTheText(entry, index)
    }
  }

  renderEntry(entry, index) {
    switch (entry.type) {
      case "text":
        return this.renderAsTextInput(entry, index)
      case "image":
        return this.renderAsImage(entry, index)
      default:
        console.log("WHAT IS IT?!", entry)
    }
  }

  renderOpacCover(index) {
    // todo => make functional component
    if (index !== this.props.activeIndex) {
      return
    }

    return (
      <TouchableWithoutFeedback onPress={e => this.updateActiveIndex(e, null)}>
        <View
          style={{
            width: Dimensions.get("window").width,
            height: 250,
            padding: 10,
            zIndex: 1,
            opacity: 0.6,
            display: "flex",
            backgroundColor: "black",
            flexDirection: "row",
            justifyContent: "space-between",
            position: "absolute"
          }}>
          <TouchableWithoutFeedback onPress={() => this.props.removeEntryAndFocus(index)}>
            <View>
              <Text style={{ color: "white", opacity: 1, fontSize: 20 }}>Delete</Text>
            </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback onPress={e => this.openImageCaptionForm(e, index)}>
            <View>
              <Text style={{ color: "white", opacity: 1, fontSize: 20 }}>Caption</Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    )
  }

  renderAsImage(entry, index) {
    // todo => make functional component
    return (
      <View key={`image${index}`} style={{ position: "relative" }}>
        {this.renderOpacCover(index)}
        <TouchableWithoutFeedback style={{ position: "relative" }} onPress={e => this.updateActiveIndex(e, index)}>
          <View>
            <Image style={{ width: Dimensions.get("window").width, height: 250 }} source={{ uri: entry.uri }} />
            {this.renderImageCaption(entry)}
          </View>
        </TouchableWithoutFeedback>
      </View>
    )
  }

  renderImageCaption(entry) {
    if (entry.caption.length === 0) {
      return
    }

    return <Text>{entry.caption}</Text>
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
            paddingTop: 0,
            paddingBottom: 0,
            fontSize: 22,
            lineHeight: 27,
            minHeight: Math.max(100, entry.height)
          },
          this.getInputStyling(entry)
        ]}
        onChangeText={text => this.handleTextChange(text, index)}
        onBlur={() => this.deleteIfEmpty(index)}
        placeholder={"Start Tying..."}
        value={entry.content}
        onLayout={e => this.handleLayoutChange(e, index)}
        blurOnSubmit={false}
      />
    )
  }

  openCameraRoll(e, index) {
    this.props.navigation.navigate("CameraRollContainer", { index: index })
  }

  openImageCaptionForm(e, index) {
    const entryCaption = this.props.entries[index].caption
    this.props.updateActiveImageCaption(entryCaption)
    this.props.navigation.navigate("ImageCaptionForm", { index: index })
  }

  renderCreateCta(index) {
    return (
      <ContentCreator
        index={index}
        key={`contentCreator${index}`}
        openCameraRoll={e => this.openCameraRoll(e, index)}
      />
    )
  }

  render() {
    return (
      <View>
        <View style={{ height: 60 }} />
        <ScrollView
          keyboardShouldPersistTaps={"always"}
          keyboardDismissMode="on-drag"
          bounces={false}
          ref={"scrollContainer"}
          style={{ height: this.props.containerHeight }}>
          {this.props.entries.map((entry, index) => {
            return [this.renderEntry(entry, index), this.renderCreateCta(index)]
          })}>
        </ScrollView>
        <View>
          <EditorToolbar />
        </View>
      </View>
    )
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Editor)
