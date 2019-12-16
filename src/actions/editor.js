import _ from 'lodash';
import * as ImageManipulator from 'expo-image-manipulator';
import { setToken, API_ROOT } from '../agent';
import DropDownHolder from '../utils/DropdownHolder';
import {
  awsUpload,
  cloudFrontUrlLength,
  deleteS3Objects
} from '../utils/image_uploader';
import { loadChapter, setEditMode } from './chapter';
import { toggleCameraRollModal } from './camera_roll';

const uuid = require('react-native-uuid');

export function updateActiveIndex(payload) {
  return {
    type: 'UPDATE_ACTIVE_INDEX',
    payload
  };
}

export function createNewEntry(payload) {
  return {
    type: 'CREATE_NEW_ENTRY',
    payload
  };
}

export const DONE_UPDATING = 'DONE_UPDATING';
export function doneUpdating() {
  return {
    type: DONE_UPDATING
  };
}

export const START_UPDATING = 'START_UPDATING';
export function startUpdating() {
  return {
    type: START_UPDATING
  };
}

export function updateEntryState(payload) {
  return {
    type: 'EDIT_ENTRY',
    payload
  };
}

export const POPULATE_ENTRIES = 'POPULATE_ENTRIES';
export function populateEntries(payload) {
  return {
    type: 'POPULATE_ENTRIES',
    payload
  };
}

export const deleteDeletedUrls = async (
  deletedUrls,
  awsAccessKey,
  awsSecretKey
) => {
  if (deletedUrls.length === 0) return;

  const awsKeys = { awsAccessKey, awsSecretKey };
  await deleteS3Objects(deletedUrls, awsKeys);
};

export function editEntry(payload) {
  return function(dispatch) {
    dispatch(updateEntryState(payload));
  };
}

export const updateBackToDraft = async (id, dispatch) => {
  const formData = new FormData();
  const token = await setToken();

  fetch(`${API_ROOT}/editor_blobs/${id}`, {
    method: 'DELETE',
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
      if (data.errors) {
        throw Error(data.errors.join(', '));
      }

      dispatch(setEditMode(false));
      dispatch(populateEntries([]));
      dispatch(doneUpdating());
    })
    .catch(err => {
      dispatch(doneUpdating());
      DropDownHolder.alert('error', 'Error', err);
    });
};

export function loseChangesAndUpdate(payload) {
  return async function(dispatch, getState) {
    dispatch(startUpdating());
    const {
      common: { awsAccessKey, awsSecretKey },
      editor: { newlyAddedImageUrls }
    } = getState();

    await deleteDeletedUrls(newlyAddedImageUrls, awsAccessKey, awsSecretKey);
    updateBackToDraft(payload.id, dispatch);
  };
}

export const ADD_TO_NEWLY_ADDED_IMAGE_URLS = 'ADD_TO_NEWLY_ADDED_IMAGE_URLS';
export function addToNewlyAddedImageUrls(payload) {
  return {
    type: ADD_TO_NEWLY_ADDED_IMAGE_URLS,
    payload
  };
}

export const finalizeDraft = async (id, entries, chapter, dispatch) => {
  const formData = new FormData();
  const token = await setToken();

  formData.append('content', JSON.stringify(entries));
  fetch(`${API_ROOT}/editor_blobs/${id}/update_blob_done`, {
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
      if (data.errors) {
        throw Error(data.errors.join(', '));
      }

      const updatedChapter = {
        ...chapter,
        editorBlob: { id: data.id, content: JSON.parse(data.content) }
      };

      dispatch(loadChapter(updatedChapter));
      dispatch(setEditMode(false));
      dispatch(populateEntries([]));
      dispatch(doneUpdating());
    })
    .catch(err => {
      dispatch(doneUpdating());
      DropDownHolder.alert('error', 'Error', err);
    });
};

export function doneEditingAndPersist() {
  return async function(dispatch, getState) {
    dispatch(startUpdating());
    const {
      editor: { entries, deletedUrls },
      common: { awsAccessKey, awsSecretKey },
      chapter: {
        chapter,
        chapter: {
          editorBlob: { id }
        }
      }
    } = getState();

    await deleteDeletedUrls(deletedUrls, awsAccessKey, awsSecretKey);
    finalizeDraft(id, entries, chapter, dispatch);
  };
}

export function updateImagesState(payload) {
  const updatedImages = payload.images.map(img => {
    return {
      id: img.id,
      filename: img.filename,
      localUri: img.uri,
      uri: img.uri,
      type: 'image',
      aspectRatio: img.height / img.width,
      caption: ''
    };
  });

  payload.images = updatedImages;
  return {
    type: 'ADD_IMAGES_TO_ENTRIES',
    payload
  };
}

