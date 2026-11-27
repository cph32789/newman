/* Special offers: show an offer only between its start and end dates, so an expired offer
   disappears by itself. If none are showing, show the "check back" message. */
(function () {
  'use strict';
  var cards = document.querySelectorAll('.ofc'), empty = document.getElementById('ofempty'), shown = 0;
  var d = new Date(), today = d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2);
  cards.forEach(function (c) {
    var s = c.getAttribute('data-start'), e = c.getAttribute('data-end'), live = (!s || s <= today) && (!e || e >= today);
    c.hidden = !live; if (live) shown++;
  });
  if (empty) empty.hidden = shown > 0;
})();
