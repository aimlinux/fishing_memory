window.addEventListener("scroll", () => {
  const nav = document.querySelector(".navbar");
  if (window.scrollY > 50) {
    nav.style.background = "#1e5fa3";
  } else {
    nav.style.background = "linear-gradient(90deg, #2b7fc3, #5fa8e6)";
  }
});