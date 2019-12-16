export const POPULATE_IMAGES = 'POPULATE_IMAGES';
export function populateImages(payload) {
  return {
    type: POPULATE_IMAGES,
    payload
  };
}

export const TOGGLE_IMAGE_SLIDER_MODAL = 'TOGGLE_IMAGE_SLIDER_MODAL';
export function toggleImageSliderModal(payload) {
  return {
    type: TOGGLE_IMAGE_SLIDER_MODAL,
    payload
  };
}
export const RESET_IMAGES = 'RESET_IMAGES';
export function resetImages() {
  return {
    type: RESET_IMAGES
  };
}
