import Dom from './dom.js';

let showHome = true,//Trois variables pour gérer l'affichage DOM
  	showAbout =false,
  	showPartners = false,
  	pos,//Trois variables Gmaps
  	map,
  	marker,
  	geocoder,//Variable pour coder les adresses
	markers = [],//array de stockage des marqueurs positionnés
  	image = "./images/logo2Medium.png",//Logo Restocalize
  	dom = new Dom;//Appel du Dom
//Premier appel de la fonction pour afficher le contenu dès l'ouverture de la page
dom.changeDomMap();//Charge la carte
dom.changeDomText(showHome, showAbout, showPartners);//Charge le Dom

//***********************GESTION DE L'AFFICHAGE DOM*********************
//Fonction true/false pour affichage Dom
function trueFalse(){
  showHome = false;
  showAbout = false;
  showPartners = false;
  return true;
};

//Selon le clic, on affiche le contenu
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

//Gestion du clic sur le bouton "Commencer"
$('#textBox').on("click", "#begin", function(){
	$('#textBox').hide();//Masquage de l'intro
	$('#parisBox').show();//Apparition carte + liste
});

//Gestion du clic sur le bouton d'ajout
$('#parisBox').on("click", "#addNew", function(){
	$.each(markers, function() {//Masquage des marqueurs présents
		this.setMap(null);
	});
 	$('#mapInfo').hide();//Masquage de la liste des restos
  	$('#form').show();//Apparition du formulaire
});


//****************INITIALISATION CARTE ET MARQUEURS*****************
//Fonction d'initialisation de la carte
function initMap(){
	map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: 48.874955, lng: 2.350517},
      zoom: 15
    });
    return map;
};
initMap();//Appel de la carte

//Création de marqueurs sans Google Places
function createMarker(){
    marker = new google.maps.Marker({
        position: pos, 
        map: map,
        icon : image
    });
    markers.push(marker);
};
//La même chose, AVEC Places
function createMarkerPlace(place){
	marker = new google.maps.Marker({
			map: map,
	    	position: place.geometry.location,
	    	icon : image,
	    	visible : false
		});
	markers.push(marker);
};


//*****************GESTION DE LA GEOLOCALISATION******************
    if (navigator.geolocation) {//Si geolocalication = OK
        navigator.geolocation.getCurrentPosition(function(position) {
          	pos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };
            $.each(markers, function() {//Masquage des marqueurs présents
				this.setMap(null);
			});
            createMarker();//Ajout d'un nouveau marqueur sur la position
            markers.push(marker);
          	map.setCenter(pos);//Centrage de la certe
          	addPlaceMarkers();//Ajout des marqueurs alentour
        });
    } else {
    	pos = map.center;
    	createMarker();
    	$('#restoList').append(`<li>La <géolocalisation n'a pas fonctionné.</li>
	      								<br>
	      								<li>La carte a été centrée par défaut au 10, Cité Paradis, Paris.</li>`);
    };
   
//Préparation du filtre utilisateur
const form = document.getElementById("filterForm");
let filter = form.elements.filterStars;

$('#sendFilter').submit(function(e){
	$.each(markers, function() {//Masquage des marqueurs
		this.setMap(null);
	});
	addPlaceMarkers();//Ajout des nouveaux
	e.preventDefault();
});

//*************************UTILISATION PRINCIPALE*************************
//Gestion de l'ajout/masquage des marqueurs en fonction de la note désirée
function addPlaceMarkers(){
	markers = [];//Mise à 0 du tableau des marqueurs, permet d'afficher les éléments places
    //Requête passée en paramètre pour le callback de Places
    let request = {
    	location: map.center,
    	radius: '500',//500 mètres autour du centre
    	type: ['restaurant']//Limitation au type resto
  	};

  	let service = new google.maps.places.PlacesService(map);
  	service.nearbySearch(request, callback);//Appel du service places

	//Fonction d'ajout de marqueur sur chaque résultat renvoyé par places
	function callback(results, status) {
	  	if (status == google.maps.places.PlacesServiceStatus.OK) {//Si tout roule
	  		$('#restoList').empty();//Vidange de la liste
	  		//Boucle sur chaque resultat renvoyé par Places
	    	for (let i = 0; i < results.length; i++) {
	      		createMarkerPlace(results[i]);//Marqueurs initialisés non visibles
	      		//Affichage des marqueurs correspondants au filtre
	      		if(filter.value <= results[i].rating){
	      			markers[i].setVisible(true);
		      		let photo = results[i].vicinity;
		      		if (photo == null){//Si pas d'image, on ajoute le logo
		      			photo = "./images/logo3_alt.png";
		      		};
		      		dom.showResults(i, photo, results[i].name, results[i].vicinity, results[i].rating);
		      		let service = new google.maps.places.PlacesService(map);//Appel à Places pour showDetails
		      		//Affichage des infos au click sur un marqueur
				    markers[i].addListener('click', function(){
				      	dom.showDetails(results[i], service);
					});
					//Ajout d'une animation sur les marqueurs lors du passage de la souris sur un résultat
					let list = document.getElementById(i);
					$(list).mouseover(function(){
						markers[i].setAnimation(google.maps.Animation.BOUNCE);
						setTimeout(function(){ markers[i].setAnimation(null); }, 750);
					});
					//Affichage des infos au click sur un resto
					$(list).click(function(){
						dom.showDetails(results[i], service);
					});
					//Coloration du background sur le resto correspondant dans la liste
					markers[i].addListener('mouseover', function(){
						$(list).css('background-color', '#ffff99');
					});
					markers[i].addListener('mouseout', function(){
						$(list).css("background-color", "");;
					});
	      		};//Fin du if pour le filtre de notes
	    	}//Fin de la boucle d'affichage des marqueurs
	  	};
	    //Message si rien à afficher
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
