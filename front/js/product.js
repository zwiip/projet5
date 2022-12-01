/** ----------------------------------------------------------------------
 * Lié à product.html pour gérer l'affichage dynamique des pages produits
 * -----------------------------------------------------------------------
 */

/**
 * Permet de récuperer des informations concernant l'URL actuelle de la fenêtre
 */

const searchURL = window.location.search;
console.log(searchURL);

const getID = new URLSearchParams(searchURL);
console.log(getID);

const productID = getID.get('id')

/**
 * Appel de l'API selon l'id du produit sélectionné
 */
let pageProductAPI = fetch(`http://localhost:3000/api/products/${productID}`);
pageProductAPI.then(function (res) {
    if (res.ok) {
        return res.json();
    }
})
    .then(function (productData) {
        console.log("mon produit", productData);
        displayProductData(productData);
    })
    .catch(function (err) {
        console.log("impossible de charger la page produit", err)
    });

/**
 * Permet d'afficher dynamiquement les données produit dans les différents bloc de la page
 * @param {*} productData données détaillée du produit récupérée par l'API
 */
function displayProductData(productData) {
    const productImg = document.createElement('img');
    productImg.src = productData.imageUrl;
    productImg.alt = productData.altTxt;
    document.querySelector('div.item__img').append(productImg);

    const productName = productData.name;
    document.querySelector('#title').textContent = `${productName}`;
    document.querySelector('title').textContent = `${productName}`;

    const productPrice = productData.price;
    document.querySelector('#price').textContent = `${productPrice}`;

    const productDescription = productData.description;
    document.querySelector('#description').textContent = `${productDescription}`;

    /**
    * Permet de parcourir le tableau contenant les couleurs du produit et créer une option pour chacune.
    */
    const productColors = productData.colors;
    for (let i = 0; i < productColors.length; i++) {
        const option = document.createElement("option");
        option.value = productColors[i];
        option.textContent = productColors[i];
        document.querySelector('#colors').append(option);
    }
}

/** -----------------------------------------------------
* Gestion du panier
* ------------------------------------------------------
*/
/**
 * Permet d'écouter le click du bouton "ajouter au panier"
 * Vérifie si les données récupérées sont correctes pour déclencher l'ajout au panier ou d'alerter le cas échéant
 */
const button = document.querySelector('#addToCart');
button.addEventListener('click', function () {
    let colorsValue = document.querySelector('#colors').value;
    let quantityValue = document.querySelector('#quantity').value;

    if (colorsValue === "" || quantityValue <= 0 || quantityValue > 100) {
        alert('Veuillez renseigner une couleur et une quantité entre 1 et 100')
        return
    } else {
        getProducts();
    }
});

/**
 * Permet de vérifier le contenu du panier afin de créer le tableau du panier, ou l'objet ou d'incrémenter l'objet existant
 */
function getProducts() {
    colorsValue = document.querySelector('#colors').value;
    quantityValue = document.querySelector('#quantity').value;
    let addedProduct = {
        id: productID,
        color: colorsValue,
        quantity: Number(quantityValue)
    };
    console.log("je vérifie le type de quantity : ", typeof addedProduct.quantity);
    console.log("je vérifie le produit ajouté au panier", addedProduct)
    let listProducts = JSON.parse(localStorage.getItem("listProducts") || '[]');
    console.log("localStorage : ", listProducts);
    if (listProducts.length === 0) {
        console.log("le panier est vide")
        addProduct(listProducts, addedProduct);
    } else {
        console.log("il y a quelque chose dans le panier", listProducts)
        /**
 * Permet de chercher si le produit rajouté est déjà présent dans le panier
 * si oui --> incrémentation de la quantité
 * si non --> création de l'objet
 */
        let checkProduct = listProducts.find(isSameProduct => isSameProduct.id === addedProduct.id && isSameProduct.color === addedProduct.color)
        console.log(checkProduct);
        if (checkProduct) {
            parseInt(checkProduct.quantity += addedProduct.quantity);
            console.log("trouvé le même produit, je vérifie la quantité totale")
            if (checkProduct.quantity > 100) {
                alert("impossible d'ajouter plus de 100 références dans le panier");
                return
            } else {
                localStorage.setItem("listProducts", JSON.stringify(listProducts))
                console.log("c'est bon c'est incrémenté", listProducts)
                const confirmNewQuantity = window.confirm(
                    `Mise à jour de la quantité du produit déjà présent dans le panier ! 
                    OK pour voir votre panier
                    Annuler pour continuer vos achats.`)
                if(confirmNewQuantity) {
                    window.location.href = 'cart.html'
                }
            }
        } else {
            console.log("pas le même produit, donc création de la référence");
            addProduct(listProducts, addedProduct);
        }
    }
}

/**
 * ajoute le produit au panier
 * @param {*} listProducts liste des produits dans le local storage
 */
function addProduct(listProducts, addedProduct) {
    listProducts.push(addedProduct);
    localStorage.setItem("listProducts", JSON.stringify(listProducts))
    console.log("nouveau panier", listProducts)
    const confirmAdd = window.confirm(
        `Produit ajouté ! 
        OK pour voir votre panier
        Annuler pour continuer vos achats.`)
    if(confirmAdd) {
        window.location.href = 'cart.html'
    }
}


/**
 * NOTE DE TRAVAIL
 * panier = [productID, quantity, color]
 * localStorage
 *  need conversion json
 *      JSON.stringify convertir valeur javascript en chaine JSON
 *      JSON.parse conversion JSON à javascript
 *  méthodes :
 *      storage.key() renvoie le nom de la n-ième clé dans le stockage
 *      storage.getItem(nomclé) renvoie la valeur de la clé
 *      storage.setItem('nomclé', valeur) ajoute la paire clé / valeur dans le stockage, si existe déjà met à jour la valeur
 *      storage.removeItem('nomclé') supprime la clé du stockage
 *      storage.clear() supprime toutes les clés du stockage
 * if product (id&&color) <1 new product
 * if product (id&&color) >1 product ++
 */
