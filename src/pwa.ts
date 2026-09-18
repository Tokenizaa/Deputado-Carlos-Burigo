export function registerPwaServiceWorker() {
  if (!("serviceWorker" in navigator)) return;

  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js", {scope: "/" }).catch(() => {
      // PWA is progressive enhancement; a registration failure must not block the portal.
    });
  });
}
