import {
  POPULATE_SINGLE_JOURNAL,
  RESET_JOURNAL_TAB,
  IMAGE_UPLOADING,
  POPULATE_JOURNAL_CHAPTERS,
  POPULATE_JOURNAL_GEAR,
  UPDATE_TAB_INDEX,
  SUB_CONTENT_LOADING
} from '../actions/journals';
import { REMOVE_CHAPTER_FROM_STATE } from '../actions/chapter';
import { PUSH_CHAPTER_TO_JOURNAL } from '../actions/chapter_form';
import { REMOVE_GEAR_REVIEW } from '../actions/gear_item_review';
import { ADD_CREATED_GEAR_REVIEW } from '../actions/gear_review_form';

const defaultJournalData = {
  journal: {
    user: {},
    chapters: [],
    gear: [],
    distance: {},
    countries: []
  },
  noRequest: false,
  loaded: false,
  imageUploading: false,
  subContentLoading: true,
  tabIndex: 0,
  routes: [
    { key: 'chapters', title: 'Chapters' },
    { key: 'gear', title: 'Gear' }
  ]
};

export default (state = defaultJournalData, action) => {
  switch (action.type) {
    case POPULATE_SINGLE_JOURNAL:
      return {
        ...state,
        journal: { ...state.journal, ...action.payload },
        loaded: true
      };
    case SUB_CONTENT_LOADING:
      return {
        ...state,
        subContentLoading: action.payload
      };
    case POPULATE_JOURNAL_CHAPTERS:
      return {
        ...state,
        journal: { ...state.journal, chapters: action.payload }
      };

    case POPULATE_JOURNAL_GEAR:
      return {
        ...state,
        journal: { ...state.journal, gear: action.payload }
      };
    case RESET_JOURNAL_TAB:
      return defaultJournalData;
    case REMOVE_CHAPTER_FROM_STATE:
      return {
        ...state,
        journal: {
          ...state.journal,
          chapters: state.journal.chapters.filter(chapter => {
            return chapter.id !== action.payload.id;
          })
        }
      };
    case IMAGE_UPLOADING:
      return {
        ...state,
        imageUploading: action.payload
      };

    case UPDATE_TAB_INDEX:
      return {
        ...state,
        tabIndex: action.payload
      };
    case ADD_CREATED_GEAR_REVIEW:
      return {
        ...state,
        journal: {
          ...state.journal,
          gear: [...state.journal.gear, action.payload]
        }
      };
    case REMOVE_GEAR_REVIEW:
      return {
        ...state,
        journal: {
          ...state.journal,
          gear: state.journal.gear.filter(gear => {
            return gear.id !== action.payload;
          })
        }
      };
    case PUSH_CHAPTER_TO_JOURNAL:
      return {
        ...state,
        journal: {
          ...state.journal,
          chapters: action.payload.chapters,
          distance: action.payload.distance
        }
      };
    default:
      return state;
  }
};
