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

/* ============================================================
   CART (saved in localStorage so it stays between pages)
   ============================================================ */
const CART_KEY = "cart";

function getCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  } catch (e) {
    return [];
  }
}

function updateBadge() {
  const count = getCart().reduce((sum, it) => sum + it.qty, 0);
  document
    .querySelectorAll('#open-cart span, #navbar a[href="cart.html"] span, .cart-count')
    .forEach((el) => (el.textContent = count));
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateBadge();
}

function esc(str) {
  return String(str).replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  }[c]));
}

const cartDrawer = document.getElementById("cart-drawer");
const cartOverlay = document.getElementById("cart-overlay");
const cartLinks = document.querySelectorAll('#open-cart, #navbar a[href="cart.html"]');
const closeCartBtn = document.getElementById("close-cart");
const cartBody = document.querySelector("#cart-drawer .cart-body");

const EMPTY_HTML = `
  <h4>Your cart is currently empty.</h4>
  <p>Not sure where to start? Try these collections:</p>
  <a href="shop.html" class="continue-btn">Continue shopping</a>`;

function openCart() {
  if (!cartDrawer) return;
  cartDrawer.classList.add("open");
  cartOverlay.classList.add("show");
}

function closeCart() {
  if (!cartDrawer) return;
  cartDrawer.classList.remove("open");
  cartOverlay.classList.remove("show");
}

function renderCart() {
  if (!cartBody) return;
  const cart = getCart();

  if (!cart.length) {
    cartBody.classList.remove("has-items");
    cartBody.innerHTML = EMPTY_HTML;
    return;
  }

  let total = 0;
  const rows = cart
    .map((item, i) => {
      total += item.price * item.qty;
      return `
        <div class="cart-item">
          <img src="${esc(item.img)}" alt="">
          <div class="cart-item-info">
            <h5>${esc(item.name)}</h5>
            <span>Size: ${esc(item.size)}</span>
            <div class="cart-qty">
              <button data-act="dec" data-i="${i}">-</button>
              <b>${item.qty}</b>
              <button data-act="inc" data-i="${i}">+</button>
            </div>
          </div>
          <div class="cart-item-right">
            <strong>$${(item.price * item.qty).toFixed(2)}</strong>
            <button class="cart-remove" data-act="del" data-i="${i}">Remove</button>
          </div>
        </div>`;
    })
    .join("");

  cartBody.classList.add("has-items");
  cartBody.innerHTML = `
    <div class="cart-items">${rows}</div>
    <div class="cart-total"><span>Subtotal</span><strong>$${total.toFixed(2)}</strong></div>
    <a href="cart.html" class="continue-btn">View cart</a>`;
}

if (cartDrawer && cartOverlay) {
  cartLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault(); // don't navigate to cart.html
      openCart();
    });
  });
  if (closeCartBtn) closeCartBtn.addEventListener("click", closeCart);
  cartOverlay.addEventListener("click", closeCart);

  // + / - / Remove buttons inside the drawer
  cartBody.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-act]");
    if (!btn) return;
    const cart = getCart();
    const i = parseInt(btn.dataset.i);
    if (!cart[i]) return;

    if (btn.dataset.act === "inc") cart[i].qty++;
    if (btn.dataset.act === "dec") cart[i].qty = Math.max(1, cart[i].qty - 1);
    if (btn.dataset.act === "del") cart.splice(i, 1);

    saveCart(cart);
    renderCart();
  });

  renderCart();
}

updateBadge();

// "Add To Cart" button on the product page
const addBtn =
  document.getElementById("add-to-cart") || document.querySelector("#prodetails button.normal");

if (addBtn) {
  addBtn.addEventListener("click", () => {
    const sizeEl = document.getElementById("pro-size") || document.querySelector("#prodetails select");
    const size = sizeEl ? sizeEl.value : "";
    if (!size) {
      alert("Please select a size first");
      return;
    }

    const qtyEl = document.getElementById("pro-qty") || document.querySelector("#prodetails input[type=number]");
    const qty = Math.max(1, parseInt(qtyEl ? qtyEl.value : 1) || 1);
    const name = document.getElementById("pro-name").textContent.trim();
    const price = parseFloat(document.getElementById("pro-price").textContent.replace(/[^0-9.]/g, "")) || 0;
    const imgSrc = MainImg.getAttribute("src");

    const cart = getCart();
    const existing = cart.find((it) => it.name === name && it.size === size);

    if (existing) {
      existing.qty += qty;
    } else {
      cart.push({ name, price, size, qty, img: imgSrc });
    }

    saveCart(cart);
    renderCart();
    openCart();
  });
}

/* ============================================================
   Size picker popup: clicking the small cart button on a product card
   ============================================================ */
