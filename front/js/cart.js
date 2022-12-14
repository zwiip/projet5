/**
 * Liée à cart.html pour afficher dynamiquement la page panier, comprenant deux parties :
 * - L'affichage d'un résumé du contenu du panier
 * - La gestion et la validation d'un formulaire et des données saisies
 */

/**
 * Permet de récupérer les éléments stockés dans le local storage et de les trier par l'id
 * @return {{id: string, color: string, quantity: number}[]}
 */
let listProducts = JSON.parse(localStorage.getItem("listProducts"));
console.log("je récupère mon local storage", listProducts);

let totalPrice = 0;
let totalQuantity = Number(0);

/**
 * Récupération des données API et vérification de s'il y a quelque chose dans le panier
 * @return {{_id: string, altTxt: string, colors: string[], description: string, imageUrl: string, name: string, price: number}[]}
 */
fetch(`http://localhost:3000/api/products/`)
    .then(res => {
        if (res.ok) {
            return res.json();
        } else {
            throw new Error('Impossible de charger les données', { cause: res })
        }
    })
    .then((data) => {
        console.log("je récupère mes données api", data)
        let cartItems = document.querySelector("#cart__items");
        if (listProducts == null || listProducts.length === 0) {
            calculateTotal(data, listProducts);
        } else {
            console.log("il y a quelque chose dans le panier");
            listProducts = listProducts.sort(function (a, b) {
                if (a.id < b.id) {
                    return -1;
                }
                if (a.id > b.id) {
                    return 1;
                }
                return 0;
            })
            calculateTotal(data, listProducts);
            addProductData(data, listProducts)
        }
    })
    .catch(e => {
        console.error('une erreur est survenue', e)
    });

/**
 * Permet d'afficher le résumé du contenus du panier
 * @param {Array} data la liste des données produits (API)
 * @param {Array} listProducts la liste du contenu de mon panier
 */
function addProductData(data, listProducts) {
    cartItems = document.querySelector("#cart__items");

    for (i = 0; i < listProducts.length; i++) {
        //console.log('je récupère bien data dans la boucle', data);                    
        //console.log('je récupère bien le local storage dans la boucle', listProducts)
        let productData = data.find(sameID => sameID._id === listProducts[i].id);
        //console.log("je récupère les deux tableaux du même produit", productData);

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
        pColor.textContent = listProducts[i].color;
        cartItemContentDescription.append(pColor);

        // affichage prix produit
        const pPrice = document.createElement('p');
        pPrice.textContent = productData.price + ' ' + '€';
        cartItemContentDescription.append(pPrice);

        // création du bloc paramètres
        const cartItemContentSettings = document.createElement('div');
        cartItemContentDescription.classList.add('cart__item__content__settings');
        cartItemContent.append(cartItemContentSettings);

        // création du bloc quantité
        const cartItemContentSettingsQuantity = document.createElement('div');
        cartItemContentSettingsQuantity.classList.add('cart__item__content__settings__quantity');

        const pQuantity = document.createElement('p');
        pQuantity.textContent = 'Qté : ';
        cartItemContentSettingsQuantity.append(pQuantity);

        const inputQuantity = document.createElement('input');
        inputQuantity.classList.add('itemQuantity')
        inputQuantity.setAttribute("type", "number")
        inputQuantity.setAttribute("name", "itemQuantity");
        inputQuantity.setAttribute("min", "1");
        inputQuantity.setAttribute("max", "100");
        inputQuantity.setAttribute("value", `${listProducts[i].quantity}`);
        /**
         * Permet de modifier la quantité d'un produit en vérifiant au préalable la quantité totale
         */
        cartItemContentSettingsQuantity.addEventListener('change', updateQuantity => {
            if (inputQuantity.value <= 0 || inputQuantity.value > 100) {
                return alert('Veuillez sélectionner une quantité comprise entre 1 et 100 ou supprimer le produit');

            } else {
                console.log(listProducts)
                let editedInputParent = inputQuantity.closest('article');
                let editedInputColor = editedInputParent.getAttribute("data-color")
                let editedInputID = editedInputParent.getAttribute("data-id")
                //console.log('vérif parent produit', editedInputParent, editedInputColor, editedInputID)
                let i = listProducts.findIndex(editInputProduct => editInputProduct.id == editedInputID && editInputProduct.color == editedInputColor);
                listProducts[i].quantity = inputQuantity.value;
                localStorage.setItem("listProducts", JSON.stringify(listProducts))
                calculateTotal(data, listProducts);
            }
        });

        cartItemContentSettingsQuantity.append(inputQuantity);
        cartItemContentSettings.append(cartItemContentSettingsQuantity)

        // création du bloc de suppression
        const cartItemContentSettingsDelete = document.createElement('div');
        cartItemContentSettingsDelete.classList.add('cart__item__content__settings__delete');
        const pDeleteItem = document.createElement('p');
        pDeleteItem.classList.add('deleteItem');
        pDeleteItem.textContent = 'Supprimer';
        cartItemContentSettingsDelete.append(pDeleteItem);
        cartItemContentSettings.append(cartItemContentSettingsDelete);
        /**
         * Permet de supprimer un produit et de mettre à jour le résumé du panier, le local storage et le total prix / quantité
         */
        cartItemContentSettingsDelete.addEventListener('click', deleteProductFromCart => {
            listProducts = JSON.parse(localStorage.getItem("listProducts"));
            console.log(listProducts, 'avant suppression')
            let deletedProductParent = pDeleteItem.closest('article');
            let deletedProductColor = deletedProductParent.getAttribute("data-color");
            let deletedProductID = deletedProductParent.getAttribute("data-id");
            console.log(deletedProductParent, deletedProductColor, deletedProductID)
            listProducts = listProducts.filter(deletedProduct => deletedProduct.id !== deletedProductID || deletedProduct.color !== deletedProductColor);
            localStorage.setItem("listProducts", JSON.stringify(listProducts));
            deletedProductParent.remove();
            alert('Le produit a été retiré du panier');
            console.log(listProducts, 'après suppression');
            calculateTotal(data, listProducts);
        });

        cartItems.append(article);
    }
}

