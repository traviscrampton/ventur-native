import _ from "lodash"
import { AsyncStorage } from "react-native"

export const persistChapterToAsyncStorage = async chapter => {
  let foundIndex
  let updatedChapters
  let stringifiedChapters
  let chapters = await AsyncStorage.getItem("chapters")
  let parsedChapters = JSON.parse(chapters)
  let foundChapter = findChapter(parsedChapters, chapter.id)

  if (foundChapter) {
    foundIndex = parsedChapters.indexOf(foundChapter)
    parsedChapters = Object.assign([], parsedChapters, { [foundIndex]: chapter })
    stringifiedChapters = JSON.stringify(parsedChapters)
    await AsyncStorage.setItem("chapters", stringifiedChapters)
  } else {
    parsedChapters = [...parsedChapters, chapter]
    stringifiedChapters = JSON.stringify(parsedChapters)

    await AsyncStorage.setItem("chapters", stringifiedChapters)
  }

  return chapter
}

export const findChapter = (chapters, chapterId) => {
  return chapters.find((chapter, index) => {
    return chapter.id == chapterId
  })
}

export const addJournalsToAsyncStorage = async journals => {
  const stringifedJournals = JSON.stringify(journals)
  await AsyncStorage.setItem("journals", stringifedJournals)
}

export const removeChapterFromAsyncStorage = async chapter => {
  let chapters = await AsyncStorage.getItem("chapters")
  let parsedChapters = JSON.parse(chapters)

  let filteredChapters = parsedChapters.filter(parsedChapter => {
    return parsedChapter.id != chapter.id
  })

  filteredChapters = JSON.stringify(filteredChapters)
  await AsyncStorage.setItem("chapters", filteredChapters)
}
