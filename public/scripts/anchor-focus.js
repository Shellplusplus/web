const anchorFocusSelectors = [
  ".page-hero[id]",
  ".architecture-grid[id]",
  ".panel[id]",
  ".download-stage[id]",
  ".download-platform-strip[id]",
  ".site-footer",
];

const anchorFocusSections = Array.from(document.querySelectorAll(anchorFocusSelectors.join(",")));
let anchorFocusTarget = null;
let anchorFocusClearTimer = 0;
let ignoreScrollUntil = 0;

anchorFocusSections.forEach((section) => section.classList.add("anchor-focus-section"));

function clearAnchorFocus() {
  window.clearTimeout(anchorFocusClearTimer);
  document.body.classList.remove("is-anchor-focus");

  if (anchorFocusTarget) {
    anchorFocusTarget.classList.remove("anchor-focus-target");
    anchorFocusTarget = null;
  }
}

function activateAnchorFocus(target) {
  clearAnchorFocus();
  anchorFocusTarget = target;
  target.classList.add("anchor-focus-target");
  document.body.classList.add("is-anchor-focus");
  ignoreScrollUntil = performance.now() + 900;

  anchorFocusClearTimer = window.setTimeout(() => {
    ignoreScrollUntil = 0;
  }, 900);
}

function getSamePageHashLink(link) {
  if (!link || !link.hash || link.hash === "#") {
    return null;
  }

  const url = new URL(link.href, window.location.href);
  if (url.origin !== window.location.origin || url.pathname !== window.location.pathname) {
    return null;
  }

  return document.getElementById(decodeURIComponent(url.hash.slice(1)));
}

document.addEventListener("click", (event) => {
  const link = event.target.closest("a[href*='#']");
  const target = getSamePageHashLink(link);

  if (!target) {
    return;
  }

  event.preventDefault();
  target.scrollIntoView({ behavior: "smooth", block: "start" });
  history.pushState(null, "", `${window.location.pathname}${window.location.search}#${target.id}`);
  activateAnchorFocus(target);
});

window.addEventListener(
  "scroll",
  () => {
    if (!document.body.classList.contains("is-anchor-focus") || performance.now() < ignoreScrollUntil) {
      return;
    }

    clearAnchorFocus();
  },
  { passive: true },
);

window.addEventListener(
  "wheel",
  () => {
    clearAnchorFocus();
  },
  { passive: true },
);

window.addEventListener(
  "touchmove",
  () => {
    clearAnchorFocus();
  },
  { passive: true },
);

window.addEventListener("keydown", (event) => {
  const scrollKeys = ["ArrowDown", "ArrowUp", "PageDown", "PageUp", "Home", "End", " "];
  if (scrollKeys.includes(event.key)) {
    clearAnchorFocus();
  }
});

window.addEventListener("hashchange", () => {
  const id = decodeURIComponent(window.location.hash.slice(1));
  const target = id ? document.getElementById(id) : null;

  if (target) {
    activateAnchorFocus(target);
  } else {
    clearAnchorFocus();
  }
});

if (window.location.hash) {
  const id = decodeURIComponent(window.location.hash.slice(1));
  const target = id ? document.getElementById(id) : null;

  if (target) {
    window.setTimeout(() => activateAnchorFocus(target), 180);
  }
}
