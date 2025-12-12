//include Header and Footer
/* global initHeader */
document.querySelectorAll("include[src]").forEach(async (el) => {
  el.outerHTML = await (await fetch(el.getAttribute("src"))).text();

   if (el.getAttribute("src") === "../src/html/header.html") {
    initHeader(); 
  }
});

// SuiteCases carousel
document.addEventListener("DOMContentLoaded", function () {
  const sliderTrack = document.querySelector(".slider-track");

  if (!sliderTrack) return;

  // Check if already initialized
  if (sliderTrack.dataset.carouselInitialized === "true") {
    return;
  }

  const originalSlides = sliderTrack.querySelectorAll(".suitcase");
  if (originalSlides.length === 0) return;

  // Prevent slides from shrinking in flex layout
  originalSlides.forEach((slide) => {
    slide.style.flexShrink = "0";
  });

  // Clone slides for seamless infinite loop
  originalSlides.forEach((slide) => {
    const clone = slide.cloneNode(true);
    clone.style.flexShrink = "0";
    sliderTrack.appendChild(clone);
  });

  const allSlides = sliderTrack.querySelectorAll(".suitcase");
  const totalSlides = originalSlides.length;
  let currentIndex = 0;
  const gap = 39; // Gap between slides from CSS

  sliderTrack.dataset.carouselInitialized = "true";

  // Initialize carousel position
  sliderTrack.style.transform = "translateX(0px)";

  function moveCarousel() {
    const firstSlide = allSlides[0];
    const slideWidth = firstSlide.offsetWidth || 296;
    const slideStep = slideWidth + gap;

    currentIndex++;

    const translateX = -currentIndex * slideStep;
    sliderTrack.style.transform = `translateX(${translateX}px)`;

    // When we reach the cloned slides, reset to beginning seamlessly
    if (currentIndex >= totalSlides) {
      setTimeout(() => {
        sliderTrack.style.transition = "none";
        currentIndex = 0;
        sliderTrack.style.transform = "translateX(0px)";

        // Force browser reflow
        sliderTrack.getBoundingClientRect();

        // Re-enable transition
        sliderTrack.style.transition = "";
      }, 400); // CSS transition duration
    }
  }

  // auto-play interval
  setInterval(moveCarousel, 3000);
});

//product markup generation
function createProductItem(product, productType) {
  const li = document.createElement("li");
  li.className = "product-item";
  li.id = product.id;
  li.innerHTML = `
      <div class="product-image">
          <a href="product-details.html?id=${product.id}">
            <img src="${product.imageUrl}" alt="${product.name}" />
            <span class="sale-label">Sale</span>
          </a>
        </div>
          <a href="product-details.html?id=${product.id}"><h3>${
    product.name
  }</h3></a>
          <p class="price">$${product.price}</p>
          ${
            productType === "new"
              ? `<button class="btn btn--add-to-cart" onclick="window.location.href='product-details.html?id=${product.id}'">View Product</button>`
              : '<button class="btn btn--add-to-cart">Add to Cart</button>'
          }
          `;
  
    const button = li.querySelector(".btn--add-to-cart");
  
  if (productType !== "new") {
    button.addEventListener("click", () => addToCart(product))
  }
  
  return li;
}

//Add product to Cart and Fire Global Window event
function addToCart(product, quantity = 1) {
  const cart = JSON.parse(localStorage.getItem("cart-products")) || [];
  const existing = cart.find((item) => item.product.id === product.id);

  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({ product, quantity });
  }

  localStorage.setItem("cart-products", JSON.stringify(cart));

  window.dispatchEvent(new CustomEvent("cartUpdated", { detail: cart }));
}

//products list function
function buildProductsLayout(productsData, productsType, htmlParent) {
  if (!productsData || !productsType || !htmlParent) return;

  const productList = document.querySelector(htmlParent);

  const blockMap = {
    selected: "Selected Products",
    new: "New Products Arrival",
    recommended: "You May Also Like",
  };

  const blockName = blockMap[productsType];
  if (!blockName) return;

  const filteredProducts = productsData.filter((product) =>
    product.blocks.includes(blockName)
  );
  filteredProducts.forEach((product) => {
    productList.appendChild(createProductItem(product, productsType));
  });
}

// Load products from JSON
async function loadProducts() {
  try {
    const response = await fetch("assets/data.json");
    if (!response.ok) throw new Error("Failed to load JSON");

    const { data } = await response.json();

    buildProductsLayout(data, "selected", ".selected-list");
    buildProductsLayout(data, "new", ".new-products-list");
  } catch (err) {
    console.error(err);
  }
}

// Load products when DOM is ready
document.addEventListener("DOMContentLoaded", loadProducts);

