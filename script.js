const bar = document.getElementById("bar");
const close = document.getElementById("close");
const nav = document.getElementById("navbar");

if (bar) {
  bar.addEventListener("click", () => {
    nav.classList.add("active");
  });
}

if (close) {
  close.addEventListener("click", (e) => {
    e.preventDefault();
    nav.classList.remove("active");
  });
}

// Shop / Home: open the product page with the clicked product's data
const products = document.querySelectorAll("#product1 .pro, #product2 .pro");

products.forEach((pro) => {
  pro.addEventListener("click", () => {
    const params = new URLSearchParams({
      img: pro.querySelector("img").getAttribute("src"),
      brand: pro.querySelector(".des span").textContent,
      name: pro.querySelector(".des h5").textContent,
      price: pro.querySelector(".des h4").textContent,
    });
    window.location.href = "sproduct.html?" + params.toString();
  });
});

// Single product page: fill data + swap main image
const MainImg = document.getElementById("MainImg");
const smallimg = document.getElementsByClassName("small-img");

if (MainImg) {
  const params = new URLSearchParams(window.location.search);
  const img = params.get("img");

  if (img) {
    MainImg.src = img;

    // small images: the selected one first, then the next ones in the same series
    const m = img.match(/^(.*?)([a-z]+)(\d+)(\.\w+)$/);
    for (let i = 0; i < smallimg.length; i++) {
      if (m) {
        const num = ((parseInt(m[3]) - 1 + i) % 8) + 1;
        smallimg[i].src = m[1] + m[2] + num + m[4];
      } else {
        smallimg[i].src = img;
      }
    }
  }

  if (params.get("name")) document.getElementById("pro-name").textContent = params.get("name");
  if (params.get("price")) document.getElementById("pro-price").textContent = params.get("price");
  if (params.get("brand")) document.getElementById("pro-brand").textContent = "Home / " + params.get("brand");

  for (let i = 0; i < smallimg.length; i++) {
    smallimg[i].onclick = function () {
      MainImg.src = smallimg[i].src;
    };
  }
}