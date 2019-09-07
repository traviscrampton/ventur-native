import { ImageManipulator } from "expo"
import { get, post } from "../agent"
import { awsUpload, cloudFrontUrlLength, deleteS3Objects } from "../utils/image_uploader"
const uuid = require("react-native-uuid")

export const TOGGLE_IMAGE_UPLOADING = "TOGGLE_IMAGE_UPLOADING"
export function setImageUploadingTrue() {
  return {
    type: TOGGLE_IMAGE_UPLOADING,
    payload: true
  }
}

export function triggerGearReviewFormFromJournal(journalId) {
  return async function(dispatch, getState) {
    let payload = Object.assign({}, { journalIds: [journalId] })
    dispatch(populateGearItemReviewForm(payload))
    dispatch(toggleGearReviewFormModal(true))

  }
}

export const POPULATE_GEAR_ITEM_REVIEW_FORM = "POPULATE_GEAR_ITEM_REVIEW_FORM"
export function populateGearItemReviewForm(payload) {
  return {
    type: POPULATE_GEAR_ITEM_REVIEW_FORM,
    payload: payload
  }
}

export const TOGGLE_GEAR_REVIEW_FORM_MODAL = "TOGGLE_GEAR_REVIEW_FORM_MODAL"
export function toggleGearReviewFormModal(payload) {
  return {
    type: TOGGLE_GEAR_REVIEW_FORM_MODAL,
    payload: payload
  }
}

export function persistGearReview() {
  return async function(dispatch, getState) {
    let { id, name, images, rating, pros, cons, review, journalIds, gearItem } = getState().gearReviewForm

    cons = JSON.stringify(cons)
    pros = JSON.stringify(pros)
    images = JSON.stringify(images)
    journalIds = JSON.stringify(journalIds)

    const params = Object.assign(
      {},
      {
        gearItemId: gearItem.id,
        name,
        images,
        rating,
        cons,
        pros,
        journalIds
      }
    )

    if (id) {
      dispatch(updateGearReview(params))
    } else {
      dispatch(createGearReview(params))
    }
  }
}

export function createGearReview(params) {
  return async function(dispatch, getState) {
    const res = await post("/gear_item_reviews", params)
  }
}

export const POPULATE_FORM_WITH_GEAR_ITEM = "POPULATE_FORM_WITH_GEAR_ITEM"
export function populateFormWithGearItem(payload) {
  console.log("in action atleast", payload)
  return {
    type: POPULATE_FORM_WITH_GEAR_ITEM,
    payload: payload
  }
}

export const TOGGLE_DROPDOWN = "TOGGLE_DROPDOWN"
export function toggleDropdown(payload) {
  return {
    type: TOGGLE_DROPDOWN,
    payload: payload
  }
}

export function searchForGearItems(name) {
  return async function(dispatch, getState) {
    const res = await get("/gear_items/item_search", { name })
    const { gearItems } = res
    dispatch(setGearItems(gearItems))
  }
}

export const SET_GEAR_ITEMS = "SET_GEAR_ITEMS"
export function setGearItems(payload) {
  return {
    type: SET_GEAR_ITEMS,
    payload: payload
  }
}

export const REMOVE_IMAGE = "REMOVE_IMAGE"
export function removeImage(payload) {
  return {
    type: REMOVE_IMAGE,
    payload: payload
  }
}

export const UPDATE_ACTIVE_IMAGE_INDEX = "UPDATE_ACTIVE_IMAGE_INDEX"
export function updateActiveImageIndex(payload) {
  return {
    type: UPDATE_ACTIVE_IMAGE_INDEX,
    payload: payload
  }
}

export function setImageUploadingFalse() {
  return {
    type: TOGGLE_IMAGE_UPLOADING,
    payload: false
  }
}

export const SET_LOADING_IMAGE_FIRST = "SET_LOADING_IMAGE_FIRST"
export function setLoadingImageFirst(payload) {
  return {
    type: SET_LOADING_IMAGE_FIRST,
    payload: payload
  }
}

export const resizeImage = async image => {
  let maxWidth = 2000
  let { width, height, uri } = image

  if (width > maxWidth) {
    height = height * (maxWidth / width)
    width = maxWidth
  }

  let updatedImage = await ImageManipulator.manipulateAsync(image.uri, [{ resize: { width: width, height: height } }], {
    compress: 0,
    format: "jpg",
    base64: false
  })

  return Object.assign({}, image, updatedImage)
}

