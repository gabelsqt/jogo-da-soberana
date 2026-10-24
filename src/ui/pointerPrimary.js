// Unified primary activation for mouse and touch. Avoid right-click accepting
// an upgrade and preserve mobile pointer events where buttons may be undefined.
export function botecoPrimaryPress(pointer){
  return Boolean(pointer?.leftButtonDown?.() ||
    pointer?.wasTouch || pointer?.event?.pointerType==='touch');
}
