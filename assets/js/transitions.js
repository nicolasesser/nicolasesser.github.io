// Decides whether a page change slides left or right, based on the order of
// the tabs in the menu. Must load in <head> (not deferred) so it runs before
// the new page is first shown. Keep this list in sync with _includes/nav.html.
(function () {
  var order = ['/', '/research/', '/cv/', '/outreach/', '/contact/'];

  function position(url) {
    try {
      var path = new URL(url, location.href).pathname.toLowerCase();
      if (path.slice(-1) !== '/') path += '/';
      path = path.replace(/index\.html\/$/, '');
      return order.indexOf(path);
    } catch (e) {
      return -1;
    }
  }

  function remember() {
    try { sessionStorage.setItem('lastPage', location.href); } catch (e) {}
  }

  // Where did we come from? Chrome/Edge tell us directly (Navigation API);
  // Safari does not, so we also remember the previous page ourselves.
  function previousPage() {
    if (window.navigation && navigation.activation && navigation.activation.from) {
      return navigation.activation.from.url;
    }
    try { return sessionStorage.getItem('lastPage'); } catch (e) { return null; }
  }

  window.addEventListener('pagereveal', function (event) {
    var from = previousPage();
    remember();
    if (!event.viewTransition || !from) return;

    var a = position(from);
    var b = position(location.href);
    if (a < 0 || b < 0 || a === b) return;   // other page: default cross-fade

    event.viewTransition.types.add(b > a ? 'forward' : 'backward');
  });

  // Browsers without the pagereveal event: still keep track of the last page.
  if (!('onpagereveal' in window)) remember();
})();