export function uploadImageToCarousel(payload) {
  return async function(dispatch, getState) {
    // set loading true
    dispatch(setImageUploadingTrue())
    let {
      common: { awsAccessKey, awsSecretKey }
    } = getState()
    const awsKeys = Object.assign({}, { accessKey: awsAccessKey, secretKey: awsSecretKey })

    // create local uri object for loading
    const localUri = payload.uri
    const localObject = Object.assign({}, { localUri })
    dispatch(setLoadingImageFirst(localObject))

    // resize image and upload
    const image = await resizeImage(payload)
    let filename = image.filename.split(".")[0] + uuid.v1() + "." + "jpg"
    let file = Object.assign({}, { uri: image.uri, name: filename, type: "image/jpg" })
    const uri = await awsUpload(file, awsKeys)

    // generateUrls and create object
    const carouselObj = createImageCarouselObj(uri)
    const indexOfLoadingImage = getState().gearReviewForm.images.indexOf(localObject)
    const carouselPayload = Object.assign({}, { image: carouselObj, index: indexOfLoadingImage })

    dispatch(updateImageInCarousel(carouselPayload))
    dispatch(addUriToNewlyAddedImages(uri))
    dispatch(setImageUploadingFalse())
  }
}

export const ADD_URI_TO_NEWLY_ADDED_IMAGES = "ADD_URI_TO_NEWLY_ADDED_IMAGES"
export function addUriToNewlyAddedImages(payload) {
  return {
    type: ADD_URI_TO_NEWLY_ADDED_IMAGES,
    payload: payload
  }
}

export const UPDATE_IMAGE_IN_CAROUSEL = "UPDATE_IMAGE_IN_CAROUSEL"
export function updateImageInCarousel(payload) {
  return {
    type: UPDATE_IMAGE_IN_CAROUSEL,
    payload: payload
  }
}

export const createImageCarouselObj = uri => {
  let newUriObject = Object.assign(
    {},
    {
      thumbnailUri: createResizeImgUri(uri, 100, 100),
      largeUri: createResizeImgUri(uri, 1000, 1000),
      originalUri: uri
    }
  )

  return newUriObject
}

export const createResizeImgUri = (originalUri, newWidth, newHeight) => {
  return (
    originalUri.slice(0, cloudFrontUrlLength) +
    `/fit-in/${newWidth}x${newHeight}` +
    originalUri.slice(cloudFrontUrlLength)
  )
}

export const UPDATE_GEAR_REVIEW_TITLE = "UPDATE_GEAR_REVIEW_TITLE"
export function updateGearReviewFormTitle(payload) {
  return async function(dispatch, getState) {
    let { id, title } = getState().gearReviewForm.gearItem

    if (id && payload !== title) {
      dispatch(resetGearItem())
    }

    dispatch(updateGearReviewName(payload))
  }
}

export const RESET_GEAR_ITEM = "RESET_GEAR_ITEM"
export function resetGearItem() {
  return {
    type: RESET_GEAR_ITEM
  }
}

export function updateGearReviewName(payload) {
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
      dispatch(updateGearReviewFormCon(newPayload))
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

export function removeGearReviewFormProCon(payload) {
  return function(dispatch, getState) {
    const { index, isPro } = payload

    if (isPro) {
      dispatch(removeGearReviewFormPro(index))
    } else {
      dispatch(removeGearReviewFormCon(index))
    }
  }
}

export const REMOVE_GEAR_REVIEW_PRO = "REMOVE_GEAR_REVIEW_PRO"
export function removeGearReviewFormPro(payload) {
  return {
    type: REMOVE_GEAR_REVIEW_PRO,
    payload: payload
  }
}

export const REMOVE_GEAR_REVIEW_CON = "REMOVE_GEAR_REVIEW_CON"
export function removeGearReviewFormCon(payload) {
  return {
    type: REMOVE_GEAR_REVIEW_CON,
    payload: payload
  }
}

export function addGearReviewFormProCon(isPro) {
  return function(dispatch, getState) {
    const newPayload = Object.assign({}, { isPro: isPro, text: "", id: null })

    if (isPro) {
      dispatch(addGearReviewFormPro(newPayload))
    } else {
      dispatch(addGearReviewFormCon(newPayload))
    }
  }
}

export const ADD_GEAR_REVIEW_PRO = "ADD_GEAR_REVIEW_PRO"
export function addGearReviewFormPro(payload) {
  return {
    type: ADD_GEAR_REVIEW_PRO,
    payload: payload
  }
}

export const ADD_GEAR_REVIEW_CON = "ADD_GEAR_REVIEW_CON"
export function addGearReviewFormCon(payload) {
  return {
    type: ADD_GEAR_REVIEW_CON,
    payload: payload
  }
}
