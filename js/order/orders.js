import { db, auth } from "../config/firebase.js";

import {
  collection,
  getDocs,
  query,
  where,
} from "https://www.gstatic.com/firebasejs/11.7.1/firebase-firestore.js";

import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-auth.js";

/* =====================================================
   COLLECTION
===================================================== */

const orderCollection = collection(db, "orders");

/* =====================================================
   HTML ELEMENT
===================================================== */

const ordersContainer = document.getElementById("ordersContainer");

/* =====================================================
   LOAD ORDERS
===================================================== */

async function loadOrders(user) {
  try {
    ordersContainer.innerHTML = "";

    const orderQuery = query(orderCollection, where("userId", "==", user.uid));

    const snapshot = await getDocs(orderQuery);

    console.log(snapshot.docs);

    if (snapshot.empty) {
      ordersContainer.innerHTML = `

                <h2>No Orders Found</h2>
            `;

      return;
    }

    snapshot.forEach((orderDoc) => {
      const order = orderDoc.data();

      console.log(order);

      const card = document.createElement("div");

      card.classList.add("order-card");

      /* =========================
               SAFE ITEMS RENDER
            ========================= */

      let itemsHTML = "";

      if (Array.isArray(order.items)) {
        itemsHTML = order.items
          .map((item) => {
            return `

                            <div class="order-item">

                                ${item.title}
                                ×
                                ${item.quantity}

                            </div>
                        `;
          })
          .join("");
      }

      card.innerHTML = `

                <h2>

                    Order ID:
                    ${orderDoc.id}

                </h2>

                <p>

                    Payment Method:
                    ${order.paymentMethod || "N/A"}

                </p>

                <p>

                    Payment Status:
                    ${order.paymentStatus || "N/A"}

                </p>

                <p>

                    Order Status:
                    ${order.orderStatus || "Placed"}

                </p>

                <p>

                    Total:
                    ₹ ${order.totalAmount || 0}

                </p>

                <div class="order-items">

                    ${itemsHTML}

                </div>

                <a href="./invoice.html?id=${orderDoc.id}">

                    <button class="primary-btn">

                        View Invoice

                    </button>

                </a>
            `;

      ordersContainer.appendChild(card);
    });
  } catch (error) {
    console.error(error);

    ordersContainer.innerHTML = `

            <h2>Error Loading Orders</h2>
        `;
  }
}

/* =====================================================
   AUTH STATE
===================================================== */

onAuthStateChanged(auth, (user) => {
  if (user) {
    loadOrders(user);
  } else {
    ordersContainer.innerHTML = `

            <h2>Please Login</h2>
        `;
  }
});
