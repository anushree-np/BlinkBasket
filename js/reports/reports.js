import {
    db
} from "../config/firebase.js";


import {

    collection,
    getDocs

} from "https://www.gstatic.com/firebasejs/11.7.1/firebase-firestore.js";


/* =====================================================
   COLLECTIONS
===================================================== */

const orderCollection =
    collection(db, "orders");


const productCollection =
    collection(db, "products");


/* =====================================================
   HTML ELEMENTS
===================================================== */

const customerReportContainer =
    document.getElementById("customerReportContainer");


const inventoryReportContainer =
    document.getElementById("inventoryReportContainer");


const salesReportContainer =
    document.getElementById("salesReportContainer");


const loadReportsBtn =
    document.getElementById("loadReportsBtn");


const fromDateInput =
    document.getElementById("fromDate");


const toDateInput =
    document.getElementById("toDate");


/* =====================================================
   LOAD REPORTS
===================================================== */

loadReportsBtn.addEventListener("click", () => {

    loadCustomerReports();

    loadInventoryReports();

    loadSalesReports();

});


/* =====================================================
   DATE FILTER
===================================================== */

function isWithinDateRange(orderDate) {

    const fromDate =
        fromDateInput.value
            ? new Date(fromDateInput.value)
            : null;


    const toDate =
        toDateInput.value
            ? new Date(toDateInput.value)
            : null;


    const currentDate =
        new Date(orderDate);


    if (fromDate && currentDate < fromDate) {

        return false;
    }


    if (toDate && currentDate > toDate) {

        return false;
    }


    return true;
}


/* =====================================================
   CUSTOMER REPORTS
===================================================== */

async function loadCustomerReports() {

    try {

        customerReportContainer.innerHTML = "";


        const snapshot =
            await getDocs(orderCollection);


        let allOrders = [];

        let cashOrders = [];

        let creditOrders = [];


        snapshot.forEach((docItem) => {

            const order =
                docItem.data();


            if (!isWithinDateRange(order.createdAt)) {

                return;
            }


            allOrders.push(order);


            if (order.paymentMethod === "Cash") {

                cashOrders.push(order);
            }


            if (order.paymentMethod === "Credit") {

                creditOrders.push(order);
            }

        });


        const top10 =
            allOrders
                .sort((a, b) =>
                    b.totalAmount - a.totalAmount
                )
                .slice(0, 10);


        customerReportContainer.innerHTML += `

            <div class="report-card">

                <h3>
                    Total Customer Orders
                </h3>

                <p>
                    ${allOrders.length}
                </p>

            </div>

            <div class="report-card">

                <h3>
                    Cash Purchase Reports
                </h3>

                <p>
                    ${cashOrders.length}
                </p>

            </div>

            <div class="report-card">

                <h3>
                    Credit Purchase Reports
                </h3>

                <p>
                    ${creditOrders.length}
                </p>

            </div>

            <div class="report-card">

                <h3>
                    Top 10 Customer Purchases
                </h3>

                ${top10.map(order => `

                    <p>
                        ${order.customerName}
                        - ₹ ${order.totalAmount}
                    </p>
                `).join("")}

            </div>
        `;

    }

    catch (error) {

        console.error(error);
    }
}


/* =====================================================
   INVENTORY REPORTS
===================================================== */

async function loadInventoryReports() {

    try {

        inventoryReportContainer.innerHTML = "";


        const snapshot =
            await getDocs(productCollection);


        let highStock = [];

        let lowStock = [];

        let categoryMap = {};


        snapshot.forEach((docItem) => {

            const product =
                docItem.data();


            if (product.stock > 100) {

                highStock.push(product);
            }


            if (product.stock < 15) {

                lowStock.push(product);
            }


            if (!categoryMap[product.categoryName]) {

                categoryMap[product.categoryName] = 0;
            }


            categoryMap[product.categoryName] +=
                product.stock;

        });


        inventoryReportContainer.innerHTML += `

            <div class="report-card">

                <h3>
                    High Stock Products (>100)
                </h3>

                ${highStock.map(product => `

                    <p>
                        ${product.title}
                        - ${product.stock} Units
                    </p>
                `).join("")}

            </div>

            <div class="report-card">

                <h3>
                    Low Stock Products (<15)
                </h3>

                ${lowStock.map(product => `

                    <p>
                        ${product.title}
                        - ${product.stock} Units
                    </p>
                `).join("")}

            </div>

            <div class="report-card">

                <h3>
                    Category Wise Inventory
                </h3>

                ${Object.entries(categoryMap)
                    .map(([category, stock]) => `

                        <p>
                            ${category}
                            - ${stock} Units
                        </p>
                    `).join("")}

            </div>
        `;

    }

    catch (error) {

        console.error(error);
    }
}


/* =====================================================
   SALES REPORTS
===================================================== */

async function loadSalesReports() {

    try {

        salesReportContainer.innerHTML = "";


        const snapshot =
            await getDocs(orderCollection);


        let totalSales = 0;

        let categorySales = {};

        let productSales = {};

        let cashSales = 0;

        let creditSales = 0;


        snapshot.forEach((docItem) => {

            const order =
                docItem.data();


            if (!isWithinDateRange(order.createdAt)) {

                return;
            }


            totalSales +=
                order.totalAmount;


            if (order.paymentMethod === "Cash") {

                cashSales += order.totalAmount;
            }


            if (order.paymentMethod === "Credit") {

                creditSales += order.totalAmount;
            }


            order.items.forEach((item) => {

                if (!productSales[item.title]) {

                    productSales[item.title] = 0;
                }


                productSales[item.title] += item.quantity;


                if (!categorySales[item.categoryName]) {

                    categorySales[item.categoryName] = 0;
                }


                categorySales[item.categoryName] += item.totalPrice;

            });

        });


        const sortedProducts =
            Object.entries(productSales)
                .sort((a, b) => b[1] - a[1]);


        const top10 =
            sortedProducts.slice(0, 10);


        const bottom10 =
            sortedProducts.slice(-10);


        salesReportContainer.innerHTML += `

            <div class="report-card">

                <h3>
                    Total Sales
                </h3>

                <p>
                    ₹ ${totalSales}
                </p>

            </div>

            <div class="report-card">

                <h3>
                    Cash Sales
                </h3>

                <p>
                    ₹ ${cashSales}
                </p>

            </div>

            <div class="report-card">

                <h3>
                    Credit Sales
                </h3>

                <p>
                    ₹ ${creditSales}
                </p>

            </div>

            <div class="report-card">

                <h3>
                    Category Wise Sales
                </h3>

                ${Object.entries(categorySales)
                    .map(([category, amount]) => `

                        <p>
                            ${category}
                            - ₹ ${amount}
                        </p>
                    `).join("")}

            </div>

            <div class="report-card">

                <h3>
                    Top 10 Selling Items
                </h3>

                ${top10.map(item => `

                    <p>
                        ${item[0]}
                        - ${item[1]} Units
                    </p>
                `).join("")}

            </div>

            <div class="report-card">

                <h3>
                    Bottom 10 Selling Items
                </h3>

                ${bottom10.map(item => `

                    <p>
                        ${item[0]}
                        - ${item[1]} Units
                    </p>
                `).join("")}

            </div>
        `;

    }

    catch (error) {

        console.error(error);
    }
}