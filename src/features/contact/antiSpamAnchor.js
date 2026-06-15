/**
 * Single anchor for "minimum time before submit" — survives React Strict Mode
 * remounts (unlike a per-hook useRef(Date.now())).
 */
let anchorMs = 0;

export function getAntiSpamAnchorMs() {
  if (!anchorMs) anchorMs = Date.now();
  return anchorMs;
}
