import {
    db,
    auth
} from "../config/firebase.js";


import {

    collection,

    addDoc,

    getDocs,

    query,

    where,

    updateDoc,

    deleteDoc,

    doc

} from "https://www.gstatic.com/firebasejs/11.7.1/firebase-firestore.js";


import {

    onAuthStateChanged

} from "https://www.gstatic.com/firebasejs/11.7.1/firebase-auth.js";


/* =====================================================
   COLLECTION
===================================================== */

const cartCollection =
    collection(db, "cart");


/* =====================================================
   HTML ELEMENTS
===================================================== */

const cartContainer =
    document.getElementById("cartContainer");


const cartTotal =
    document.getElementById("cartTotal");


/* =====================================================
   CURRENT USER
===================================================== */

let currentUser = null;


/* =====================================================
   LOAD CART
===================================================== */

async function loadCart() {

    try {

        if (!currentUser) {

            return;
        }


        cartContainer.innerHTML = "";


        let total = 0;


        const cartQuery =
            query(
                cartCollection,
                where("userId", "==", currentUser.uid)
            );


        const snapshot =
            await getDocs(cartQuery);
        const cartItems = snapshot.docs;


        snapshot.forEach((cartDoc) => {

            const cartItem =
                cartDoc.data();


            total += cartItem.totalPrice;


            const div =
                document.createElement("div");


            div.classList.add("cart-item");


            div.innerHTML = `

                <img src="${cartItem.imageURL}">

                <div class="cart-details">

                    <h3>${cartItem.title}</h3>

                    <p>

                        ₹ ${cartItem.price}
                    </p>

                    <p>

                        Total:
                        ₹ ${cartItem.totalPrice}
                    </p>

                    <div class="quantity-controls">

                        <button class="quantity-btn decrease-btn"
                                data-id="${cartDoc.id}"
                                data-quantity="${cartItem.quantity}"
                                data-price="${cartItem.price}">

                            -

                        </button>

                        <span>

                            ${cartItem.quantity}

                        </span>

                        <button class="quantity-btn increase-btn"
                                data-id="${cartDoc.id}"
                                data-quantity="${cartItem.quantity}"
                                data-price="${cartItem.price}">

                            +

                        </button>

                    </div>

                </div>

                <button class="remove-btn"
                        data-id="${cartDoc.id}">

                    Remove

                </button>
            `;


            cartContainer.appendChild(div);

        });

if (cartItems.length === 0) {

    cartTotal.innerHTML = `

        <div class="empty-state">

            <h2>

                Cart Is Empty

            </h2>

            <p>

                Add products to continue shopping.

            </p>

        </div>
    `;
}

else {

    cartTotal.innerHTML = `

        <div class="cart-summary">

            <h2>

                Total: ₹ ${total}

            </h2>

            <a href="./checkout.html">

                <button class="primary-btn">

                    Proceed To Checkout

                </button>

            </a>

        </div>
    `;
}

        setupQuantityButtons();

        setupRemoveButtons();

    }

    catch (error) {

        console.error(error);
    }

}



/* =====================================================
   INCREASE / DECREASE
===================================================== */

function setupQuantityButtons() {

    const increaseButtons =
        document.querySelectorAll(".increase-btn");


    const decreaseButtons =
        document.querySelectorAll(".decrease-btn");


    increaseButtons.forEach((button) => {

        button.addEventListener("click", async () => {

            const cartId =
                button.dataset.id;

            const quantity =
                Number(button.dataset.quantity);

            const price =
                Number(button.dataset.price);


            const cartRef =
                doc(db, "cart", cartId);


            await updateDoc(cartRef, {

                quantity: quantity + 1,

                totalPrice:
                    (quantity + 1) * price
            });


            loadCart();

        });

    });


    decreaseButtons.forEach((button) => {

        button.addEventListener("click", async () => {

            const cartId =
                button.dataset.id;

            const quantity =
                Number(button.dataset.quantity);

            const price =
                Number(button.dataset.price);


            if (quantity <= 1) {

                return;
            }


            const cartRef =
                doc(db, "cart", cartId);


            await updateDoc(cartRef, {

                quantity: quantity - 1,

                totalPrice:
                    (quantity - 1) * price
            });


            loadCart();

        });

    });

}



/* =====================================================
   REMOVE ITEM
===================================================== */

function setupRemoveButtons() {

    const removeButtons =
        document.querySelectorAll(".remove-btn");


    removeButtons.forEach((button) => {

        button.addEventListener("click", async () => {

            try {

                const cartId =
                    button.dataset.id;


                await deleteDoc(
                    doc(db, "cart", cartId)
                );


                loadCart();

            }

            catch (error) {

                console.error(error);
            }

        });

    });

}

/* =====================================================
   AUTH STATE
===================================================== */

onAuthStateChanged(auth, (user) => {

    if (user) {

        currentUser = user;

        loadCart();
    }

});