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
  REMOVE_IMAGE
} from "../actions/gear_review_form"

const defaultGearForm = {
  gearItemId: null,
  name: "Ortlieb top roller",
  images: [{thumbnailUri: "", originalUri: "hey"}, {thumbnailUri: "", originalUri: "what"}],
  rating: 4,
  pros: [
    { id: 1, text: "waterproof beyond belief", isPro: true },
    { id: 2, text: "very durable, and sealed", isPro: true },
    { id: 3, text: "nice material", isPro: true }
  ],
  cons: [{ id: 4, text: "dirty clothes stick up whole bag" }],
  review:
    "What is there to say about these bags that hasn't said before? I think this is one of the greatest inventions that cycle touring has ever had and I am confident in that fact. I mean take a think about it, isn't it amazing and isn't this a really long text that I am writing, i mean come on thats ridiculous!",
  imageUploading: false,
  activeImageIndex: null,
  urisSetForDelete: [],
  newlyCreatedUris: []
}

export default (state = defaultGearForm, action) => {
  switch (action.type) {
    case UPDATE_GEAR_REVIEW_TITLE:
      return {
        ...state,
        name: action.payload
      }

    case UPDATE_GEAR_REVIEW_REVIEW:
      return {
        ...state,
        review: action.payload
      }

    case UPDATE_GEAR_REVIEW_STAR_RATING:
      return {
        ...state,
        rating: action.payload
      }

    case UPDATE_GEAR_REVIEW_PRO:
      return {
        ...state,
        pros: Object.assign([], state.pros, { [action.payload.index]: action.payload.proCon })
      }

    case UPDATE_GEAR_REVIEW_CON:
      return {
        ...state,
        cons: Object.assign([], state.cons, { [action.payload.index]: action.payload.proCon })
      }

    case REMOVE_GEAR_REVIEW_PRO:
      return {
        ...state,
        pros: [...state.pros.slice(0, action.payload), ...state.pros.slice(action.payload + 1)]
      }
    case REMOVE_GEAR_REVIEW_CON:
      return {
        ...state,
        cons: [...state.cons.slice(0, action.payload), ...state.cons.slice(action.payload + 1)]
      }

    case ADD_GEAR_REVIEW_PRO:
      return {
        ...state,
        pros: [...state.pros, action.payload]
      }
    case ADD_GEAR_REVIEW_CON:
      return {
        ...state,
        cons: [...state.cons, action.payload]
      }
    case TOGGLE_IMAGE_UPLOADING:
      return {
        ...state,
        imageUploading: action.payload
      }
    case SET_LOADING_IMAGE_FIRST:
      return {
        ...state,
        images: [action.payload, ...state.images],
        activeImageIndex: null
      }
    case ADD_URI_TO_NEWLY_ADDED_IMAGES:
      return {
        ...state,
        newlyCreatedUris: action.payload
      }
    case UPDATE_ACTIVE_IMAGE_INDEX: 
      return {
        ...state,
        activeImageIndex: action.payload
      }  
    case UPDATE_IMAGE_IN_CAROUSEL:
      return {
        ...state,
        images: Object.assign([], state.images, { [action.payload.index]: action.payload.image })
      }
    case REMOVE_IMAGE: 
      return {
        ...state,
        images: [...state.images.slice(0, action.payload.index), ...state.images.slice(action.payload.index + 1)],
        urisSetForDelete: [...state.urisSetForDelete, action.payload.uri],
        activeImageIndex: null
      }  
    default:
      return state
  }
}
