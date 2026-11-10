(() => {
  "use strict";
  const track = document.getElementById("slides");
  const slides = [...track.children];
  const previous = document.getElementById("previous");
  const next = document.getElementById("next");
  const viewport = document.getElementById("viewport");
  let current = 0;

  function showPage(index) {
    const target = Math.max(0, Math.min(slides.length - 1, index));
    if (target === current) return;
    current = target;
    track.style.transform = `translateX(-${current * 100}%)`;
    document.getElementById("current").textContent = String(current + 1);
    slides.forEach((slide, i) => {
      slide.setAttribute("aria-hidden", String(i !== current));
      slide.inert = i !== current;
    });
    const focus = document.activeElement;
    previous.hidden = current === 0;
    next.hidden = current === slides.length - 1;
    if (focus === next && next.hidden) previous.focus({ preventScroll: true });
    if (focus === previous && previous.hidden) next.focus({ preventScroll: true });
    // 次の画像を先読みして、横スライド時の表示待ちを減らします。
    slides[current + 1]?.querySelector("img")?.setAttribute("loading", "eager");
  }

  previous.addEventListener("click", () => showPage(current - 1));
  next.addEventListener("click", () => showPage(current + 1));
  document.addEventListener("keydown", (event) => {
    if (event.target.closest("input, select, textarea, [contenteditable]")) return;
    if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
    if (event.key === "ArrowRight") { event.preventDefault(); showPage(current + 1); }
    if (event.key === "ArrowLeft") { event.preventDefault(); showPage(current - 1); }
  });

  let start = null;
  viewport.addEventListener("pointerdown", (event) => {
    if (event.target.closest(".slide-form")) return;
    if (!event.isPrimary || event.button !== 0) return;
    start = { x: event.clientX, y: event.clientY, id: event.pointerId };
    viewport.setPointerCapture(event.pointerId);
  });
  viewport.addEventListener("pointerup", (event) => {
    if (!start || start.id !== event.pointerId) return;
    const dx = event.clientX - start.x;
    const dy = event.clientY - start.y;
    start = null;
    if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.3) showPage(current + (dx < 0 ? 1 : -1));
  });
  viewport.addEventListener("pointercancel", () => { start = null; });

  const cta = document.getElementById("cta-link");
  slides.forEach((slide, i) => { slide.inert = i !== current; });
  cta.addEventListener("click", (event) => {
    event.preventDefault();
    showPage(slides.length - 1);
    document.getElementById("form-heading").focus({ preventScroll: true });
  });
  if (window.location.hash === "#reservation") showPage(slides.length - 1);

  const form = document.getElementById("reservation-form");
  const dateFields = [...form.querySelectorAll('input[type="date"]')];
  const today = new Date();
  const minimumDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  dateFields.forEach((input) => { input.min = minimumDate; });
  const config = window.LP_CONFIG || {};
  const submitButton = document.getElementById("form-submit");
  const status = document.getElementById("form-status");
  const submitLabel = submitButton.innerHTML;
  let sending = false;

  async function submitForm(event) {
    event.preventDefault();
    if (sending) return;
    dateFields.forEach((input) => { input.required = true; });
    ["time_1", "time_2", "clinic"].forEach((name) => { form.elements[name].required = true; });
    if (!form.reportValidity()) return;

    // 通知先はWeb3Forms側の登録先。選択院に対応するキーだけを使います。
    const clinic = form.elements["clinic"].value;
    const routes = config.clinicAccessKeys || {};
    const accessKey = Object.hasOwn(routes, clinic) ? routes[clinic]?.trim() : "";
    if (!accessKey || /^BLINE_.*ACCESS_KEY$/.test(accessKey)) {
      status.textContent = "選択された院の送信設定は準備中です。お手数ですが、お電話にてご連絡ください。池袋院 03-6709-0535 / 大阪院 06-6926-8812（受付時間 10:00〜19:00）";
      status.focus({ preventScroll: true });
      status.scrollIntoView({ block: "nearest" });
      return;
    }

    sending = true;
    submitButton.disabled = true;
    submitButton.textContent = "送信中...";
    status.textContent = "";

    const raw = new FormData(form);
    const sources = raw.getAll("source");

    // フィールド名の文字化けを防ぐため、メール本文を日本語ラベル付きの1テキストにまとめます。
    const lines = [
      `ご予約院: ${raw.get("clinic") || ""}`,
      `ご来院: ${raw.get("visit_type") || ""}`,
      `お名前（カタカナ）: ${raw.get("name_kana") || ""}`,
      `年齢: ${raw.get("age") || ""}歳`,
      `メールアドレス: ${raw.get("email") || ""}`,
      `電話番号: ${raw.get("tel") || ""}`,
      `第1希望日: ${raw.get("day_1") || ""} ${raw.get("time_1") || ""}`,
      `第2希望日: ${raw.get("day_2") || ""} ${raw.get("time_2") || ""}`,
      `ご連絡希望時間帯: ${raw.get("contact_time") || ""}`,
      `どこで知りましたか: ${sources.length ? sources.join("、") : ""}`,
      `症例モニター: ${raw.get("monitor") || ""}`,
      `お問い合わせ内容: ${raw.get("message") || ""}`,
    ];

    const data = new FormData();
    data.set("access_key", accessKey);
    data.set("subject", `【予約・お問い合わせ】B-LINE CLINIC ${clinic}`);
    data.set("from_name", "B-LINE CLINIC");
    data.set("email", raw.get("email") || "");
    data.set("message", lines.join("\n"));
    data.set("botcheck", "");

    try {
      const response = await fetch("https://api.web3forms.com/submit", { method: "POST", body: data });
      const json = await response.json();
      if (!response.ok || !json.success) throw new Error(json.message || "送信に失敗しました。");
      window.location.href = config.thanksUrl || "thanks/";
    } catch (error) {
      sending = false;
      submitButton.disabled = false;
      submitButton.innerHTML = submitLabel;
      status.textContent = "送信に失敗しました。お手数ですが、お電話にてご連絡ください。池袋院 03-6709-0535 / 大阪院 06-6926-8812（受付時間 10:00〜19:00）";
      status.focus({ preventScroll: true });
      status.scrollIntoView({ block: "nearest" });
    }
  }
  submitButton.addEventListener("click", submitForm);
  form.addEventListener("submit", submitForm);
})();
