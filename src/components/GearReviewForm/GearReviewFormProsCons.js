import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  TextInput,
  View,
  Text,
  TouchableWithoutFeedback,
  StyleSheet
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import {
  updateGearReviewFormProCon,
  removeGearReviewFormProCon,
  addGearReviewFormProCon
} from '../../actions/gear_review_form';

const mapStateToProps = state => ({
  width: state.common.width,
  pros: state.gearReviewForm.pros,
  cons: state.gearReviewForm.cons
});

const mapDispatchToProps = dispatch => ({
  updateGearReviewFormProCon: payload =>
    dispatch(updateGearReviewFormProCon(payload)),
  removeGearReviewFormProCon: payload =>
    dispatch(removeGearReviewFormProCon(payload)),
  addGearReviewFormProCon: payload => dispatch(addGearReviewFormProCon(payload))
});

class GearReviewFormProsCons extends Component {
  constructor(props) {
    super(props);
  }

  addGearReviewFormProCon = isPro => {
    this.props.addGearReviewFormProCon(isPro);
  };

  updateProCon = (text, index, isPro) => {
    const payload = Object.assign({}, { text, index, isPro });

    this.props.updateGearReviewFormProCon(payload);
  };

  handleProConDelete = (index, isPro) => {
    const payload = Object.assign({}, { index, isPro });

    this.props.removeGearReviewFormProCon(payload);
  };

  getTitleAndCta = isPro => {
    const title = isPro ? 'Pros' : 'Cons';
    const addCta = `+ Add ${title.substring(0, 3)}`.toUpperCase();
    return Object.assign({}, { title, addCta });
  };

  renderProsCons = (prosCons, isPro) => {
    return prosCons.map((proCon, index) => {
      return (
        <View style={styles.proConContainer}>
          <TextInput
            shadowColor="gray"
            shadowOffset={{ width: 0, height: 0 }}
            shadowOpacity={0.5}
            shadowRadius={2}
            multiline
            style={[styles.prosCons, { maxWidth: this.props.width - 80 }]}
            selectionColor="#FF5423"
            onChangeText={text => this.updateProCon(text, index, isPro)}
            value={proCon.text}
          />
          <TouchableWithoutFeedback
            onPress={() => this.handleProConDelete(index, isPro)}
          >
            <MaterialIcons name="delete" size={20} style={styles.icons} />
          </TouchableWithoutFeedback>
        </View>
      );
    });
  };

  renderProsConsContainer(listItems, isPro) {
    const { title, addCta } = this.getTitleAndCta(isPro);

    return (
      <View style={styles.marginBottom5}>
        <Text style={styles.label}>{title}</Text>
        {this.renderProsCons(listItems, isPro)}
        <TouchableWithoutFeedback
          onPress={() => this.addGearReviewFormProCon(isPro)}
        >
          <View style={styles.marginTop5}>
            <Text style={styles.addCta}>{addCta}</Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
    );
  }

  render() {
    const { pros, cons } = this.props;

    return (
      <View style={styles.marginTopBottom20}>
        {this.renderProsConsContainer(pros, true)}
        {this.renderProsConsContainer(cons, false)}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  proConContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  marginTopBottom20: {
    marginTop: 20,
    marginBottom: 20
  },
  addCta: {
    fontFamily: 'open-sans-regular',
    color: '#323941'
  },
  marginTop5: {
    marginTop: 5
  },
  marginBottom5: {
    marginBottom: 5
  },
  label: { fontFamily: 'playfair', color: '#323941', fontSize: 18 },
  icons: {
    width: 40,
    textAlign: 'right'
  },
  prosCons: {
    marginTop: 5,
    marginBottom: 5,
    fontSize: 16,
    flexGrow: 1,
    borderWidth: 1,
    fontFamily: 'open-sans-regular',
    padding: 5,
    borderRadius: 5,
    backgroundColor: 'white',
    borderColor: '#d3d3d3'
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GearReviewFormProsCons);
