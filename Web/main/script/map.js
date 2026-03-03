document.addEventListener("DOMContentLoaded", () => {

  const regionSelect = document.getElementById("regionSelect");
  const mapImage = document.getElementById("mapImage");
  const pinLayer = document.getElementById("pinLayer");

  /* ===============================
     地域変更時：マップ切り替え
  =============================== */
  regionSelect.addEventListener("change", () => {
    const region = regionSelect.value;
    if (!region) return;

    mapImage.src = `../img/${region}.jpg`;

    // ピン再描画
    pinLayer.innerHTML = "";
    loadPins(region);
  });

  /* ===============================
     マップクリック → 釣果選択
  =============================== */
  mapImage.addEventListener("click", (e) => {
    const region = regionSelect.value;
    if (!region) return alert("地域を選択してください");

    const history = JSON.parse(localStorage.getItem("fishingHistory")) || [];
    if (history.length === 0) return alert("釣果データがありません");

    const rect = mapImage.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width * 100;
    const y = (e.clientY - rect.top) / rect.height * 100;

    showSelectPopup(history, region, x, y);
  });

  /* ===============================
     釣果選択ポップアップ
  =============================== */
  function showSelectPopup(history, region, x, y) {

    document.querySelectorAll(".select-box").forEach(e => e.remove());

    const box = document.createElement("div");
    box.className = "select-box";

    box.innerHTML = `
      <h4>釣果を選択</h4>
      ${history.map((h, i) => `
        <div class="select-item" data-index="${i}">
          ${h.fish} (${h.size}cm)
        </div>
      `).join("")}
    `;

    document.body.appendChild(box);

    box.querySelectorAll(".select-item").forEach(item => {
      item.addEventListener("click", () => {

        const index = item.dataset.index;
        const selected = history[index];

        const data = {
          id: Date.now(),
          region,
          x,
          y,
          fish: selected.fish,
          size: selected.size,
          image: selected.image
        };

        let mapData = JSON.parse(localStorage.getItem("mapData")) || [];
        mapData.push(data);
        localStorage.setItem("mapData", JSON.stringify(mapData));

        addPin(data);
        box.remove();
      });
    });
  }

  /* ===============================
     ピン生成
  =============================== */
  function addPin(data) {

    const pin = document.createElement("div");
    pin.className = "pin";
    pin.style.left = data.x + "%";
    pin.style.top = data.y + "%";
    pin.textContent = "🐟";

    pin.addEventListener("click", (e) => {
      e.stopPropagation();

      document.querySelectorAll(".info-box").forEach(b => b.remove());

      const info = document.createElement("div");
      info.className = "info-box";

      info.innerHTML = `
        <h4>${data.fish}</h4>
        <p>サイズ: ${data.size}cm</p>
        ${data.image ? `<img src="${data.image}" class="popup-img">` : ""}
        <button class="delete-btn">削除</button>
      `;

      // 画像拡大
      const img = info.querySelector(".popup-img");
      if (img) {
        img.addEventListener("click", () => {
          showImageModal(data.image);
        });
      }

      // 削除
      info.querySelector(".delete-btn").addEventListener("click", () => {
        let mapData = JSON.parse(localStorage.getItem("mapData")) || [];
        mapData = mapData.filter(d => d.id !== data.id);
        localStorage.setItem("mapData", JSON.stringify(mapData));
        pin.remove();
        info.remove();
      });

      pin.appendChild(info);
    });

    pinLayer.appendChild(pin);
  }

  /* ===============================
     画像拡大モーダル
  =============================== */
  function showImageModal(src) {

    const modal = document.createElement("div");
    modal.className = "image-modal";

    modal.innerHTML = `
      <div class="modal-bg"></div>
      <img src="${src}" class="modal-img">
    `;

    modal.querySelector(".modal-bg").addEventListener("click", () => {
      modal.remove();
    });

    document.body.appendChild(modal);
  }

  /* ===============================
     保存済みピン読み込み
  =============================== */
  function loadPins(region) {
    const mapData = JSON.parse(localStorage.getItem("mapData")) || [];
    mapData
      .filter(d => d.region === region)
      .forEach(d => addPin(d));
  }

});



/* ===============================
   GoogleMap風ズーム＆パン
================================ */

// let scale = 1;
// let originX = 0;
// let originY = 0;
// let isDragging = false;
// let startX, startY;

// const container = document.querySelector(".map-container");

// /* ズーム（ホイール） */
// container.addEventListener("wheel", (e) => {
//   e.preventDefault();

//   const zoomIntensity = 0.1;
//   const direction = e.deltaY > 0 ? -1 : 1;
//   const newScale = scale + direction * zoomIntensity;

//   if (newScale < 1) return;
//   if (newScale > 4) return; // 最大4倍

//   scale = newScale;
//   updateTransform();
// });

// /* ドラッグ開始 */
// container.addEventListener("mousedown", (e) => {
//   isDragging = true;
//   startX = e.clientX - originX;
//   startY = e.clientY - originY;
// });

// /* ドラッグ中 */
// window.addEventListener("mousemove", (e) => {
//   if (!isDragging) return;

//   originX = e.clientX - startX;
//   originY = e.clientY - startY;
//   updateTransform();
// });

// /* ドラッグ終了 */
// window.addEventListener("mouseup", () => {
//   isDragging = false;
// });

// /* 変形適用 */
// function updateTransform() {
//   const transform = `translate(${originX}px, ${originY}px) scale(${scale})`;
//   mapImage.style.transform = transform;
//   pinLayer.style.transform = transform;
// }