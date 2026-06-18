(function () {
  const input = document.getElementById("searchInput");
  const results = document.getElementById("searchResults");
  const summary = document.getElementById("searchSummary");
  const items = Array.isArray(window.SEARCH_ITEMS) ? window.SEARCH_ITEMS : [];
  const params = new URLSearchParams(window.location.search);
  const initial = params.get("q") || "";

  function escapeText(value) {
    return String(value || "").replace(/[&<>"]/g, function (char) {
      return {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
      }[char];
    });
  }

  function card(item) {
    const tags = (item.tags || [])
      .slice(0, 3)
      .map(function (tag) {
        return "<span>" + escapeText(tag) + "</span>";
      })
      .join("");

    return (
      '<article class="movie-card">' +
      '<a class="poster-link" href="' +
      escapeText(item.href) +
      '" aria-label="观看' +
      escapeText(item.title) +
      '">' +
      '<img src="' +
      escapeText(item.cover) +
      '" alt="' +
      escapeText(item.title) +
      ' 高分电影封面" loading="lazy">' +
      '<span class="year-badge">' +
      escapeText(item.year) +
      "</span>" +
      '<span class="watch-badge">观看</span>' +
      "</a>" +
      '<div class="movie-card-body">' +
      '<h2><a href="' +
      escapeText(item.href) +
      '">' +
      escapeText(item.title) +
      "</a></h2>" +
      "<p>" +
      escapeText(item.oneLine) +
      "</p>" +
      '<div class="movie-meta">' +
      escapeText(
        [item.year, item.region, item.type, item.genre]
          .filter(Boolean)
          .join(" · "),
      ) +
      "</div>" +
      '<div class="tag-row">' +
      tags +
      "</div>" +
      "</div>" +
      "</article>"
    );
  }

  function render(query) {
    const q = String(query || "")
      .trim()
      .toLowerCase();
    let matched = items;

    if (q) {
      matched = items.filter(function (item) {
        const text = [
          item.title,
          item.year,
          item.region,
          item.type,
          item.genre,
          (item.tags || []).join(" "),
          item.oneLine,
        ]
          .join(" ")
          .toLowerCase();
        return text.indexOf(q) !== -1;
      });
    }

    const visible = matched.slice(0, q ? 120 : 48);
    results.innerHTML = visible.map(card).join("");
    summary.textContent = q ? "搜索结果：" + q : "精选内容";
  }

  if (input) {
    input.value = initial;
    input.addEventListener("input", function () {
      render(input.value);
    });
  }

  render(initial);
})();
