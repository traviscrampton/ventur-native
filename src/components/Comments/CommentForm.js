import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableWithoutFeedback
} from 'react-native';
import {
  resetCommentForm,
  updateCommentContent,
  createComment,
  toggleCommentFormModal
} from '../../actions/comment_form';
import FormModal from '../shared/FormModal';

const mapStateToProps = state => ({
  content: state.commentForm.content,
  commentable: state.commentForm.commentable,
  visible: state.commentForm.visible
});

const mapDispatchToProps = dispatch => ({
  resetCommentForm: () => dispatch(resetCommentForm()),
  updateCommentContent: payload => dispatch(updateCommentContent(payload)),
  toggleCommentFormModal: payload => dispatch(toggleCommentFormModal(payload)),
  createComment: () => dispatch(createComment())
});

class CommentForm extends Component {
  constructor(props) {
    super(props);
  }

  handleCancelAndNavigate = () => {
    this.props.resetCommentForm();
    this.props.toggleCommentFormModal(false);
  };

  handleCommentPersistance = () => {
    this.props.createComment();
    this.props.resetCommentForm();
    this.props.toggleCommentFormModal(false);
  };

  renderHeader() {
    return (
      <View style={styles.header}>
        <TouchableWithoutFeedback onPress={this.handleCancelAndNavigate}>
          <View>
            <Text style={styles.headerOptions}>Cancel</Text>
          </View>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback onPress={this.handleCommentPersistance}>
          <View>
            <Text style={styles.headerOptions}>Post</Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
    );
  }

  renderCommentablePreview() {
    return (
      <View
        shadowColor="#d3d3d3"
        shadowOffset={{ width: 1, height: 1 }}
        shadowOpacity={0.7}
        style={styles.commentablePreviewContainer}
      >
        <Text style={styles.commentableTitle}>
          {this.props.commentable.commentableTitle}
        </Text>
        <Text style={styles.openSansRegular}>
          By: {this.props.commentable.commentableUser.fullName}
        </Text>
      </View>
    );
  }

  renderTextBox() {
    return (
      <View style={styles.padding20}>
        <TextInput
          multiline
          autoFocus
          style={styles.textBox}
          selectionColor={'#FF5423'}
          onChangeText={text => this.props.updateCommentContent(text)}
          value={this.props.content}
        />
      </View>
    );
  }

  render() {
    return (
      <FormModal visible={this.props.visible}>
        {this.renderHeader()}
        <ScrollView>
          {this.renderCommentablePreview()}
          {this.renderTextBox()}
        </ScrollView>
      </FormModal>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    height: 45,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: 20,
    paddingLeft: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#f8f8f8'
  },
  padding20: {
    padding: 20
  },
  textBox: {
    fontSize: 16,
    fontFamily: 'open-sans-regular'
  },
  headerOptions: {
    fontFamily: 'open-sans-bold',
    fontWeight: '600',
    fontSize: 14,
    color: '#323941'
  },
  commentableTitle: {
    fontWeight: 'bold',
    marginBottom: 5,
    fontFamily: 'open-sans-regular'
  },
  openSansRegular: {
    fontFamily: 'open-sans-regular'
  },
  commentablePreviewContainer: {
    margin: 20,
    borderColor: '#d3d3d3',
    borderWidth: 1,
    borderRadius: 3,
    backgroundColor: 'white',
    padding: 10
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(CommentForm);
