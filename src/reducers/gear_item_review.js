import { POPULATE_GEAR_ITEM_REVIEW, RESET_GEAR_ITEM_REVIEW } from "../actions/gear_item_review"

const defaultGearItemReview = {
  id: null,
  name: "",
  userId: null,
  gearItem: {
    id: null,
    name: null,
    imageUrl: ""
  },
  images: [],
  review: "",
  rating: "",
  pros: [],
  cons: [],
  loading: false
}

export default (state = defaultGearItemReview, action) => {
  switch (action.type) {
    case POPULATE_GEAR_ITEM_REVIEW:
      return Object.assign({}, state, action.payload)
    case RESET_GEAR_ITEM_REVIEW:
      return defaultGearItemReview
    default:
      return state
  }
}
