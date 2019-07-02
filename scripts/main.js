
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
	showAbout = false;
	showPartners = true;
	changeDom();
	e.preventDefault();
});

function changeDom(){
if (showHome == true){
	$('#parisBox').hide().empty().append(`<div class="col-lg-10 text-center" id="parisImg" v-if="showImgText">
			<div class="imgText">
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
$('#begin').click(function(){
	$('#parisBox').hide().empty().append(`<div id="explain" class="col-lg-12">
										<p>Pour consulter les restaurants dans votre secteur, merci d'autoriser l'accès à la position ou la localisation pour votre navigateur. Promis, nous ne viendrons pas sonner chez vous ! <br>
										Vous pouvez filtrer les résultats en fonction des notes attribuées par nos utilisateurs.</p> 
										<br>
										<p>Si vous souhaitez ajouter un restaurant, cliquez sur "Ajouter", et laissez-vous guider.</p>
										<div id="mapContainer" class="container">
											<div class="row">
												<div id="map"class="col-lg-6"></div>
												<div class="col-lg-6" id="mapInfoContainer">
													<h5>Restaurants trouvés :</h5>
													<div id="mapInfo"></div>
													<input type="button" class="btn btn-info" value="Ajouter" id="addNew">
												</div>
											</div>
										</div>
									</div>`).show();
	initMap();

});

//Gestion du clic sur le bouton d'ajout
$('#parisBox').on("click", "#addNew", function(){
	$('#mapInfoContainer').hide().empty().append(` <form id="addForm">
  														<div class="form-group">
  														  <label for="Nom du restaurant">Nom:</label>
  														  <input type="text" class="form-control" id="name">
  														</div>
  														<div class="form-group">
  														  <label for="numéro">Numéro:</label>
  														  <input type="text" class="form-control" id="number">
  														</div>
  														<div class="form-group">
  														  <label for="rue">Rue:</label>
  														  <input type="text" class="form-control" id="street">
  														</div>
  														<div class="form-group">
  														  <label for="code">Code Postal:</label>
  														  <input type="text" class="form-control" id="code">
  														</div>
  														<div class="form-group">
  														  <label for="ville">Ville:</label>
  														  <input type="text" class="form-control" id="city">
  														</div>
  														<div class="form-group">
  														  <label for="commentaire">Commentaire:</label>
  														  <input type="text" class="form-control" id="comment">
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
  														<button type="submit" class="btn btn-info">Submit</button>
													</form> `
		).show();
	console.log("pouet");
});

/********************GESTION DE LA CARTE*************************/
let map, infoWindow;

//**************INITIALISATION DE LA CARTE******************
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
    	center: {lat: 48.874955, lng: 2.350517},
    	zoom: 12
    });
    infoWindow = new google.maps.InfoWindow;

//*****************GESTION DE LA GEOLOCALISATION******************
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

 /*   map.data.loadGeoJson(
      '../scripts/adress.json');*/

}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
                              'Erreur de géolocalisation.' :
                              'Erreur: votre navigateur n\'accepte pas la géolocalisation.');
    infoWindow.open(map);
}



})//Pas touche, fin de funtion jquery