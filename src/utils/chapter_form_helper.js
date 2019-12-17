import _ from 'lodash';
import { persistChapterToAsyncStorage } from './offline_helpers';

export const offlineChapterCreate = async (chapter, reduxCallback) => {
  const localId = `Created on ${Date.now()}`;
  const localIdChapter = { ...chapter, id: localId };
  const persistableChapter = _.omit(localIdChapter, 'journals');
  await persistChapterToAsyncStorage(persistableChapter, reduxCallback);

  return localIdChapter;
};

const MONTHS = [
  'January',
  'Feburary',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
];

export const generateReadableDate = date => {
  const month = MONTHS[date.getMonth()];
  const day = ` ${date.getDate()}, `;
  const year = date.getFullYear();

  return month + day + year;
};
