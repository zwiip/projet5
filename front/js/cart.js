function main() {

    // récupération des éléments stockés dans le local storage
    let listProducts = JSON.parse(localStorage.getItem("listProducts"));
    console.log(listProducts);
    checkCartContent(listProducts);

    // vérification du contenus du panier
    function checkCartContent(listProducts) {
        const cartItems = document.querySelector("#cart__items");
        if (listProducts == null || listProducts.length === 0) {
            console.log("le panier est vide");
            const emptyCart = document.createElement('p');
            emptyCart.innerText = ('Votre panier est vide');
            cartItems.append(emptyCart);
        } else {
            console.log("il y a quelque chose dans le panier")
            displayCart(listProducts);
        }
    }



    // fonction pour créer et afficher les éléments du panier
    function displayCart() {
        const cartItems = document.querySelector("#cart__items");

        // récupération des données de l'API
        fetch(`http://localhost:3000/api/products/`)
            .then(res => {
                if (res.ok) {
                    return res.json();
                } else {
                    throw new Error('Impossible de charger les données', { cause: res })
                }
            })
            .then(addProductData => {
                for (i = 0; i < listProducts.length; i++) {
                    //créer fonction avec parametre productData
                    console.log('vérif dans then', listProducts)
                    let productData = addProductData.find(sameID => sameID._id === listProducts[i].id);
                    // filter à la place de find ?
                    console.log(productData);

                    // création du bloc article
                    const article = document.createElement('article');
                    console.log(listProducts[i]);
                    article.classList.add('cart__item');
                    article.dataset.id = listProducts[i].id
                    article.dataset.color = listProducts[i].color

                    // création du bloc img
                    const cartItemImg = document.createElement('div');
                    cartItemImg.classList.add('cart__item__img');

                    // création de l'img
                    const img = document.createElement('img');
                    img.src = productData.imageUrl;
                    img.alt = productData.altTxt;
                    cartItemImg.append(img);
                    article.append(cartItemImg);
    
                    // création du bloc produit
                    const cartItemContent = document.createElement('div');
                    cartItemContent.classList.add('cart__item__content');
                    article.append(cartItemContent);
    
                    // création du bloc description produit
                    const cartItemContentDescription = document.createElement('div');
                    cartItemContentDescription.classList.add('cart__item__content__description');
                    cartItemContent.append(cartItemContentDescription);
    
                    // affichage nom produit
                    const h2 = document.createElement('h2');
                    h2.textContent = productData.name;
                    cartItemContentDescription.append(h2);
    
                    // affichage option couleur
                    const pColor = document.createElement('p');
                    pColor.textContent = listProducts.color;
                    cartItemContentDescription.append(pColor);
    
                    // affichage prix produit
                    const pPrice = document.createElement('p');
                    pPrice.textContent = productData.price + ' ' + '€';
                    cartItemContentDescription.append(pPrice);
    
                    // création du bloc paramètres
                    const cartItemContentSettings = document.createElement('div');
                    cartItemContentDescription.classList.add('cart__item__content__settings');
                    cartItemContent.append(cartItemContentSettings);
    
                    // création du bloc quantité*/

                    cartItems.appendChild(article);
                }
            })
            .catch(e => {
                console.error('une erreur est survenue', e)
            })
    }
}

main();
