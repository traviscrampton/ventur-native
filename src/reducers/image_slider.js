import {
  POPULATE_IMAGES,
  TOGGLE_IMAGE_SLIDER_MODAL,
  RESET_IMAGES
} from '../actions/image_slider';

const defaultImageSliderData = {
  images: [],
  visible: false,
  activeIndex: 0
};

export default (state = defaultImageSliderData, action) => {
  switch (action.type) {
    case POPULATE_IMAGES:
      return { ...state, ...action.payload };
    case TOGGLE_IMAGE_SLIDER_MODAL:
      return {
        ...state,
        visible: action.payload
      };
    case RESET_IMAGES:
      return {
        ...state,
        images: defaultImageSliderData.images
      };
    default:
      return state;
  }
};
