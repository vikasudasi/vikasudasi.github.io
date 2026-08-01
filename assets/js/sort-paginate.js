(function () {
  'use strict';

  // ---------- Pagination ----------
  function initPagination(containerId, itemsSelector, perPage) {
    var container = document.getElementById(containerId);
    if (!container) return;
    var items = container.querySelectorAll(itemsSelector);
    if (items.length === 0) return;

    var controls = container.querySelector('.paginate-controls');
    if (!controls) {
      controls = document.createElement('div');
      controls.className = 'paginate-controls d-flex justify-content-center align-items-center gap-3 mt-4 mb-2';
      container.appendChild(controls);
    }

    function render(page) {
      var total = Math.ceil(items.length / perPage);
      if (page < 1) page = 1;
      if (page > total) page = total;
      items.forEach(function (el, i) {
        var p = Math.floor(i / perPage) + 1;
        el.style.display = p === page ? '' : 'none';
      });
      controls.innerHTML =
        '<button class="paginate-prev btn btn-sm btn-outline-primary"' +
          (page <= 1 ? ' disabled' : '') + '>\u2190 Previous</button>' +
        '<span class="paginate-info fw-medium mx-2">' + page + ' / ' + total + '</span>' +
        '<button class="paginate-next btn btn-sm btn-outline-primary"' +
          (page >= total ? ' disabled' : '') + '>Next \u2192</button>';
      controls.querySelector('.paginate-prev').onclick = function () { render(page - 1); };
      controls.querySelector('.paginate-next').onclick = function () { render(page + 1); };
    }
    render(1);
  }

  // ---------- Trends ----------
  function initTrends() {
    var container = document.getElementById('trends-container');
    if (!container) return;
    var sel = document.getElementById('trends-sort');
    if (!sel) return;

    function reorder() {
      var sections = Array.prototype.slice.call(
        container.querySelectorAll('[data-date]')
      );
      sections.sort(function (a, b) {
        var da = a.getAttribute('data-date') || '';
        var db = b.getAttribute('data-date') || '';
        return sel.value === 'newest' ? db.localeCompare(da) : da.localeCompare(db);
      });
      sections.forEach(function (el) { container.appendChild(el); });
      // Remove then re-create pagination
      var oldCtl = container.querySelector('.paginate-controls');
      if (oldCtl) oldCtl.remove();
      initPagination('trends-container', '[data-date]', 3);
    }
    sel.addEventListener('change', reorder);
    reorder();
  }

  // ---------- Projects ----------
  function initProjects() {
    var container = document.getElementById('projects-container');
    if (!container) return;
    var sel = document.getElementById('projects-sort');
    if (!sel) return;

    function reorder() {
      var cards = Array.prototype.slice.call(
        container.querySelectorAll('.project-card')
      );
      cards.sort(function (a, b) {
        if (sel.value === 'importance') {
          return (parseInt(a.getAttribute('data-importance')) || 99) -
                 (parseInt(b.getAttribute('data-importance')) || 99);
        }
        var ta = (a.getAttribute('data-title') || '').toLowerCase();
        var tb = (b.getAttribute('data-title') || '').toLowerCase();
        return sel.value === 'alpha-asc'
          ? ta.localeCompare(tb)
          : tb.localeCompare(ta);
      });
      cards.forEach(function (el) { container.appendChild(el); });
      var oldCtl = container.querySelector('.paginate-controls');
      if (oldCtl) oldCtl.remove();
      initPagination('projects-container', '.project-card', 12);
    }
    sel.addEventListener('change', reorder);
    reorder();
  }

  // ---------- Boot ----------
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { initTrends(); initProjects(); });
  } else {
    initTrends();
    initProjects();
  }
})();