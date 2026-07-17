const canUseGlintCursor =
  window.matchMedia("(pointer: fine)").matches &&
  !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (canUseGlintCursor) {
  const cursor = document.createElement("div");
  cursor.className = "cursor-glint";
  cursor.setAttribute("aria-hidden", "true");
  document.body.append(cursor);
  document.body.classList.add("has-glint-cursor");

  let pointerX = window.innerWidth / 2;
  let pointerY = window.innerHeight / 2;
  let currentX = pointerX;
  let currentY = pointerY;
  let frame = 0;

  function updateCursor() {
    currentX += (pointerX - currentX) * 0.42;
    currentY += (pointerY - currentY) * 0.42;
    cursor.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) translate(-50%, -50%)`;
    frame = window.requestAnimationFrame(updateCursor);
  }

  window.addEventListener(
    "pointermove",
    (event) => {
      pointerX = event.clientX;
      pointerY = event.clientY;
      cursor.classList.add("is-visible");
    },
    { passive: true },
  );

  window.addEventListener("pointerdown", () => cursor.classList.add("is-pressed"));
  window.addEventListener("pointerup", () => cursor.classList.remove("is-pressed"));
  document.addEventListener("mouseleave", () => cursor.classList.remove("is-visible"));
  document.addEventListener("mouseenter", () => cursor.classList.add("is-visible"));

  document.addEventListener("mouseover", (event) => {
    const interactive = event.target.closest("a, button, input, textarea, select, summary, [role='button']");
    cursor.classList.toggle("is-interactive", Boolean(interactive));
  });

  frame = window.requestAnimationFrame(updateCursor);

  window.addEventListener("pagehide", () => window.cancelAnimationFrame(frame));
}
