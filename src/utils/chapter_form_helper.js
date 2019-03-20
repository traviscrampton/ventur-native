import { AsyncStorage } from "react-native"
import _ from "lodash"
import { setToken, API_ROOT } from "agent"
import DropDownHolder from "utils/DropdownHolder"
import { persistChapterToAsyncStorage, findChapter } from "utils/offline_helpers"

export const offlineChapterCreate = async (chapter, reduxCallback) => {
  const localId = "Created on " + Date.now()
  let localIdChapter = Object.assign(chapter, { id: localId })
  let persistableChapter = _.omit(localIdChapter, "journals")
  await persistChapterToAsyncStorage(persistableChapter, reduxCallback)

  return localIdChapter
}

export const updateChapter = async (id, params, callback) => {
  let formData = new FormData()
  formData.append("id", params.id)
  formData.append("title", params.title)
  formData.append("distance", params.distance)
  formData.append("date", new Date(params.date).toUTCString())
  formData.append("journalId", params.journalId)

  if (params.bannerImage.needsUpload) {
    formData.append("banner_image", params.bannerImage)
  }

  const token = await setToken()
  fetch(`${API_ROOT}/chapters/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: token
    },
    body: formData
  })
    .then(response => {
      return response.json()
    })
    .then(data => {
      if (data.errors) {
        throw Error(data.errors.join(", "))
      }
      
      callback(data.chapter)
    })
    .catch(err => {
      DropDownHolder.alert("error", "Error", err)
    })
}

export const createChapter = async (params, callback) => {
  let formData = new FormData()
  formData.append("id", params.id)
  formData.append("title", params.title)
  formData.append("offline", params.offline)
  formData.append("distance", params.distance)
  formData.append("journalId", params.journalId)
  if (params.bannerImage.needsUpload) {
    formData.append("banner_image", params.bannerImage)
  }
  const token = await setToken()
  fetch(`${API_ROOT}/chapters`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token
    },
    body: formData
  })
    .then(response => {
      return response.json()
    })
    .then(data => {
      if (data.errors) {
        throw Error(data.errors.join(", "))
      }
      callback(data.chapter)
    })
    .catch(err => {
      DropDownHolder.alert("error", "Error", err)
    })
}

const MONTHS = [
  "January",
  "Feburary",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
]

export const generateReadableDate = date => {
  let month = MONTHS[date.getMonth()]
  let day = " " + date.getDate() + ", "
  let year = date.getFullYear()

  return month + day + year
}
