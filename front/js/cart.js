// récupération des éléments stockés dans le local storage

function getListProducts() {
    let listProducts = JSON.parse(localStorage.getItem("listProducts"));
    console.log(listProducts);
    checkCartContent(listProducts);

    // vérification du contenus du panier

    function checkCartContent(listProducts) {
        const cartItems = document.querySelector("#cart__items");
        if(listProducts == null || listProducts.length === 0 ) {
            console.log("le panier est vide");
            const emptyCart = document.createElement('p');
            emptyCart.innerText = ('Votre panier est vide');
            cartItems.append(emptyCart);        
        } else {
            console.log("il y a quelque chose dans le panier")
            displayCart(listProducts);
        }
    }

    function displayCart(listProducts) {
        console.log("création des éléments pour le panier");
        for (i = 0; i < listProducts.length; i ++) {
            
            const article = document.createElement('article');
            document.querySelector("#cart__items").append(article);
            article.classList.add('cart__item');
            article.dataset.id = 'listProducts[i].id'
            article.dataset.color = 'listProducts[i].color'

            const cartItemImg = document.createElement('div');
            article.append(cartItemImg);
            article.classList.add('cart__item__img');

            getProductData(listProducts);
            
            const img = document.createElement('img');
            img.src = 'productData.imageUrl;'

        }
    }

    function getProductData(listProducts) {
        let productID = 'listProducts[i].id';
        let productData = fetch(`http://localhost:3000/api/products/${productID}`);
        productData.then(function(res) {
            if (res.ok) {
                return res.json();
            }
        })
    };
};

getListProducts();