import React, { Component } from 'react';
import { View, Text, TouchableWithoutFeedback, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { MaterialIcons } from '@expo/vector-icons';
import { updateGearReviewFormStarRating } from '../../actions/gear_review_form';

const mapStateToProps = state => ({
  width: state.common.width,
  rating: state.gearReviewForm.rating
});

const mapDispatchToProps = dispatch => ({
  updateGearReviewFormStarRating: payload =>
    dispatch(updateGearReviewFormStarRating(payload))
});

class GearReviewFormStarRating extends Component {
  constructor(props) {
    super(props);
  }

  static MAX_STARS = 5;

  getStarText() {
    switch (this.props.rating) {
      case 1:
        return 'Bad';
      case 2:
        return 'Meh';
      case 3:
        return 'Decent';
      case 4:
        return 'Pretty Good';
      case 5:
        return 'Excellent';
      default:
        return '';
    }
  }

  renderStar(i) {
    if (this.props.rating >= i + 1) {
      return <MaterialIcons name="star" color="gold" size={32} key={i} />;
    }

    return <MaterialIcons name="star-border" color="gold" size={32} key={i} />;
  }

  renderText() {
    const text = this.getStarText();

    return (
      <View style={styles.marginLeft10}>
        <Text style={styles.openSansRegular}>{text}</Text>
      </View>
    );
  }

  renderStars = () => {
    return [...Array(GearReviewFormStarRating.MAX_STARS)].map((e, i) => {
      return (
        <TouchableWithoutFeedback
          onPress={() => this.props.updateGearReviewFormStarRating(i + 1)}
        >
          {this.renderStar(i)}
        </TouchableWithoutFeedback>
      );
    });
  };

  render() {
    return (
      <View style={styles.marginTop20}>
        <View style={styles.marginBottom5}>
          <Text style={styles.ratingLabel}>Rating</Text>
        </View>
        <View style={styles.flexRowCenter}>
          {this.renderStars()}
          {this.renderText()}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  marginLeft10: {
    marginLeft: 10
  },
  flexRowCenter: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  marginTop20: {
    marginTop: 20
  },
  ratingLabel: {
    fontFamily: 'playfair',
    color: '#323941',
    fontSize: 18
  },
  marginBottom5: {
    marginBottom: 5
  },
  openSansRegular: {
    fontFamily: 'open-sans-regular'
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GearReviewFormStarRating);
