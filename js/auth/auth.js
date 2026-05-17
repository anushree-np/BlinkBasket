import {
    auth,
    db
} from "../config/firebase.js";


import {

    createUserWithEmailAndPassword,

    signInWithEmailAndPassword,

    GoogleAuthProvider,

    signInWithPopup,

    sendPasswordResetEmail,

    signOut,

    onAuthStateChanged

} from "https://www.gstatic.com/firebasejs/11.7.1/firebase-auth.js";


import {

    doc,

    setDoc

} from "https://www.gstatic.com/firebasejs/11.7.1/firebase-firestore.js";



/* =====================================================
   REGISTER
===================================================== */

const registerForm =
    document.getElementById("registerForm");


if (registerForm) {

    registerForm.addEventListener("submit", async (event) => {

        event.preventDefault();

        try {

            const name =
                document.getElementById("registerName").value;

            const email =
                document.getElementById("registerEmail").value;

            const password =
                document.getElementById("registerPassword").value;


            /* =========================
               CREATE USER
            ========================= */

            const userCredential =
                await createUserWithEmailAndPassword(
                    auth,
                    email,
                    password
                );


            const user =
                userCredential.user;


            /* =========================
               STORE USER IN FIRESTORE
            ========================= */

            await setDoc(doc(db, "users", user.uid), {

                uid: user.uid,

                name: name,

                email: email,

                role: "customer",

                createdAt: new Date()
            });


            alert("Registration Successful");


            window.location.href =
                "./login.html";

        }

        catch (error) {

            console.error(error);

            alert(error.message);
        }

    });

}



/* =====================================================
   LOGIN
===================================================== */

const loginForm =
    document.getElementById("loginForm");


if (loginForm) {

    loginForm.addEventListener("submit", async (event) => {

        event.preventDefault();

        try {

            const email =
                document.getElementById("loginEmail").value;

            const password =
                document.getElementById("loginPassword").value;


            await signInWithEmailAndPassword(
                auth,
                email,
                password
            );


            alert("Login Successful");


            window.location.href =
                "../index.html";

        }

        catch (error) {

            console.error(error);

            alert(error.message);
        }

    });

}



/* =====================================================
   GOOGLE LOGIN
===================================================== */

const googleLoginBtn =
    document.getElementById("googleLoginBtn");


if (googleLoginBtn) {

    googleLoginBtn.addEventListener("click", async () => {

        try {

            const provider =
                new GoogleAuthProvider();


            const result =
                await signInWithPopup(
                    auth,
                    provider
                );


            const user =
                result.user;


            /* =========================
               STORE GOOGLE USER
            ========================= */

            await setDoc(doc(db, "users", user.uid), {

                uid: user.uid,

                name: user.displayName,

                email: user.email,

                role: "customer",

                createdAt: new Date()
            });


            alert("Google Login Successful");


            window.location.href =
                "../index.html";

        }

        catch (error) {

            console.error(error);

            alert(error.message);
        }

    });

}



/* =====================================================
   RESET PASSWORD
===================================================== */

const forgotPasswordBtn =
    document.getElementById("forgotPasswordBtn");


if (forgotPasswordBtn) {

    forgotPasswordBtn.addEventListener("click", async () => {

        const email =
            prompt("Enter your email");


        if (!email) {

            return;
        }


        try {

            await sendPasswordResetEmail(
                auth,
                email
            );


            alert("Password Reset Email Sent");

        }

        catch (error) {

            console.error(error);

            alert(error.message);
        }

    });

}



/* =====================================================
   AUTH STATE LISTENER
===================================================== */

onAuthStateChanged(auth, (user) => {

    if (user) {

        console.log("User Logged In");

        console.log(user);

    }

    else {

        console.log("No Active User");
    }

});



/* =====================================================
   LOGOUT
===================================================== */

async function logoutUser() {

    try {

        await signOut(auth);

        alert("Logout Successful");


        window.location.href =
            "../pages/login.html";

    }

    catch (error) {

        console.error(error);
    }

}


window.logoutUser = logoutUser;