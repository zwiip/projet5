/* --- Javascript lié à index.html permettant d'afficher dynamiquement les liens vers les pages produits ---*/

/* Récupération des données de l'API, puis création des élements dans la page d'accueil grâce à une boucle for. */
fetch("http://localhost:3000/api/products")
    .then(function(res) {
        if (res.ok) {
            return res.json();
        }
    })
    .then(function(linksLayout) {
        console.log(linksLayout);
        const links = linksLayout;
        for (let link of links) {
            
            let linkHome = document.createElement('a');
            document.querySelector('.items').appendChild(linkHome);
            homeLink.href = ``;
            
            let linkArticle = document.createElement('article');
            linkHome.appendChild(linkArticle);
            
            let linkImg = document.createElement('img');
            linkImg.src = links[link].imageUrl;
            linkImg.alt = links[link].altTxt;
            linkArticle.appendChild(linkImg);

            let linkName = document.createElement('h3');
            linkName.classList.add('productName');
            linkName.innerText = links[link].name;
            linkArticle.appendChild(linkName);
            
            let linkDescription = document.createElement('p');
            linkName.classList.add('productDescription');
            linkName.innerText = links[link].description;
            linkArticle.appendChild(linkDescription);
        }
    })
    .catch(function(err) {
        console.log("une erreur est survenue")
    });


    /*

.then(function(createProductLink) {
    

    const imgLink = document.createElement('img');
    imgLink.src = createProductLink[i].imageUrl);

    
    console.log(createLinks[i].name);
    console.log(createLinks[i].description);
})
*/



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

    