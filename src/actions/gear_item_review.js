import { get, destroy } from "../agent"

export const POPULATE_GEAR_ITEM_REVIEW = "POPULATE_GEAR_ITEM_REVIEW"
export function populateGearItemReview(payload) {
  return {
    type: POPULATE_GEAR_ITEM_REVIEW,
    payload: payload
  }
}

export function deleteGearReview() {
  return async function(dispatch, getState) {
    const { id } = getState().gearItemReview
    const res = await destroy(`/gear_item_reviews/${id}`)
    dispatch(removeGearReview(id))
  }
}

export const REMOVE_GEAR_REVIEW = "REMOVE_GEAR_REVIEW"
export function removeGearReview(payload) {
  return {
    type: REMOVE_GEAR_REVIEW,
    payload: payload
  }
}

export const RESET_GEAR_ITEM_REVIEW = RESET_GEAR_ITEM_REVIEW
export function resetGearItemReview() {
  return {
    type: RESET_GEAR_ITEM_REVIEW
  }
}

export function fetchGearItem(id) {
  return async function(dispatch, getState) {
    let gearItemReview = await get(`/gear_item_reviews/${id}`)
    gearItemReview = Object.assign({}, gearItemReview, {
      images: typeof gearItemReview.images === "string" ? JSON.parse(gearItemReview.images) : gearItemReview.images,
      loading: false  
    })

    dispatch(populateGearItemReview(gearItemReview))
  }
}