export const UPLOAD_IS_IMAGE = 'UPLOAD_IS_IMAGE';
export const uploadIsImage = isImage => {
  return {
    type: UPLOAD_IS_IMAGE,
    payload: isImage
  };
};

export const startImageUploading = () => {
  return function(dispatch) {
    dispatch(startUpdating());
    dispatch(uploadIsImage(true));
  };
};

export const resizeImage = async image => {
  const maxWidth = 1800;
  let { width, height } = image;
  const { uri } = image;

  if (width > maxWidth) {
    height *= maxWidth / width;
    width = maxWidth;
  }

  const updatedImage = await ImageManipulator.manipulateAsync(
    uri,
    [{ resize: { width, height } }],
    {
      compress: 0,
      format: 'jpeg',
      base64: false
    }
  );

  return { ...image, updatedImage };
};

export const createResizeImgUri = (aspectRatio, originalUri, newWidth) => {
  const newHeight = parseInt(newWidth * aspectRatio);

  return `${originalUri.slice(
    0,
    cloudFrontUrlLength
  )}/fit-in/${newWidth}x${newHeight}${originalUri.slice(cloudFrontUrlLength)}`;
};

export const createUrisObject = (uri, aspectRatio) => {
  return {
    thumbnailUri: createResizeImgUri(aspectRatio, uri, 50),
    lowResUri: createResizeImgUri(aspectRatio, uri, 450),
    uri: createResizeImgUri(aspectRatio, uri, 1000),
    originalUri: uri
  };
};

export const saveEditorContent = async (
  entries,
  imageUpload,
  chapter,
  dispatch
) => {
  const formData = new FormData();
  const token = await setToken();
  formData.append('content', JSON.stringify(entries));
  fetch(`${API_ROOT}/editor_blobs/${chapter.editorBlob.id}`, {
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
      if (data.errors) {
        throw Error(data.errors.join(', '));
      }
      if (imageUpload) {
        dispatch(populateEntries(JSON.parse(data.content)));
        dispatch(uploadIsImage(false));
      }
      dispatch(doneUpdating());
    })
    .catch(err => {
      dispatch(doneUpdating());
      DropDownHolder.alert('error', 'Error', err);
    });
};

export const dispatchPersist = async (
  entries,
  imageUpload,
  chapter,
  dispatch
) => {
  saveEditorContent(entries, imageUpload, chapter, dispatch);
};

export const debouncePersist = _.debounce(dispatchPersist, 2000);

export const addImagesToEntries = payload => {
  return async (dispatch, getState) => {
    dispatch(startImageUploading());
    const { awsAccessKey, awsSecretKey } = getState().common;
    const awsKeys = { accessKey: awsAccessKey, secretKey: awsSecretKey };
    const image = await resizeImage(payload.images[0]);

    let entry = {
      filename: image.filename,
      localUri: image.uri,
      uri: '',
      type: 'image',
      aspectRatio: image.height / image.width,
      caption: ''
    };

    dispatch(toggleCameraRollModal(false));
    const filename = `${image.filename.split('.')[0]} ${uuid.v1()}.jpeg`;
    const file = { uri: image.uri, name: filename, type: 'image/jpg' };
    dispatch(updateActiveIndex(null));
    dispatch(createNewEntry({ newEntry: entry, newIndex: payload.index }));
    const uri = await awsUpload(file, awsKeys);

    const allUriSizes = createUrisObject(uri, entry.aspectRatio);
    entry = { ...entry, allUriSizes };
    dispatch(updateEntryState({ entry, index: payload.index }));
    dispatch(addToNewlyAddedImageUrls(entry.originalUri));
    dispatchPersist(
      getState().editor.entries,
      true,
      getState().chapter.chapter,
      dispatch
    );
  };
};

export const SET_INITAL_IMAGE_IDS = 'SET_INITAL_IMAGE_IDS';
export const setInitalImageIds = ids => {
  return {
    type: SET_INITAL_IMAGE_IDS,
    payload: ids
  };
};

export const RESET_DELETED_URLS = 'RESET_DELETED_URLS';
export const resetDeletedUrls = () => {
  return {
    type: RESET_DELETED_URLS
  };
};

export const getInitialImageIds = entries => {
  return function(dispatch) {
    const imageIds = entries
      .filter(entry => entry.type === 'image' && entry.id)
      .map(entry => {
        return entry.id;
      });
    dispatch(setInitalImageIds(imageIds));
  };
};

