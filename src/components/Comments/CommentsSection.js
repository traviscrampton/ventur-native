import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableWithoutFeedback
} from 'react-native';
import CommentForm from './CommentForm';
import { toggleCommentFormModal } from '../../actions/comment_form';
import Comment from './Comment';
const CycleTouringLogo = require('../../assets/images/cycletouringlogo.png');

const mapStateToProps = state => ({
  comments: state.comments.comments,
  currentUserAvatarImageUrl: state.common.currentUser.avatarImageUrl
});

const mapDispatchToProps = dispatch => ({
  toggleCommentFormModal: payload => dispatch(toggleCommentFormModal(payload))
});

class CommentsSection extends Component {
  constructor(props) {
    super(props);
  }

  navigateToCommentForm = () => {
    this.props.navigateAndPopulateCommentForm();
    this.props.toggleCommentFormModal(true);
  };

  replyToComment = comment => {
    const params = {
      commentableType: 'comment',
      commentableId: comment.id,
      commentableUser: {
        id: comment.user.id,
        fullName: comment.user.fullName
      },
      commentableTitle: comment.content
    };

    this.props.navigateAndPopulateCommentForm(params);
    this.props.toggleCommentFormModal(true);
  };

  getAvatarUrl() {
    if (this.props.currentUserAvatarImageUrl.length > 0) {
      return { uri: this.props.currentUserAvatarImageUrl };
    } else {
      return CycleTouringLogo;
    }
  }

  renderCommentCta = () => {
    const avatarUrl = this.getAvatarUrl();

    return (
      <View style={styles.ctaContainer}>
        <TouchableWithoutFeedback onPress={this.navigateToCommentForm}>
          <View style={styles.ctaView}>
            <Image style={styles.ctaImage} source={avatarUrl} />
            <Text style={styles.labelColor}>Write a comment</Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
    );
  };

  renderComments() {
    return this.props.comments.map((comment, index) => {
      return (
        <Comment
          {...comment}
          commentableUser={this.props.commentableUser}
          replyToComment={this.replyToComment}
        />
      );
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.openSansRegular}>Comments</Text>
        </View>
        {this.renderCommentCta()}
        <View style={styles.divider} />
        {this.renderComments()}
        <CommentForm />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  ctaContainer: {
    backgroundColor: 'white',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#d3d3d3'
  },
  openSansRegular: {
    fontFamily: 'open-sans-regular'
  },
  divider: {
    borderBottomColor: '#d3d3d3',
    borderBottomWidth: 3,
    width: 70,
    marginBottom: 20,
    marginLeft: 20
  },
  container: {
    backgroundColor: '#FAFAFA',
    paddingTop: 20,
    paddingBottom: 20
  },
  headerContainer: {
    marginBottom: 15,
    padding: 20,
    paddingBottom: 10
  },
  ctaView: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20
  },
  ctaImage: {
    width: 35,
    height: 35,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#d3d3d3',
    borderRadius: 17.5
  },
  labelColor: {
    color: '#d3d3d3'
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(CommentsSection);
