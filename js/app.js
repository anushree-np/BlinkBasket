import { auth, db } from "./config/firebase.js";

import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-auth.js";

import {
  doc,
  getDoc,
} from "https://www.gstatic.com/firebasejs/11.7.1/firebase-firestore.js";

/* =====================================================
   AUTH CHECK
===================================================== */

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    return;
  }

  try {
    const userRef = doc(db, "users", user.uid);

    const snapshot = await getDoc(userRef);

    if (!snapshot.exists()) {
      return;
    }

    const userData = snapshot.data();

    /* =========================
           ADMIN BUTTON
        ========================= */

    if (userData.role === "admin") {
      const navLinks = document.querySelector(".nav-links");

      navLinks.innerHTML += `

                <a href="./pages/admin.html">

                    Admin

                </a>
            `;
    }
  } catch (error) {
    console.error(error);
  }
});
