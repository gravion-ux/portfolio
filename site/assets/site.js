/* Gravion portfolio — project grid rendering and category filter.
   No dependencies, no tracking, no external requests. */

(function () {
  "use strict";

  var grid = document.getElementById("project-grid");
  if (!grid) {
    return;
  }

  var list = document.getElementById("project-list");
  var filters = document.querySelectorAll("[data-filter]");
  var countEl = document.getElementById("project-count");

  function el(tag, cls, text) {
    var node = document.createElement(tag);
    if (cls) {
      node.className = cls;
    }
    if (text !== undefined) {
      if (text !== null) {
        node.textContent = text;
      }
    }
    return node;
  }

  function render(items) {
    grid.textContent = "";
    items.forEach(function (p) {
      var card = el("li", "card");
      card.setAttribute("data-category", p.category);

      var h3 = el("h3");
      var link = el("a", null, p.name);
      link.href = p.url;
      link.rel = "noopener noreferrer";
      h3.appendChild(link);
      card.appendChild(h3);

      card.appendChild(el("p", null, p.description));

      var foot = el("div", "card-foot");
      foot.appendChild(el("span", null, p.language));
      foot.appendChild(el("span", null, p.stars + (p.stars === 1 ? " star" : " stars")));
      if (p.testCount) {
        foot.appendChild(el("span", null, p.testCount + " tests"));
      }
      card.appendChild(foot);

      grid.appendChild(card);
    });

    if (countEl) {
      countEl.textContent = items.length + (items.length === 1 ? " project" : " projects");
    }
  }

  function load() {
    fetch("assets/projects.json")
      .then(function (resp) {
        if (!resp.ok) {
          throw new Error("HTTP " + resp.status);
        }
        return resp.json();
      })
      .then(function (data) {
        var all = data.projects || [];
        window.__gravionProjects = all;

        var active = "all";
        var visible = all;

        function apply() {
          if (active === "all") {
            visible = all;
          } else {
            visible = all.filter(function (p) { return p.category === active; });
          }
          render(visible);
        }

        Array.prototype.forEach.call(filters, function (btn) {
          btn.addEventListener("click", function () {
            active = btn.getAttribute("data-filter");
            Array.prototype.forEach.call(filters, function (other) {
              other.setAttribute("aria-pressed", other === btn ? "true" : "false");
            });
            apply();
          });
        });

        apply();

        if (list) {
          list.classList.add("hide");
        }
      })
      .catch(function () {
        // The noscript fallback already lists every project, so a failure here
        // leaves the page complete rather than blank.
        grid.classList.add("hide");
        if (countEl) {
          countEl.textContent = "Project list unavailable — see the full list below";
        }
      });
  }

  load();
})();
