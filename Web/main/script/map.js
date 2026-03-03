document.addEventListener("DOMContentLoaded", () => {

  const regionSelect = document.getElementById("regionSelect");
  const mapImage = document.getElementById("mapImage");
  const pinLayer = document.getElementById("pinLayer");

  const maps = {
    nakaumi: "../img/nakaumi.jpg",
    shimane: "../img/shimane.jpg",
    umi: "../img/nihonkai.jpg"
  };

  regionSelect.addEventListener("change", () => {
    const value = regionSelect.value;
    mapImage.src = maps[value] || "";
    loadPins(value);
  });

  mapImage.addEventListener("click", (e) => {
    const region = regionSelect.value;
    if (!region) return alert("地域を選択してください");

    const rect = mapImage.getBoundingClientRect();

    const x = (e.clientX - rect.left) / rect.width * 100;
    const y = (e.clientY - rect.top) / rect.height * 100;

    const fish = prompt("魚種を入力");

    if (!fish) return;

    const data = { region, x, y, fish };

    let mapData = JSON.parse(localStorage.getItem("mapData")) || [];
    mapData.push(data);
    localStorage.setItem("mapData", JSON.stringify(mapData));

    addPin(data);
  });

  function addPin(data) {
    const pin = document.createElement("div");
    pin.className = "pin";
    pin.style.left = data.x + "%";
    pin.style.top = data.y + "%";
    pin.textContent = "📍";

    pin.title = data.fish;

    pinLayer.appendChild(pin);
  }

  function loadPins(region) {
    pinLayer.innerHTML = "";
    let mapData = JSON.parse(localStorage.getItem("mapData")) || [];
    mapData
      .filter(d => d.region === region)
      .forEach(addPin);
  }

});