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
button.addEventListener('click', checkValues);
let colorsValue;
let quantityValue;

function checkValues() {
    colorsValue = document.querySelector('#colors').value;
    quantityValue = document.querySelector('#quantity').value;
    if (colorsValue === "") {
        alert('Veuillez sélectionner une couleur')
    }
    if (quantityValue <= 0) {
        alert('veuillez ajouter au moins 1 article')
    }
    let cart = [
        productID,
        colorsValue,
        quantityValue
    ]
    console.log(cart);
    return cart
};




/**
 * NOTE DE TRAVAIL
 * panier = [productID, quantity, color]
 * localStorage
 * if product (id&&color) <1 new product
 * if product (id&&color) >1 product ++
 */
