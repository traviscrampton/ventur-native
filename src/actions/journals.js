import { get, post, API_ROOT, setToken, destroy } from '../agent';
import { setLoadingTrue, setLoadingFalse } from './common';
import { loadChapter, resetChapter } from './chapter';

export const JOURNAL_FEED_LOADED = 'JOURNAL_FEED_LOADED';
export const SINGLE_JOURNAL_LOADED = 'SINGLE_JOURNAL_LOADED';

export const RESET_JOURNAL_TAB = 'RESET_JOURNAL_TAB';
export function resetJournalShow() {
  return {
    type: RESET_JOURNAL_TAB
  };
}

export const POPULATE_SINGLE_JOURNAL = 'POPULATE_SINGLE_JOURNAL';
export function populateSingleJournal(payload) {
  return {
    type: POPULATE_SINGLE_JOURNAL,
    payload
  };
}
export const POPULATE_JOURNAL_GEAR = 'POPULATE_JOURNAL_GEAR';
export const populateJournalGear = payload => {
  return {
    type: POPULATE_JOURNAL_GEAR,
    payload
  };
};

export const IMAGE_UPLOADING = 'IMAGE_UPLOADING';
export function imageUploading(payload) {
  return {
    type: IMAGE_UPLOADING,
    payload
  };
}

export const POPULATE_JOURNAL_CHAPTERS = 'POPULATE_JOURNAL_CHAPTERS';
export function populateJournalChapters(payload) {
  return {
    type: POPULATE_JOURNAL_CHAPTERS,
    payload
  };
}

export const fetchJournalChapters = journalId => {
  return async function(dispatch) {
    try {
      const data = await get(`/journals/${journalId}/chapters`);
      dispatch(populateJournalChapters(data.chapters));
    } catch (err) {
      console.log('we should populate something here');
    }
  };
};

export const fetchJournalGear = journalId => {
  return async function(dispatch) {
    const data = await get(`/journals/${journalId}/gear_item_reviews`);
    dispatch(populateJournalGear(data.gearItemReviews));
  };
};

export const SUB_CONTENT_LOADING = 'SUB_CONTENT_LOADING';
export function subContentLoading(payload) {
  return {
    type: SUB_CONTENT_LOADING,
    payload
  };
}

export function unfollowJournal(journalId) {
  return async function(dispatch, getState) {
    let { journalFollowsCount } = getState().journal.journal;

    try {
      const { isFollowing } = await destroy(`/journal_follows/${journalId}`, {
        journalId
      });
      journalFollowsCount -= 1;
      const payload = { isFollowing, journalFollowsCount };
      dispatch(populateSingleJournal(payload));
    } catch (err) {
      console.log('what in tarnation', err);
    }
  };
}

export function followJournal(journalId) {
  return async function(dispatch, getState) {
    let { journalFollowsCount } = getState().journal.journal;
    try {
      const { isFollowing } = await post('/journal_follows', { journalId });
      journalFollowsCount += 1;
      const payload = { isFollowing, journalFollowsCount };
      dispatch(populateSingleJournal(payload));
    } catch (err) {
      console.log('what in tarnation', err);
    }
  };
}

export function toggleJournalFollow() {
  return async function(dispatch, getState) {
    const { id, isFollowing } = getState().journal.journal;

    if (isFollowing) {
      dispatch(unfollowJournal(id));
    } else {
      dispatch(followJournal(id));
    }
  };
}

export const updateBannerImage = async (journalId, img, dispatch) => {
  const formData = new FormData();
  formData.append('banner_image', img);

  const token = await setToken();
  fetch(`${API_ROOT}/journals/${journalId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: token
    },
    body: formData
  })
    .then(response => {
      return response.json();
    })
    .then(data => {
      dispatch(populateSingleJournal(data));
      dispatch(imageUploading(false));
    });
};

export function uploadBannerImage(journalId, img) {
  return function(dispatch) {
    updateBannerImage(journalId, img, dispatch);
  };
}

export function loadSingleJournal(journalId) {
  return async function(dispatch) {
    try {
      const data = await get(`/journals/${journalId}/journal_metadata`);
      dispatch(populateSingleJournal(data.journal));
      await dispatch(fetchJournalChapters(journalId));
      await dispatch(fetchJournalGear(journalId));
      dispatch(subContentLoading(false));
    } catch (err) {
      dispatch(populateSingleJournal({}));
    }
  };
}

export const POPULATE_JOURNAL_FEED = 'POPULATE_JOURNAL_FEED';
export function populateJournalFeed(payload) {
  return {
    type: POPULATE_JOURNAL_FEED,
    payload
  };
}

export const TOGGLE_REFRESH = 'TOGGLE_REFRESH';
export function toggleRefresh(payload) {
  return {
    type: TOGGLE_REFRESH,
    payload
  };
}

export function toggleRefreshAndRefresh() {
  return async function(dispatch) {
    dispatch(toggleRefresh(true));

    try {
      const data = await get('/journals');
      dispatch(populateJournalFeed(data.journals));
    } catch (err) {
      console.log("didn't work");
    }

    dispatch(toggleRefresh(false));
  };
}

export function requestForChapter(chapterId) {
  return function(dispatch) {
    dispatch(setLoadingTrue());
    dispatch(resetChapter());
    get(`/chapters/${chapterId}`).then(res => {
      dispatch(loadChapter(res.chapter));
      dispatch(setLoadingFalse());
    });
  };
}

export function loadJournalFeed() {
  return async function(dispatch) {
    dispatch(setLoadingTrue());

    try {
      const data = await get('/journals');
      dispatch(populateJournalFeed(data.journals));
    } catch (err) {
      dispatch(populateJournalFeed([]));
    }

    dispatch(setLoadingFalse());
  };
}

export const UPDATE_TAB_INDEX = 'UPDATE_TAB_INDEX';
export function updateTabIndex(payload) {
  return {
    type: UPDATE_TAB_INDEX,
    payload
  };
}
