function main() {
    getListProducts();
    getProductData(listProducts);
    if(getListProducts && getProductData) {
        console.log('toutes les données sont récupérées');
        checkCartContent(listProducts);
    } else {
        console.log('impossible de charger les données');
        return
    }

// récupération des éléments stockés dans le local storage
    function getListProducts() {
        let listProducts = JSON.parse(localStorage.getItem("listProducts"));
        console.log(listProducts);
        return listProducts
    }
    
// récupération des données de l'API
    function getProductData(listProducts) {
        let productData = fetch(`http://localhost:3000/api/products`);
        productData.then(function(res) {
            if (res.ok) {
                return res.json();
            }
        })
    }

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

};


    function displayCart(listProducts) {
        console.log("création des éléments pour le panier");
        for (i = 0; i < listProducts.length; i ++) {
            
            
// création du bloc article
            const article = document.createElement('article');
            document.querySelector("#cart__items").append(article);
            article.classList.add('cart__item');
            article.dataset.id = 'listProducts[i].id'
            article.dataset.color = 'listProducts[i].color'

// création du bloc img
            const cartItemImg = document.createElement('div');
            article.append(cartItemImg);
            article.classList.add('cart__item__img');
            
// création de l'img
            const img = document.createElement('img');
            img.src = 'productData[].imageUrl;'
            cartItemImg.append(img);
        }


    }



