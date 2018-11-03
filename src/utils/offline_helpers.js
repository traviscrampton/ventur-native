import _ from "lodash"
import { AsyncStorage } from "react-native"

export const storeJWT = async obj => {
  try {
    AsyncStorage.setItem("JWT", obj.token)
    AsyncStorage.setItem("currentUser", JSON.stringify(obj.user))
  } catch (error) {
    console.log(error)
  }
}

export const getCurrentUser = async () => {
  try {
    await AsyncStorage.getItem("currentUser")
  } catch (error) {
    console.log(error)
  }
}

export const persistChapterToAsyncStorage = async chapter => {
  let updatedChapters
  let chapters = await AsyncStorage.getItem("chapters")
  let parsedChapters = JSON.parse(chapters)
  let foundChapter = findChapter(parsedChapters, chapter.id)

  if (foundChapter) {
    updatedChapters = parsedChapters.map(parsedChapter => {
      return parsedChapter.id == chapter.id ? parsedChapter : chapter
    })
    updatedChapters = JSON.stringify(updatedChapters)
    await AsyncStorage.setItem("chapters", updatedChapters)
  } else {
    parsedChapters.push(chapter)
    updatedChapters = JSON.stringify(parsedChapters)

    await AsyncStorage.setItem("chapters", updatedChapters)
  }

  let refoundChapters = await AsyncStorage.getItem("chapters")
}

const findChapter = (chapters, chapterId) => {
  return chapters.find(chapter => {
    return chapter.id == chapterId
  })
}

const removeChapterFromAsyncStorage = async chapter => {
  let chapters = await AsyncStorage.getItem("chapters")
  let parsedChapters = JSON.parse(chapters)

  let filteredChapters = parsedChapters.filter(parsedChapter => {
    return parsedChapter.id != chapter.id
  })

  filteredChapters = JSON.stringify(filteredChapters)

  await AsyncStorage.setItem("chapters", filteredChapters)
}
