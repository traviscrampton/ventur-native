import { post, put } from '../agent';
import { populateUserJournals } from './user';
import { populateSingleJournal } from './journals';

export const UPDATE_JOURNAL_FORM = 'UPDATE_JOURNAL_FORM';
export function updateJournalForm(payload) {
  return {
    type: UPDATE_JOURNAL_FORM,
    payload
  };
}

export const RESET_JOURNAL_FORM = 'RESET_JOURNAL_FORM';
export function resetJournalForm() {
  return {
    type: RESET_JOURNAL_FORM
  };
}

export const SINGLE_JOURNAL_LOADED = 'SINGLE_JOURNAL_LOADED';
export function populateJournal(payload) {
  return {
    type: SINGLE_JOURNAL_LOADED,
    payload
  };
}

export const ADD_TO_MY_TRIPS = 'ADD_TO_MY_TRIPS';
export function addToMyTrips(payload) {
  return {
    type: ADD_TO_MY_TRIPS,
    payload
  };
}

export const TOGGLE_JOURNAL_FORM_MODAL = 'TOGGLE_JOURNAL_FORM_MODAL';
export function toggleJournalFormModal(payload) {
  return {
    type: TOGGLE_JOURNAL_FORM_MODAL,
    payload
  };
}

export const TOGGLE_COUNTRIES_EDITOR_MODAL = 'TOGGLE_COUNTRIES_EDITOR_MODAL';
export function toggleCountriesEditorModal(payload) {
  return {
    type: TOGGLE_COUNTRIES_EDITOR_MODAL,
    payload
  };
}

export const persistJournalPost = async (params, dispatch) => {
  const res = await post('/journals', params);
  const payload = { id: res.id };

  dispatch(populateUserJournals(res));
  dispatch(updateJournalForm(payload));
  dispatch(resetJournalForm());
};

export const persistJournalPut = async (
  params,
  dispatch,
  navigationCallBack
) => {
  const journal = await put(`/journals/${params.id}`, params);

  dispatch(populateSingleJournal(journal));
  navigationCallBack();
  dispatch(resetJournalForm());
};

export function persistJournal(navigationCallBack) {
  return function(dispatch, getState) {
    const { journalForm } = getState();
    if (journalForm.id) {
      persistJournalPut(journalForm, dispatch, navigationCallBack);
    } else {
      persistJournalPost(journalForm, dispatch);
    }
  };
}

export const ADD_TO_JOURNAL_FEED = 'ADD_TO_JOURNAL_FEED';
export function sendToReducerForJournalFeed(payload) {
  return {
    type: ADD_TO_JOURNAL_FEED,
    payload
  };
}

export function addToJournalFeed(payload) {
  return function(dispatch, getState) {
    let newPayload;
    const allJournals = [...getState().journalFeed.allJournals];
    const foundJournal = allJournals.find(journal => {
      return payload.id === journal.id;
    });

    if (foundJournal) {
      const index = allJournals.indexOf(foundJournal);
      newPayload = Object.assign([], allJournals, [index]);
    } else {
      newPayload = [...allJournals, payload];
    }
    dispatch(sendToReducerForJournalFeed(newPayload));
  };
}

export function addJournalEverywhere(payload) {
  return function(dispatch) {
    dispatch(addToJournalFeed(payload));
  };
}
