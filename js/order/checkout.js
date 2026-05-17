import {
    db,
    auth
} from "../config/firebase.js";


import {

    collection,

    getDocs,

    query,

    where,

    addDoc,

    updateDoc,

    deleteDoc,

    doc

} from "https://www.gstatic.com/firebasejs/11.7.1/firebase-firestore.js";


import {

    onAuthStateChanged

} from "https://www.gstatic.com/firebasejs/11.7.1/firebase-auth.js";


/* =====================================================
   COLLECTIONS
===================================================== */

const cartCollection =
    collection(db, "cart");


const orderCollection =
    collection(db, "orders");

const invoiceCollection =
    collection(db, "invoices");

const productCollection =
    collection(db, "products");


/* =====================================================
   HTML ELEMENTS
===================================================== */

const checkoutContainer =
    document.getElementById("checkoutContainer");


const checkoutTotal =
    document.getElementById("checkoutTotal");


const paymentMethod =
    document.getElementById("paymentMethod");


const placeOrderBtn =
    document.getElementById("placeOrderBtn");


const paymentStatus =
    document.getElementById("paymentStatus");


/* =====================================================
   GLOBALS
===================================================== */

let currentUser = null;

let cartItems = [];

let grandTotal = 0;


/* =====================================================
   LOAD CHECKOUT
===================================================== */

async function loadCheckout() {

    try {

        checkoutContainer.innerHTML = "";

        grandTotal = 0;

        cartItems = [];


        const cartQuery =
            query(
                cartCollection,
                where("userId", "==", currentUser.uid)
            );


        const snapshot =
            await getDocs(cartQuery);


        snapshot.forEach((cartDoc) => {

            const item =
                cartDoc.data();


            cartItems.push({

                cartId: cartDoc.id,

                ...item
            });


            grandTotal += item.totalPrice;


            const div =
                document.createElement("div");


            div.classList.add("checkout-item");


            div.innerHTML = `

                <img src="${item.imageURL}">

                <div>

                    <h3>${item.title}</h3>

                    <p>₹ ${item.price}</p>

                    <p>Qty: ${item.quantity}</p>

                    <p>Total: ₹ ${item.totalPrice}</p>

                </div>
            `;


            checkoutContainer.appendChild(div);

        });


        checkoutTotal.textContent =
            `Total: ₹ ${grandTotal}`;

    }

    catch (error) {

        console.error(error);
    }

}



/* =====================================================
   PLACE ORDER
===================================================== */

placeOrderBtn.addEventListener("click", async () => {

    try {

        if (cartItems.length === 0) {

            alert("Cart Is Empty");

            return;
        }


        /* =========================
           PAYMENT LOADING
        ========================= */

        paymentStatus.textContent =
            "Processing Payment...";


        placeOrderBtn.disabled = true;


        /* =========================
           PAYMENT SIMULATION
        ========================= */

        await new Promise((resolve) => {

            setTimeout(resolve, 3000);

        });


        /* =========================
           RANDOM SUCCESS / FAILURE
        ========================= */

        const paymentSuccess =
            Math.random() > 0.2;


        // 80% SUCCESS RATE

        if (!paymentSuccess) {

            paymentStatus.textContent =
                "Payment Failed";


            placeOrderBtn.disabled = false;

            return;
        }


        paymentStatus.textContent =
            "Payment Successful";


        /* =========================
           STOCK VALIDATION
        ========================= */

        const productSnapshot =
            await getDocs(productCollection);


        for (const item of cartItems) {

            let productFound = false;


            productSnapshot.forEach((productDoc) => {

                const product =
                    productDoc.data();


                if (productDoc.id === item.productId) {

                    productFound = true;


                    if (product.stock < item.quantity) {

                        throw new Error(
                            `${product.title} Out Of Stock`
                        );
                    }

                }

            });


            if (!productFound) {

                throw new Error(
                    "Product No Longer Exists"
                );
            }

        }


        /* =========================
           CREATE ORDER
        ========================= */
const orderRef =
    await addDoc(orderCollection, {

        userId: currentUser.uid,

        items: cartItems,

        totalAmount: grandTotal,

        paymentMethod: paymentMethod.value,

        paymentStatus: "Paid",

        orderStatus: "Placed",

        createdAt: new Date()
    });

    const invoiceNumber =
    `INV-${Date.now()}`;


await addDoc(invoiceCollection, {

    orderId: orderRef.id,

    userId: currentUser.uid,

    invoiceNumber: invoiceNumber,

    items: cartItems,

    totalAmount: grandTotal,

    paymentMethod: paymentMethod.value,

    createdAt: new Date()
});


        /* =========================
           UPDATE INVENTORY
        ========================= */

        for (const item of cartItems) {

            productSnapshot.forEach(async (productDoc) => {

                if (productDoc.id === item.productId) {

                    const product =
                        productDoc.data();


                    const productRef =
                        doc(db, "products", productDoc.id);


                    await updateDoc(productRef, {

                        stock:
                            product.stock - item.quantity
                    });

                }

            });

        }


        /* =========================
           CLEAR CART
        ========================= */

        for (const item of cartItems) {

            await deleteDoc(
                doc(db, "cart", item.cartId)
            );

        }


        /* =========================
           SUCCESS
        ========================= */

        alert("Order Placed Successfully");


       window.location.href =
    `./invoice.html?id=${orderRef.id}`;

    }

    catch (error) {

        console.error(error);

        alert(error.message);

        paymentStatus.textContent =
            "Payment Failed";


        placeOrderBtn.disabled = false;
    }

});



/* =====================================================
   AUTH STATE
===================================================== */

onAuthStateChanged(auth, (user) => {

    if (user) {

        currentUser = user;

        loadCheckout();
    }

});