export async function blockUntilLoaded() {
  if (window.jwplayer) {
    return true;
  }
  return new Promise((resolve) =>
    window.addEventListener('jwReadyEvent', resolve, {
      // It is important to only trigger this listener once
      // so that we don't leak too many listeners.
      once: true,
      passive: true,
    })
  );
}
