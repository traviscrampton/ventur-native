import { INITIAL_ACTIVITY_LOAD, ADD_TO_SELECTED_IDS, REMOVE_FROM_SELECTED_IDS } from "actions/strava_activity_import"

const defaultData = {
  activities: [],
  selectedIds: [2537283604, 2514792205]
}

export default (state = defaultData, action) => {
  switch (action.type) {
    case INITIAL_ACTIVITY_LOAD:
      return {
        ...state,
        activities: action.payload
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
