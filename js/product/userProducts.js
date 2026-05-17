import { db, auth } from "../config/firebase.js";

import {
  collection,
  getDocs,
  addDoc,
  query,
  where,
} from "https://www.gstatic.com/firebasejs/11.7.1/firebase-firestore.js";

/* =====================================================
   COLLECTIONS
===================================================== */

const productCollection = collection(db, "products");

const categoryCollection = collection(db, "categories");

/* =====================================================
   HTML ELEMENTS
===================================================== */

const userProductContainer = document.getElementById("userProductContainer");

const searchInput = document.getElementById("searchInput");

const categoryFilter = document.getElementById("categoryFilter");

/* =====================================================
   GLOBAL PRODUCT ARRAY
===================================================== */

let allProducts = [];

/* =====================================================
   LOAD PRODUCTS
===================================================== */

async function loadProducts() {
  try {
    const snapshot = await getDocs(productCollection);

    allProducts = [];

    snapshot.forEach((productDoc) => {
      const product = productDoc.data();

      if (product.isDeleted) {
        return;
      }

      allProducts.push({
        id: productDoc.id,

        ...product,
      });
    });

    renderProducts(allProducts);
  } catch (error) {
    console.error(error);
  }
}

/* =====================================================
   RENDER PRODUCTS
===================================================== */

function renderProducts(products) {
  userProductContainer.innerHTML = "";

  if (products.length === 0) {
    userProductContainer.innerHTML = `

            <h2>

                No Products Found

            </h2>
        `;

    return;
  }

  products.forEach((product) => {
    const card = document.createElement("div");

    card.classList.add("product-card");

    card.innerHTML = `

            <img src="${product.imageURL}">

            <h3>

                ${product.title}

            </h3>

            <p>

                ${product.description}

            </p>

            <p class="price">

                ₹ ${product.price}

            </p>

            <p>

                Category:
                ${product.categoryName}

            </p>

            <p>

                Stock:
                ${product.stock}

            </p>

            ${
              product.stock <= 0
                ? `

                    <button class="remove-btn">

                        Out Of Stock

                    </button>
                `
                : `

                    <button class="primary-btn add-cart-btn">

                        Add To Cart

                    </button>
                `
            }
        `;

    userProductContainer.appendChild(card);

    /* =========================
           ADD TO CART
        ========================= */

    const addCartBtn = card.querySelector(".add-cart-btn");

    if (addCartBtn) {
      addCartBtn.addEventListener("click", async () => {
        try {
          const user = auth.currentUser;

          if (!user) {
            alert("Please Login First");

            return;
          }

          /* =========================
                       STOCK CHECK
                    ========================= */

          if (product.stock <= 0) {
            alert("Product Out Of Stock");

            return;
          }

          /* =========================
                       CART COLLECTION
                    ========================= */

          const cartCollection = collection(db, "cart");

          /* =========================
                       CHECK EXISTING PRODUCT
                    ========================= */

          const cartQuery = query(
            cartCollection,
            where("userId", "==", user.uid),
            where("productId", "==", product.id),
          );

          const snapshot = await getDocs(cartQuery);

          if (!snapshot.empty) {
            const existingData = snapshot.docs[0].data();

            alert(`Already In Cart (${existingData.quantity})`);

            return;
          }

          /* =========================
                       ADD TO CART
                    ========================= */

          await addDoc(cartCollection, {
            userId: user.uid,

            productId: product.id,

            title: product.title,

            imageURL: product.imageURL,

            price: product.price,

            quantity: 1,

            totalPrice: product.price,
          });

          alert("Added To Cart");
        } catch (error) {
          console.error(error);
        }
      });
    }
  });
}

/* =====================================================
   LOAD CATEGORY FILTER
===================================================== */

async function loadCategoryFilter() {
  try {
    const snapshot = await getDocs(categoryCollection);

    snapshot.forEach((categoryDoc) => {
      const category = categoryDoc.data();

      if (category.isDeleted) {
        return;
      }

      const option = document.createElement("option");

      option.value = category.name;

      option.textContent = category.name;

      categoryFilter.appendChild(option);
    });
  } catch (error) {
    console.error(error);
  }
}

/* =====================================================
   SEARCH & FILTER
===================================================== */

function applyFilters() {
  const searchText = searchInput.value.toLowerCase();

  const selectedCategory = categoryFilter.value;

  const filteredProducts = allProducts.filter((product) => {
    const matchesSearch = product.title.toLowerCase().includes(searchText);

    const matchesCategory =
      selectedCategory === "" || product.categoryName === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  renderProducts(filteredProducts);
}

/* =====================================================
   EVENT LISTENERS
===================================================== */

searchInput.addEventListener("input", () => {
  applyFilters();
});

categoryFilter.addEventListener("change", () => {
  applyFilters();
});

/* =====================================================
   INITIAL LOAD
===================================================== */

loadProducts();

loadCategoryFilter();
