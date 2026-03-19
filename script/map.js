document.addEventListener("DOMContentLoaded", () => {

  const regionSelect = document.getElementById("regionSelect");
  const mapImage = document.getElementById("mapImage");
  const pinLayer = document.getElementById("pinLayer");

  const defaultRegion = "nakaumi";

  /* ===============================
     初期表示（中海を自動表示）
  =============================== */
  regionSelect.value = defaultRegion;
  mapImage.src = `../img/${defaultRegion}.jpg`;
  loadPins(defaultRegion);

  /* ===============================
     地域変更時：マップ切り替え
  =============================== */
  regionSelect.addEventListener("change", () => {
    const region = regionSelect.value;
    if (!region) return;

    mapImage.src = `../img/${region}.jpg`;

    pinLayer.innerHTML = "";
    loadPins(region);
  });

  /* ===============================
     マップクリック → 釣果選択
  =============================== */
  mapImage.addEventListener("click", (e) => {

    const region = regionSelect.value;
    if (!region) return alert("地域を選択してください");

    const history = safeParse("fishingHistory");
    if (history.length === 0) return alert("釣果データがありません");

    const rect = mapImage.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

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
          image: selected.image || ""
        };

        savePin(data);
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

      /* 画像拡大 */
      const img = info.querySelector(".popup-img");
      if (img) {
        img.addEventListener("click", () => {
          showImageModal(data.image);
        });
      }

      /* 削除 */
      info.querySelector(".delete-btn").addEventListener("click", () => {
        deletePin(data.id);
        pin.remove();
        info.remove();
      });

      pin.appendChild(info);
    });

    pinLayer.appendChild(pin);
  }

  /* ===============================
     保存（常にlocalStorageを正とする）
  =============================== */
  function savePin(data) {

    const mapData = safeParse("mapData");

    mapData.push(data);

    localStorage.setItem("mapData", JSON.stringify(mapData));
  }

  /* ===============================
     読み込み（再起動対応）
  =============================== */
  function loadPins(region) {

    pinLayer.innerHTML = "";

    const mapData = safeParse("mapData");

    mapData
      .filter(d => d.region === region)
      .forEach(d => addPin(d));
  }

  /* ===============================
     削除（保存も同期）
  =============================== */
  function deletePin(id) {

    let mapData = safeParse("mapData");

    mapData = mapData.filter(d => d.id !== id);

    localStorage.setItem("mapData", JSON.stringify(mapData));
  }

  /* ===============================
     JSON安全パース
  =============================== */
  function safeParse(key) {
    try {
      const data = JSON.parse(localStorage.getItem(key));
      return Array.isArray(data) ? data : [];
    } catch {
      return [];
    }
  }

});


/************************************
  画面のどこかをクリックしたら
  info-box を閉じる
*************************************/
document.addEventListener("click", (e) => {

  // ピンをクリックした時は閉じない
  if (e.target.closest(".pin")) return;

  document.querySelectorAll(".info-box").forEach(box => {
    box.remove();
  });

});