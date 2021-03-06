import React, { Component } from 'react';
import {
  View,
  Image,
  Text,
  TouchableWithoutFeedback,
  StyleSheet
} from 'react-native';
import { connect } from 'react-redux';
import {
  getUserJournals,
  handleJournalPress
} from '../../actions/gear_review_form';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { journalBackground } from '../../assets/images/stockPhotos.js';

const mapStateToProps = state => ({
  width: state.common.width,
  journals: state.gearReviewForm.userJournals,
  journalIds: state.gearReviewForm.journalIds
});

const mapDispatchToProps = dispatch => ({
  getUserJournals: payload => dispatch(getUserJournals(payload)),
  handleJournalPress: payload => dispatch(handleJournalPress(payload))
});

class GearReviewFormJournals extends Component {
  constructor(props) {
    super(props);

    this.state = {
      menuOpen: false
    };
  }

  componentWillMount() {
    this.props.getUserJournals();
  }

  toggleMenu = () => {
    const { menuOpen } = this.state;

    this.setState({
      menuOpen: !menuOpen
    });
  };

  handleJournalPress = id => {
    this.props.handleJournalPress(id);
  };

  renderJournalOption = (journal, index) => {
    const isIncluded = this.props.journalIds.includes(journal.id);
    let { cardBannerImageUrl } = journal;
    cardBannerImageUrl =
      cardBannerImageUrl.length > 0 ? cardBannerImageUrl : journalBackground;

    return (
      <TouchableWithoutFeedback
        key={journal.id}
        onPress={() => this.handleJournalPress(journal.id)}
      >
        <View key={journal.id} style={styles.journalOptionContainer}>
          <View style={styles.flexRowCenter}>
            <Image
              source={{ uri: cardBannerImageUrl }}
              style={styles.journalImage}
            />
            <Text style={styles.journalTitle}>{journal.title}</Text>
          </View>
          <MaterialCommunityIcons
            name={'check-circle-outline'}
            size={25}
            color={isIncluded ? '#82CA9C' : 'lightgray'}
          />
        </View>
      </TouchableWithoutFeedback>
    );
  };

  renderJournalOptions() {
    return this.props.journals.map((journal, index) => {
      return this.renderJournalOption(journal, index);
    });
  }

  renderDropdown = () => {
    if (!this.state.menuOpen) return;

    return (
      <View
        shadowColor="gray"
        shadowOffset={{ width: 0, height: 0 }}
        shadowOpacity={0.5}
        shadowRadius={2}
      >
        <View style={styles.journalsContainer}>
          {this.renderJournalOptions()}
        </View>
      </View>
    );
  };

  getJournalLabelText() {
    const { journalIds } = this.props;
    let journal = 'JOURNAL';

    if (journalIds.length === 0 || journalIds.length > 1) {
      journal = 'JOURNALS';
    }

    return `${journalIds.length} ${journal} SELECTED`;
  }

  renderDropdownIcon() {
    const icon = this.state.menuOpen ? 'chevron-up' : 'chevron-down';

    return <MaterialCommunityIcons name={icon} size={20} />;
  }

  render() {
    return (
      <View>
        <TouchableWithoutFeedback onPress={this.toggleMenu}>
          <View
            style={styles.menu}
            shadowColor="gray"
            shadowOffset={{ width: 0, height: 0 }}
            shadowOpacity={0.5}
            shadowRadius={2}
          >
            <Text style={styles.journalLabelText}>
              {this.getJournalLabelText()}
            </Text>
            {this.renderDropdownIcon()}
          </View>
        </TouchableWithoutFeedback>
        {this.renderDropdown()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  menu: {
    height: 50,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    alignItems: 'center',
    paddingRight: 15,
    paddingLeft: 15,
    width: '100%',
    borderRadius: 5
  },
  journalOptionContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    paddingRight: 10,
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  journalsContainer: {
    backgroundColor: 'white',
    borderRadius: 5,
    marginTop: 10,
    overflow: 'hidden'
  },
  journalImage: {
    width: 50,
    height: 50,
    marginRight: 15
  },
  flexRowCenter: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  journalTitle: {
    fontFamily: 'playfair',
    color: '#323941'
  },
  journalLabelText: {
    fontFamily: 'overpass'
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GearReviewFormJournals);
