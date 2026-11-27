/* Shows the Admin's page edits (wording, pictures, links, section order, hidden sections).
   Runs before the page draws itself. Edits are saved by Admin > Pages > Edit this page. */
(function () {
  'use strict';
  if (!window.PAGEKIT) return;
  var all; try { all = JSON.parse(localStorage.getItem('nps.pageEdits') || 'null'); } catch (e) { all = null; }
  if (!all) return;
  var E = all[PAGEKIT.pageKey(location.pathname)]; if (!E) return;
  try { PAGEKIT.apply(document, E); } catch (e) { console.warn('page edits could not be applied', e); }
})();
