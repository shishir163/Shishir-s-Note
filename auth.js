/* Login gate loader — covers the app until the account is verified. */
(function () {
  var root = document.documentElement;
  var gate = document.createElement('div');
  gate.id = 'sn-gate';
  gate.style.cssText = 'position:fixed;inset:0;z-index:2000;display:flex;align-items:center;justify-content:center;padding:20px;' +
    'background:var(--canvas,#f4f5f9);color:var(--ink-soft,#6b6f80);font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;font-size:15px';
  gate.textContent = 'Loading…';
  root.appendChild(gate);

  function fail(src) {
    gate.innerHTML = '<div style="text-align:center">Could not load ' + src + '.<br>Check your internet and ' +
      '<a href="" style="color:#6d48e5;font-weight:700">try again</a>.</div>';
  }
  function load(src, next) {
    var s = document.createElement('script');
    s.src = src;
    s.onload = next;
    s.onerror = function () { fail(src); };
    root.appendChild(s);
  }
  load('firebase-config.js', function () { load('auth.bundle.js'); });
})();
