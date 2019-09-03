export const TOGGLE_CAMERA_ROLL_MODAL = "TOGGLE_CAMERA_ROLL_MODAL"
export function toggleCameraRollModal(payload) {
  return {
    type: TOGGLE_CAMERA_ROLL_MODAL,
    payload: payload
  }
}