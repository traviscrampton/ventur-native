import {
  UPDATE_JOURNAL_FORM,
  RESET_JOURNAL_FORM,
  TOGGLE_JOURNAL_FORM_MODAL,
  TOGGLE_COUNTRIES_EDITOR_MODAL
} from '../actions/journal_form';

const defaultJournalFormData = {
  id: null,
  title: '',
  description: '',
  status: 'not_started',
  distanceType: 'kilometers',
  includedCountries: [],
  visible: false,
  countriesEditorVisible: false
};

export default (state = defaultJournalFormData, action) => {
  switch (action.type) {
    case UPDATE_JOURNAL_FORM:
      return { ...state, ...action.payload };
    case RESET_JOURNAL_FORM:
      return defaultJournalFormData;
    case TOGGLE_JOURNAL_FORM_MODAL:
      return {
        ...state,
        visible: action.payload
      };
    case TOGGLE_COUNTRIES_EDITOR_MODAL:
      return {
        ...state,
        countriesEditorVisible: action.payload
      };
    default:
      return state;
  }
};
