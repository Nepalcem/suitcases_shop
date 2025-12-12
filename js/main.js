/* eslint-disable-next-line no-unused-vars */
function initHeader() {
  //Hamburger menu activation
  const hamburger = document.querySelector(".hamburger");
  const nav = document.querySelector(".main-nav");

 hamburger.addEventListener("click", () => {
   nav.classList.toggle("active");
   hamburger.classList.toggle("active");
 });

  //header stickup drop-shadow
  window.addEventListener("scroll", () => {
    const header = document.querySelector("header");
    if (window.scrollY > 10) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  });

  //Account popup & re-initializing nodes on page change
  const userLink = document.getElementById("user-account");
  const popup = document.getElementById("user-popup");

  if (!userLink || !popup) return;

  userLink.addEventListener("click", (e) => {
    e.preventDefault();
    popup.style.display = "flex";
  });

  popup.addEventListener("click", (e) => {
    if (e.target === popup) popup.style.display = "none";
  });

  //Account Form scripts
  const form = document.getElementById("login-form");
  const email = document.getElementById("user-email");
  const password = document.getElementById("password");
  const togglePassword = document.getElementById("togglePassword");

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,}$/;

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    if (!emailRegex.test(email.value.trim())) {
      alert("Please enter a valid email address.");
      email.focus();
      return;
    }

    if (password.value.trim().length < 6) {
      alert("Password must be at least 6 characters.");
      password.focus();
      return;
    }

    popup.style.display = "none";
    this.reset();
  });

  // Show/hide password
  togglePassword.addEventListener("click", () => {
    const isHidden = password.type === "password";
    password.type = isHidden ? "text" : "password";
  });

  // Get initial cart state
  let cart = JSON.parse(localStorage.getItem("cart-products")) || [];
  renderCart(cart);

  // Listen for cart changes from any script
  window.addEventListener("cartUpdated", (event) => {
    cart = event.detail;
    renderCart(cart);
  });

  function renderCart(cartItems) {
    const cartCount = document.querySelector(".cart-counter");

    if (!cartCount) return;

    const totalQty = cartItems.reduce((acc, el) => acc + el.quantity, 0);

    cartCount.textContent = totalQty ?? "";
    cartCount.style.display = totalQty ? "inline-flex" : "none";
  }

  //Adding class for active menus
  const currentPage = window.location.pathname.split("/").pop();
  const links = document.querySelectorAll(".main-nav a");

  links.forEach((link) => {
    const href = link.getAttribute("href");
    const linkPage = href.split("/").pop();
    if (linkPage === currentPage) {
      link.classList.add("active");
    }
  });
}
