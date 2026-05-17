import {

    auth,
    db

} from "./config/firebase.js";


import {

    onAuthStateChanged

} from "https://www.gstatic.com/firebasejs/11.7.1/firebase-auth.js";


import {

    doc,
    getDoc

} from "https://www.gstatic.com/firebasejs/11.7.1/firebase-firestore.js";


/* =====================================================
   AUTH STATE
===================================================== */

onAuthStateChanged(auth, async (user) => {

    try {

        const navLinks =
            document.querySelector(".nav-links");


        /* =========================
           NOT LOGGED IN
        ========================= */

        if (!user) {

            return;
        }


        /* =========================
           GET USER ROLE
        ========================= */

        const userRef =
            doc(db, "users", user.uid);


        const snapshot =
            await getDoc(userRef);


        if (!snapshot.exists()) {

            return;
        }


        const userData =
            snapshot.data();


        /* =========================
           ADMIN NAVBAR
        ========================= */

        if (userData.role === "admin") {

            navLinks.innerHTML += `

                <a href="./pages/admin.html">

                    Admin

                </a>

                <a href="./pages/reports.html">

                    Reports

                </a>
            `;
        }

    }

    catch (error) {

        console.error(error);
    }

});