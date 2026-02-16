// js/documents.js
(function () {
  const STORE_KEY = "student_documents";

  const DEFAULTS = {
    resume: null,
    transcript: null,
    coverLetter: null,
    recommendation: null,
    portfolio: null,
  };

  function loadStore() {
    try {
      return { ...DEFAULTS, ...(JSON.parse(localStorage.getItem(STORE_KEY)) || {}) };
    } catch {
      return { ...DEFAULTS };
    }
  }

  function saveStore(data) {
    localStorage.setItem(STORE_KEY, JSON.stringify(data));
  }

  // ===== Modal Helpers =====
  function ensureModal() {
    if (document.getElementById("docModal")) return;

    const modalHTML = `
      <div id="docModal" class="docModalOverlay" style="display:none;">
        <div class="docModalCard">
          <div class="docModalHeader">
            <b id="docModalTitle">Document</b>
            <button class="docModalClose" onclick="closeDocModal()">✕</button>
          </div>

          <div id="docModalBody" class="docModalBody"></div>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML("beforeend", modalHTML);
  }

  function openDocModal(title, bodyHTML) {
    ensureModal();
    document.getElementById("docModalTitle").textContent = title;
    document.getElementById("docModalBody").innerHTML = bodyHTML;
    document.getElementById("docModal").style.display = "flex";
  }

  function closeDocModal() {
    const el = document.getElementById("docModal");
    if (el) el.style.display = "none";
  }

  // Close modal when clicking outside card
  document.addEventListener("click", (e) => {
    const modal = document.getElementById("docModal");
    if (!modal || modal.style.display === "none") return;
    if (e.target === modal) closeDocModal();
  });

  // ===== Public functions used by onclick =====
  function uploadDoc(docId) {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".pdf,.png,.jpg,.jpeg";
    input.onchange = () => {
      const file = input.files && input.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = () => {
        const data = loadStore();
        data[docId] = {
          name: file.name,
          type: file.type,
          dataUrl: reader.result, // base64 data url
          uploadedAt: new Date().toISOString(),
        };
        saveStore(data);
        renderDocumentsUI();
      };
      reader.readAsDataURL(file);
    };
    input.click();
  }

  function viewDoc(docId) {
    const data = loadStore();
    const doc = data[docId];

    if (!doc) {
      openDocModal(
        "Missing document",
        `<p style="margin:0 0 12px 0;">You haven't uploaded this document yet.</p>
         <button class="btn btn-primary" onclick="uploadDoc('${docId}')">Upload now</button>`
      );
      return;
    }

    const titleMap = {
      resume: "Resume (CV)",
      transcript: "Transcript",
      coverLetter: "Cover Letter",
      recommendation: "Recommendation Letter",
      portfolio: "Portfolio",
    };

    const title = titleMap[docId] || "Document";

    // show PDF in iframe, images in img
    let preview = "";
    if ((doc.type || "").includes("pdf")) {
      preview = `<iframe src="${doc.dataUrl}" style="width:100%;height:520px;border:0;border-radius:12px;"></iframe>`;
    } else if ((doc.type || "").startsWith("image/")) {
      preview = `<img src="${doc.dataUrl}" style="max-width:100%;border-radius:12px;" />`;
    } else {
      preview = `<p>Preview not supported for this file type.</p>`;
    }

    openDocModal(
      title,
      `
      <div style="display:flex;justify-content:space-between;gap:10px;align-items:center;margin-bottom:10px;">
        <div style="color:var(--muted);font-size:13px;">
          <b style="color:var(--text);">File:</b> ${escapeHtml(doc.name || "file")}
        </div>
        <div style="display:flex;gap:8px;">
          <button class="btn" onclick="removeDoc('${docId}')">Remove</button>
          <button class="btn btn-primary" onclick="uploadDoc('${docId}')">Replace</button>
        </div>
      </div>
      ${preview}
      `
    );
  }

  function removeDoc(docId) {
    const data = loadStore();
    data[docId] = null;
    saveStore(data);
    closeDocModal();
    renderDocumentsUI();
  }

  // ===== UI renderer (updates badges/buttons in your list) =====
  function renderDocumentsUI() {
    const data = loadStore();

    document.querySelectorAll("[data-doc]").forEach((row) => {
      const id = row.getAttribute("data-doc");
      const statusEl = row.querySelector("[data-status]");
      const actionEl = row.querySelector("[data-action]");

      const exists = !!data[id];

      if (statusEl) {
        statusEl.textContent = exists ? "Uploaded" : "Missing";
        statusEl.classList.remove("ok", "warn");
        statusEl.classList.add(exists ? "ok" : "warn");
      }

      if (actionEl) {
        if (exists) {
          actionEl.innerHTML = `
            <a class="btn" href="#" onclick="viewDoc('${id}'); return false;">View</a>
          `;
        } else {
          actionEl.innerHTML = `
            <a class="btn btn-primary" href="#" onclick="uploadDoc('${id}'); return false;">Upload</a>
          `;
        }
      }
    });
  }

  function escapeHtml(str) {
    return String(str)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  // Expose to window for onclick usage
  window.uploadDoc = uploadDoc;
  window.viewDoc = viewDoc;
  window.removeDoc = removeDoc;
  window.closeDocModal = closeDocModal;
  window.renderDocumentsUI = renderDocumentsUI;

  // Auto-run when page loads
  window.addEventListener("DOMContentLoaded", () => {
    renderDocumentsUI();
  });
})();