(function () {
  const SIZES = ["S", "M", "L", "XL"];
  let current = null;
  let picked = null;

  function init() {
    const style = document.createElement("style");
    style.textContent = `
      #size-modal { position: fixed; inset: 0; background: rgba(0,0,0,.5); display: none;
        align-items: center; justify-content: center; z-index: 1000; padding: 20px; }
      #size-modal.show { display: flex; }
      .size-box { background: #fff; border-radius: 12px; padding: 24px; width: 100%; max-width: 360px; position: relative; }
      .size-close { position: absolute; top: 8px; right: 14px; background: none; border: none; font-size: 28px; cursor: pointer; }
      .size-top { display: flex; gap: 14px; align-items: center; margin-bottom: 18px; }
      .size-top img { width: 70px; height: 90px; object-fit: cover; border-radius: 6px; background: #f1f1f1; }
      .size-top h4 { font-size: 15px; margin-bottom: 6px; }
      .size-box p { font-size: 14px; margin-bottom: 8px; color: #555; }
      .size-options { display: flex; gap: 10px; margin-bottom: 20px; }
      .size-opt { flex: 1; padding: 10px 0; border: 1px solid #ccc; background: #fff; border-radius: 6px; cursor: pointer; font-size: 15px; }
      .size-opt.active { background: #088178; color: #fff; border-color: #088178; }
      .size-add { width: 100%; padding: 14px; border: none; border-radius: 6px; background: #088178; color: #fff; font-size: 15px; cursor: pointer; }
      .size-add:disabled { background: #bbb; cursor: not-allowed; }
      #cart-toast { position: fixed; bottom: 30px; left: 50%; transform: translateX(-50%); background: #222; color: #fff;
        padding: 12px 22px; border-radius: 8px; z-index: 1001; opacity: 0; transition: opacity .3s; pointer-events: none; }
      #cart-toast.show { opacity: 1; }
    `;
    document.head.appendChild(style);

    const modal = document.createElement("div");
    modal.id = "size-modal";
    modal.innerHTML = `
      <div class="size-box">
        <button type="button" class="size-close">&times;</button>
        <div class="size-top">
          <img id="size-img" alt="">
          <div><h4 id="size-name"></h4><strong id="size-price"></strong></div>
        </div>
        <p>Select size</p>
        <div class="size-options">
          ${SIZES.map((s) => `<button type="button" class="size-opt" data-size="${s}">${s}</button>`).join("")}
        </div>
        <button type="button" class="size-add" disabled>Add to cart</button>
      </div>`;
    document.body.appendChild(modal);

    const toast = document.createElement("div");
    toast.id = "cart-toast";
    toast.textContent = "Added to cart";
    document.body.appendChild(toast);

    const addBtn = modal.querySelector(".size-add");
    const opts = modal.querySelectorAll(".size-opt");

    function closeModal() {
      modal.classList.remove("show");
    }

    function openModal(pro) {
      current = {
        name: pro.querySelector(".des h5").textContent.trim(),
        price: parseFloat(pro.querySelector(".des h4").textContent.replace(/[^0-9.]/g, "")) || 0,
        img: pro.querySelector("img").getAttribute("src"),
      };
      picked = null;
      opts.forEach((o) => o.classList.remove("active"));
      addBtn.disabled = true;

      modal.querySelector("#size-img").src = current.img;
      modal.querySelector("#size-name").textContent = current.name;
      modal.querySelector("#size-price").textContent = "$" + current.price;
      modal.classList.add("show");
    }

    opts.forEach((o) => {
      o.addEventListener("click", () => {
        picked = o.dataset.size;
        opts.forEach((x) => x.classList.toggle("active", x === o));
        addBtn.disabled = false;
      });
    });

    addBtn.addEventListener("click", () => {
      if (!picked || !current) return;

      const cart = getCart();
      const existing = cart.find((it) => it.name === current.name && it.size === picked);
      if (existing) {
        existing.qty += 1;
      } else {
        cart.push({ name: current.name, price: current.price, size: picked, qty: 1, img: current.img });
      }

      saveCart(cart);
      renderCart();
      closeModal();

      if (cartDrawer) {
        openCart();
      } else {
        toast.classList.add("show");
        setTimeout(() => toast.classList.remove("show"), 1800);
      }
    });

    modal.querySelector(".size-close").addEventListener("click", closeModal);
    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeModal();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeModal();
    });

    // capture phase: runs before the card's "open product page" click
    document.addEventListener(
      "click",
      (e) => {
        const btn = e.target.closest(".pro .cart, .pro a, .pro button");
        if (!btn) return;
        const pro = btn.closest(".pro");
        if (!pro || !pro.querySelector(".des h5")) return;
        e.preventDefault();
        e.stopPropagation();
        openModal(pro);
      },
      true
    );
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();