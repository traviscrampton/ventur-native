import _ from "lodash"

export const mungeChapter = chapter => {
  return Object.assign(
    {},
    {
      id: chapter.id,
      title: chapter.title,
      readableDate: chapter.readableDate,
      date: chapter.date,
      imageUrl: chapter.imageUrl,
      published: chapter.published,
      distance: chapter.distance,
      blogImageCount: chapter.blogImageCount
    }
  )
}

export const setChapterToJournalChapter = (journal, newChapter) => {
  let chapters = []
  let chapter = mungeChapter(newChapter)

  let foundIndex = journal.chapters.findIndex(journalChapter => {
    return journalChapter.id == chapter.id
  })

  if (foundIndex > -1) {
    chapters = Object.assign([], journal.chapters, { [foundIndex]: chapter })
  } else {
    chapters = [...journal.chapters, chapter]
  }

  const sortedChapters = _.sortBy(chapters, "date")

  return {
    journalId: journal.id,
    chapters: sortedChapters,
    distance: newChapter.journal.distance
  }
}

export const UPDATE_CHAPTER_FORM = "UPDATE_CHAPTER_FORM"
export function updateChapterForm(payload) {
  return {
    type: UPDATE_CHAPTER_FORM,
    payload: payload
  }
}

export const RESET_CHAPTER_FORM = "RESET_CHAPTER_FORM"
export function resetChapterForm() {
  return {
    type: RESET_CHAPTER_FORM
  }
}

export const getJournalFeedDistance = (getState, journalId, distance) => {
  let journals
  const allJournals = getState().journalFeed.allJournals
  const foundIndex = allJournals.findIndex(journal => {
    return journal.id == journalId
  })  

  if (foundIndex > -1) {
    journal = Object.assign({}, allJournals[foundIndex], { distance: distance })
    journals = Object.assign([], allJournals, { [foundIndex]: journal })
  } else {
    journals = allJournals
  }
  return journals
}

export const UPDATE_FEED_DISTANCE = "UPDATE_FEED_DISTANCE"
export function updateFeedDistance(payload) {
  return {
    type: UPDATE_FEED_DISTANCE,
    payload: payload
  }
}

export const ADD_CHAPTER_TO_JOURNALS = "ADD_CHAPTER_TO_JOURNALS"
export function addChapterToJournals(payload) {
  return function(dispatch, getState) {
    let journal = getState().journal.journal
    if (journal && journal.id == payload.journal.id) {
      let chaptersAndDistance = setChapterToJournalChapter(journal, payload)

      dispatch(pushChapterToJournal(chaptersAndDistance))
      let updatedFeed = getJournalFeedDistance(getState, chaptersAndDistance.journalId, chaptersAndDistance.distance)
      dispatch(updateFeedDistance(updatedFeed))
    }
  }
}

export const PUSH_CHAPTER_TO_JOURNAL = "PUSH_CHAPTER_TO_JOURNAL"
export function pushChapterToJournal(payload) {
  return {
    type: PUSH_CHAPTER_TO_JOURNAL,
    payload: payload
  }
}
