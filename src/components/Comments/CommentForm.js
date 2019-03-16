import React, { Component } from "react"
import {
  StyleSheet,
  ScrollView,
  View,
  Dimensions,
  Text,
  Image,
  TextInput,
  TouchableWithoutFeedback
} from "react-native"
import { resetCommentForm, updateCommentContent, createComment } from "actions/comment_form"
import { connect } from "react-redux"

const mapStateToProps = state => ({
  content: state.commentForm.content,
  commentable: state.commentForm.commentable
})

const mapDispatchToProps = dispatch => ({
  resetCommentForm: () => dispatch(resetCommentForm()),
  updateCommentContent: payload => dispatch(updateCommentContent(payload)),
  createComment: () => dispatch(createComment())
})

class CommentForm extends Component {
  constructor(props) {
    super(props)
  }

  handleCancelAndNavigate = () => {
    this.props.resetCommentForm()
    this.props.navigation.goBack()
  }

  handleCommentPersistance = () => {
    this.props.createComment()
    this.props.resetCommentForm()
    this.props.navigation.goBack()
  }

  renderHeader() {
    return (
      <View
        style={{
          height: 45,
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingRight: 20,
          paddingLeft: 20,
          backgroundColor: "white",
          borderBottomWidth: 1,
          borderBottomColor: "#f8f8f8"
        }}>
        <TouchableWithoutFeedback onPress={this.handleCancelAndNavigate}>
          <View>
            <Text>Cancel</Text>
          </View>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback onPress={this.handleCommentPersistance}>
          <View>
            <Text>Post</Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
    )
  }

  renderCommentablePreview() {
    return (
      <View
        shadowColor="#d3d3d3"
        shadowOffset={{ width: 1, height: 1 }}
        shadowOpacity={0.7}
        style={{
          margin: 20,
          borderColor: "#d3d3d3",
          borderWidth: 1,
          borderRadius: 3,
          backgroundColor: "white",
          padding: 10
        }}>
        <Text style={{ fontWeight: "bold", marginBottom: 5 }}>{this.props.commentable.commentableTitle}</Text>
        <Text>By: {this.props.commentable.commentableUser.fullName}</Text>
      </View>
    )
  }

  renderTextBox() {
    return (
      <View style={{ padding: 20 }}>
        <TextInput
          multiline
          autoFocus
          style={{ fontSize: 16 }}
          selectionColor={"#FF8C34"}
          onChangeText={text => this.props.updateCommentContent(text)}
          value={this.props.content}
        />
      </View>
    )
  }

  render() {
    return (
      <View style={{ backgroundColor: "white", height: Dimensions.get("window").height }}>
        {this.renderHeader()}
        <ScrollView>
          {this.renderCommentablePreview()}
          {this.renderTextBox()}
        </ScrollView>
      </View>
    )
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CommentForm)
