const externalDialogMarkup = `
  <dialog class="external-link-dialog" id="external-link-dialog" aria-labelledby="external-link-title">
    <div class="external-link-panel">
      <span class="row-index">EXTERNAL LINK</span>
      <h2 id="external-link-title">即将离开 Shell++ 官网</h2>
      <p>你将跳转到第三方页面。请确认目标地址无误后再继续。</p>
      <code id="external-link-url">https://example.com/</code>
      <p class="external-link-note">
        我们在添加该链接时已进行基本安全核验，但无法持续保证第三方页面后续的内容、隐私政策或安全性。是否继续访问，请您自行判断。
      </p>
      <div class="external-link-actions">
        <button class="line-action" type="button" data-external-cancel>取消</button>
        <button class="primary-action" type="button" data-external-continue>继续前往</button>
      </div>
    </div>
  </dialog>
`;

let pendingExternalHref = "";
let isClosingExternalDialog = false;

function getExternalDialog() {
  let dialog = document.getElementById("external-link-dialog");
  if (!dialog) {
    document.body.insertAdjacentHTML("beforeend", externalDialogMarkup);
    dialog = document.getElementById("external-link-dialog");
  }
  return dialog;
}

function closeExternalDialog({ clearHref = true, afterClose } = {}) {
  const dialog = getExternalDialog();
  if (!(dialog instanceof HTMLDialogElement) || !dialog.open || isClosingExternalDialog) {
    return;
  }

  isClosingExternalDialog = true;
  dialog.classList.add("is-closing");

  window.setTimeout(() => {
    dialog.close();
    dialog.classList.remove("is-closing");
    document.body.classList.remove("has-native-dialog-cursor");
    isClosingExternalDialog = false;

    if (clearHref) {
      pendingExternalHref = "";
    }

    afterClose?.();
  }, 180);
}

function openExternalDialog(href) {
  const dialog = getExternalDialog();
  const url = document.getElementById("external-link-url");
  const continueButton = dialog.querySelector("[data-external-continue]");

  pendingExternalHref = href;
  if (url) {
    url.textContent = href;
  }

  if (dialog instanceof HTMLDialogElement) {
    dialog.classList.remove("is-closing");
    isClosingExternalDialog = false;
    document.body.classList.add("has-native-dialog-cursor");
    dialog.showModal();
    continueButton?.focus();
  }
}

function isExternalHttpLink(link) {
  if (!link.href) {
    return false;
  }

  const url = new URL(link.href, window.location.href);
  return (url.protocol === "http:" || url.protocol === "https:") && url.origin !== window.location.origin;
}

function bindExternalDialogControls() {
  const dialog = getExternalDialog();
  const cancelButton = dialog.querySelector("[data-external-cancel]");
  const continueButton = dialog.querySelector("[data-external-continue]");

  cancelButton?.addEventListener("click", () => closeExternalDialog());

  continueButton?.addEventListener("click", () => {
    if (!pendingExternalHref) {
      return;
    }

    const nextHref = pendingExternalHref;
    closeExternalDialog({
      clearHref: true,
      afterClose: () => {
        window.open(nextHref, "_blank", "noopener,noreferrer");
      },
    });
  });

  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) {
      closeExternalDialog();
    }
  });

  dialog.addEventListener("cancel", (event) => {
    event.preventDefault();
    closeExternalDialog();
  });
}

bindExternalDialogControls();

document.addEventListener("click", (event) => {
  const link = event.target instanceof Element ? event.target.closest("a[href]") : null;
  if (!(link instanceof HTMLAnchorElement) || !isExternalHttpLink(link)) {
    return;
  }

  event.preventDefault();
  openExternalDialog(link.href);
});

document.addEventListener("keydown", (event) => {
  const dialog = getExternalDialog();
  if (event.key === "Escape" && dialog.open) {
    event.preventDefault();
    closeExternalDialog();
  }
});
