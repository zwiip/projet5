/**
 *  Javascript lié à index.html permettant d'afficher dynamiquement les liens vers les pages produits
 */
/**
 * Permet de récupérer les données de l'API, de vérifier que c'est bon et de mettre en forme dans un tableau
 * Permet de créer les différents éléments du lien de chaque produit et les répartir dans la page à partir des données de l'API
 */ 
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
 })
/**
* Permet de signaler si une erreur est apparue dans les fonctions précédentes
*/
 .catch(function(err) {
     console.log("une erreur est survenue")
 });


//tentative V2
/* function main() {
    try {
        const getData = fetch("http://localhost:3000/api/products");
        getData.then((res) => {
            if (res.ok) {
            const data = res.json();
            console.log(data)
            return data
            }
        })
    }
        catch(err) {
        console.log("une erreur est survenue")
        };
    
    function links(data) {
        console.log(links);
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
    };    
}
main();
links();*/


/**
 * NOTES DE TRAVAIL
 * document.querySelectorAll('a')
 * url search param pour récuperer id sur detail produit
 */