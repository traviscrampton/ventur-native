import React, { Component } from 'react';
import { View, Text, TouchableWithoutFeedback, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import {
  persistGearReview,
  defaultGearReviewForm
} from '../../actions/gear_review_form';
import InputScrollView from 'react-native-input-scroll-view';
import GearReviewFormTitle from './GearReviewFormTitle';
import GearReviewFormStarRating from './GearReviewFormStarRating';
import GearReviewFormImageCarousel from './GearReviewFormImageCarousel';
import GearReviewFormProsCons from './GearReviewFormProsCons';
import GearReviewFormReview from './GearReviewFormReview';
import GearReviewFormJournals from './GearReviewFormJournals';
import FormModal from '../shared/FormModal';

const mapStateToProps = state => ({
  visible: state.gearReviewForm.visible,
  width: state.common.width,
  height: state.common.height,
  id: state.gearReviewForm.id
});

const mapDispatchToProps = dispatch => ({
  persistGearReview: () => dispatch(persistGearReview()),
  defaultGearReviewForm: () => dispatch(defaultGearReviewForm())
});

class GearReviewForm extends Component {
  constructor(props) {
    super(props);
  }

  persistGearReview = () => {
    this.props.persistGearReview();
    this.props.defaultGearReviewForm();
  };

  handleCancel = () => {
    this.props.defaultGearReviewForm();
  };

  renderHeader() {
    return (
      <View style={styles.headerContainer}>
        <TouchableWithoutFeedback onPress={this.handleCancel}>
          <View>
            <Text style={styles.headerOptions}>Cancel</Text>
          </View>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback onPress={this.persistGearReview}>
          <View>
            <Text style={styles.headerOptions}>Save</Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
    );
  }

  getTitleText() {
    return this.props.id ? 'Edit Gear Review' : 'New Gear Review';
  }

  renderFormTitle() {
    return (
      <View style={styles.marginBottom20}>
        <Text style={styles.titleText}>{this.getTitleText()}</Text>
      </View>
    );
  }

  render() {
    return (
      <FormModal
        visible={this.props.visible}
        animationType={'slide'}
        style={[styles.backgroundColorWhite, { height: this.props.height }]}
      >
        {this.renderHeader()}
        <InputScrollView
          multilineInputStyle={{ lineHeight: 30 }}
          topOffset={50}
          keyboardOffset={90}
          style={styles.padding20}
          keyboardShouldPersistTaps="always"
        >
          {this.renderFormTitle()}
          <GearReviewFormTitle />
          <GearReviewFormReview />
          <GearReviewFormImageCarousel />
          <GearReviewFormStarRating />
          <GearReviewFormProsCons />
          <GearReviewFormJournals />
          <View style={styles.marginBottom300} />
        </InputScrollView>
      </FormModal>
    );
  }
}

const styles = StyleSheet.create({
  headerContainer: {
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
  headerOptions: {
    fontFamily: 'playfair',
    fontSize: 14,
    color: '#323941'
  },
  backgroundColorWhite: {
    backgroundColor: 'white'
  },
  titleText: {
    fontFamily: 'playfair',
    color: '#323941',
    fontSize: 28
  },
  marginBottom20: {
    marginBottom: 20
  },
  padding20: {
    padding: 20
  },
  marginBottom300: {
    marginBottom: 300
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(GearReviewForm);
