const menuItems = [
  {
    id: 1,
    name: "Classic Burger",
    category: "Burgers",
    price: 14.99,
    description: "Beef patty, cheddar, lettuce, tomato, and signature sauce.",
    image:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80",
    badge: "Popular"
  },
  {
    id: 2,
    name: "Margherita Pizza",
    category: "Pizza",
    price: 18.5,
    description: "Fresh basil, mozzarella, tomato sauce, and olive oil.",
    image:
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80",
    badge: "Best Seller"
  },
  {
    id: 3,
    name: "Crispy Chicken Wrap",
    category: "Wraps",
    price: 12.75,
    description: "Crispy chicken, ranch, slaw, and pickles in a soft tortilla.",
    image:
      "https://images.unsplash.com/photo-1552332386-f8dd00dc2f85?auto=format&fit=crop&w=800&q=80",
    badge: "Fresh"
  },
  {
    id: 4,
    name: "Garden Salad",
    category: "Salads",
    price: 10.25,
    description: "Mixed greens, avocado, cucumber, tomatoes, and balsamic dressing.",
    image:
      "https://images.unsplash.com/photo-1546793665-c74683f339c1?auto=format&fit=crop&w=800&q=80",
    badge: "Healthy"
  },
  {
    id: 5,
    name: "Spicy Pasta",
    category: "Pasta",
    price: 16.75,
    description: "Creamy tomato sauce with chili flakes and parmesan.",
    image:
      "https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?auto=format&fit=crop&w=800&q=80",
    badge: "Hot"
  },
  {
    id: 6,
    name: "Loaded Fries",
    category: "Sides",
    price: 8.5,
    description: "Golden fries topped with cheese, scallions, and smoky aioli.",
    image:
      "https://images.unsplash.com/photo-1576107232684-1279f390859f?auto=format&fit=crop&w=800&q=80",
    badge: "Crunchy"
  },
  {
    id: 7,
    name: "Chocolate Shake",
    category: "Drinks",
    price: 6.5,
    description: "Rich chocolate shake topped with whipped cream.",
    image:
      "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=800&q=80",
    badge: "Sweet"
  },
  {
    id: 8,
    name: "Cheesecake Slice",
    category: "Desserts",
    price: 7.9,
    description: "Creamy vanilla cheesecake with berry compote.",
    image:
      "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=800&q=80",
    badge: "Treat"
  }
];

const cart = [];
let activeCategory = "All";

const menuGrid = document.getElementById("menu-grid");
const categoryFilters = document.getElementById("category-filters");
const cartItems = document.getElementById("cart-items");
const cartCount = document.getElementById("cart-count");
const subtotalEl = document.getElementById("subtotal");
const deliveryEl = document.getElementById("delivery");
const totalEl = document.getElementById("total");
const cartPanel = document.getElementById("cart-panel");
const toast = document.getElementById("toast");
const checkoutForm = document.getElementById("checkout-form");

const categories = ["All", ...new Set(menuItems.map((item) => item.category))];

function formatCurrency(amount) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD"
  }).format(amount);
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(showToast.timeoutId);
  showToast.timeoutId = setTimeout(() => {
    toast.classList.remove("show");
  }, 1800);
}

function getCartTotals() {
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const delivery = cart.length ? 4.99 : 0;
  const total = subtotal + delivery;
  return { subtotal, delivery, total };
}

function renderFilters() {
  categoryFilters.innerHTML = categories
    .map(
      (category) => `
        <button class="filter-btn ${category === activeCategory ? "active" : ""}" data-category="${category}" type="button">
          ${category}
        </button>
      `
    )
    .join("");

  document.querySelectorAll(".filter-btn").forEach((button) => {
    button.addEventListener("click", () => {
      activeCategory = button.dataset.category;
      renderFilters();
      renderMenu();
    });
  });
}

function renderMenu() {
  const visibleItems =
    activeCategory === "All"
      ? menuItems
      : menuItems.filter((item) => item.category === activeCategory);

  menuGrid.innerHTML = visibleItems
    .map(
      (item) => `
        <article class="menu-card">
          <img src="${item.image}" alt="${item.name}" />
          <div class="menu-card-body">
            <div class="menu-card-top">
              <h3>${item.name}</h3>
              <span class="tag">${item.badge}</span>
            </div>
            <p>${item.description}</p>
            <div class="card-footer">
              <span class="price">${formatCurrency(item.price)}</span>
              <button class="add-btn" data-id="${item.id}" type="button">Add</button>
            </div>
          </div>
        </article>
      `
    )
    .join("");

  document.querySelectorAll(".add-btn").forEach((button) => {
    button.addEventListener("click", () => addToCart(Number(button.dataset.id)));
  });
}

function addToCart(itemId) {
  const item = menuItems.find((entry) => entry.id === itemId);
  const existingItem = cart.find((entry) => entry.id === itemId);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ ...item, quantity: 1 });
  }

  renderCart();
  showToast(`${item.name} added to cart`);
  cartPanel.classList.add("open");
}

function updateCartItem(itemId, delta) {
  const item = cart.find((entry) => entry.id === itemId);
  if (!item) return;

  item.quantity += delta;

  if (item.quantity <= 0) {
    const index = cart.findIndex((entry) => entry.id === itemId);
    cart.splice(index, 1);
  }

  renderCart();
}

function renderCart() {
  const { subtotal, delivery, total } = getCartTotals();

  cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
  subtotalEl.textContent = formatCurrency(subtotal);
  deliveryEl.textContent = formatCurrency(delivery);
  totalEl.textContent = formatCurrency(total);

  if (!cart.length) {
    cartItems.innerHTML = `
      <div class="empty-state">
        <p>Your cart is empty.</p>
        <small>Add some food items to begin.</small>
      </div>
    `;
    return;
  }

  cartItems.innerHTML = cart
    .map(
      (item) => `
        <article class="cart-item">
          <img src="${item.image}" alt="${item.name}" />
          <div>
            <h4>${item.name}</h4>
            <div class="mini-price">${formatCurrency(item.price)} each</div>
            <div class="qty-controls">
              <button class="qty-button" data-action="decrease" data-id="${item.id}" type="button">−</button>
              <span>${item.quantity}</span>
              <button class="qty-button" data-action="increase" data-id="${item.id}" type="button">+</button>
            </div>
          </div>
          <strong>${formatCurrency(item.price * item.quantity)}</strong>
        </article>
      `
    )
    .join("");

  document.querySelectorAll(".qty-button").forEach((button) => {
    button.addEventListener("click", () => {
      const itemId = Number(button.dataset.id);
      const action = button.dataset.action;
      updateCartItem(itemId, action === "increase" ? 1 : -1);
    });
  });
}

document.querySelector(".cart-button").addEventListener("click", () => {
  cartPanel.classList.toggle("open");
});

document.getElementById("close-cart").addEventListener("click", () => {
  cartPanel.classList.remove("open");
});

checkoutForm.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!cart.length) {
    showToast("Please add items before ordering");
    return;
  }

  const formData = new FormData(checkoutForm);
  const name = formData.get("name");
  const phone = formData.get("phone");
  const address = formData.get("address");

  if (!name || !phone || !address) {
    showToast("Please fill in all fields");
    return;
  }

  showToast("Order placed successfully!");
  cart.length = 0;
  renderCart();
  checkoutForm.reset();
  cartPanel.classList.remove("open");
});

renderFilters();
renderMenu();
renderCart();
