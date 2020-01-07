import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  StyleSheet,
  View,
  Text,
  TouchableWithoutFeedback,
  TextInput
} from 'react-native';
import { get } from '../../agent';
import { Header } from '../editor/header';
import {
  updateJournalForm,
  toggleCountriesEditorModal
} from '../../actions/journal_form';
import { Feather } from '@expo/vector-icons';
import FormModal from '../shared/FormModal';

const mapStateToProps = state => ({
  visible: state.journalForm.countriesEditorVisible
});

const mapDispatchToProps = dispatch => ({
  updateJournalForm: payload => dispatch(updateJournalForm(payload)),
  toggleCountriesEditorModal: payload =>
    dispatch(toggleCountriesEditorModal(payload))
});

class CountriesEditor extends Component {
  constructor(props) {
    super(props);

    this.state = {
      searchText: '',
      searchResultCountries: [],
      includedCountries: props.includedCountries
    };
  }

  componentDidUpdate(prevProps, prevState) {
    if (!prevProps.visible && this.props.visible) {
      this.setState({ includedCountries: this.props.includedCountries });
    }
  }

  handleTextChange = text => {
    this.setState({ searchText: text }, this.searchForCountries);
  };

  searchForCountries() {
    get('/countries/search_countries', { name: this.state.searchText }).then(
      res => {
        this.setState({ searchResultCountries: res.countries });
      }
    );
  }

  countryAlreadyIncluded = searchCountry => {
    const includedCountryIds = this.state.includedCountries.map(
      includedCountry => {
        return includedCountry.id;
      }
    );

    return includedCountryIds.includes(searchCountry.id);
  };

  addCountries = () => {
    const { includedCountries } = this.state;
    const payload = Object.assign({}, { includedCountries });
    this.props.updateJournalForm(payload);
    this.handleGoBack();
  };

  handleGoBack = () => {
    const { includedCountries } = this.props;
    this.setState({ includedCountries });
    this.props.toggleCountriesEditorModal(false);
  };

  includeCountry = searchCountry => {
    if (this.countryAlreadyIncluded(searchCountry)) return;

    const newIncludedCountries = [
      ...this.state.includedCountries,
      searchCountry
    ];
    this.setState({ includedCountries: newIncludedCountries, searchText: '' });
  };

  removeCountry = countryToRemove => {
    const newCountries = this.state.includedCountries.filter(
      includedCountry => includedCountry.id !== countryToRemove.id
    );

    this.setState({ includedCountries: newCountries });
  };

  renderSearchBar() {
    return (
      <View>
        <TextInput
          shadowColor="gray"
          shadowOffset={{ width: 0, height: 0 }}
          shadowOpacity={0.5}
          shadowRadius={2}
          style={styles.searchBarTextInput}
          autoFocus
          selectionColor="#FF5423"
          value={this.state.searchText}
          placeholderTextColor={'darkgray'}
          placeholder={'Type to find country'}
          onChangeText={text => this.handleTextChange(text)}
        />
      </View>
    );
  }

  renderSearchResult(searchCountry) {
    return (
      <TouchableWithoutFeedback
        onPress={() => this.includeCountry(searchCountry)}
      >
        <View style={styles.searchResult} key={searchCountry.id}>
          <Text style={styles.countryName}>{searchCountry.name}</Text>
        </View>
      </TouchableWithoutFeedback>
    );
  }

  renderSearchResults() {
    if (
      this.state.searchText.length < 1 ||
      this.state.searchResultCountries.lengty < 1
    )
      return;

    return (
      <View
        shadowColor="gray"
        shadowOffset={{ width: 0, height: 0 }}
        shadowOpacity={0.5}
        shadowRadius={2}
        style={styles.searchResultsContainer}
      >
        <View style={styles.searchResultView}>
          {this.state.searchResultCountries.map((searchCountry, index) => {
            return this.renderSearchResult(searchCountry);
          })}
        </View>
      </View>
    );
  }

  renderIncludedCountryTab(includedCountry, index) {
    return (
      <View
        shadowColor="gray"
        shadowOffset={{ width: 0, height: 0 }}
        shadowOpacity={0.5}
        shadowRadius={2}
        style={styles.includedCountriesTab}
        key={includedCountry.id}
      >
        <Text style={styles.fontSize18}>{includedCountry.name}</Text>
        <TouchableWithoutFeedback
          onPress={() => this.removeCountry(includedCountry)}
        >
          <Feather style={styles.marginLeft15} name="x" size={18} />
        </TouchableWithoutFeedback>
      </View>
    );
  }

  renderHeader() {
    const headerProps = Object.assign(
      {},
      {
        goBackCta: 'Cancel',
        handleGoBack: this.handleGoBack,
        centerCta: 'Add Countries',
        handleConfirm: this.addCountries,
        confirmCta: 'Done'
      }
    );
    return <Header key="header" {...headerProps} />;
  }

  renderIncludedCountries() {
    return (
      <View style={styles.alreadyIncludedCountries}>
        {this.state.includedCountries.map((includedCountry, index) => {
          return this.renderIncludedCountryTab(includedCountry, index);
        })}
      </View>
    );
  }

  renderComponents() {
    return Object.assign(
      {},
      {
        searchBar: this.renderSearchBar(),
        searchResults: this.renderSearchResults(),
        includedCountries: this.renderIncludedCountries(),
        header: this.renderHeader()
      }
    );
  }

  render() {
    const {
      searchBar,
      searchResults,
      includedCountries,
      header
    } = this.renderComponents();

    return (
      <FormModal visible={this.props.visible}>
        {header}
        <View style={styles.container}>
          <View style={styles.searchBarAndResult}>
            {searchBar}
            {searchResults}
          </View>
          {includedCountries}
        </View>
      </FormModal>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 25,
    marginTop: 10
  },
  searchBarAndResult: {
    position: 'relative',
    zIndex: 10
  },
  alreadyIncludedCountries: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 20
  },
  fontSize18: {
    fontSize: 18
  },
  includedCountriesTab: {
    borderWidth: 1,
    borderColor: '#d3d3d3',
    borderRadius: 5,
    backgroundColor: 'white',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 5,
    marginRight: 10,
    marginBottom: 10
  },
  searchBarTextInput: {
    borderWidth: 1,
    borderColor: '#d3d3d3',
    borderRadius: 5,
    padding: 5,
    fontSize: 18,
    backgroundColor: 'white'
  },
  searchResult: {
    borderBottomWidth: 1,
    backgroundColor: 'white',
    borderBottomColor: '#d3d3d3',
    padding: 5,
    paddingTop: 10,
    paddingBottom: 10
  },
  searchResultsContainer: {
    position: 'absolute',
    top: 35,
    marginTop: 5,
    position: 'absolute',
    top: 35,
    width: '100%'
  },
  marginLeft15: {
    marginLeft: 15
  },
  searchResultView: {
    borderRadius: 5,
    backgroundColor: 'white',
    overflow: 'hidden'
  },
  countryName: {
    fontSize: 18,
    fontFamily: 'open-sans-regular'
  },
  formTitle: {},
  title: {}
});

export default connect(mapStateToProps, mapDispatchToProps)(CountriesEditor);
