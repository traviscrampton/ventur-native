import React, { Component } from "react"
import { StyleSheet, FlatList, View, Image, Dimensions, Text, TouchableWithoutFeedback } from "react-native"
import { connect } from "react-redux"
import { deleteComment } from "actions/comments"

const mapStateToProps = state => ({
  currentUser: state.common.currentUser
})

const mapDispatchToProps = dispatch => ({
  deleteComment: payload => dispatch(deleteComment(payload))
})

class Comment extends Component {
  constructor(props) {
    super(props)

    this.state = {
      showSubComments: false
    }
  }

  toggleSubComments = () => {
    const { showSubComments } = this.state
    this.setState({
      showSubComments: !showSubComments
    })
  }

  renderRepliesCta() {
    const subCommentCount = this.props.subComments.length
    if (subCommentCount === 0) {
      return <View />
    }

    return (
      <View>
        <TouchableWithoutFeedback onPress={this.toggleSubComments}>
          <View>
            <Text>Replies ({subCommentCount})</Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
    )
  }

  handleDeleteComment = id => {
    this.props.deleteComment(id)
  }

  isCurrentUsersComment() {
    return this.props.currentUser.id == this.props.user.id
  }

  currentUserOwnsCommentable() {
    return this.props.currentUser.id == this.props.commentableUser.id
  }

  renderEditButton() {
    return
    if (this.isCurrentUsersComment()) return

    return (
      <View>
        <TouchableWithoutFeedback onPress={() => console.log("hiya")}>
          <View>
            <Text>EDIT</Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
    )
  }

  renderDeleteButton() {
    if (!this.isCurrentUsersComment() && !this.currentUserOwnsCommentable()) return

    return (
      <View style={{ marginLeft: 5 }}>
        <TouchableWithoutFeedback onPress={() => this.handleDeleteComment(this.props.id)}>
          <View>
            <Text>DELETE</Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
    )
  }

  renderDeleteEditButtons() {
    return (
      <View style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
        {this.renderEditButton()}
        {this.renderDeleteButton()}
      </View>
    )
  }

  renderUserSection() {
    const imgDimensions = 35
    return (
      <View style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
        <View style={{ display: "flex", flexDirection: "row", alignItems: "top" }}>
          <Image
            style={{ width: imgDimensions, height: imgDimensions, borderRadius: imgDimensions / 2 }}
            source={{ uri: this.props.user.avatarImageUrl }}
          />
          <View
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              height: imgDimensions,
              paddingLeft: 5
            }}>
            <Text>{this.props.user.fullName}</Text>
            <Text>{this.props.readableDate}</Text>
          </View>
        </View>
        {this.renderDeleteEditButtons()}
      </View>
    )
  }

  renderCommentContent() {
    return (
      <View style={{ marginTop: 20 }}>
        <Text>{this.props.content}</Text>
      </View>
    )
  }

  renderCommentInterractions() {
    return (
      <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", marginTop: 20 }}>
        {this.renderRepliesCta()}
        <View>
          <TouchableWithoutFeedback onPress={() => this.props.replyToComment(this.props)}>
            <View>
              <Text>Reply</Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </View>
    )
  }

  renderSubComments() {
    if (!this.state.showSubComments) return
    let canDelete
    return this.props.subComments.map((subComment, index) => {
      canDelete = this.currentUserOwnsCommentable() || this.props.currentUser.id == subComment.user.id
      return <SubComment {...subComment} canDelete={canDelete} handleDeleteComment={this.handleDeleteComment} />
    })
  }

  render() {
    return (
      <View
        style={{
          backgroundColor: "white",
          borderRadius: 2,
          marginBottom: 20,
          padding: 20,
          borderTopColor: "#d3d3d3",
          borderBottomColor: "#d3d3d3",
          borderTopWidth: 1,
          borderBottomWidth: 1
        }}>
        {this.renderUserSection()}
        {this.renderCommentContent()}
        {this.renderCommentInterractions()}
        {this.renderSubComments()}
      </View>
    )
  }
}

const SubComment = props => {
  const imgDimensions = 35

  deleteCta = (
    <View>
      <TouchableWithoutFeedback onPress={() => props.handleDeleteComment(props.id)}>
        <View>
          <Text>Delete</Text>
        </View>
      </TouchableWithoutFeedback>
    </View>
  )

  return (
    <View style={{ borderTopWidth: 1, borderTopColor: "#d3d3d3", marginTop: 15, paddingTop: 15, paddingLeft: 20 }}>
      <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <View style={{ display: "flex", flexDirection: "row", alignItems: "top" }}>
          <Image
            style={{ width: imgDimensions, height: imgDimensions, borderRadius: imgDimensions / 2 }}
            source={{ uri: props.user.avatarImageUrl }}
          />
          <View
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              height: imgDimensions,
              paddingLeft: 5
            }}>
            <Text>{props.user.fullName}</Text>
            <Text>{props.readableDate}</Text>
          </View>
        </View>
        {props.canDelete ? deleteCta : ""}
      </View>
      <View style={{ marginTop: 20 }}>
        <Text>{props.content}</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Comment)