export const editChapterOfflineMode = async (chapter, offline, dispatch) => {
  const token = await setToken();
  const params = { id: chapter.id, offline };
  fetch(`${API_ROOT}/chapters/${params.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token
    },
    body: JSON.stringify(params)
  })
    .then(response => {
      return response.json();
    })
    .then(data => {
      if (data.errors) {
        throw Error(data.errors.join(', '));
      }
      dispatch(loadChapter(data));
    })
    .catch(err => {
      DropDownHolder.alert('error', 'Error', err);
    });
};

export const ADD_TO_DELETED_URLS = 'ADD_TO_DELETED_URLS';
export const addToDeletedUrls = imageId => {
  return {
    type: ADD_TO_DELETED_URLS,
    payload: imageId
  };
};

export function updateManageContentEntries(payload) {
  return {
    type: 'UPDATE_MANAGE_CONTENT_ENTRIES',
    payload
  };
}

export function removeEntryFromClone(payload) {
  return {
    type: 'REMOVE_ENTRY_FROM_CLONE',
    payload
  };
}

export function updateEntriesOrder() {
  return {
    type: 'UPDATE_ENTRIES_ORDER'
  };
}

export function prepManageContent() {
  return {
    type: 'PREP_MANAGE_CONTENT'
  };
}

export function updateActiveImageCaption(payload) {
  return {
    type: 'UPDATE_ACTIVE_IMAGE_CAPTION',
    payload
  };
}

export function updateImageCaption(payload) {
  return function(dispatch, getState) {
    dispatch(startUpdating());
    dispatch(editEntry(payload));
    dispatch(updateActiveImageCaption(''));
    dispatch(updateActiveIndex(null));
    debouncePersist(
      getState().editor.entries,
      getState().editor.deletedIds,
      getState().chapter.chapter,
      dispatch
    );
  };
}

export function setSelectedImages(payload) {
  return {
    type: 'SET_SELECTED_IMAGES',
    payload
  };
}

export function getCameraRollPhotos(payload) {
  return {
    type: 'GET_CAMERA_ROLL_PHOTOS',
    payload
  };
}

export const UPDATE_ACTIVE_CREATOR = 'UPDATE_ACTIVE_CREATOR';
export function updateActiveCreator(payload) {
  return {
    type: UPDATE_ACTIVE_CREATOR,
    payload
  };
}

export function setNextIndexNull() {
  return {
    type: 'SET_NEXT_INDEX_NULL',
    payload: null
  };
}

export function updateKeyboardState(payload) {
  return {
    type: 'UPDATE_KEYBOARD_STATE',
    payload
  };
}

export function updateFormatBar(payload) {
  return {
    type: 'UPDATE_FORMAT_BAR',
    payload
  };
}

export function createNewTextEntry(payload) {
  const { newIndex } = payload;

  return function(dispatch) {
    dispatch(createNewEntry(payload));
    dispatch(updateActiveIndex(newIndex));
  };
}

export function deleteEntry(payload) {
  return {
    type: 'DELETE_ENTRY',
    payload
  };
}

export function removeEntryAndFocus(payload) {
  return function(dispatch, getState) {
    dispatch(startUpdating());
    dispatch(deleteEntry(payload));
    dispatch(updateActiveIndex(null));
    debouncePersist(
      getState().editor.entries,
      getState().editor.deletedIds,
      getState().chapter.chapter,
      dispatch
    );
  };
}

export function updateTextInput(payload) {
  return {
    type: 'TEXT_TO_INPUT',
    payload
  };
}

// export function deleteWithEdit(payload) {
//   const { oldPayload, index, cursorPosition, instance } = payload;
//   return function(dispatch, getState) {
//     dispatch(editText(oldPayload));
//     dispatch(deleteEntry(index));
//     dispatch(updateActiveIndex(index));
//     dispatch(updateCursorPosition(cursorPosition));
//   };
// }

export function turnTextToTextInput(payload) {
  return function(dispatch, getState) {
    dispatch(updateTextInput(payload));
    dispatch(updateFormatBar(getState().editor.entries[payload].styles));
  };
}

export const SET_INITIAL_EDITOR_STATE = 'SET_INITIAL_EDITOR_STATE';
export function setInitialEditorState(payload) {
  return {
    type: 'SET_INITIAL_EDITOR_STATE',
    payload
  };
}

export function updateCursorPosition(payload) {
  return { type: 'UPDATE_CURSOR_POSITION', payload };
}
