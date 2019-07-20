import React, { Component } from "react"
import { StyleSheet, View, Image, Dimensions, Text, TouchableWithoutFeedback, Alert } from "react-native"
import { connect } from "react-redux"
import { deleteComment } from "../../actions/comments"
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons"
const CycleTouringLogo = require("../../assets/images/cycletouringlogo.png")

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

  handleDeleteComment = id => {
    Alert.alert(
      "Are you sure?",
      "This comment will be deleted",
      [{ text: "Delete Comment", onPress: () => this.props.deleteComment(id) }, { text: "Cancel", style: "cancel" }],
      { cancelable: true }
    )
  }

  isCurrentUsersComment() {
    return this.props.currentUser.id == this.props.user.id
  }

  currentUserOwnsCommentable() {
    return this.props.currentUser.id == this.props.commentableUser.id
  }

  renderRepliesCta() {
    const subCommentCount = this.props.subComments.length
    if (subCommentCount === 0) {
      return <View />
    }

    const chevron = this.state.showSubComments ? "chevron-up" : "chevron-down"

    return (
      <View>
        <TouchableWithoutFeedback onPress={this.toggleSubComments}>
          <View style={styles.flexRow}>
            <Text style={styles.repliesCtaText}>Replies ({subCommentCount})</Text>
            <MaterialCommunityIcons style={{ paddingTop: 2 }} name={chevron} size={18} color={"rgba(0,0,0,.65)"} />
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
            <MaterialIcons name="delete" size={16} color="rgba(0,0,0,.65)" />
          </View>
        </TouchableWithoutFeedback>
      </View>
    )
  }

  renderDeleteEditButtons() {
    return <View style={styles.flexRow}>{this.renderDeleteButton()}</View>
  }

  renderUserSection() {
    const avatarImageUrl =
      this.props.user.avatarImageUrl.length > 0 ? { uri: this.props.user.avatarImageUrl } : CycleTouringLogo

    return (
      <View style={styles.userSectionContainer}>
        <View style={styles.imageAndUser}>
          <Image style={styles.image} source={avatarImageUrl} />
          <View style={styles.userAndDate}>
            <Text style={styles.userFullName}>{this.props.user.fullName}</Text>
            <Text style={styles.commentDate}>{this.props.readableDate}</Text>
          </View>
        </View>
        {this.renderDeleteEditButtons()}
      </View>
    )
  }

  renderCommentContent() {
    return (
      <View style={{ marginTop: 20 }}>
        <Text style={styles.commentContent}>{this.props.content}</Text>
      </View>
    )
  }

  renderCommentInterractions() {
    return (
      <View style={styles.commentInteractionContainer}>
        {this.renderRepliesCta()}
        <View>
          <TouchableWithoutFeedback onPress={() => this.props.replyToComment(this.props)}>
            <View style={styles.flexRow}>
              <MaterialIcons name="reply" size={14} color={"rgba(0,0,0,.65)"} />
              <Text style={styles.replyCta}>Reply</Text>
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
      <View style={styles.container}>
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
          <MaterialIcons name="delete" size={16} color="rgba(0,0,0,.65)" />
        </View>
      </TouchableWithoutFeedback>
    </View>
  )

  return (
    <View style={styles.subCommentContainer}>
      <View style={styles.userContentAndCta}>
        <View style={styles.imageAndUser}>
          <Image style={styles.image} source={{ uri: props.user.avatarImageUrl }} />
          <View style={styles.userAndDate}>
            <Text style={styles.userFullName}>{props.user.fullName}</Text>
            <Text style={styles.commentDate}>{props.readableDate}</Text>
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

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    borderRadius: 2,
    marginBottom: 20,
    padding: 20,
    borderTopColor: "#d3d3d3",
    borderBottomColor: "#d3d3d3",
    borderTopWidth: 1,
    borderBottomWidth: 1
  },
  flexRow: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center"
  },
  repliesCtaText: {
    fontSize: 14,
    color: "rgba(0,0,0,.65)",
    marginRight: 2,
    fontFamily: "open-sans-regular"
  },
  userSectionContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  imageAndUser: {
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-start"
  },
  image: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
    borderWidth: 1,
    borderColor: "#d3d3d3"
  },
  userAndDate: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    height: 35,
    padding: 5,
    paddingTop: 2
  },
  userFullName: {
    fontSize: 12,
    color: "#323941",
    fontFamily: "open-sans-bold"
  },
  commentDate: {
    fontSize: 12,
    fontFamily: "open-sans-regular",
    color: "rgba(0,0,0,.65)"
  },
  commentContent: {
    fontSize: 16,
    fontFamily: "open-sans-regular"
  },
  commentInteractionContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20
  },
  replyCta: {
    marginLeft: 2,
    color: "rgba(0,0,0,.65)",
    fontFamily: "open-sans-regular"
  },
  subCommentContainer: {
    borderTopWidth: 1,
    borderTopColor: "#d3d3d3",
    marginTop: 15,
    paddingTop: 15,
    paddingLeft: 20
  },
  userContentAndCta: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  }
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Comment)
