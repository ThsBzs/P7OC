//*******************AJOUT DES RESTOS DEPUIS LE FICHIER JSON***********
// Create a script tag and set the USGS URL as the source.
/*let script = document.createElement('script');
script.src = './scripts/adress2.geojson';
document.getElementsByTagName('head')[0].appendChild(script);  

let moyenne;
window.eqfeed_callback = function(results) {
        for (let i = 0; i < results.features.length; i++) {
          let coords = results.features[i].geometry.coordinates;
          let latLng = new google.maps.LatLng(coords[0],coords[1]);
          let marker = new google.maps.Marker({
            position: latLng,
            map: map
          });
          function middle(elt){
          	let total = 0;
          	let ratings = [];
          	for(j=0; j<results.features[elt].properties.ratings.length; j++){
          		ratings.push(results.features[elt].properties.ratings[j].stars);
          		for(k=0; k<ratings.length; k++){
          			total += ratings[k];
          		};
          		let long = ratings.length;
          		moyenne = (total/long);
          	}
          	return moyenne;
          }
          middle(i);
          //Ajout de l'image avec Google Places, renvoie pour le moment une erreur 403, vois pourquoi
          $('#restoList').append('<!--<img src="https://maps.googleapis.com/maps/api/streetview?size=100x100&location='+ latLng + '&fov=90&heading=235&pitch=10&key=AIzaSyDkGfukLjq7KmPR1WR_McVxyGMTx_3UY34&signature=s4PAaqh25XbBrmpa-oys6hQRpC8= >--><li class="name">' + results.features[i].properties.restaurantName + '</li> <li>' + results.features[i].properties.address + '</li> <li>Note moyenne :' + moyenne + '</li>');
        }
      };*/
//*******************FIN DE L'AJOUT DES RESTOS DEPUIS JSON**************************