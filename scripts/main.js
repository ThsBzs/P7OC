import Dom from './dom.js';

let showHome = true,
  	showAbout =false,
  	showPartners = false,
  	pos,
  	map,
  	marker,
  	image = "./images/logo2Medium.png",
  	dom = new Dom;
//Premier appel de la fonction pour afficher le contenu dès l'ouverture de la page
dom.changeDomMap();
dom.changeDomText(showHome, showAbout, showPartners);

//Fonction d'initialisation de la carte
function initMap(){
	map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: 48.874955, lng: 2.350517},
      zoom: 15
    });
    return map;
};
initMap();//Appel de la carte

//Fonction de création de marqueurs sans Google Places
function createMarker(){
    marker = new google.maps.Marker({
        position: pos, 
        map: map,
        icon : image
    });
    markers.push(marker);
};

function createMarkerPlace(place){
	marker = new google.maps.Marker({
			map: map,
	    	position: place.geometry.location,
	    	icon : image,
	    	visible : false
		});
	markers.push(marker);
}


//Essai de fonction pour true/false
function trueFalse(){
  showHome = false;
  showAbout = false;
  showPartners = false;
  return true;
};

$('#home').click(function(e){
  $('#textBox').hide();
  $('#parisBox').show();
  e.preventDefault();
});

$('#about').click(function(e){
  showAbout = trueFalse();
  dom.changeDomText(showHome, showAbout, showPartners);
  e.preventDefault();
});

$('#partners').click(function(e){
  showPartners = trueFalse();
  dom.changeDomText(showHome, showAbout, showPartners);
  e.preventDefault();
});

//*************FONCTION DE MODIFICATION DE L'AFFICHAGE DOM***************************

 /*Gestion du clic sur le bouton de lancement*/
$('#textBox').on("click", "#begin", function(){
	$('#textBox').hide();
	$('#parisBox').show();
});

//Gestion du clic sur le bouton d'ajout
$('#parisBox').on("click", "#addNew", function(){
	$.each(markers, function() {
		this.setMap(null);
	});
 	$('#mapInfo').hide();
  	$('#form').show();
});

/********************GESTION DE LA CARTE*************************/
let geocoder;
//Création d'un array markers pour stocker les marqueurs positionnés et les effacer si besoin
let markers = [];

//*****************GESTION DE LA GEOLOCALISATION******************
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
          	pos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };
            $.each(markers, function() {
				this.setMap(null);
			});
            createMarker();
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

$('#sendFilter').click(function(e){
	$.each(markers, function() {
		this.setMap(null);
	});
	addPlaceMarkers();
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

//Gestion de l'ajout des marqueurs en fonction de la note désirée
function addPlaceMarkers(){
	markers = [];//Mise à 0 du tableau des marqueurs, permet d'afficher les éléments places
    //gestion de places autour du centre de la map
    let request = {//Requête passée en paramètre pour le callback de Places
    	location: map.center,
    	radius: '500',
    	type: ['restaurant']
  	};

  	let service = new google.maps.places.PlacesService(map);
  	service.nearbySearch(request, callback);//Appel du service places

	//Fonction d'ajout de marqueur sur chaque résultat renvoyé par places
	function callback(results, status) {
	  	if (status == google.maps.places.PlacesServiceStatus.OK) {
	  		$('#restoList').empty();
	    	for (let i = 0; i < results.length; i++) {
	    		//Ajout du filtre utilisateur
	      		createMarkerPlace(results[i]);
	      		if(filter.value <= results[i].rating){
	      			//Affichage des marqueurs correspondants au filtre
	      			markers[i].setVisible(true);
		      		let photo = results[i].photos;
		      		if (photo == undefined){
		      			photo = "./images/logo3_alt.png";
		      		} else {
		      			photo = results[i].vicinity;
		      		};
		      		dom.showResults(i, photo, results[i].name, results[i].vicinity, results[i].rating);
		      		let service = new google.maps.places.PlacesService(map);//Appel à Places pour showDetails
				    markers[i].addListener('click', function(){
				      	dom.showDetails(results[i], service);
					});
					//Ajout d'une animation sur les marqueurs lors du passage de la souris sur un résultat
					let list = document.getElementById(i);
					$(list).mouseover(function(){
						markers[i].setAnimation(google.maps.Animation.BOUNCE);
						setTimeout(function(){ markers[i].setAnimation(null); }, 750);
					});
					$(list).click(function(){
						dom.showDetails(results[i], service);
					});
					markers[i].addListener('mouseover', function(){
						$(list).css('background-color', '#ffff99');
					});
					markers[i].addListener('mouseout', function(){
						$(list).css("background-color", "");;
					});
	      		};//Fin du if pour le filtre de notes
	    	}//Fin de la boucle d'affichage des marqueurs
	  	} else {
	        // Browser doesn't support Geolocation
	        handleLocationError(false, marker, map.getCenter());
	    };
	    //Affichage d'un message si rien à afficher
		      		let check = document.getElementById('resultBox');
	  				if(check == null){
	      				$('#restoList').append(`<li>Désolé, aucun restaurant ne correspond à votre recherche.</li>
	      								<br>
	      								<li>Nous vous invitons à modifier le secteur ou la note.</li>`);
	  				};
	};//Fin du callback de places
};//Fin d'addPlaceMarkers

//***********************AJOUT / SUPPRESSION / MODIFICATION DES MARQUEURS************************************
//Ajout d'un marqueur sur la carte lors d'un clic
map.addListener('click', function(e){
	console.log(e.latLng);
	$('#mapInfo').hide();
    $('#form').show();
    pos = e.latLng;
    map.setCenter(pos);
    let image = "./images/logo2Medium.png";
  	createMarker();
    markers.push(marker);
    map.setCenter(pos);
})

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
function closeConfirm(){//Masquage du message de confirmation d'ajout
	$('#confirmAdd').hide();
	$('#mapInfo').show();
};

//Récupération des infos saisies dans le formulaire
let userRating, userComment;
$('#sendResto').click(function(e){
const userForm = document.getElementById('addForm');
	userRating = userForm.elements.stars.value;
	userComment = userForm.elements.comment.value;
  	$('#mapInfo').hide();
  	$('#confirmAdd').show()
  	$('#form').hide();
  	setTimeout(closeConfirm, 3000);
  	e.preventDefault();
});
//Masquage du formulaire si on veut annuler
$('#cancel').click(function(e){
	  $('#mapInfo').show();
  $('#form').hide();
});
//Options du formulaire d'ajout
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
				createMarkerPlace(results[0]);
				markers[0].setVisible(true);
				markers[0].addListener('click', function(){
					dom.showReview(result.vicinity, result.name, result.formatted_address, 'Restocalize', userRating, userComment);
				});
				$('#restoList').empty();
				dom.showResults(0, result.vicinity, result.name, result.vicinity, result.rating);//Affiche dans la liste
				$('#0').click(function(){
					dom.showReview(result.vicinity, result.name, result.formatted_address, 'Restocalize', userRating, userComment);//Ajoute la modale
				});
			};
		});
	};
	codeAdress();
});
