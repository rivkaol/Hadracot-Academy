// Shared behaviour for /live/<series> pages. Reads window.SESSION (set in each page's <head>):
// fills dates and prices, closes the page once the session has started, wires the checkout links,
// shows a draft banner while details are missing, and reports views and pay clicks to /api/hub.
(function () {
  var S = window.SESSION || {};
  var start = new Date(S.start);
  var tz = 'Asia/Jerusalem';
  var dayLong = function (d) { return d.toLocaleDateString('he-IL', { timeZone: tz, weekday: 'long', day: 'numeric', month: 'long' }); };
  var joinBy = new Date(start.getTime() + (S.joinWindowDays || 3) * 864e5);

  var values = {
    date: isNaN(start) ? '' : dayLong(start),
    time: isNaN(start) ? '' : start.toLocaleTimeString('he-IL', { timeZone: tz, hour: '2-digit', minute: '2-digit' }),
    price: S.price != null ? String(S.price) : '',
    joinBy: isNaN(start) ? '' : dayLong(joinBy),
  };
  document.querySelectorAll('[data-field]').forEach(function (el) {
    var v = values[el.getAttribute('data-field')];
    if (v) el.textContent = v;
  });

  if (!isNaN(start) && Date.now() >= start.getTime()) document.body.classList.add('is-closed');

  document.querySelectorAll('a[data-checkout]').forEach(function (a) {
    if (S.checkoutUrl) a.href = S.checkoutUrl;
  });

  var draft = document.getElementById('draft');
  if (draft && S.draft && S.draft.length) {
    draft.textContent = 'טיוטה, לא לפרסום. עוד חסר: ' + S.draft.join(' · ');
    draft.hidden = false;
  }

  // Fade sections in as they scroll into view.
  var items = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) { items.forEach(function (el) { el.classList.add('in'); }); }
  else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    items.forEach(function (el) { io.observe(el); });
  }

  // Funnel tracking, same pattern as /join: fire-and-forget, never blocks the payment link.
  var params = new URLSearchParams(location.search);
  var src = (params.get('src') || '').slice(0, 60) || 'direct';
  var ref = '';
  try { if (document.referrer) ref = new URL(document.referrer).hostname; } catch (e) {}
  function send(eventName, extra) {
    try {
      var meta = { src: src, ref: ref, series: S.series, session: S.start };
      if (extra) for (var k in extra) meta[k] = extra[k];
      var body = JSON.stringify({ action: 'trackEvent', eventName: eventName, meta: meta });
      if (navigator.sendBeacon && navigator.sendBeacon('/api/hub', new Blob([body], { type: 'application/json' }))) return;
      fetch('/api/hub', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: body, keepalive: true }).catch(function () {});
    } catch (e) {}
  }
  send('live_view');
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a');
    if (!a) return;
    var href = a.getAttribute('href') || '';
    if (href.indexOf('invoice4u') !== -1) send('live_pay_click');
    else if (href === '#offer') send('live_offer_click', { button: (a.textContent || '').trim().slice(0, 40) });
  });
})();
