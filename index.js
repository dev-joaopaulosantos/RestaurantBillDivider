const products = [
    { id: "pizza", name: "Pizza", price: 42.00 },
    { id: "rodizioSimples", name: "Rodízio Simples", price: 70.00 },
    { id: "rodizioExecutivo", name: "Rodízio Executivo", price: 85.00 },
    { id: "temaki", name: "Temaki", price: 20.00 },
    { id: "refrigerante", name: "Refrigerante", price: 8.00 },
    { id: "porcaoPeixe", name: "Porção de Peixe", price: 50.00 },
    { id: "suco", name: "Suco", price: 7.00 },
];

const productSelect = document.getElementById("productSelect");

products.forEach(function (product) {
    let option = document.createElement("option");
    option.value = product.id;
    option.textContent = product.name + " - R$" + product.price;
    productSelect.appendChild(option);
});

const consumedProducts = [];

function registerConsumption() {
    const quantityInput = document.getElementById("quantityInput");
    const customersInput = document.getElementById("customersInput");

    if (customersInput.value === "") {
        alert("Por favor, preencha o nome do cliente.");
        return;
    }

    const product = productSelect.value;
    const quantity = parseInt(quantityInput.value);
    const customers = customersInput.value.toLowerCase()
        .split(",")
        .map((customer) => customer.trim());

    console.log(customers)

    consumedProducts.push({ product, quantity, customers });

    showProductsConsumed();
}

function showProductsConsumed() {
    const consumedProductsList =
        document.getElementById("consumedProducts");
    consumedProductsList.innerHTML = "";

    consumedProducts.forEach(function (consumedProduct) {
        const li = document.createElement("li");
        const text = `${consumedProduct.quantity}x ${getProductName(
            consumedProduct.product
        )} - Clientes: ${consumedProduct.customers.join(", ").toUpperCase()}`;

        li.textContent = text;
        consumedProductsList.appendChild(li);
    });
}

function getProductName(product) {
    const productFound = products.find((p) => p.id === product);
    return productFound?.name || "";
}

function calculateDivision() {
    let divisionResult = document.getElementById("divisionResult");
    divisionResult.innerHTML = "";

    const pricesPerCustomer = [];

    consumedProducts.forEach(function (consumedProduct) {
        const UnitPrice = getUnitPrice(consumedProduct.product);
        const totalPrice = UnitPrice * consumedProduct.quantity;
        const divisionByCustomer = calculateSplitByCustomer(
            totalPrice,
            consumedProduct.customers.length
        );

        consumedProduct.customers.forEach(function (customer) {
            customer = customer.trim();

            let customerFound = pricesPerCustomer.find(
                (c) => c.name === customer
            );

            if (!customerFound) {
                customerFound = { name: customer, price: 0, fee: 0 };
                pricesPerCustomer.push(customerFound);
            }

            customerFound.price += divisionByCustomer;
        });
    });

    pricesPerCustomer.forEach(function (customer) {
        let li = document.createElement("li");
        const priceToPay = customer.price;

        let checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.onchange = function () {
            customer.fee = checkbox.checked ? priceToPay * 0.1 : 0;
            updatePriceToPay();
        };

        let span = document.createElement("span");
        span.textContent = "Taxa | ";

        li.appendChild(checkbox);
        li.appendChild(span);
        li.appendChild(
            document.createTextNode(
                `${customer.name.toUpperCase()} deverá pagar R$${(priceToPay + (customer.fee || 0)).toFixed(2)}`
            )
        );
        divisionResult.appendChild(li);

        function updatePriceToPay() {
            li.textContent = `${customer.name.toUpperCase()} deverá pagar R$${(priceToPay + (customer.fee || 0)).toFixed(2)}`;
            li.prepend(checkbox);
            li.insertBefore(span, checkbox.nextSibling);
        }
    });


}

function getUnitPrice(product) {
    const productFound = products.find((p) => p.id === product);
    return productFound?.price || 0;
}

function calculateSplitByCustomer(totalPrice, quantitycustomers) {
    const pricePercustomer = totalPrice / quantitycustomers;
    return Math.round(pricePercustomer * 100) / 100;
}