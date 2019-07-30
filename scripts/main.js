
$(function(){

let showHome = true,
  showAbout =false,
  showPartners = false;
//Premier appel de la fonction pour afficher le contenu dès l'ouverture de la page
changeDom();

//Essai de fonction pour true/false, ne marche pas
/*function trueFalse(elt){
  showHome = false;
  showAbout = false;
  showPartners = false;
  elt = true;
};*/

$('#home').click(function(e){
  /*trueFalse(showHome);*/
  showHome = true;
  showAbout = false;
  showPartners = false;
  changeDom();
  e.preventDefault();
});

$('#about').click(function(e){
  /*trueFalse(showAbout);*/
  showHome = false;
  showAbout =true;
  showPartners = false;
  changeDom();
  e.preventDefault();
});

$('#partners').click(function(e){
  /*trueFalse(showPartners);*/
  showHome = false;
  showAbout = false;
  showPartners = true;
  changeDom();
  e.preventDefault();
});

//*************FONCTION DE MODIFICATION DE L'AFFICHAGE DOM***************************
function changeDom(){
  if (showHome == true){
    $('#parisBox').hide().empty().append(`<div class="col-lg-10 text-center" id="parisImg" v-if="showImgText">
        <div id="imgText">
          <h3>Bienvenue !</h4>
          <p>Restocalize vous propose de découvrir les meilleurs restaurants alentour, notés par nos utilisateurs, notés par VOUS. <br>
          Choisissez un secteur, nous vous proposerons les restaurants les plus proches. Vous pouvez par ailleurs contribuer à l'expérience en proposant de nouvelles adresses, qui seront vérifiées par les autres utilisateurs gourmets. <br>
          </p>
          <input type="button" class="btn btn-info" value="Commencer" id="begin">
        </div>
      </div>`).show();
  } else if (showAbout == true){
    $('#parisBox').hide().empty().append(`<div class="col-lg-10 text-center" id="about" v-if="showAbout">
        <p>A propos de Restocalize : lorem ipsum...</p>
      </div>`).show();
  } else if (showPartners == true){
    $('#parisBox').hide().empty().append(`<div class="col-lg-10 text-center" id="partners" v-if="showPartners">
        <p>Nos partenaires : lorem ipsum...</p>
      </div>`).show();
  };
};

 /*Gestion du clic sur le bouton de lancement*/
$('#parisBox').on("click", "#begin", function(){
  $('#parisBox').hide().empty().append(`<div id="explain" class="col-lg-12">
                    <p>Pour consulter les restaurants dans votre secteur, merci d'autoriser l'accès à la position ou la localisation pour votre navigateur. Promis, nous ne viendrons pas sonner chez vous ! <br>
                    Vous pouvez filtrer les résultats en fonction des notes attribuées par nos utilisateurs.</p> 
                    <br>
                    <p>Si vous souhaitez ajouter un restaurant, cliquez sur "Ajouter", et laissez-vous guider.</p>
                    <div id="mapContainer" class="container">
                      <div class="row">
                        <div id="map"class="col-lg-6"></div>
                        <div class="col-lg-6" id="mapInfoContainer">
                          <div id="mapInfo">
                           <h5>Résultat de la recherche :</h5>
                           <div>
                             <ul id="restoList"></ul>
                            </div>
                           <input type="button" class="btn btn-info" value="Ajouter" id="addNew">
                          </div>
                          <div id="form">
                            <form id="addForm">
                              <div class="form-group">
                                <label>Addresse</label>
                                <input id="user_input_autocomplete_address" class="form-control" placeholder="Votre adresse...">
                              </div>
                              <div class="form-group">
                                <label for="Nom du restaurant">Nom:</label>
                                <input type="text" class="form-control" id="name" placeholder="Nom du restaurant">
                              </div>
                              <div class="form-group" id="toHide">
                                <label>street_number</label>
                                <input id="street_number" name="street_number" disabled>
                              </div>
                              <div class="form-group" id="toHide">
                                <label>route</label>
                                <input id="route" name="route" disabled>
                              </div>
                              <div class="form-group" id="toHide">
                                <label>locality</label>
                                <input id="locality" name="locality" disabled>
                              </div>
                              <div class="form-group" id="toHide">
                                <label>country</label>
                                <input id="country" name="country" disabled>
                              </div>
                              <div class="form-group">
                                <label for="commentaire">Commentaire:</label>
                                <input type="text" class="form-control" id="comment" placeholder="Votre commentaire">
                              </div>
                              <div class="form-group">
                                <label for="stars">Note:</label>
                              <select class="form-control" id="stars">
                                <option>1</option>
                                <option>2</option>
                                <option>3</option>
                                <option>4</option>
                                <option>5</option>
                              </select>
                            </div>
                              <button type="submit" class="btn btn-info" id="sendResto">Envoyer</button>
                          </form> 
                          <form>
                          </form>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>`);
  $('#form').hide();
  $('#parisBox').show();
  initMap();
});

//Gestion du clic sur le bouton d'ajout
$('#parisBox').on("click", "#addNew", function(){
  $('#mapInfo').hide();
  $('#form').show();
});

/********************GESTION DE LA CARTE*************************/
let map, infoWindow, marker, geocoder, address;
//Création d'un array markers pour stocker les marqueurs positionnés et les effacer si besoin
let markers = [];

//**************INITIALISATION DE LA CARTE******************
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: 48.874955, lng: 2.350517},
      zoom: 15
    });

