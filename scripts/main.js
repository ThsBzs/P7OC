
$(function(){

let showHome = true,
  showAbout =false,
  showPartners = false;
//Premier appel de la fonction pour afficher le contenu dès l'ouverture de la page
changeDom();

//Essai de fonction pour true/false, ne marche pas
function trueFalse(){
  showHome = false;
  showAbout = false;
  showPartners = false;
  return true;
};

$('#home').click(function(e){
  showHome = trueFalse();
  changeDom();
  e.preventDefault();
});

$('#about').click(function(e){
  showAbout = trueFalse();
  changeDom();
  e.preventDefault();
});

$('#partners').click(function(e){
  showPartners = trueFalse();
  changeDom();
  e.preventDefault();
});

//*************FONCTION DE MODIFICATION DE L'AFFICHAGE DOM***************************
function changeDom(){
  if (showHome == true){
    $('#parisBox').hide().empty().append(`<div class="col-lg-10 text-center" id="parisImg">
        <div id="imgText">
          <h3>Bienvenue !</h4>
          <p>Restocalize vous propose de découvrir les meilleurs restaurants alentour, notés par nos utilisateurs, notés par VOUS. <br>
          Choisissez un secteur, nous vous proposerons les restaurants les plus proches. Vous pouvez par ailleurs contribuer à l'expérience en proposant de nouvelles adresses, qui seront vérifiées par les autres utilisateurs gourmets. <br>
          </p>
          <input type="button" class="btn btn-info" value="Commencer" id="begin">
        </div>
      </div>`).show();
  } else if (showAbout == true){
    $('#parisBox').hide().empty().append(`<div class="col-lg-10 text-center" id="about">
        <p>A propos de Restocalize : lorem ipsum...</p>
      </div>`).show();
  } else if (showPartners == true){
    $('#parisBox').hide().empty().append(`<div class="col-lg-10 text-center" id="partners">
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
                    <p>Si vous souhaitez ajouter un restaurant, cliquez sur "Ajouter" en bas de la liste, et laissez-vous guider.</p>
                    <div id="mapContainer" class="container">
                    	<div class = "row">
                    		<div id="filter">
                            	<form id="filterForm" class="form-inline">
                            		<div class="form-group">
                                		<label for="stars">Note minimum (sur 5):</label>
                              			<select class="form-control" id="filterStars">
                                			<option>1</option>
                                			<option>2</option>
                                			<option>3</option>
                                			<option>4</option>
                                			<option>5</option>
                              			</select>
									</div>
									<input type="button" class="btn btn-info" id="sendFilter" value="Valider"></input>
                            	</form>
                            </div>
                    	</div>
                      	<div class="row">
                        	<div id="map"class="col-lg-6"></div>
                        		<div class="col-lg-6" id="mapInfoContainer">
                          			<div id="mapInfo">
                           				<h5>Résultat(s) de la recherche :</h5>
                           				<div>
                             				<ul id="restoList"></ul>
                            			</div>
                           				<input type="button" class="btn btn-info" value="Ajouter" id="addNew">
                          			</div>
                          			<div id="form">
                            			<form id="addForm">
	                              			<div class="form-group">
	                                			<label>Addresse</label>
	                                			<input id="searchTextField" type="text" size="50" placeholder="Saisissez votre recherche">
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
	                            			<input type="button" class="btn btn-info" id="sendResto" value="Envoyer"></input>
                          				</form> 
                          			</div>
                          			<div id="confirmAdd">
                          				<p>Merci, votre avis a bien été ajouté !</p>
                          			</div>
                        		</div>
                      		</div>
                    	</div>
                  </div>`);
  $('#form').hide();
  $('#confirmAdd').hide();
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
            $.each(markers, function() {
				this.setMap(null);
			});
            let image = "./images/logo2Medium.png";
            marker = new google.maps.Marker({
            	position: pos, 
            	map: map,
            	icon : image
            });
            markers.push(marker);
          	map.setCenter(pos);
          	addPlaceMarkers();
        }, function() {
          	handleLocationError(true, marker, map.getCenter());
        });
    };
   
//Préparation du filtre utilisateur
const form = document.getElementById("filterForm");
let filter = form.elements.filterStars;
let isEmpty;
$('#sendFilter').click(function(e){
	$.each(markers, function() {
		this.setMap(null);
	});
	addPlaceMarkers();
	if (isEmpty == true){
	      			$('#restoList').append(`<li>Désolé, aucun restaurant ne correspond à votre recherche.</li>
	      										<br>
	      										<li>Peut-être pourriez-vous essayer de changer de secteur, ou de modifier la note minimum ?</li>`);
	      				console.log("rien à afficher");
	      			};
	e.preventDefault();
});

//Centrage de la carte sur la position de l'utilisateur si  autorisation = ok 
function handleLocationError(browserHasGeolocation, marker, pos) {
	let image = "./images/logo2Medium.png";
    marker = new google.maps.Marker({
            position: pos,
            map: map,
            icon: image
          });
    markers.push(marker);
    marker.setPosition(pos);
};

function createMarker(place) {
	//markers = [];
	let image = "./images/logo2Medium.png";
	let marker = new google.maps.Marker({
	    map: map,
	    position: place.geometry.location,
	    icon : image,
	    visible : false
	});
	markers.push(marker);
};

//Affichage des restos dans la liste de droite
function showResults(photo, name, vicinity, rating){
	$('#restoList').append(`<div class="container">
		      									<div class="row">
			    									<div class="col-lg-5">
			     										<img src="https://maps.googleapis.com/maps/api/streetview?size=200x200&location=` + photo + `&fov=90&heading=235&pitch=10&key=YOUR_KEY">
			     									</div>
			      									<div class="col-lg-7">
			      										<li class="name">` + name + `</li> 
			      										<li>` + vicinity + `</li> 
			      										<li>Note moyenne : ` + rating + `</li>
			      									</div>
			      									<br>
			      								</div>
			      								<br>
		      								</div>
		      								<br>`);
};
//Affichage des infos complémentaires
function showReview(photo, name, address, author, text){
	$('#reviewMask').empty()
		.append(`<div class="container">
					<div class="row" id="reviewBox">
						<div class="col-lg-5">
							<img src="https://maps.googleapis.com/maps/api/streetview?size=200x200&location=`+ photo + `&fov=90&heading=235&pitch=10&key=YOUR_KEY">
						</div>
						<div class="col-lg-7">
							<ul>
								<li class="name">` + name + `</li> 
								<li>` + address + `</li> 
								<li>Auteur-e : ` + author + `</li>
								<li>Commentaire(s) : ` + text + `</li>
							</ul>
						</div>
						<input type="submit" class="btn btn-info" id="closeReview" value="Fermer"></input>
						<br>
					</div>
					<br>
				</div>
				<br>`)
				.fadeIn();
	$('#closeReview').click(function(){
		$('#reviewMask').fadeOut();
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


	//Fonction d'ajout de marqueur sur chaque résultat renvoyé par places
	function callback(results, status) {
	  	if (status == google.maps.places.PlacesServiceStatus.OK) {
	  		$('#restoList').empty();
	    	for (let i = 0; i < results.length; i++) {
	    		isEmpty = true;
	    		//Ajout du filtre utilisateur
	    		isEmpty = false;
	      		createMarker(results[i]);
	      		if(filter.value <= results[i].rating){
	      			markers[i].setVisible(true);
		      		let photo = results[i].photos;
		      		if (photo == undefined){
		      			photo = "./images/logo3_alt.png";
		      		} else {
		      			photo = results[i].vicinity;
		      		};
		      		showResults(photo, results[i].name, results[i].vicinity, results[i].rating);
		      		//Ajout des informations complémentaires sur les marqueurs
				    markers[i].addListener('click', function(){
				      	let request2 = {
				      		placeId: results[i].place_id,
				      		fields: ['name', 'formatted_address', 'rating', 'review']
				      	};
				      	let service = new google.maps.places.PlacesService(map);
						service.getDetails(request2, callback);
						function callback(place, status) {
			  				if (status == google.maps.places.PlacesServiceStatus.OK) {
			    				showReview(place.name, place.formatted_address, place.reviews[0].author_name, place.reviews[0].text);
			  				};
						};//Fin du callback getDetails
					});//Fin du addListener sur les marqueurs
	      		};//Fin du if pour le filtre de notes
	    	}//Fin de la boucle d'affichage des marqueurs
	  	} else {
	        // Browser doesn't support Geolocation
	        handleLocationError(false, marker, map.getCenter());
	    };
	    return isEmpty;
	};//Fin du callback des marqueurs
};//Fin d'addPlaceMarkers

//***********************AJOUT / SUPPRESSION / MODIFICATION DES MARQUEURS************************************
//Appel des marqueurs
//addPlaceMarkers();
//Ajout d'un marqueur sur la carte lors d'un clic.FONCTIONNE
map.addListener('doubleclick', function(e){
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

//Suppression des marqueurs lors du déplacement de la carte et ajout des nouveaux avec places
map.addListener('dragend', function(){
	$.each(markers, function() {
		this.setMap(null);
	});
	addPlaceMarkers();
});

//Préparation d'ajout d'un marqueur sur adresse saisie
geocoder = new google.maps.Geocoder();
//Gestion du formulaire d'ajout d'adresse
let userRating, userComment;
$('#sendResto').click(function(e){
	const userForm = document.getElementById('addForm');
	userRating = userForm.elements.stars;
	userComment = userForm.elements.comment.value;
function closeConfirm(){
	$('#confirmAdd').hide();
	$('#mapInfo').show();
};
  $('#mapInfo').hide();
  $('#confirmAdd').show()
  $('#form').hide();
  setTimeout(closeConfirm, 3000);
  e.preventDefault();
});

let input = document.getElementById('searchTextField');
let options = {
	types : ['establishment'],
	componentRestrictions: {country: 'fr'},
	fields: ['place_id', 'name', 'formatted_address', 'vicinity', 'rating']
};

let autoComplete = new google.maps.places.Autocomplete(input, options);
autoComplete.addListener('place_changed', function(){
	let result = autoComplete.getPlace();
	function codeAdress(){
		geocoder.geocode({'placeId' : result.place_id}, function(results, status){
			if(status == 'OK'){
				markers = [];
				map.setCenter(results[0].geometry.location);
				createMarker(results[0]);
				markers[0].setVisible(true);
				markers[0].addListener('click', function(){
					showReview(result.vicinity, result.name, result.formatted_address, 'Restocalize', userComment);
				});
				showResults(result.vicinity, result.name, result.vicinity, result.rating);
			};
		});
	};
	codeAdress();
})

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
          $('#restoList').append('<!--<img src="https://maps.googleapis.com/maps/api/streetview?size=100x100&location='+ latLng + '&fov=90&heading=235&pitch=10&key=YOUR_KEY&signature=YOUR_SIGNATURE>--><li class="name">' + results.features[i].properties.restaurantName + '</li> <li>' + results.features[i].properties.address + '</li> <li>Note moyenne :' + moyenne + '</li>');
        }
      };*/
//*******************FIN DE L'AJOUT DES RESTOS DEPUIS JSON**************************

};//Pas touche, fin d'initMap
})//Pas touche, fin de function jquery