/* --- Javascript lié à index.html permettant d'afficher dynamiquement les liens vers les pages produits ---*/

/* Récupération des données de l'API, puis création des élements dans la page d'accueil grâce à une boucle for. */
const getData = fetch("http://localhost:3000/api/products");
    getData.then(function(res) {
        if (res.ok) {
            return res.json();
        }
    })
    .then(function(links) {
        console.log(links);
        for (let i = 0; i < links.length; i++) {
            
            const linkHome = document.createElement('a');
            document.querySelector('#items').append(linkHome);
            linkHome.href = ``;
            
            const linkArticle = document.createElement('article');
            linkHome.append(linkArticle);
            
            const linkImg = document.createElement('img');
            linkImg.src = links[i].imageUrl;
            linkImg.alt = links[i].altTxt;
            linkArticle.append(linkImg);

            const linkName = document.createElement('h3');
            linkName.classList.add('productName');
            linkName.innerText = links[i].name;
            linkArticle.append(linkName);
            
            const linkDescription = document.createElement('p');
            linkDescription.classList.add('productDescription');
            linkDescription.innerText = links[i].description;
            linkArticle.append(linkDescription);
        }
    })
    .catch(function(err) {
        console.log("une erreur est survenue")
    });


/* create element
avec la boucle for
document.querySelectorAll('a')
page d'accueil + 
url search param pour récuperer id sur detail produit
ajouter id avec point ? */