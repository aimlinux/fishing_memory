window.addEventListener("scroll", () => {
  const nav = document.querySelector(".navbar");
  if (window.scrollY > 50) {
    nav.style.background = "#1e5fa3";
  } else {
    nav.style.background = "linear-gradient(90deg, #2b7fc3, #5fa8e6)";
  }
});


// ===== 釣果保存処理 =====
document.addEventListener("DOMContentLoaded", () => {

  const saveBtn = document.getElementById("saveBtn");
  if (!saveBtn) return;

  saveBtn.addEventListener("click", () => {

    const fish = document.querySelector("input[placeholder='例：シーバス']")?.value || "";
    const size = document.querySelector("input[placeholder='例：65']")?.value || "";
    const place = document.querySelector("input[placeholder='例：中海']")?.value || "";
    const lure = document.querySelector("input[placeholder='例：ミノー']")?.value || "";
    const memo = document.querySelector("textarea")?.value || "";

    const fileInput = document.getElementById("photoInput");

    const saveData = (imageBase64 = "") => {
      const data = {
        fish,
        size,
        place,
        lure,
        memo,
        image: imageBase64,
        date: new Date().toLocaleString()
      };

      let history = JSON.parse(localStorage.getItem("fishingHistory")) || [];
      history.push(data);
      localStorage.setItem("fishingHistory", JSON.stringify(history));

      alert("保存しました！");
    };

    // ===== 画像処理（圧縮版）=====
    if (fileInput && fileInput.files.length > 0) {
      const file = fileInput.files[0];
      const reader = new FileReader();

      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");

          // ★ 最大幅を制限（重要）
          const maxWidth = 600;
          const scale = maxWidth / img.width;

          canvas.width = maxWidth;
          canvas.height = img.height * scale;

          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

          // ★ JPEG圧縮（超重要）
          const compressed = canvas.toDataURL("image/jpeg", 0.7);

          saveData(compressed);
        };

        img.src = e.target.result;
      };

      reader.readAsDataURL(file);

    } else {
      saveData("");
    }

  });

});


// ===== 履歴表示 =====
const historyList = document.getElementById("historyList");

if (historyList) {
  let history = JSON.parse(localStorage.getItem("fishingHistory")) || [];

  const renderHistory = () => {
    historyList.innerHTML = "";

    history
      .slice()
      .reverse()
      .forEach((data, index) => {

        const realIndex = history.length - 1 - index;

        const card = document.createElement("div");
        card.className = "catch-card";

          card.innerHTML = `
            <h3>${data.fish} (${data.size}cm)</h3>

            ${data.image ? `<img src="${data.image}" class="catch-photo">` : ""}

            <p><strong>場所:</strong> ${data.place}</p>
            <p><strong>ルアー:</strong> ${data.lure}</p>
            <p><strong>メモ:</strong> ${data.memo}</p>
            <p class="date">${data.date}</p>
            <button class="delete-btn" data-index="${realIndex}">🗑 削除</button>
          `;

        historyList.appendChild(card);
      });
  };

  // 初回描画
  renderHistory();

  // ===== 削除処理 =====
  historyList.addEventListener("click", (e) => {
    if (e.target.classList.contains("delete-btn")) {
      const index = Number(e.target.dataset.index);

      history.splice(index, 1);
      localStorage.setItem("fishingHistory", JSON.stringify(history));

      renderHistory();
    }
  });
}