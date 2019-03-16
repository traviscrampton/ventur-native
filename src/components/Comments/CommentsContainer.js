import React, { Component } from "react"
import { StyleSheet, FlatList, View, Dimensions, Text, TouchableWithoutFeedback } from "react-native"
import { connect } from "react-redux"
import { loadComments } from "actions/comments"

const mapStateToProps = state => ({
  comments: state.comments.comments
})

const mapDispatchToProps = dispatch => ({
  loadComments: payload => dispatch(loadComments(payload))
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
    const params = { commentableId: commentableId, commentableType: commentableType }
    await this.props.loadComments(params)

    this.setState({
      showComments: true
    })
  }

  renderCommentsSection() {
    return <Text>{this.props.comments}</Text>
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
      return this.renderCommentsSection()
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
