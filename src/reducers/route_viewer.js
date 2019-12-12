import {
  POPULATE_ROUTE_VIEWER,
  DEFAULT_ROUTE_VIEWER
} from "../actions/route_viewer";

const defaultRouteData = {
  id: null,
  polylines: [[]],
  initialRegion: {}
};

export default (state = defaultRouteData, action) => {
  switch (action.type) {
    case POPULATE_ROUTE_VIEWER:
      return {
        ...state,
        initialRegion: action.payload.initialRegion,
        polylines: action.payload.polylines,
        id: action.payload.id
      };

    case DEFAULT_ROUTE_VIEWER:
      return defaultRouteData;

    default:
      return state;
  }
};
