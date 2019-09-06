import { ImageManipulator } from "expo"
import { awsUpload, cloudFrontUrlLength, deleteS3Objects } from "../utils/image_uploader"
const uuid = require("react-native-uuid")

export const TOGGLE_IMAGE_UPLOADING = "TOGGLE_IMAGE_UPLOADING"
export function setImageUploadingTrue() {
  return {
    type: TOGGLE_IMAGE_UPLOADING,
    payload: true
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
    console.log("got da keys", awsKeys)

    // create local uri object for loading
    const localUri = payload.uri
    const localObject = Object.assign({}, { localUri })
    dispatch(setLoadingImageFirst(localObject))

    // resize image and upload
    const image = await resizeImage(payload)
    let filename = image.filename.split(".")[0] + uuid.v1() + "." + "jpg"
    let file = Object.assign({}, { uri: image.uri, name: filename, type: "image/jpg" })
    const uri = await awsUpload(file, awsKeys)
    console.log("got the URI", uri)

    // generateUrls and create object
    const carouselObj = createImageCarouselObj(uri)
    const indexOfLoadingImage = getState().gearReviewForm.images.indexOf(localObject)
    const carouselPayload = Object.assign({}, { image: carouselObj, index: indexOfLoadingImage })
    console.log("got the carousel payload", carouselPayload)

    dispatch(updateImageInCarousel(carouselPayload))
    dispatch(addUriToNewlyAddedImages(uri))
    dispatch(setImageUploadingFalse())
    console.log("made it out alive!")

    // send to aws get back url,

    // set up object to have original, thumbnail and large uri
    // find index of loading image

    // replace loading image at index, probably ( 0 ) but we should keep it programatic
    // set loading equal to false
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
