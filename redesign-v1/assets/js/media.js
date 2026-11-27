/* Media page: open a magazine feature full size, and play videos only when asked
   (nothing from YouTube loads until a visitor presses play). */
(function () {
  'use strict';
  var A = window.NPS_ARTICLES || [], dlg = document.getElementById('artview'), body = document.getElementById('avBody');
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-art]');
    if (b && dlg) {
      var a = A[+b.getAttribute('data-art')]; if (!a) return;
      document.getElementById('avT').textContent = a.t;
      body.innerHTML = (a.p ? '<p class="pub" style="margin:0 0 14px">' + esc(a.p) + '</p>' : '') + a.i.map(function (src) { return '<img class="afull" src="' + esc(src) + '" alt="' + esc(a.t) + '">'; }).join('') + (a.l ? '<p style="margin-top:18px"><a class="btn btn--ink btn--sm" href="' + esc(a.l) + '" target="_blank" rel="noopener">Open the original</a></p>' : '');
      if (dlg.showModal) dlg.showModal(); else dlg.setAttribute('open', '');
      return;
    }
    var v = e.target.closest('.vplay');
    if (v) {
      var kind = v.getAttribute('data-kind'), ref = v.getAttribute('data-ref'), t = v.getAttribute('data-title'), h;
      if (kind === 'youtube') h = '<iframe src="https://www.youtube-nocookie.com/embed/' + encodeURIComponent(ref) + '?autoplay=1&rel=0" title="' + esc(t) + '" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>';
      else if (kind === 'vimeo') h = '<iframe src="https://player.vimeo.com/video/' + encodeURIComponent(ref) + '?autoplay=1" title="' + esc(t) + '" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>';
      else h = '<video src="' + esc(ref) + '" controls autoplay playsinline></video>';
      v.outerHTML = '<div class="vlive">' + h + '</div>';
    }
  });
})();
