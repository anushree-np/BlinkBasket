import { db } from "../config/firebase.js";

import {
  doc,
  getDoc,
} from "https://www.gstatic.com/firebasejs/11.7.1/firebase-firestore.js";

/* =====================================================
   URL PARAMS
===================================================== */

const params = new URLSearchParams(window.location.search);

const orderId = params.get("id");

/* =====================================================
   HTML ELEMENT
===================================================== */

const invoiceContainer = document.getElementById("invoiceContainer");

/* =====================================================
   LOAD INVOICE
===================================================== */

async function loadInvoice() {
  try {
    const orderRef = doc(db, "orders", orderId);

    const snapshot = await getDoc(orderRef);

    if (!snapshot.exists()) {
      invoiceContainer.innerHTML = "<h2>Invoice Not Found</h2>";

      return;
    }

    const order = snapshot.data();

    /* =========================
           GENERATE INVOICE NUMBER
        ========================= */

    const invoiceNumber = `INV-${Date.now()}`;

    /* =========================
           RENDER INVOICE
        ========================= */

    invoiceContainer.innerHTML = `

            <div class="invoice-box">

                <h1>

                    ShopEasy Invoice

                </h1>

                <hr>

                <p>

                    Invoice Number:
                    ${invoiceNumber}

                </p>

                <p>

                    Order ID:
                    ${orderId}

                </p>

                <p>

                    Payment Method:
                    ${order.paymentMethod}

                </p>

                <hr>

                ${order.items
                  .map(
                    (item) => `

                    <div class="invoice-item">

                        <span>

                            ${item.title}
                            ×
                            ${item.quantity}

                        </span>

                        <span>

                            ₹ ${item.totalPrice}

                        </span>

                    </div>

                `,
                  )
                  .join("")}

                <hr>

                <div class="invoice-total">

                    Total:
                    ₹ ${order.totalAmount}

                </div>

            </div>
        `;
  } catch (error) {
    console.error(error);
  }
}

/* =====================================================
   INITIAL LOAD
===================================================== */

loadInvoice();
