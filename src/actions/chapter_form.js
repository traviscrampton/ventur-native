import _ from 'lodash';
import { post, put } from '../agent';
import { loadChapter } from './chapter';
import { doneUpdating } from './editor';

export const PUSH_CHAPTER_TO_JOURNAL = 'PUSH_CHAPTER_TO_JOURNAL';
export function pushChapterToJournal(payload) {
  return {
    type: PUSH_CHAPTER_TO_JOURNAL,
    payload
  };
}

export const UPDATE_CHAPTER_FORM = 'UPDATE_CHAPTER_FORM';
export function updateChapterForm(payload) {
  return {
    type: UPDATE_CHAPTER_FORM,
    payload
  };
}

export const RESET_CHAPTER_FORM = 'RESET_CHAPTER_FORM';
export function resetChapterForm() {
  return {
    type: RESET_CHAPTER_FORM
  };
}

export const UPDATE_FEED_DISTANCE = 'UPDATE_FEED_DISTANCE';
export function updateFeedDistance(payload) {
  return {
    type: UPDATE_FEED_DISTANCE,
    payload
  };
}

export const TOGGLE_CHAPTER_MODAL = 'TOGGLE_CHAPTER_MODAL';
export function toggleChapterModal(payload) {
  return {
    type: TOGGLE_CHAPTER_MODAL,
    payload
  };
}

export const getJournalFeedDistance = (getState, journalId, distance) => {
  let journals;
  const { allJournals } = getState().journalFeed;
  const foundIndex = allJournals.findIndex(journal => {
    return journal.id === journalId;
  });

  if (foundIndex > -1) {
    const journal = { ...allJournals[foundIndex], distance };
    journals = Object.assign([], allJournals, { [foundIndex]: journal });
  } else {
    journals = allJournals;
  }
  return journals;
};

export const mungeChapter = chapter => {
  return {
    id: chapter.id,
    title: chapter.title,
    readableDate: chapter.readableDate,
    date: chapter.date,
    imageUrl: chapter.imageUrl,
    published: chapter.published,
    distance: chapter.distance,
    blogImageCount: chapter.blogImageCount
  };
};

export const setChapterToJournalChapter = (journal, newChapter) => {
  let chapters = [];
  const chapter = mungeChapter(newChapter);

  const foundIndex = journal.chapters.findIndex(journalChapter => {
    return journalChapter.id === chapter.id;
  });

  if (foundIndex > -1) {
    chapters = Object.assign([], journal.chapters, { [foundIndex]: chapter });
  } else {
    chapters = [...journal.chapters, chapter];
  }

  const sortedChapters = _.sortBy(chapters, 'date');

  return {
    journalId: journal.id,
    chapters: sortedChapters,
    distance: newChapter.journal.distance
  };
};

export const ADD_CHAPTER_TO_JOURNALS = 'ADD_CHAPTER_TO_JOURNALS';
export function addChapterToJournals(payload) {
  return function(dispatch, getState) {
    const { journal } = getState().journal;
    if (journal && journal.id === payload.journal.id) {
      const chaptersAndDistance = setChapterToJournalChapter(journal, payload);
      dispatch(pushChapterToJournal(chaptersAndDistance));
      const updatedFeed = getJournalFeedDistance(
        getState,
        chaptersAndDistance.journalId,
        chaptersAndDistance.distance
      );
      dispatch(updateFeedDistance(updatedFeed));
    }
  };
}

function getChapterParams(params) {
  const { id, title, distance, journalId } = params;
  let { date } = params;
  date = new Date(date).toUTCString();
  return {
    id,
    title,
    distance,
    journalId,
    date
  };
}

export function updateChapter(params, callback) {
  return async function(dispatch) {
    const chapterParams = getChapterParams(params);
    const { id } = chapterParams;

    try {
      const { chapter } = await put(`/chapters/${id}`, chapterParams);
      dispatch(addChapterToJournals(chapter));
      dispatch(loadChapter(chapter));
      dispatch(doneUpdating());
      callback();
    } catch (err) {
      dispatch(doneUpdating());
      console.log('wat in tarnation', err);
    }
  };
}

export function createChapter(params, callback) {
  return async function(dispatch) {
    const chapterParams = getChapterParams(params);

    try {
      const { chapter } = await post('/chapters', chapterParams);
      dispatch(addChapterToJournals(chapter));
      dispatch(loadChapter(chapter));
      dispatch(doneUpdating());
      callback();
    } catch (err) {
      dispatch(doneUpdating());
      console.log('here is the error', err);
    }
  };
}
