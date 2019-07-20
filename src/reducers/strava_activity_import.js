import {
  INITIAL_ACTIVITY_LOAD,
  ADD_TO_SELECTED_IDS,
  REMOVE_FROM_SELECTED_IDS,
  ADD_TO_ACTIVITY_TO_IMPORT
} from "../actions/strava_activity_import"

const defaultData = {
  activities: [],
  selectedIds: [],
  activitiesToImport: [],
  importedActivites: []
}

export default (state = defaultData, action) => {
  switch (action.type) {
    case INITIAL_ACTIVITY_LOAD:
      return {
        ...state,
        activities: action.payload
      }
    case ADD_TO_ACTIVITY_TO_IMPORT:
      return {
        ...state,
        activitiesToImport: [...state.activitiesToImport, action.payload]
      }
    case ADD_TO_SELECTED_IDS:
      return {
        ...state,
        selectedIds: [...state.selectedIds, action.payload]
      }
    case REMOVE_FROM_SELECTED_IDS:
      return {
        ...state,
        selectedIds: state.selectedIds.filter(id => {
          return id !== action.payload
        })
      }
    default:
      return state
  }
}
