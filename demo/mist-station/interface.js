import { items, objects } from "./art.js";
import { BRIDGE, LAND_PRICE } from "./islands.js";
import { iconUrl } from "./scene.js";

const img = (src, size = 28) => `<img src="${src}" width="${size}" height="${size}" alt="">`;
const $$ = selector => document.querySelector(selector);

export function createInterface(state, actions) {
  const panel = $$("#panel"), actionButton = $$("#interact"), actionLabel = $$("#action-word");
  const art = Object.fromEntries(Object.entries(items).map(([id, item]) => [id, iconUrl(item.module)]));
  for (const id of Object.keys(actions.blueprints)) art[id + "-build"] = iconUrl(objects[id]);
  const names = { guide: "Hướng dẫn", bag: "Túi đồ", build: "Bản vẽ", map: "Hải đồ", forge: "Lò luyện",
    workbench: "Bàn chế tạo", dock: "Bến trao đổi" };
  let view = "guide", station = null, key = "", toastTimer;

  function open(next, source = null) {
    if (view === "build" && next !== "build") actions.closeBuild();
    key = "";
    view = next;
    station = source;
    for (const id of ["bag", "build", "map"]) {
      $$("#" + id).setAttribute("aria-expanded", String(id === view));
    }
    $$(".sidebar").classList.toggle("panel-open", view !== "guide");
  }

  function toast(text) {
    const output = $$("#toast");
    output.value = text;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { output.value = ""; }, 2600);
  }

  const toggle = id => open(view === id ? "guide" : id);
  for (const id of ["bag", "build", "map"]) $$("#" + id).addEventListener("click", () => toggle(id));
  $$("#help").addEventListener("click", () => { open("guide"); panel.scrollIntoView({ block: "nearest" }); });
  $$("#dash").addEventListener("click", actions.dash);
  $$("#sound").addEventListener("click", event => event.currentTarget.setAttribute("aria-pressed", String(actions.sound())));

  panel.addEventListener("click", event => {
    const button = event.target.closest("button");
    if (!button) return;
    const { command, id } = button.dataset;
    if (command === "close") open("guide");
    if (command === "plan") actions.plan(id);
    if (command === "craft") actions.craft(id, station);
    if (command === "trade") actions.trade();
    if (command === "unlock") actions.unlock();
    if (command === "visit") actions.visit(id);
  });

  const costText = cost => Object.entries(cost).map(([id, count]) => count + " " + items[id].name.toLowerCase()).join(" · ");
  const button = (command, id, title, detail, icon, disabled = false, selected = false) =>
    `<button type="button" data-command="${command}" data-id="${id}" ${disabled ? "disabled" : ""} ${selected ? 'class="selected"' : ""}>${icon ? img(art[icon]) : ""}<span><strong>${title}</strong><small>${detail}</small></span></button>`;

  function body(selection, job) {
    if (view === "bag") {
      return `<div class="entries">${Object.entries(state.inventory).map(([id, count]) => `<div class="entry">${img(art[id])}<strong>${items[id].name}</strong><b>${count}</b></div>`).join("")}</div>`;
    }
    if (view === "build") {
      return `<p>${selection ? "Chạm một ô rồi nhấn Đặt." : "Chọn bản vẽ và một ô trống trên đảo."}</p><div class="entries">${Object.entries(actions.blueprints).map(([id, bp]) =>
        button("plan", id, bp.name, `${costText(bp.cost)} · ${bp.width}×${bp.height} ô. ${bp.detail}`, id + "-build", false, selection === id)).join("")}</div>`;
    }
    if (view === "forge" || view === "workbench") {
      return `<p>${job ? "Đang làm · " + Math.max(1, Math.ceil((job.end - Date.now()) / 1000)) + " giây" : "Vật phẩm hoàn thành sẽ bay về túi đồ."}</p>
        <div class="entries">${Object.entries(actions.recipes).filter(([, r]) => r.station === view).map(([id, r]) =>
          button("craft", id, r.name, costText(r.cost), r.output, !!job || !actions.afford(r.cost))).join("")}</div>`;
    }
    if (view === "dock") {
      return `<p>Tín phiếu dùng để xin quyền cập bờ tại Bãi Tím.</p><div class="entries">
        ${button("trade", "", "Đổi lấy 3 tín phiếu", "1 thỏi sắt", "coin", !actions.afford({ ingot: 1 }))}
        ${button("unlock", "", state.unlocked ? "Bãi Tím đã mở" : "Mở Bãi Tím", LAND_PRICE + " tín phiếu", "pearl", state.unlocked || !actions.afford({ coin: LAND_PRICE }))}
      </div>`;
    }
    if (view === "map") {
      const bridge = state.structures.filter(s => s.kind === "bridge").length;
      return `<div class="entries">
        ${button("visit", "cove", "Vịnh Rêu", "Đi đến nơi xuất phát")}
        ${button("visit", "garden", "Vườn Mẫu", "Đi qua cầu phía nam · xem cây, hoa và các loại quặng")}
        <div class="entry"><span><strong>Eo Gió</strong><small>${bridge}/${BRIDGE.length} nhịp cầu</small></span><b>≈</b></div>
        <div class="entry"><span><strong>Bãi Tím</strong><small>${state.unlocked ? "Đã cấp quyền cập bờ" : "Cần 3 tín phiếu tại bến trao đổi"}</small></span><b>${state.unlocked ? "●" : "◇"}</b></div>
      </div>`;
    }
    return "<p>Chạm vào cây, đá hay trạm để tự đi đến và tương tác. Giữ nút hành động để chặt hoặc đào liên tục. Chọn bản vẽ trong Xây dựng, sau đó chạm vào ô muốn đặt.</p>";
  }

  function render({ zone, selection, blocked, label, targetName }) {
    const hp = $$("#hearts");
    if (hp.dataset.value !== String(state.player.health)) {
      hp.dataset.value = state.player.health;
      hp.innerHTML = Array.from({ length: 4 }, (_, i) => i < state.player.health ? "♥" : '<span class="empty">♡</span>').join("");
      hp.setAttribute("aria-label", `Máu ${state.player.health} trên 4`);
    }
    const location = ["Eo Gió","Vịnh Rêu","Bãi Tím","Vườn Mẫu"][zone];
    const zoneLabel = $$("#zone");
    if (zoneLabel.textContent !== location) zoneLabel.textContent = location;
    if (actionLabel.textContent !== label) actionLabel.textContent = label;
    const actionName = targetName ? label + " " + targetName.toLowerCase() : label;
    if (actionButton.getAttribute("aria-label") !== actionName) actionButton.setAttribute("aria-label", actionName);
    const locked = String(Boolean(blocked));
    if (actionButton.getAttribute("aria-disabled") !== locked) actionButton.setAttribute("aria-disabled", locked);

    const hasForge = state.structures.some(s => s.kind === "forge");
    const hasBridge = state.structures.filter(s => s.kind === "bridge").length === BRIDGE.length;
    const step = state.restored ? 5 : state.guardian.hp === 0 ? 4 : state.unlocked && hasBridge ? 3 : hasForge ? 2 : 1;
    const goals = [
      ["Dựng lò luyện", "Thu gỗ và đá ở Vịnh Rêu. Chọn lò trong Xây dựng."],
      ["Mở đường qua Eo Gió", "Luyện sắt, đổi tín phiếu tại bến rồi dựng hai nhịp cầu."],
      ["Thu hồi ngọc sương", "Sang Bãi Tím, né các vùng đỏ rồi hạ hộ vệ tinh thể."],
      ["Khởi động trạm", "Lắp lõi tại bàn chế tạo rồi mang đến trạm thời tiết."],
      ["Trạm đã hồi sinh", "Tín hiệu thời tiết đã trở lại Quần đảo Gió Lặng."],
    ];
    const stepLabel = $$("#step");
    if (stepLabel.textContent !== `${step}/5`) {
      stepLabel.textContent = `${step}/5`;
      $$("#goal").textContent = goals[step - 1][0];
      $$("#goal-detail").textContent = goals[step - 1][1];
      document.querySelectorAll("#progress i").forEach((el, i) => el.classList.toggle("on", i < step));
    }

    if (station && Math.hypot(state.player.x - station.x, state.player.y - station.y) > 26) open("guide");
    const job = state.jobs.find(j => j.station === station?.id);
    const jobSeconds = job ? Math.ceil((job.end - Date.now()) / 1000) : -1;
    const change = [view, selection, state.unlocked, hasBridge, state.structures.length, jobSeconds, ...Object.values(state.inventory)].join("/");
    if (change === key) return;
    key = change;
    const previousFocus = panel.contains(document.activeElement) ? document.activeElement.dataset : null;
    panel.innerHTML = `<div class="panel-head"><h2>${names[view]}</h2>${view === "guide" ? "" : '<button type="button" data-command="close" aria-label="Đóng bảng">×</button>'}</div>${body(selection, job)}`;
    if (previousFocus?.command) {
      const nextFocus = [...panel.querySelectorAll("button")].find(el => el.dataset.command === previousFocus.command && el.dataset.id === previousFocus.id);
      nextFocus?.focus({ preventScroll: true });
    }
  }

  return { open, toast, render };
}
