const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const revealGroups = [
  ".status-strip > div",
  ".architecture-card",
  ".panel-heading",
  ".showcase-device, .showcase-card",
  ".feature-card",
  ".compatibility-row",
  ".detail-row",
  ".release-card",
  ".developer-card",
  ".download-card",
  ".platform-card",
  ".device-group",
  ".site-footer > p",
];

const revealTargets = [];
const seenNodes = new Set();

function registerRevealTargets(selectors, bucket) {
  for (const selector of selectors) {
    const nodes = Array.from(document.querySelectorAll(selector));
    nodes.forEach((node, index) => {
      if (seenNodes.has(node)) {
        return;
      }

      seenNodes.add(node);
      node.classList.add("reveal-item");
      node.style.setProperty("--reveal-delay", `${Math.min(index * 90, 360)}ms`);
      bucket.push(node);
    });
  }
}

registerRevealTargets(revealGroups, revealTargets);

document.body.classList.add("is-reveal-ready");

if (reduceMotion) {
  revealTargets.forEach((node) => node.classList.add("is-visible"));
} else {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.16,
      rootMargin: "0px 0px -10% 0px",
    },
  );

  revealTargets.forEach((node) => {
    observer.observe(node);
  });
}