/**
 * Permet de calculer le total prix et quantité
 * @param {Array} data la liste des données produits (API)
 * @param {Array} listProducts la liste du contenu de mon panier
 */
function calculateTotal(data, listProducts) {
    totalPrice = 0;
    totalQuantity = 0;
    if (listProducts == null || listProducts.length === 0) {
        console.log("le panier est vide");
        cartItems = document.querySelector("#cart__items");
        const emptyCart = document.createElement('p');
        emptyCart.innerText = ('Votre panier est vide');
        cartItems.append(emptyCart);

    } else {
        for (let i = 0; i < listProducts.length; i++) {
            let newProductData = data.find(sameID => sameID._id === listProducts[i].id);
            totalQuantity += parseInt(listProducts[i].quantity);
            totalPrice += listProducts[i].quantity * newProductData.price;
        }    
    }
    
    console.log('prix total = ', totalPrice, 'quantité totale = ', totalQuantity)
    document.querySelector('#totalPrice').textContent = `${totalPrice}`;
    document.querySelector('#totalQuantity').textContent = `${totalQuantity}`;
}

/**
 * ----------------------------------------
 *  Gestion formulaire
 * ---------------------------------------
 */

/**
 * Permet d'écouter le clic du bouton, de récupérer les inputs de contact et de valider les données saisies
 */
let btnSubmit = document.querySelector('#order');
btnSubmit.addEventListener('click', function (e) {
    if (totalQuantity === 0) {
        window.alert('Impossible de passer une commande si votre panier est vide')
        return
    }
    e.preventDefault();

    let contact = {
        firstName: document.querySelector('#firstName').value,
        lastName: document.querySelector('#lastName').value,
        address: document.querySelector('#address').value,
        city: document.querySelector('#city').value,
        email: document.querySelector('#email').value
    };

    let errorMsg = {
        firstName: ('Merci de renseigner votre prénom'),
        lastName: ('Merci de renseigner votre nom de famille'),
        address: ('Merci de renseigner votre adresse'),
        city: ('Merci de renseigner votre ville'),
        email: ('Merci de renseigner un email valide')
    };

    let basicRegExp = new RegExp("^[A-Za-zÀ-Öà-öø-ÿ\ \-]*$")
    let numberRegExp = new RegExp("^[0-9A-Za-zÀ-Öà-öø-ÿ\ \-]*$")
    let emailRegExp = new RegExp("^[0-9A-Za-z\.\-\_]+\@[A-Za-z]+\.[A-Za-z]{1,10}$")

    console.log(contact);

    if (contact.firstName == "") {
        let firstNameErrorMsg = document.querySelector('#firstNameErrorMsg');
        firstNameErrorMsg.textContent = errorMsg.firstName;

        return
    } else if (basicRegExp.test(contact.firstName) == false) {
        firstNameErrorMsg.textContent = ('Le champ prénom accepte des lettres, des tirets et des espaces uniquement');
        return
    }

    if (contact.lastName == "") {
        let lastNameErrorMsg = document.querySelector('#lastNameErrorMsg');
        lastNameErrorMsg.textContent = errorMsg.lastName;
        return
    } else if (basicRegExp.test(contact.lastName) == false) {
        lastNameErrorMsg.textContent = ('Le champ nom accepte des lettres, des tirets et des espaces uniquement');
        return
    }

    if (contact.address == "") {
        let addressErrorMsg = document.querySelector('#addressErrorMsg');
        addressErrorMsg.textContent = errorMsg.address;
        return
    } else if (numberRegExp.test(contact.address) == false) {
        addressErrorMsg.textContent = ('Le champ adresse accepte des lettres, des chiffres, des tirets et des espaces uniquement');
        return
    }

    if (contact.city == "") {
        let cityErrorMsg = document.querySelector('#cityErrorMsg');
        cityErrorMsg.textContent = errorMsg.city;
        return
    } else if (numberRegExp.test(contact.city) == false) {
        cityErrorMsg.textContent = ('Le champ Ville accepte des lettres, des chiffres, des tirets et des espaces uniquement');
        return
    }

    if (contact.email == "") {
        let emailErrorMsg = document.querySelector('#emailErrorMsg');
        emailErrorMsg.textContent = errorMsg.email;
        return
    } else if (emailRegExp.test(contact.email) == false) {
        emailErrorMsg.textContent = ('Veuillez entrer un email valide');
        return
    }

    sendOrder(contact);
})

/**
 * Permet de créer l'objet à envoyer à l'API pour passer la commande
 * @param {object} contact inputs saisies et précédemment controlées 
 */
function sendOrder(contact) {
    let products = [];
    for (let i = 0; i < listProducts.length; i++) {
        products.push(listProducts[i].id);
    }
    const order = {
        contact,
        products
    };
    console.log('commande posée', order);

    let options = {
        method: 'POST',
        body: JSON.stringify(order),
        headers: {
            "Content-Type": "application/json"
        }
    };

    fetch('http://localhost:3000/api/products/order', options)
        .then((res) => res.json())
        .then((postOrder) => {
            console.log(postOrder)
            localStorage.clear();
            document.location.href = `confirmation.html?orderId=${postOrder.orderId}`
        })
        .catch((err) => {
            console.log("problème avec l'envoi du formulaire", err)
        })
}