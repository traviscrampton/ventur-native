import {
  INITIAL_ACTIVITY_LOAD,
  ADD_TO_SELECTED_IDS,
  REMOVE_FROM_SELECTED_IDS,
  ADD_TO_ACTIVITY_TO_IMPORT,
  ADD_ACTIVITY_TO_INCLUDED_ACTIVITIES,
  SET_STRAVA_LOADING_TRUE,
  SET_STRAVA_LOADING_FALSE
} from '../actions/strava_activity_import';
import { POPULATE_MAP, ERASE_TOTAL_ROUTE } from '../actions/route_editor';

const defaultData = {
  activities: [],
  selectedIds: [],
  activitiesToImport: [],
  includedActivities: [],
  stravaLoading: false
};

export default (state = defaultData, action) => {
  switch (action.type) {
    case INITIAL_ACTIVITY_LOAD:
      return {
        ...state,
        activities: action.payload
      };
    case POPULATE_MAP:
      return {
        ...state,
        includedActivities: action.payload.includedActivities,
        selectedIds: action.payload.includedActivities.map(activity => {
          return activity.id;
        })
      };
    case SET_STRAVA_LOADING_TRUE:
      return {
        ...state,
        stravaLoading: true
      };
    case SET_STRAVA_LOADING_FALSE:
      return {
        ...state,
        stravaLoading: false,
        includedActivities: defaultData.includedActivities
      };
    case ERASE_TOTAL_ROUTE:
      return {
        ...state,
        includedActivities: defaultData.includedActivities,
        selectedIds: defaultData.selectedIds
      };
    case ADD_TO_ACTIVITY_TO_IMPORT:
      return {
        ...state,
        activitiesToImport: [...state.activitiesToImport, action.payload]
      };

    case ADD_ACTIVITY_TO_INCLUDED_ACTIVITIES:
      return {
        ...state,
        includedActivities: [...state.includedActivities, action.payload]
      };
    case ADD_TO_SELECTED_IDS:
      return {
        ...state,
        selectedIds: [...state.selectedIds, action.payload]
      };
    case REMOVE_FROM_SELECTED_IDS:
      return {
        ...state,
        selectedIds: state.selectedIds.filter(id => {
          return id !== action.payload;
        })
      };
    default:
      return state;
  }
};
