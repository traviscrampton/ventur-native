import _ from "lodash";
import { persistChapterToAsyncStorage } from "./offline_helpers";

export const offlineChapterCreate = async (chapter, reduxCallback) => {
  const localId = "Created on " + Date.now();
  let localIdChapter = Object.assign(chapter, { id: localId });
  let persistableChapter = _.omit(localIdChapter, "journals");
  await persistChapterToAsyncStorage(persistableChapter, reduxCallback);

  return localIdChapter;
};

const MONTHS = [
  "January",
  "Feburary",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
];

export const generateReadableDate = date => {
  let month = MONTHS[date.getMonth()];
  let day = " " + date.getDate() + ", ";
  let year = date.getFullYear();

  return month + day + year;
};
