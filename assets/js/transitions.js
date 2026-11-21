// Decides whether a page change slides left or right, based on the order of
// the tabs in the menu. Must load in <head> (not deferred) so it runs before
// the new page is first shown. Keep this list in sync with _includes/nav.html.
(function () {
  var order = ['/', '/research/', '/cv/', '/outreach/', '/contact/'];

  function position(url) {
    try {
      var path = new URL(url).pathname.toLowerCase();
      if (path.slice(-1) !== '/') path += '/';
      path = path.replace(/index\.html\/$/, '');
      return order.indexOf(path);
    } catch (e) {
      return -1;
    }
  }

  window.addEventListener('pagereveal', function (event) {
    if (!event.viewTransition || !window.navigation || !navigation.activation) return;
    var from = navigation.activation.from;
    var to = navigation.activation.entry;
    if (!from || !to) return;

    var a = position(from.url);
    var b = position(to.url);
    if (a < 0 || b < 0 || a === b) return;   // unknown page: default cross-fade

    event.viewTransition.types.add(b > a ? 'forward' : 'backward');
  });
})();
