import React, { Component } from "react"
import { StyleSheet, View, Text, Image, TouchableWithoutFeedback } from "react-native"
import { connect } from "react-redux"
import Comment from "./Comment"
const CycleTouringLogo = require("../../assets/images/cycletouringlogo.png")

const mapStateToProps = state => ({
  comments: state.comments.comments,
  currentUserAvatarImageUrl: state.common.currentUser.avatarImageUrl
})

const mapDispatchToProps = dispatch => ({})

class CommentsSection extends Component {
  constructor(props) {
    super(props)
  }

  navigateToCommentForm = () => {
    this.props.navigateAndPopulateCommentForm()
  }

  replyToComment = comment => {
    const params = {
      commentableType: "comment",
      commentableId: comment.id,
      commentableUser: {
        id: comment.user.id,
        fullName: comment.user.fullName
      },
      commentableTitle: comment.content
    }

    this.props.navigateAndPopulateCommentForm(params)
  }

  getAvatarUrl() {
    if (this.props.currentUserAvatarImageUrl.length > 0) {
      return { uri: this.props.currentUserAvatarImageUrl }
    } else {
      return CycleTouringLogo
    }
  }

  renderCommentCta = () => {
    const avatarUrl = this.getAvatarUrl()

    return (
      <View style={{ backgroundColor: "white", marginBottom: 20, borderWidth: 1, borderColor: "#d3d3d3" }}>
        <TouchableWithoutFeedback onPress={this.navigateToCommentForm}>
          <View style={{ display: "flex", flexDirection: "row", alignItems: "center", padding: 20 }}>
            <Image
              style={{
                width: 35,
                height: 35,
                marginRight: 10,
                borderWidth: 1,
                borderColor: "#d3d3d3",
                borderRadius: 35 / 2
              }}
              source={avatarUrl}
            />
            <Text style={{ color: "#d3d3d3" }}>Write a comment</Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
    )
  }

  renderComments() {
    return this.props.comments.map((comment, index) => {
      return <Comment {...comment} commentableUser={this.props.commentableUser} replyToComment={this.replyToComment} />
    })
  }

  render() {
    return (
      <View style={{ backgroundColor: "#FAFAFA", paddingTop: 20, paddingBottom: 20 }}>
        <View
          style={{
            marginBottom: 15,
            padding: 20,
            paddingBottom: 10
          }}>
          <Text style={{ fontFamily: "open-sans-regular" }}>Comments</Text>
        </View>
        {this.renderCommentCta()}
        <View
          style={{ borderBottomColor: "#d3d3d3", borderBottomWidth: 3, width: 70, marginBottom: 20, marginLeft: 20 }}
        />
        {this.renderComments()}
      </View>
    )
  }
}

const styles = StyleSheet.create({})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CommentsSection)