//Ajoute 'map' sur tous les marqueurs pour pouvoir les supprimer au déplacement de la carte
function setMapOnAll(map) {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
    };
};

    
//*****************GESTION DE LA GEOLOCALISATION******************
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
          	let pos = {
              	lat: position.coords.latitude,
              	lng: position.coords.longitude
            };
            marker = new google.maps.Marker({
            	position: pos, map: map
            });
            markers.push(marker);
          	map.setCenter(pos);
        }, function() {
          	handleLocationError(true, marker, map.getCenter());
        });
    };
    
function addPlaceMarkers(){
	markers = [];//Mise à 0 du tableau des marqueurs, permet d'afficher les éléments places
    //gestion de places autour du centre de la map
    let request = {
    	location: map.center,
    	radius: '500',
    	type: ['restaurant']
  	};

  service = new google.maps.places.PlacesService(map);
  service.nearbySearch(request, callback);
	//Fonction utilisée pour ajouter des marqueurs 
	function createMarker(place) {
		//markers = [];
		let image = "./images/logo2Medium.png";
	    var marker = new google.maps.Marker({
	        map: map,
	        position: place.geometry.location,
	        icon : image
	        });
	    markers.push(marker);
	};
	//Fonction d'ajout de marqueur sur chaque résultat renvoyé par places
	function callback(results, status) {
	  	if (status == google.maps.places.PlacesServiceStatus.OK) {
	  		$('#restoList').empty();
	    	for (let i = 0; i < results.length; i++) {
	    		let place = results[i];
	      		createMarker(results[i]);
	      		/*let requestReview = {
	      			placeId : results[i].id,
	      			fields : ['name', 'formatted_address', 'rating', 'review']
	      		};*/
	      		
	      		//Préparation des infowindows
	      		let content = `<div class="container">
		      			<div class="row">
			      			<div class="col-lg-5">
			      				<img src=` + results[i].photos[0].getUrl({maxWidth: 200, maxHeight: 200}) + `>
			      			</div>
			      			<div class="col-lg-7">
			      				<li class="name">` + results[i].name + `</li> 
			      				<li>` + results[i].vicinity + `</li> 
			      				<li>Note moyenne : ` + results[i].rating + `</li>
			      			</div>
			      			<br>
			      		</div>
			      		<br>
		      		</div>
		      		<br>`;

	      		infoWindow = new google.maps.InfoWindow({
						content : content
					});
	      		//Ajout des infoWindows sur chaque marqueur
	      		markers[i].addListener('click', function(){
	      		/*	let request = {
	      				placeId: results[i].id,
	      				fields: ['name', 'formatted_address', 'rating', 'review']
	      			};
	      			service = new google.maps.places.PlacesService(map);
					service.getDetails(request, callback);

					function callback(place, status) {
  						if (status == google.maps.places.PlacesServiceStatus.OK) {
    						console.log(place, "OK");
    						console.log(request);
  						};
					};*/
					infoWindow.setContent(content);
					infoWindow.setPosition(markers[i].position);
					infoWindow.open(map, markers[i]);
				});

	      		$('#restoList').append(`<div class="container">
	      									<div class="row">
		      									<div class="col-lg-5">
		      										<img src="` + results[i].photos[0].getUrl({maxWidth: 200, maxHeight: 200}) + `">
		      									</div>
		      									<div class="col-lg-7">
		      										<li class="name">` + results[i].name + `</li> 
		      										<li>` + results[i].vicinity + `</li> 
		      										<li>Note moyenne : ` + results[i].rating + `</li>
		      									</div>
		      									<br>
		      								</div>
		      								<br>
	      								</div>
	      								<br>`);
	    	}
	    	//console.log(results[0]);
	  	} else {
	        // Browser doesn't support Geolocation
	        handleLocationError(false, marker, map.getCenter());
	    }
	};//PAS TOUCHE, fin du callback des marqueurs

	
	
};

