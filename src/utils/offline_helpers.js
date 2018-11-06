import _ from "lodash"
import { AsyncStorage } from "react-native"

export const persistChapterToAsyncStorage = async chapter => {
  let updatedChapters
  let chapters = await AsyncStorage.getItem("chapters")
  let parsedChapters = JSON.parse(chapters)
  let foundChapter = findChapter(parsedChapters, chapter.id)

  if (foundChapter) {
    updatedChapters = parsedChapters.map(parsedChapter => {
      return parsedChapter.id == chapter.id ? parsedChapter : chapter
    })

    let uniqueChapters = _.uniqBy(updatedChapters, "id")
    let stringifiedChapter = JSON.stringify(uniqueChapters)
    await AsyncStorage.setItem("chapters", stringifiedChapter)
  } else {
    parsedChapters.push(chapter)

    let uniqueChapters = _.uniqBy(parsedChapters, "id")
    let stringifiedChapters = JSON.stringify(uniqueChapters)

    await AsyncStorage.setItem("chapters", stringifiedChapters)
  }

  let refoundChapters = await AsyncStorage.getItem("chapters")
  parsedChapters = JSON.parse(refoundChapters)
  return findChapter(parsedChapters, chapter.id)
}

export const findChapter = (chapters, chapterId) => {
  return chapters.find(chapter => {
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
