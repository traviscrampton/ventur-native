import { AsyncStorage } from "react-native"
import _ from "lodash"
import { setToken } from "agent"
import { persistChapterToAsyncStorage, findChapter } from "utils/offline_helpers"
const API_ROOT = "http://192.168.7.23:3000"

export const offlineChapterCreate = async chapter => {
  const localId = Date.now()
  let saveableChapter = Object.assign(chapter, { id: localId })
  saveableChapter = _.omit(saveableChapter, "journals")
  await persistChapterToAsyncStorage(saveableChapter)
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
      console.log(callback)
      callback(data)
    })
}
