// Asincronía para manejar la obtención de datos del archivo JSON
const fetchData = async () => {
  try {
    // Fetch data from the JSON file
    const dataResponse = await fetch("data.json");
    // Convert the response to JSON
    const data = await dataResponse.json();
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

// Inicializa los elementos y variables necesarias al cargar la página
const initializeCart = async () => {
  const data = await fetchData();
  const addToCartBtns = document.querySelectorAll(".add-cart-container");
  const plusBtns = document.querySelectorAll(".plus");
  const minusBtns = document.querySelectorAll(".minus");
  const totalItemsInCart = document.querySelector("span[data-total-items]");
  const cartMessage = document.querySelector(".cart-message");
  const orderListDiv = document.querySelector(".order-list-container");
  const orderListUl = orderListDiv.querySelector(".order-list");
  const orderTotal = document.getElementById("order-total");
  const confirmBtn = orderListDiv.querySelector(".confirm-btn");
  const orderDialog = document.getElementById("order-confirmation");
  const newOrderBtn = orderDialog.querySelector(".confirm-btn");
  const confirmOrderUl = document.querySelector(".confirm-order-list");
  const orderListObj = {};

  // Mapea los datos obtenidos a un objeto de la lista de pedidos
  for (const obj of data) {
    orderListObj[obj["name"]] = {
      price: obj["price"],
      image: obj["image"],
      category: obj["category"],
      quanity: 0,
      total: 0,
      ele: null,
    };
  }

  // Define el comportamiento de los botones para agregar al carrito
  const changeAddCartBtn = (e) => {
    const itemQuantity = parseInt(e.currentTarget.value);
    const card = e.currentTarget.parentElement.parentElement;

    // Añade un borde al elemento seleccionado
    const img = card.querySelector("picture");
    img.classList.toggle("selected-item");

    // Actualiza el objeto de la lista de pedidos
    const name = card.querySelector(".card-title").textContent.trim();
    orderListObj[name].quanity = 1;
    orderListObj[name].total = orderListObj[name].price;

    // Añade el artículo a la lista de pedidos
    const orderListEle = addListItem(name);
    orderListObj[name].ele = orderListEle;

    const AddItemBtn = e.currentTarget.parentElement.querySelector(".add-cart-counter");
    e.currentTarget.classList.toggle("hide");
    AddItemBtn.classList.toggle("hide");

    updateItemsInCart(itemQuantity);
    changeCartView(itemQuantity);

    // Actualiza el total del pedido
    updateOrderTotal(orderListObj[name].price);
  };

  // Actualiza el total del pedido
  const updateOrderTotal = (price) => {
    orderTotal.textContent = `$${(parseFloat(orderTotal.textContent.slice(1)) + price).toFixed(2)}`;
  };

  // Añade un elemento a la lista de pedidos
  const addListItem = (name) => {
    const orderListUl = document.querySelector(".order-list");

    const liEle = document.createElement("li");
    liEle.classList.add("list-item");
    orderListUl.appendChild(liEle);

    const itemInfoDiv = document.createElement("div");
    itemInfoDiv.classList.add("item-info");
    liEle.appendChild(itemInfoDiv);

    const itemTitleP = document.createElement("p");
    itemTitleP.setAttribute("class", "item-title red-hat-text-600");
    const itemTitleText = document.createTextNode(`${name}`);
    itemTitleP.appendChild(itemTitleText);
    itemInfoDiv.append(itemTitleP);

    const itemPricesDiv = document.createElement("div");
    itemPricesDiv.classList.add("item-prices");
    itemInfoDiv.appendChild(itemPricesDiv);

    const quanityPara = document.createElement("p");
    const quanityParaText = document.createTextNode(`${orderListObj[name].quanity}x`);
    quanityPara.setAttribute("class", "item-quantity red-hat-text-700");
    quanityPara.appendChild(quanityParaText);

    const pricePara = document.createElement("p");
    const priceParaText = document.createTextNode(`Uni.  $${orderListObj[name].price.toFixed(2)}`);
    pricePara.setAttribute("class", "item-price red-hat-text-600");
    pricePara.appendChild(priceParaText);

    const totalPricePara = document.createElement("p");
    const totalPriceParaText = document.createTextNode(`$${orderListObj[name].total.toFixed(2)}`);
    totalPricePara.setAttribute("class", "item-total-price red-hat-text-700");
    totalPricePara.appendChild(totalPriceParaText);

    itemPricesDiv.appendChild(quanityPara);
    itemPricesDiv.appendChild(pricePara);
    itemPricesDiv.appendChild(totalPricePara);

    const removeItemBtn = document.createElement("button");
    removeItemBtn.setAttribute("class", "remove-item-btn");
    removeItemBtn.setAttribute("value", -1);

    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttributeNS(null, "width", "10");
    svg.setAttributeNS(null, "height", "10");
    svg.setAttributeNS(null, "fill", "none");
    svg.setAttributeNS(null, "viewBox", "0.5 0 10 10");
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttributeNS(null, "fill", "#CAAFA7");
    path.setAttributeNS(null, "d", "M8.375 9.375 5 6 1.625 9.375l-1-1L4 5 .625 1.625l1-1L5 4 8.375.625l1 1L6 5l3.375 3.375-1 1Z");
    svg.appendChild(path);
    removeItemBtn.appendChild(svg);

    liEle.appendChild(removeItemBtn);
    removeItemBtn.addEventListener("click", removeItem);

    return itemInfoDiv;
  };

  // Alterna la visibilidad de los botones
  const changeBtn = (ele) => {
    const addItemBtn = ele;
    const addToCart = addItemBtn.previousElementSibling;
    const img = addToCart.previousElementSibling;
    img.classList.toggle("selected-item");
    addToCart.classList.toggle("hide");
    addItemBtn.classList.toggle("hide");
  };

  // Elimina un elemento de la lista de pedidos
  const removeItem = (e) => {
    const name = e.currentTarget.parentElement.querySelector(".item-title").textContent;
    const oldAmount = parseInt(totalItemsInCart.getAttribute("data-total-items"));
    const itemQuantity = orderListObj[name].quanity;
    updateItemsInCart(-itemQuantity);
    changeCartView(oldAmount - itemQuantity > 0 ? true : false);

    const cardTitleEles = document.querySelectorAll(".card-title");
    const cardTitleEle = [...cardTitleEles].find(e => e.textContent.trim() === name);
    const addCartCounter = cardTitleEle.parentElement.querySelector(".add-cart-counter");
    const amount = addCartCounter.querySelector(".amount");
    changeBtn(addCartCounter);

    // Actualiza el total del pedido
    updateOrderTotal(-orderListObj[name].price * orderListObj[name].quanity);

    // Reinicia el objeto y contador
    amount.textContent = 1;
    orderListObj[name].quanity = 0;
    orderListObj[name].total = 0;
    orderListObj[name].ele.parentElement.remove();
    orderListObj[name].ele = null;
  };

  // Cambia la vista del carrito
  const changeCartView = (firstItem) => {
    cartMessage.classList.toggle("hide", firstItem);
    orderListDiv.classList.toggle("hide", !firstItem);
  };

  // Actualiza la cantidad de artículos en el carrito
  const updateAmount = (e) => {
    const amount = e.currentTarget.parentElement.querySelector(".amount");
    let newVal = parseInt(e.currentTarget.getAttribute("data-amount"));
    let updatedAmount = parseInt(amount.textContent) + newVal;

    const name = e.currentTarget.parentElement.parentElement.parentElement
      .querySelector(".card-title")
      .textContent.trim();
    orderListObj[name].quanity += newVal;
    orderListObj[name].total += newVal * orderListObj[name].price;

    // Actualiza el total del pedido
    updateOrderTotal(newVal * orderListObj[name].price);

    if (updatedAmount <= 0) {
      updatedAmount = 1;
      newVal = -1;
      changeBtn(e.currentTarget.parentElement);
      changeCartView(parseInt(totalItemsInCart.getAttribute("data-total-items")) + newVal);
      orderListObj[name].ele.parentElement.remove();
    }
    amount.textContent = updatedAmount;

    // Actualiza el artículo en la lista de pedidos
    orderListObj[name].ele.querySelector(".item-quantity").textContent = `${orderListObj[name].quanity}x`;
    orderListObj[name].ele.querySelector(".item-total-price").textContent = `$${orderListObj[name].total.toFixed(2)}`;

    updateItemsInCart(newVal);
  };

  // Confirma el pedido
  const confirmOrder = () => {
    const orderListItems = document.querySelectorAll(".list-item");
    orderListItems.forEach(li => {
      const clonedItem = li.querySelector(".item-info").cloneNode(true);
      confirmOrderUl.appendChild(clonedItem);
    });

    resetOrder();
  };

  // Restablece el pedido
  const resetOrder = () => {
    const orderListItems = document.querySelectorAll(".list-item");
    orderListItems.forEach(ele => ele.remove());
    orderTotal.textContent = "$0.00";
    totalItemsInCart.textContent = 0;
    totalItemsInCart.setAttribute("data-total-items", 0);

    for (const name in orderListObj) {
      orderListObj[name].quanity = 0;
      orderListObj[name].total = 0;
      orderListObj[name].ele = null;
    }

    const selectedItems = document.querySelectorAll(".selected-item");
    selectedItems.forEach(img => img.classList.toggle("selected-item"));
    const addCartCounterBtns = document.querySelectorAll(".add-cart-counter");
    addCartCounterBtns.forEach(btn => {
      const addToCart = btn.parentElement.querySelector(".add-cart-container");
      btn.classList.toggle("hide");
      addToCart.classList.toggle("hide");
    });

    changeCartView(false);
  };

  // Actualiza la cantidad de artículos en el carrito
  const updateItemsInCart = (amount) => {
    totalItemsInCart.setAttribute("data-total-items", parseInt(totalItemsInCart.getAttribute("data-total-items")) + amount);
    totalItemsInCart.textContent = totalItemsInCart.getAttribute("data-total-items");
  };

  // Agrega los eventos de escucha a los botones
  addToCartBtns.forEach(btn => btn.addEventListener("click", changeAddCartBtn));
  plusBtns.forEach(btn => btn.addEventListener("click", updateAmount));
  minusBtns.forEach(btn => btn.addEventListener("click", updateAmount));
  confirmBtn.addEventListener("click", confirmOrder);
  newOrderBtn.addEventListener("click", () => orderDialog.close());
};

// Llama a la función para inicializar el carrito al cargar la página
initializeCart();
