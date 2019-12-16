export const TOGGLE_CAMERA_ROLL_MODAL = 'TOGGLE_CAMERA_ROLL_MODAL';
export function toggleCameraRollModal(payload) {
  return {
    type: TOGGLE_CAMERA_ROLL_MODAL,
    payload,
  };
}

export const UPDATE_ACTIVE_VIEW = 'UPDATE_ACTIVE_VIEW';
export function updateActiveView(payload) {
  return {
    type: UPDATE_ACTIVE_VIEW,
    payload,
  };
}
