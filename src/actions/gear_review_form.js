export const UPDATE_GEAR_REVIEW_TITLE = "UPDATE_GEAR_REVIEW_TITLE"
export function updateGearReviewFormTitle(payload) {
  return {
    type: UPDATE_GEAR_REVIEW_TITLE,
    payload: payload
  }
}

export const UPDATE_GEAR_REVIEW_REVIEW = "UPDATE_GEAR_REVIEW_REVIEW"
export function updateGearReviewFormReview(payload) {
  return {
    type: UPDATE_GEAR_REVIEW_REVIEW,
    payload: payload
  }
}

export const UPDATE_GEAR_REVIEW_STAR_RATING = "UPDATE_GEAR_REVIEW_STAR_RATING"
export function updateGearReviewFormStarRating(payload) {
  return {
    type: UPDATE_GEAR_REVIEW_STAR_RATING,
    payload: payload
  }
}

export function updateGearReviewFormProCon(payload) {
  return function(dispatch, getState) {
    const { gearReviewForm } = getState()
    let { isPro, text, index } = payload
    
    let proCon = isPro ? gearReviewForm.pros[index] : gearReviewForm.cons[index]
    proCon = Object.assign({}, proCon, { text })
    const newPayload = Object.assign({}, { proCon, index })

    if (isPro) {
      dispatch(updateGearReviewFormPro(newPayload))
    } else {
      dispatch(updateGearReviewFormPro(newPayload))
    }
  }
}

export const UPDATE_GEAR_REVIEW_PRO = "UPDATE_GEAR_REVIEW_PRO"
export function updateGearReviewFormPro(payload) {
  return {
    type: UPDATE_GEAR_REVIEW_PRO,
    payload: payload
  }
}

export const UPDATE_GEAR_REVIEW_CON = "UPDATE_GEAR_REVIEW_CON"
export function updateGearReviewFormCon(payload) {
  return {
    type: UPDATE_GEAR_REVIEW_CON,
    payload: payload
  }
}

export const REMOVE_GEAR_REVIEW_PRO = "REMOVE_GEAR_REVIEW_PRO"
export const REMOVE_GEAR_REVIEW_CON = "REMOVE_GEAR_REVIEW_CON"
