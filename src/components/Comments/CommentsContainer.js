import React, { Component } from "react"
import { StyleSheet, View, Dimensions, Text, TouchableWithoutFeedback } from "react-native"
import { connect } from "react-redux"
import { loadComments } from "actions/comments"
import { populateCommentForm } from "actions/comment_form"
import CommentsSection from "components/Comments/CommentsSection"

const mapStateToProps = state => ({
  comments: state.comments.comments
})

const mapDispatchToProps = dispatch => ({
  loadComments: payload => dispatch(loadComments(payload)),
  populateCommentForm: payload => dispatch(populateCommentForm(payload))
})

class CommentsContainer extends Component {
  constructor(props) {
    super(props)

    this.state = {
      showComments: false
    }
  }

  loadComments = async () => {
    const { commentableId, commentableType } = this.props
    const params = { commentableId, commentableType }
    await this.props.loadComments(params)

    this.setState({
      showComments: true
    })
  }

  navigateAndPopulateCommentForm = (commentableParams = null, id = null) => {
    let commentableObj = commentableParams ? commentableParams : this.props

    const { commentableId, commentableType, commentableUser, commentableTitle } = commentableObj
    const commentable = Object.assign(
      {},
      {
        commentableType,
        commentableId,
        commentableUser,
        commentableTitle
      }
    )
    this.props.populateCommentForm({ id, commentable })
    this.props.navigation.navigate("CommentForm")
  }

  renderCommentsCTA() {
    return (
      <View style={{ display: "flex", flexDirection: "row", justifyContent: "center", alignContent: "center" }}>
        <TouchableWithoutFeedback onPress={this.loadComments}>
          <View style={styles.showCommentCta}>
            <Text style={styles.showCommentCtaText}>Show Comments ({this.props.commentCount})</Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
    )
  }

  render() {
    if (this.state.showComments) {
      return <CommentsSection commentableUser={this.props.commentableUser} navigateAndPopulateCommentForm={this.navigateAndPopulateCommentForm} />
    } else {
      return this.renderCommentsCTA()
    }
  }
}

const styles = StyleSheet.create({
  showCommentCta: {
    backgroundColor: "#fafafa",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingRight: 5,
    paddingLeft: 5,
    paddingTop: 10,
    paddingBottom: 10,
    borderColor: "#505050",
    borderWidth: 1,
    borderRadius: 3,
    width: Dimensions.get("window").width - 40
  },
  showCommentCtaText: {
    letterSpacing: 1.8,
    color: "#505050",
    textAlign: "center"
  }
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CommentsContainer)
