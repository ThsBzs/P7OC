export default class Dom {
	//Méthode de modification du texte DOM
	changeDomText(showHome, showAbout, showPartners){
	  	if (showHome == true){
	  		$("#parisBox").hide();
		    $('#textBox').hide().empty().append(`<div class="col-lg-10 text-center" id="parisImg">
		        <div id="imgText">
		          <h3>Bienvenue !</h4>
		          <p>Restocalize vous propose de découvrir les meilleurs restaurants alentour, notés par nos utilisateurs, notés par VOUS. <br>
		          Choisissez un secteur, nous vous proposerons les restaurants les plus proches. Vous pouvez par ailleurs contribuer à l'expérience en proposant de nouvelles adresses, qui seront vérifiées par les autres utilisateurs gourmets. <br>
		          </p>
		          <input type="button" class="btn btn-info" value="Commencer" id="begin">
		        </div>
		      </div>`).show();
		} else if (showAbout == true){
			$("#parisBox").hide();
		    $('#textBox').hide().empty().append(`<div class="col-lg-10 text-center" id="about">
		        <p>A propos de Restocalize : lorem ipsum...</p>
		      </div>`).show();
	  	} else if (showPartners == true){
	  		$("#parisBox").hide();
	    	$('#textBox').hide().empty().append(`<div class="col-lg-10 text-center" id="partners">
	        	<p>Nos partenaires : lorem ipsum...</p>
	      	</div>`).show();
	  	};
	};

	//Méthode de modification du DOM map/liste
	changeDomMap(){
		$('#parisBox').hide().append(`<div id="explain" class="col-lg-12">
                    <p>Pour consulter les restaurants dans votre secteur, merci d'autoriser l'accès à la position ou la localisation pour votre navigateur. Promis, nous ne viendrons pas sonner chez vous !<br>
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
	                               			<input id="searchTextField" type="text" size="50" placeholder="Saisissez votre recherche" required>
	                              		</div>
	                              		<div class="form-group">
	                                		<label for="commentaire">Commentaire:</label>
	                                		<input type="text" class="form-control" id="comment" placeholder="Votre commentaire" required>
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
	                            		<input type="submit" class="btn btn-success" id="sendResto" value="Envoyer"></input>
	                            		<input type="button" class="btn btn-danger" id="cancel" value="Annuler"></input>
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
	}

	//Méthode d'affichage des resultats dans la liste de droite
	showResults(id, photo, name, vicinity, rating){
	$('#restoList').append(`<div class="container" id="resultBox">
								<div class="row" id="` + id +  `">
			    					<div class="col-lg-5">
			     						<img src="https://maps.googleapis.com/maps/api/streetview?size=200x200&location=` + photo + `&fov=90&heading=235&pitch=10&key=AIzaSyAIdFrOiY5BVNIG8Plbadd0Fpjfx7IueTo">
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

	//Méthode d'affichage des infos complémentaires en fenêtre modale
	showReview(photo, name, address, author, rating, text){
	$('#reviewMask').empty()
		.append(`<div class="container">
					<div class="row" id="reviewBox">
						<div class="col-lg-5">
							<img src="https://maps.googleapis.com/maps/api/streetview?size=200x200&location=`+ photo + `&fov=90&heading=235&pitch=10&key=AIzaSyAIdFrOiY5BVNIG8Plbadd0Fpjfx7IueTo">
						</div>
						<div class="col-lg-7">
							<ul>
								<li class="name">` + name + `</li> 
								<li>` + address + `</li> 
								<li>Auteur-e : ` + author + `</li>
								<li>Note : ` + rating + `</li>
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

	//Remplissage de la modale précédente
	showDetails(results, service){
		let self = this;
		let photo = results.photos;
		      		if (photo == undefined){
		      			photo = "./images/logo3_alt.png";
		      		} else {
		      			photo = results.vicinity;
		      		};
		let request2 = {
			placeId: results.place_id,
			fields: ['name', 'formatted_address', 'rating', 'review']
		};
		service.getDetails(request2, callback);
		function callback(place, status) {
			if (status == google.maps.places.PlacesServiceStatus.OK) {
				self.showReview(photo, place.name, place.formatted_address, place.reviews[0].author_name, place.reviews[0].rating, place.reviews[0].text);
			};
		};//Fin du callback getDetails
	};
}