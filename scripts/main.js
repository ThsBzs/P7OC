
$(function(){

let showHome = true,
	showAbout =false,
	showPartners = false;

//Premier appel de la fonction pour afficher le contenu dès l'ouverture de la page
changeDom();


$('#home').click(function(e){
	showHome = true;
	showAbout = false;
	showPartners = false;
	changeDom();
	e.preventDefault();
});

$('#about').click(function(e){
	showHome = false;
	showAbout =true;
	showPartners = false;
	changeDom();
	e.preventDefault();
});

$('#partners').click(function(e){
	showHome = false;
	showAbout =false;
	showPartners = true;
	changeDom();
	e.preventDefault();
});

function changeDom(){
if (showHome == true){
	$('#parisBox').empty().append(`<div class="col-lg-10 text-center" id="parisImg" v-if="showImgText">
			<div class="imgText">
				<h3>Bienvenue à Paris, capitale mondiale de la gastronomie.</h4>
				<p>Paris Restos vous propose de découvrir les meilleurs restaurants de la capitale, notés par nos utilisateurs, notés par VOUS. <br>
				Choisissez un secteur, nous vous proposerons les restaurants les plus proches. Vous pouvez par ailleurs contribuer à l'expérience en proposant de nouvelles adresses, qui seront vérifiées par les autres utilisateurs gourmets. <br>
				</p>
				<input type="button" class="btn btn-success" value="Commencer" id="begin">
			</div>
		</div>`);
} else if (showAbout == true){
	$('#parisBox').empty().append(`<div class="col-lg-10 text-center" id="about" v-if="showAbout">
			<p>A propos de Paris Restos : lorem ipsum...</p>
		</div>`);
} else if (showPartners == true){
	$('#parisBox').empty().append(`<div class="col-lg-10 text-center" id="partners" v-if="showPartners">
			<p>Nos partenaires : lorem ipsum...</p>
		</div>`);
};
};
 /*Gestion du clic sur le bouton de lancement*/
$('#begin').click(function(){
	$('#parisBox').empty().append(`<div id="explain">
			<p>Pour consulter les restaurants dans votre secteur, merci d'autoriser l'accès à la position ou la localisation pour votre navigateur. Promis, nous ne viendrons pas sonner chez vous ! <br>
			Vous pouvez filtrer les résultats en fonction des notes attribuées par nos utilisateurs.</p> 
			<br>
			<p>Si vous souhaitez ajouter un restaurant, cliquez sur "Ajouter", et laissez-vous guider.</p>
			<div id="map"></div>
			</div>`);
	initMap();

});


/********************GESTION DE LA CARTE*************************/
let map, infoWindow;

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
    	center: {lat: 48.874955, lng: 2.350517},
    	zoom: 12
    });
    infoWindow = new google.maps.InfoWindow;

    // Try HTML5 geolocation.
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
        	var pos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };

        	infoWindow.setPosition(pos);
        	infoWindow.setContent('Vous êtes (à peu près) ici');
        	infoWindow.open(map);
        	map.setCenter(pos);
        }, function() {
        	handleLocationError(true, infoWindow, map.getCenter());
        });
    } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter());
        }
    }

    function handleLocationError(browserHasGeolocation, infoWindow, pos) {
        infoWindow.setPosition(pos);
        infoWindow.setContent(browserHasGeolocation ?
                              'Error: The Geolocation service failed.' :
                              'Error: Your browser doesn\'t support geolocation.');
        infoWindow.open(map);
      }




})//Pas touche, fin de funtion jquery