import {
    auth,
    db
} from "../config/firebase.js";


import {

    onAuthStateChanged

} from "https://www.gstatic.com/firebasejs/11.7.1/firebase-auth.js";


import {

    doc,
    getDoc

} from "https://www.gstatic.com/firebasejs/11.7.1/firebase-firestore.js";


console.log("ADMIN GUARD ACTIVE");


onAuthStateChanged(auth, async (user) => {

    // NOT LOGGED IN

    if (!user) {

        alert("Please Login First");

        window.location.href =
            "./login.html";

        return;
    }


    try {

        // GET USER DOCUMENT

        const userRef =
            doc(db, "users", user.uid);


        const userSnap =
            await getDoc(userRef);


        // USER DOC MISSING

        if (!userSnap.exists()) {

            alert("User Data Missing");

            window.location.href =
                "../index.html";

            return;
        }


        const userData =
            userSnap.data();


        console.log(userData);


        // ROLE CHECK

        if (userData.role !== "admin") {

            alert("Access Denied");


            window.location.href =
                "../index.html";

            return;
        }


        console.log("ADMIN VERIFIED");

    }

    catch (error) {

        console.error(error);

        alert(error.message);
    }

});