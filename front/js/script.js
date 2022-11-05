/* --- Javascript lié à index.html permettant d'afficher dynamiquement les liens vers les pages produits ---*/

/* Récupération des données de l'API, puis création des élements dans la page d'accueil grâce à une boucle for. */
let getData = async () => {
    await fetch("http://localhost:3000/api/products")
    .then(function(res) {
        if (res.ok) {
            return res.json();
        }
    })
    .then(function(links) {
        console.log(links);
        for (let i = 0; i < links.length; i++) {
            
            let linkHome = document.createElement('a');
            document.querySelector('#items').append(linkHome);
            homeLink.href = `#`;
            
            let linkArticle = document.createElement('article');
            document.querySelector(linkHome).append(linkArticle);
            
            let linkImg = document.createElement('img');
            linkImg.src = links[i].imageUrl;
            linkImg.alt = links[i].altTxt;
            document.querySelector(linkArticle).append(linkImg);

            let linkName = document.createElement('h3');
            linkName.classList.add('productName');
            linkName.innerText = links[i].name;
            document.querySelector(linkArticle).append(linkName);
            
            let linkDescription = document.createElement('p');
            linkName.classList.add('productDescription');
            linkName.innerText = links[i].description;
            document.querySelector(linkArticle).append(linkDescription);
        }
    })
    .catch(function(err) {
        console.log("une erreur est survenue")
    });
}

getData();



/* create element
avec la boucle for
document.querySelectorAll('a')
page d'accueil + 
url search param pour récuperer id sur detail produit
ajouter id avec point ?

class Product {
    constructor(colors, _id, name, price, imageUrl, description, altTxt) {
        this.colors = colors;
        this.id = id;
        this.name = name;
        this.price = price;
        this.imageUrl = imageUrl;
        this.description = description;
        this.altTxt = altTxt;
        }
    }

let products = [
    new Product(
        ''
    )
]*/

    