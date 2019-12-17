import { POPULATE_JOURNAL_FEED, TOGGLE_REFRESH } from '../actions/journals';
import { ADD_TO_JOURNAL_FEED } from '../actions/journal_form';
import { UPDATE_FEED_DISTANCE } from '../actions/chapter_form';

const defaultJournalData = {
  allJournals: [],
  failedRequest: false,
  refreshing: false
};

export default (state = defaultJournalData, action) => {
  switch (action.type) {
    case POPULATE_JOURNAL_FEED:
      return {
        ...state,
        allJournals: action.payload
      };

    case TOGGLE_REFRESH:
      return {
        ...state,
        refreshing: action.payload
      };

    case ADD_TO_JOURNAL_FEED:
      return {
        ...state,
        allJournals: action.payload
      };

    case UPDATE_FEED_DISTANCE:
      return {
        ...state,
        allJournals: action.payload
      };
    default:
      return state;
  }
};
