import { POPULATE_JOURNAL_ROUTE } from '../actions/journal_route';

const defaultRouteData = {
  id: null,
  polylines: [[]],
  initialRegion: {}
};

export default (state = defaultRouteData, action) => {
  switch (action.type) {
    case POPULATE_JOURNAL_ROUTE:
      return {
        ...state,
        initialRegion: action.payload.initialRegion,
        polylines: action.payload.polylines,
        id: action.payload.id
      };

    default:
      return state;
  }
};
