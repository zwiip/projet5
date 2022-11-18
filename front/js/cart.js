// récupération des éléments stockés dans le local storage

function getListProducts() {
    let listProducts = JSON.parse(localStorage.getItem("listProducts"));
    console.log(listProducts);
    checkCartContent(listProducts);
};

    
// affichage des produits du localStorage dans le panier

function checkCartContent(listProducts) {
    const cartItems = document.querySelector("#cart__items");
    if(listProducts == null || listProducts.length === 0 ) {
        console.log("le panier est vide");
        const emptyCart = document.createElement('p');
        emptyCart.innerText = ('Votre panier est vide');
        cartItems.append(emptyCart);        
    } else {
        console.log("il y a quelque chose dans le panier")
    }
    
}

getListProducts();

    //for (i = 0; i < listProducts.length; i ++) {

//}