function main() {

    // récupération des éléments stockés dans le local storage
    let listProducts = JSON.parse(localStorage.getItem("listProducts"));
    console.log("je récupère mon local storage", listProducts);
    checkCartContent(listProducts);
    calculateTotal();


    // vérification du contenus du panier
    function checkCartContent(listProducts) {
        let cartItems = document.querySelector("#cart__items");
        if (listProducts == null || listProducts.length === 0) {
            console.log("le panier est vide");
            const emptyCart = document.createElement('p');
            emptyCart.innerText = ('Votre panier est vide');
            cartItems.append(emptyCart);
        } else {
            console.log("il y a quelque chose dans le panier");
            displayCart(listProducts);
        }
    }

    // fonction pour créer et afficher les éléments du panier
    function displayCart() {
        cartItems = document.querySelector("#cart__items");

        // récupération des données de l'API
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
                addProductData(data);
            })
            .catch(e => {
                console.error('une erreur est survenue', e)
            });

        function addProductData(data) {
            for (i = 0; i < listProducts.length; i++) {
                //console.log('je récupère bien data dans la boucle', data);                    
                //console.log('je récupère bien le local storage dans la boucle', listProducts)
                let productData = data.find(sameID => sameID._id === listProducts[i].id);
                console.log("je récupère les deux tableaux du même produit", productData);

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
                cartItemContentSettingsQuantity.addEventListener('change', updateQuantity => {
                    if (inputQuantity.value <= 0 || inputQuantity.value > 100) {
                        return alert('Veuillez sélectionner une quantité comprise entre 1 et 100 ou supprimer le produit');
                    } else {
                        console.log(listProducts)
                        updateQuantity(listProducts);
                    }
                    function updateQuantity(listProducts) {
                        let editedInputParent = inputQuantity.closest('article');
                        let editedInputColor = editedInputParent.getAttribute("data-color")
                        let editedInputID = editedInputParent.getAttribute("data-id")
                        //console.log('vérif parent produit', editedInputParent, editedInputColor, editedInputID)
                        let i = listProducts.findIndex(editInputProduct => editInputProduct.id == editedInputID && editInputProduct.color == editedInputColor);
                        listProducts[i].quantity = inputQuantity.value;
                        localStorage.setItem("listProducts", JSON.stringify(listProducts))
                        calculateTotal();
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
                cartItemContentSettingsDelete.addEventListener('click', deleteProductFromCart);
                function deleteProductFromCart() {
                    listProducts = JSON.parse(localStorage.getItem("listProducts"));
                    let deletedProductParent = pDeleteItem.closest('article');
                    let deletedProductColor = deletedProductParent.getAttribute("data-color");
                    let deletedProductID = deletedProductParent.getAttribute("data-id");
                    listProducts = listProducts.filter(deletedProduct => deletedProduct.id !== deletedProductID || deletedProduct.color !== deletedProductColor);
                    localStorage.setItem("listProducts", JSON.stringify(listProducts));
                    deletedProductParent.remove();
                    alert('Le produit a été retiré du panier');
                    console.log(listProducts);
                    calculateTotal();
                };

                cartItems.append(article);
            }
        }
    }
    function calculateTotal() {
        listProducts = JSON.parse(localStorage.getItem("listProducts"));
        let totalPrice = 0;
        let totalQuantity = Number(0);

        fetch(`http://localhost:3000/api/products/`)
            .then(res => {
                if (res.ok) {
                    return res.json();
                } else {
                    throw new Error('Impossible de charger les données', { cause: res })
                }
            })
            .then(newData => {
                console.log("je récupère mes données api", newData)
                for(let i = 0; i < listProducts.length; i++) {
                    newProductData = newData.find(sameID => sameID._id === listProducts[i].id);
                    totalQuantity += parseInt(listProducts[i].quantity);
                    totalPrice += listProducts[i].quantity * newProductData.price;
                }
                
                console.log('prix total = ', totalPrice, 'quantité totale = ', totalQuantity)
                document.querySelector('#totalPrice').textContent = `${totalPrice}`;
                document.querySelector('#totalQuantity').textContent = `${totalQuantity}`;
            })
            .catch(e => {
                console.error('une erreur est survenue', e)
            });

    }
    let btnSubmit = document.querySelector('#order');
        btnSubmit.addEventListener('click', function(e) {

            let formInputs = {
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

            let basicRegExp =  new RegExp("[A-Za-zÀ-ÖØ-öø-ÿ -]")

            console.log(formInputs);

            if (formInputs.firstName == "") {
                let firstNameErrorMsg = document.querySelector('#firstNameErrorMsg');
                firstNameErrorMsg.textContent = errorMsg.firstName;
                e.preventDefault();
            } else if(basicRegExp.test(formInputs.firstName) == false) {
                firstNameErrorMsg.textContent = ('Le champ prénom accepte des lettres, des tirets et des espaces uniquement');
                e.preventDefault();
            }

            if (formInputs.lastName == "") {
                let lastNameErrorMsg = document.querySelector('#lastNameErrorMsg');
                lastNameErrorMsg.textContent = errorMsg.lastName;
            }

            if (formInputs.address == "") {
                let addressErrorMsg = document.querySelector('#addressErrorMsg');
                addressErrorMsg.textContent = errorMsg.address;
            }

            if (formInputs.city == "") {
                let cityErrorMsg = document.querySelector('#cityErrorMsg');
                cityErrorMsg.textContent = errorMsg.city;
            }

            if (formInputs.email == "") {
                let emailErrorMsg = document.querySelector('#emailErrorMsg');
                emailErrorMsg.textContent = errorMsg.email;
            }
 

        })
        
}

main();
