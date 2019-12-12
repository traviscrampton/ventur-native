import {
  UPDATE_GEAR_REVIEW_TITLE,
  UPDATE_GEAR_REVIEW_REVIEW,
  UPDATE_GEAR_REVIEW_STAR_RATING,
  UPDATE_GEAR_REVIEW_PRO,
  UPDATE_GEAR_REVIEW_CON,
  REMOVE_GEAR_REVIEW_PRO,
  REMOVE_GEAR_REVIEW_CON,
  ADD_GEAR_REVIEW_PRO,
  ADD_GEAR_REVIEW_CON,
  TOGGLE_IMAGE_UPLOADING,
  SET_LOADING_IMAGE_FIRST,
  ADD_URI_TO_NEWLY_ADDED_IMAGES,
  UPDATE_IMAGE_IN_CAROUSEL,
  UPDATE_ACTIVE_IMAGE_INDEX,
  REMOVE_IMAGE,
  TOGGLE_DROPDOWN,
  POPULATE_FORM_WITH_GEAR_ITEM,
  SET_GEAR_ITEMS,
  RESET_GEAR_ITEM,
  POPULATE_GEAR_ITEM_REVIEW_FORM,
  TOGGLE_GEAR_REVIEW_FORM_MODAL,
  POPULATE_GEAR_JOURNALS,
  ADD_TO_JOURNAL_IDS,
  REMOVE_FROM_JOURNAL_IDS,
  DEFAULT_GEAR_REVIEW_FORM
} from "../actions/gear_review_form";

const defaultGearForm = {
  id: null,
  gearItem: {
    id: null,
    name: null
  },
  name: "",
  images: [],
  rating: 1,
  pros: [],
  cons: [],
  review: "",
  journalIds: [],
  imageUploading: false,
  activeImageIndex: null,
  urisSetForDelete: [],
  journalIds: [],
  newlyCreatedUris: [],
  gearItemSuggestions: [],
  dropdownOpen: false,
  visible: false,
  userJournals: []
};

export default (state = defaultGearForm, action) => {
  switch (action.type) {
    case DEFAULT_GEAR_REVIEW_FORM:
      return defaultGearForm;
    case TOGGLE_GEAR_REVIEW_FORM_MODAL:
      return {
        ...state,
        visible: action.payload
      };
    case UPDATE_GEAR_REVIEW_TITLE:
      return {
        ...state,
        name: action.payload
      };
    case RESET_GEAR_ITEM:
      return {
        ...state,
        gearItem: defaultGearForm.gearItem
      };

    case POPULATE_GEAR_ITEM_REVIEW_FORM:
      return Object.assign({}, state, action.payload);

    case UPDATE_GEAR_REVIEW_REVIEW:
      return {
        ...state,
        review: action.payload
      };

    case UPDATE_GEAR_REVIEW_STAR_RATING:
      return {
        ...state,
        rating: action.payload
      };

    case UPDATE_GEAR_REVIEW_PRO:
      return {
        ...state,
        pros: Object.assign([], state.pros, {
          [action.payload.index]: action.payload.proCon
        })
      };

    case UPDATE_GEAR_REVIEW_CON:
      return {
        ...state,
        cons: Object.assign([], state.cons, {
          [action.payload.index]: action.payload.proCon
        })
      };

    case REMOVE_GEAR_REVIEW_PRO:
      return {
        ...state,
        pros: [
          ...state.pros.slice(0, action.payload),
          ...state.pros.slice(action.payload + 1)
        ]
      };
    case REMOVE_GEAR_REVIEW_CON:
      return {
        ...state,
        cons: [
          ...state.cons.slice(0, action.payload),
          ...state.cons.slice(action.payload + 1)
        ]
      };

    case ADD_GEAR_REVIEW_PRO:
      return {
        ...state,
        pros: [...state.pros, action.payload]
      };
    case ADD_GEAR_REVIEW_CON:
      return {
        ...state,
        cons: [...state.cons, action.payload]
      };
    case TOGGLE_IMAGE_UPLOADING:
      return {
        ...state,
        imageUploading: action.payload
      };
    case SET_LOADING_IMAGE_FIRST:
      return {
        ...state,
        images: [action.payload, ...state.images],
        activeImageIndex: null
      };
    case ADD_URI_TO_NEWLY_ADDED_IMAGES:
      return {
        ...state,
        newlyCreatedUris: action.payload
      };

    case ADD_TO_JOURNAL_IDS:
      return {
        ...state,
        journalIds: [...state.journalIds, action.payload]
      };
    case REMOVE_FROM_JOURNAL_IDS:
      return {
        ...state,
        journalIds: state.journalIds.filter(journalId => {
          return journalId !== action.payload;
        })
      };
    case UPDATE_ACTIVE_IMAGE_INDEX:
      return {
        ...state,
        activeImageIndex: action.payload
      };
    case POPULATE_FORM_WITH_GEAR_ITEM:
      return {
        ...state,
        gearItem: Object.assign({}, action.payload),
        name: action.payload.name
      };

    case SET_GEAR_ITEMS:
      return {
        ...state,
        gearItemSuggestions: action.payload
      };
    case TOGGLE_DROPDOWN:
      return {
        ...state,
        dropdownOpen: action.payload
      };
    case POPULATE_GEAR_JOURNALS:
      return {
        ...state,
        userJournals: action.payload
      };
    case UPDATE_IMAGE_IN_CAROUSEL:
      return {
        ...state,
        images: Object.assign([], state.images, {
          [action.payload.index]: action.payload.image
        })
      };
    case REMOVE_IMAGE:
      return {
        ...state,
        images: [
          ...state.images.slice(0, action.payload.index),
          ...state.images.slice(action.payload.index + 1)
        ],
        urisSetForDelete: [...state.urisSetForDelete, action.payload.uri],
        activeImageIndex: null
      };
    default:
      return state;
  }
};
