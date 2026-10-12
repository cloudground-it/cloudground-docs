// Keeps the colour mode in step across tabs without the echo that froze the
// browser (issue #12).
//
// Docusaurus listens for `storage` events on the colour-mode key and answers
// each one by writing the received value back to localStorage. When two tabs
// change the mode at nearly the same time (or one tab changes it quickly while
// others are open) the events cross: a tab receives an old value after storage
// has already moved on, writes that old value back, the other tabs answer with
// theirs, and the tabs echo each other without end.
//
// This listener runs before Docusaurus's (it is added when the client modules
// load, before React mounts) and drops every event whose value is no longer
// the one in storage. The event that carries the current value always follows,
// so tabs still end on the same mode, and the write-back Docusaurus then does
// stores the value already there: no new event, no echo.
import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';
import SiteStorage from '@generated/site-storage';

const KEY = `theme${SiteStorage.namespace}`;

if (ExecutionEnvironment.canUseDOM) {
  window.addEventListener('storage', (event) => {
    if (event.key !== KEY) {
      return;
    }
    let current: string | null;
    try {
      const storage = window[SiteStorage.type];
      if (event.storageArea !== storage) {
        return;
      }
      current = storage.getItem(KEY);
    } catch {
      return;
    }
    if (event.newValue !== current) {
      event.stopImmediatePropagation();
    }
  });
}
