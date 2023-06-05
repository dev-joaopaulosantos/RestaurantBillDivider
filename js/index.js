const products = [
    { id: "pizza", name: "Pizza", price: 42.00 }, // Lista de produtos
    { id: "rodizioSimples", name: "Rodízio Simples", price: 70.00 },
    { id: "rodizioExecutivo", name: "Rodízio Executivo", price: 85.00 },
    { id: "temaki", name: "Temaki", price: 20.00 },
    { id: "refrigerante", name: "Refrigerante", price: 8.00 },
    { id: "porcaoPeixe", name: "Porção de Peixe", price: 50.00 },
    { id: "suco", name: "Suco", price: 7.00 },
]

const productSelect = document.getElementById("productSelect")

products.forEach(function (product) {
    let option = document.createElement("option"); // cria um elemento <option> para cada produto
    option.value = product.id // define o valor do atributo
    option.textContent = product.name + " - R$" + product.price
    productSelect.appendChild(option)
})

const consumedProducts = [] // lista para armazenar os produtos consumidos

function registerConsumption() {
    const quantityInput = document.getElementById("quantityInput")
    const customersInput = document.getElementById("customersInput")

    if (customersInput.value === "") { // verifica se o campo de nome do cliente está vazio
        alert("Por favor, preencha o nome do cliente.")
        return
    }

    const product = productSelect.value
    const quantity = parseInt(quantityInput.value)
    const customers = customersInput.value.toLowerCase()
        .split(",")
        .map((customer) => customer.trim())

    console.log(customers)

    consumedProducts.push({ product, quantity, customers })

    showProductsConsumed() // Atualiza a exibição dos prodtos consumidos
}

function showProductsConsumed() {
    const consumedProductsList = document.getElementById("consumedProducts")
    consumedProductsList.innerHTML = ""

    consumedProducts.forEach(function (consumedProduct) {
        const li = document.createElement("li") // cria um elemento <li> para cada produto consumido

        const text = `${consumedProduct.quantity}x ${getProductName(
            consumedProduct.product
        )} - Clientes: ${consumedProduct.customers.join(", ").toUpperCase()}`

        li.textContent = text
        consumedProductsList.appendChild(li)
    });
}

function getProductName(product) {
    const productFound = products.find((p) => p.id === product)
    return productFound?.name || "" // retorna o nome do produto encontrado ou uma string vazia se não for encontrado
}

function calculateDivision() {
    let divisionResult = document.getElementById("divisionResult")
    divisionResult.innerHTML = ""

    const pricesPerCustomer = [] // lista para armazenar os preços por cliente

    consumedProducts.forEach(function (consumedProduct) {
        const UnitPrice = getUnitPrice(consumedProduct.product) // obtem o preço unitário do produto consumido
        const totalPrice = UnitPrice * consumedProduct.quantity // calcula o preço total do produto consumido
        const divisionByCustomer = calculateSplitByCustomer(
            totalPrice,
            consumedProduct.customers.length
        ) // calcula a divisao do preço total pelo numero de clientes

        consumedProduct.customers.forEach(function (customer) {
            customer = customer.trim()

            let customerFound = pricesPerCustomer.find(
                (c) => c.name === customer
            ) // verifica se o cliente já foi encontrado anteriormente

            if (!customerFound) {
                customerFound = { name: customer, price: 0, fee: 0 }
                pricesPerCustomer.push(customerFound)
            }

            customerFound.price += divisionByCustomer // adiciona a divisao do preço ao preço do cliente
        });
    });

    pricesPerCustomer.forEach(function (customer) {
        let li = document.createElement("li") // cria um elemento <li> para cada cliente
        const priceToPay = customer.price

        let checkbox = document.createElement("input") // cria um elemento <input> do tipo checkbox
        checkbox.type = "checkbox"
        checkbox.onchange = function () { // função a ser executada quando o estado do checkbox mudar
            customer.fee = checkbox.checked ? priceToPay * 0.1 : 0 // Atualiza a taxa
            updatePriceToPay() // atualiza o preço a ser pago
        };

        let span = document.createElement("span"); // cria um elemento <span>
        span.textContent = "Taxa de 10% | "

        li.appendChild(checkbox)
        li.appendChild(span)
        li.appendChild(
            document.createTextNode(
                `${customer.name.toUpperCase()} deverá pagar R$${(priceToPay + (customer.fee || 0)).toFixed(2)}`
            )
        )
        divisionResult.appendChild(li)

        function updatePriceToPay() {
            li.textContent = `${customer.name.toUpperCase()} deverá pagar R$${(priceToPay + (customer.fee || 0)).toFixed(2)}`
            li.prepend(checkbox)
            li.insertBefore(span, checkbox.nextSibling)
        }
    });
}

function getUnitPrice(product) {
    const productFound = products.find((p) => p.id === product)
    return productFound?.price || 0 // retorna o preço unitario do produto encontrado ou 0 se não for encontrado
}

function calculateSplitByCustomer(totalPrice, quantitycustomers) {
    const pricePercustomer = totalPrice / quantitycustomers; // calcula o preço por cliente
    return Math.round(pricePercustomer * 100) / 100; // arredonda o preço
}
