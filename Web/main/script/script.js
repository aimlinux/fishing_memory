// ===============================
// ナビスクロール色変化
// ===============================
window.addEventListener("scroll", () => {
  const nav = document.querySelector(".navbar");
  if (!nav) return;

  if (window.scrollY > 50) {
    nav.style.background = "#1e5fa3";
  } else {
    nav.style.background = "linear-gradient(90deg, #2b7fc3, #5fa8e6)";
  }
});


// ===============================
// DOM読み込み後に全部実行
// ===============================
document.addEventListener("DOMContentLoaded", () => {

  const historyList = document.getElementById("historyList");
  const saveBtn = document.getElementById("saveBtn");

  // ===============================
  // データ取得
  // ===============================
  let history = JSON.parse(localStorage.getItem("fishingHistory")) || [];

  // ===============================
  // IntersectionObserver（アニメ用）
  // ===============================
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add("show");
        }, index * 150);
      }
    });
  }, { threshold: 0.2 });


  // ===============================
  // 履歴描画
  // ===============================
  const renderHistory = () => {
    if (!historyList) return;

    historyList.innerHTML = "";

    history.slice().reverse().forEach((data, index) => {
      const realIndex = history.length - 1 - index;

      const card = document.createElement("div");
      card.className = "catch-card";

      card.innerHTML = `
        <h3>🐠 ${data.fish} (${data.size}cm)</h3>
        ${data.image ? `<img src="${data.image}" class="catch-photo">` : ""}
        <p><strong>🗺場所:</strong> ${data.place}</p>
        <p><strong>🐟ルアー・餌:</strong> ${data.lure}</p>
        <p><strong>📝メモ:</strong> ${data.memo}</p>
        <p><strong>🎣釣った日時:</strong> ${new Date(data.date).toLocaleString()}</p>
        <button class="delete-btn" data-index="${realIndex}">🗑 削除</button>
      `;

      historyList.appendChild(card);
      observer.observe(card); // ← 超重要
    });
  };

  renderHistory();


  // ===============================
  // 削除処理
  // ===============================
  if (historyList) {
    historyList.addEventListener("click", (e) => {
      if (e.target.classList.contains("delete-btn")) {

        const index = Number(e.target.dataset.index);

        // フェードアウト演出
        const card = e.target.closest(".catch-card");
        card.style.opacity = "0";
        card.style.transform = "scale(0.9)";

        setTimeout(() => {
          history.splice(index, 1);
          localStorage.setItem("fishingHistory", JSON.stringify(history));
          renderHistory();
        }, 300);
      }
    });
  }


  // ===============================
  // 保存処理
  // ===============================
  if (saveBtn) {
    saveBtn.addEventListener("click", () => {

      const fish = document.querySelector("input[placeholder='例：シーバス']")?.value || "";
      const size = document.querySelector("input[placeholder='例：65']")?.value || "";
      const place = document.querySelector("input[placeholder='例：中海']")?.value || "";
      const lure = document.querySelector("input[placeholder='例：オキアミ']")?.value || "";
      const catchTimeInput = document.getElementById("catchTime");
      const catchTime = catchTimeInput?.value || new Date().toISOString().slice(0, 16);
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
          date: catchTime
        };

        history.push(data);
        localStorage.setItem("fishingHistory", JSON.stringify(history));

        alert("保存しました！");
        renderHistory();
      };

      // ===== 画像処理 =====
      if (fileInput && fileInput.files.length > 0) {

        const file = fileInput.files[0];
        const reader = new FileReader();

        reader.onload = (e) => {
          const img = new Image();
          img.onload = () => {

            const canvas = document.createElement("canvas");
            const maxWidth = 600;
            const scale = maxWidth / img.width;

            canvas.width = maxWidth;
            canvas.height = img.height * scale;

            const ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

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
  }

});