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
 * Permet d'afficher le bon produit selon son ID en modifiant l'id dans l'appel de l'API
 */
let pageProduct = fetch(`http://localhost:3000/api/products/${productID}`);
    pageProduct.then(function(res) {
        if (res.ok) {
            return res.json();
        }
    })
    .then(function(productData) {
        console.log(productData);
        
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
        function getColors(productColors) {
            for (let i = 0; i < productColors.length; i++) {
                const option = document.createElement("option");
                option.value = productColors[i];
                option.textContent = productColors[i];
                document.querySelector('#colors').append(option);
            }
        }
        getColors(productColors);    
    })
/**
 * Permet de signaler si une erreur est apparue dans les fonctions précédentes
 */
    .catch(function(err) {
        console.log("impossible de charger la page produit")
    });

/** -----------------------------------------------------
 * Gestion du panier
 * ------------------------------------------------------
 */
const button = document.querySelector('#addToCart');

button.addEventListener('click', function() {
    let colorsValue = document.querySelector('#colors').value;
    let quantityValue = document.querySelector('#quantity').value;
    
    if(colorsValue === "" || quantityValue <= 0) {
        alert('Veuillez renseigner la quantité et la couleur')
    }
    let addToCart = [
        productID,
        colorsValue,
        quantityValue
    ]
    console.log(addToCart);
    getProducts();

    function addFirstProduct() {
        listProducts = [];
        listProducts.push(addToCart);
        saveProducts(listProducts);
    }

    function getProducts() {
        let listProducts = localStorage.getItem("listProducts");
        if(listProducts == null) {
            console.log("le panier est vide")
            addFirstProduct();
        } else {
            return JSON.parse(listProducts);
            searchSameProduct();
        }
    }

    function saveProducts(listProducts) {
        localStorage.setItem("listProducts", JSON.stringify(listProducts))
    };

    function searchSameProduct(listProducts) {
        let checkProduct = listProducts.find(isSameProduct => isSameProduct.productID === addToCart.productID && isSameProduct.colorsValue === addToCart.colorsValue)
        console.log(checkProduct);
    }

});

/*let checkStorage = JSON.parse(localStorage.getItem("products"));
console.log(checkStorage);

function pushStorage() {
    checkStorage.push(addToCart);
    localStorage.setItem("products", JSON.stringify(checkStorage))
    console.log(`on pousse ${checkStorage}`);
}

if(checkStorage) {
    console.log('il y a quelque chose dans le panier')
    for (let i of checkStorage) {
        if (addToCart.productID === i.id && addToCart.colorsValue === i.colorsValue) {
            console.log('incrémentation');
            i.quantityValue += addToCart.quantityValue;
            console.log(checkStorage)
        } else {
            console.log('produit non présent');
            pushStorage();
        }
    }} else {
        console.log('le panier est vide')
        checkStorage = [];
        pushStorage();
    }      
}*/

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
