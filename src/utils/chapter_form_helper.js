import { AsyncStorage } from "react-native"
import _ from "lodash"
import { setToken, API_ROOT } from "agent"
import { persistChapterToAsyncStorage, findChapter } from "utils/offline_helpers"

export const offlineChapterCreate = async (chapter, reduxCallback) => {
  const localId = "Created on " + Date.now()
  let localIdChapter = Object.assign(chapter, { id: localId })
  let persistableChapter = _.omit(localIdChapter, "journals")
  await persistChapterToAsyncStorage(persistableChapter, reduxCallback)

  return localIdChapter
}

export const updateChapter = async (id, params, callback) => {
  const token = await setToken()
  fetch(`${API_ROOT}/chapters/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: token
    },
    body: JSON.stringify(params)
  })
    .then(response => {
      return response.json()
    })
    .then(data => {
      callback(data)
    })
}

export const createChapter = async (params, callback) => {
  const token = await setToken()
  fetch(`${API_ROOT}/chapters`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token
    },
    body: JSON.stringify(params)
  })
    .then(response => {
      return response.json()
    })
    .then(data => {
      callback(data)
    })
}
