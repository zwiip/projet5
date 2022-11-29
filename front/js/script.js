/**
 *  Javascript lié à index.html permettant d'afficher dynamiquement sur la page d'accueil les liens vers les pages produits
 */
/**
 * Permet de récupérer les données de l'API
 */
function main() {
    const getData = fetch("http://localhost:3000/api/products");
    getData.then(function (res) {
        if (res.ok) {
            return res.json();
        }
    })
        .then(function (links) {
            console.log(links);
            createLinks(links);
        })
        .catch(function (err) {
            console.log("une erreur est survenue", err)
        });

/**
 * Permet d'afficher les différents produits sur la page en bouclant sur les données reçues de l'API
 * @param {Array(8)} links tableau d'objets récupéré par l'appel API
 */
    function createLinks(links) {
        for (let i = 0; i < links.length; i++) {

            const linkHome = document.createElement('a');
            document.querySelector('#items').append(linkHome);
            linkHome.href = `./product.html?id=${links[i]._id}`;

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
    }
}

main();