//***********************AJOUT / SUPPRESSION / MODIFICATION DES MARQUEURS************************************
//Appel des marqueurs
addPlaceMarkers();
//Ajout d'un marqueur sur la carte lors d'un clic.FONCTIONNE
map.addListener('click', function(e){
    $('#mapInfo').hide();
    $('#form').show();
    let pos = e.latLng;
    map.setCenter(pos);
    let image = "./images/logo2Medium.png";
    let marker = new google.maps.Marker({
	    map: map,
	    position: pos,
	    icon: image
  	});
  	markers.push(marker);
    map.setCenter(pos);
});

//Fermeture des infowindows ouvertes lors du déplacement de la carte
map.addListener('dragstart', function(){
	infoWindow.close();
});
//Suppression des marqueurs lors du déplacement de la carte et ajout des nouveaux avec places
map.addListener('dragend', function(){
	$.each(markers, function() {
		this.setMap(null);
	});
	addPlaceMarkers();
});
//Préparation d'ajout d'un marqueur sur adresse saisie
geocoder = new google.maps.Geocoder();
//Fonction de codage en latLng
//Gestion du formulaire d'ajout d'adresse
$('#parisBox').on("click", "#sendResto", function(e){
  const addInfo = [addForm.elements.name.value, addForm.elements.address.value, addForm.elements.code.value, addForm.elements.city.value, addForm.elements.comment.value, addForm.elements.stars.value];
  address = (addInfo[1] + ' ' + addInfo[2] + ', ' + addInfo[3]);
  codeAddress(geocoder, map);
  $('#restoList').append('<li>' + addInfo + '</li>' );
  $('#form').hide();
  $('#mapInfo').show();
  e.preventDefault();
});


//Gestion du clic sur les marqueurs


//*******************AJOUT DES RESTOS DEPUIS LE FICHIER JSON -- FONCTIONNE -- A CONSERVER POUR LA SUITE***********
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
          		console.log("ratings=" + ratings);
          		for(k=0; k<ratings.length; k++){
          			total += ratings[k];
          		};
          		let long = ratings.length;
          		moyenne = (total/long);
          		console.log("moyenne = " + moyenne);
          	}
          	return moyenne;
          }
          middle(i);
          //Ajout de l'image avec Google Places, renvoie pour le moment une erreur 403, vois pourquoi
          $('#restoList').append('<!--<img src="https://maps.googleapis.com/maps/api/streetview?size=100x100&location='+ latLng + '&fov=90&heading=235&pitch=10&key=YOUR_KEY&signature=YOUR_SIGNATURE >--><li class="name">' + results.features[i].properties.restaurantName + '</li> <li>' + results.features[i].properties.address + '</li> <li>Note moyenne :' + moyenne + '</li>');
        }
      };*/
//*******************FIN DE L'AJOUT DES RESTOS DEPUIS JSON**************************


//Fonction codeAdress pour l'affichage du marker sur l'adresse saisie FONCTIONNE, PAS TOUCHE !
function codeAddress(geocoder, map) {
    geocoder.geocode({'address': address}, function(results, status) {
        if (status === 'OK') {
            map.setCenter(results[0].geometry.location);
            let image = "./images/logo2Medium.png";
            let marker = new google.maps.Marker({
              map: map,
              position: results[0].geometry.location,
              icon: image
            });
            markers.push(marker);
        } else {
            alert('Geocode was not successful for the following reason: ' + status);
        }
    });
};

//Centrage de la carte sur la position de l'utilisateur si  autorisation = ok FONCTIONNE
function handleLocationError(browserHasGeolocation, marker, pos) {
	let image = "./images/logo2Medium.png";
    marker = new google.maps.Marker({
            position: pos,
            map: map,
            icon: image
          });
    markers.push(marker);
    marker.setPosition(pos);
    marker.open(map);
};

};//Pas touche, fin d'initMap
//Déplacement de tous les éléments post-initMap pour accéder à google.blabla partout

})//Pas touche, fin de funtion jquery

