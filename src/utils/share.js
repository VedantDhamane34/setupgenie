export function encodeShare(setup, answers) {
  try {
    const payload = JSON.stringify({ setup, answers, v:1 });
    return `${window.location.href.split("#")[0]}#s=${btoa(encodeURIComponent(payload))}`;
  } catch { return window.location.href; }
}

export function decodeShare(hash) {
  try {
    const m = hash.match(/#s=(.+)/);
    if (!m) return null;
    return JSON.parse(decodeURIComponent(atob(m[1])));
  } catch { return null; }
}