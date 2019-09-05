import {
  UPDATE_GEAR_REVIEW_TITLE,
  UPDATE_GEAR_REVIEW_REVIEW,
  UPDATE_GEAR_REVIEW_STAR_RATING,
  UPDATE_GEAR_REVIEW_PRO,
  UPDATE_GEAR_REVIEW_CON,
  DELETE_GEAR_REVIEW_PRO,
  DELETE_GEAR_REVIEW_CON
} from "../actions/gear_review_form"

const defaultGearForm = {
  gearItemId: null,
  name: "Ortlieb top roller",
  images: [],
  rating: 4,
  pros: [
    { id: 1, text: "waterproof beyond belief", isPro: true },
    { id: 2, text: "very durable, and sealed", isPro: true },
    { id: 3, text: "nice material", isPro: true }
  ],
  cons: [{ id: 4, text: "dirty clothes stick up whole bag" }],
  review:
    "What is there to say about these bags that hasn't said before? I think this is one of the greatest inventions that cycle touring has ever had and I am confident in that fact. I mean take a think about it, isn't it amazing and isn't this a really long text that I am writing, i mean come on thats ridiculous!"
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
        pros: Object.assign([], state.pros, { [payload.index]: payload.proCon })
      }

    case UPDATE_GEAR_REVIEW_CON:
      return {
        ...state,
        cons: Object.assign([], state.pros, { [payload.index]: payload.proCon })
      }

    case DELETE_GEAR_REVIEW_PRO:
      return {
        ...state,
        pros: [...state.pros.slice(0, action.payload), ...state.pros.slice(action.payload + 1)]
      }
    case DELETE_GEAR_REVIEW_CON:
      return {
        ...state,
        cons: [...state.cons.slice(0, action.payload), ...state.cons.slice(action.payload + 1)]
      }
    default:
      return state
  }
}
