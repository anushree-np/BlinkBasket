import { db } from "../config/firebase.js";

import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  doc,
} from "https://www.gstatic.com/firebasejs/11.7.1/firebase-firestore.js";

/* =====================================================
   FIRESTORE COLLECTIONS
===================================================== */

const productCollection = collection(db, "products");

const categoryCollection = collection(db, "categories");

/* =====================================================
   HTML ELEMENTS
===================================================== */

const productForm = document.getElementById("productForm");

const productContainer = document.getElementById("productContainer");

const categoryForm = document.getElementById("categoryForm");

const categoryContainer = document.getElementById("categoryContainer");

const productCategory = document.getElementById("productCategory");

let editingProductId = null;

/* =====================================================
   ADD OR UPDATE PRODUCT
===================================================== */

if (productForm) {
  productForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    try {
      const productData = {
        title: document.getElementById("productTitle").value,

        description: document.getElementById("productDescription").value,

        price: Number(document.getElementById("productPrice").value),

        categoryName:
          document.getElementById("productCategory").value,

        stock: Number(document.getElementById("productStock").value),

        imageURL: document.getElementById("productImage").value,

        isDeleted: false,

        createdAt: new Date(),
      };

      /* =========================
         UPDATE PRODUCT
      ========================= */

      if (editingProductId) {
        const productRef =
          doc(db, "products", editingProductId);

        await updateDoc(productRef, productData);

        alert("Product Updated");

        editingProductId = null;
      }

      /* =========================
         ADD PRODUCT
      ========================= */

      else {
        await addDoc(productCollection, productData);

        alert("Product Added");
      }

      productForm.reset();

      loadProducts();
    }

    catch (error) {
      console.error(error);

      alert(error.message);
    }
  });
}

/* =====================================================
   CATEGORY CRUD
===================================================== */

if (categoryForm) {

  categoryForm.addEventListener("submit", async (event) => {

    event.preventDefault();

    try {

      const categoryName =
        document.getElementById("categoryName").value;

      await addDoc(categoryCollection, {

        name: categoryName,

        isDeleted: false,

        createdAt: new Date(),
      });

      alert("Category Added");

      categoryForm.reset();

      loadCategories();

    }

    catch (error) {

      console.error(error);

      alert(error.message);
    }

  });

}

/* =====================================================
   LOAD CATEGORIES
===================================================== */

async function loadCategories() {

  try {

    categoryContainer.innerHTML = "";

    productCategory.innerHTML = `

      <option value="">
        Select Category
      </option>
    `;

    const snapshot =
      await getDocs(categoryCollection);

    snapshot.forEach((categoryDoc) => {

      const category =
        categoryDoc.data();

      const categoryId =
        categoryDoc.id;

      /* =========================
         SOFT DELETE CHECK
      ========================= */

      if (category.isDeleted) {
        return;
      }

      /* =========================
         CATEGORY UI
      ========================= */

      const div =
        document.createElement("div");

      div.classList.add("category-card");

      div.innerHTML = `

        <span>${category.name}</span>

        <button class="delete-btn"
                data-id="${categoryId}">
          Delete
        </button>
      `;

      categoryContainer.appendChild(div);

      /* =========================
         CATEGORY DROPDOWN
      ========================= */

      const option =
        document.createElement("option");

      option.value =
        category.name;

      option.textContent =
        category.name;

      productCategory.appendChild(option);

    });

    setupCategoryDeleteButtons();

  }

  catch (error) {

    console.error(error);
  }

}

/* =====================================================
   SOFT DELETE CATEGORY
===================================================== */

function setupCategoryDeleteButtons() {

  const buttons =
    categoryContainer.querySelectorAll(".delete-btn");

  buttons.forEach((button) => {

    button.addEventListener("click", async () => {

      try {

        const categoryId =
          button.dataset.id;

        const categoryRef =
          doc(db, "categories", categoryId);

        await updateDoc(categoryRef, {

          isDeleted: true,
        });

        alert("Category Deleted");

        loadCategories();

      }

      catch (error) {

        console.error(error);
      }

    });

  });

}

/* =====================================================
   LOAD PRODUCTS
===================================================== */

async function loadProducts() {

  try {

    productContainer.innerHTML = "";

    const snapshot =
      await getDocs(productCollection);

    snapshot.forEach((productDoc) => {

      const product =
        productDoc.data();

      const productId =
        productDoc.id;

      /* =========================
         SOFT DELETE CHECK
      ========================= */

      if (product.isDeleted) {
        return;
      }

      const card =
        document.createElement("div");

      card.classList.add("product-card");

      card.innerHTML = `

        <img src="${product.imageURL}">

        <h3>${product.title}</h3>

        <p>${product.description}</p>

        <p>₹ ${product.price}</p>

        <p>Stock: ${product.stock}</p>

        <p>Category: ${product.categoryName}</p>

        <div class="card-buttons">

          <button class="edit-btn"
                  data-id="${productId}">
            Edit
          </button>

          <button class="delete-btn"
                  data-id="${productId}">
            Delete
          </button>

        </div>
      `;

      productContainer.appendChild(card);

    });

    setupEditButtons();

    setupDeleteButtons();

  }

  catch (error) {

    console.error(error);
  }

}

/* =====================================================
   EDIT PRODUCT
===================================================== */

function setupEditButtons() {

  const editButtons =
    document.querySelectorAll(".edit-btn");

  editButtons.forEach((button) => {

    button.addEventListener("click", async () => {

      const productId =
        button.dataset.id;

      const snapshot =
        await getDocs(productCollection);

      snapshot.forEach((docItem) => {

        if (docItem.id === productId) {

          const product =
            docItem.data();

          document.getElementById("productTitle").value =
            product.title;

          document.getElementById("productDescription").value =
            product.description;

          document.getElementById("productPrice").value =
            product.price;

          document.getElementById("productCategory").value =
            product.categoryName;

          document.getElementById("productStock").value =
            product.stock;

          document.getElementById("productImage").value =
            product.imageURL;

          editingProductId =
            productId;

        }

      });

    });

  });

}

/* =====================================================
   SOFT DELETE PRODUCT
===================================================== */

function setupDeleteButtons() {

  const deleteButtons =
    document.querySelectorAll(".delete-btn");

  deleteButtons.forEach((button) => {

    button.addEventListener("click", async () => {

      try {

        const productId =
          button.dataset.id;

        const productRef =
          doc(db, "products", productId);

        await updateDoc(productRef, {

          isDeleted: true,
        });

        alert("Product Deleted");

        loadProducts();

      }

      catch (error) {

        console.error(error);
      }

    });

  });

}

/* =====================================================
   INITIAL LOAD
===================================================== */

loadCategories();

loadProducts();