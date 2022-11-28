let orderID = new URL(window.location.href).searchParams;
let id = orderID.get('orderId');

const displayOrderID = document.querySelector("#orderId");
displayOrderID.textContent = id;