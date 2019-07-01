let map = window.map = new Vue({
	el: '#map',

	data:{

	},

	methods: {
		initMap() {
        	map = new google.maps.Map(document.getElementById('map'), {
          	center: {lat: -34.397, lng: 150.644},
          	zoom: 8
        	});
      	},
	}
	
});

/*essai de composants*/
Vue.component('explain', {
	/*props: ['type'],*/
	template: `<div>
			<p>Pour consulter les restaurants dans votre secteur, centrez la carte sur votre position, ou renseignez une adresse, puis validez. <br>
			Vous pouvez filtrer les résultats en fonction des notes attribuées par nos utilisateurs.</p> 
			<br>
			<p>Si vous souhaitez ajouter un restaurant, cliquez sur "Ajouter", et laissez-vous guider.</p>
			</div>`
})

Vue.component('homepage', {
	/*props: ['type'],*/
	template: `<div>
			<h3>Bienvenue à Paris, capitale mondiale de la gastronomie.</h4>
				<p>Paris Restos vous propose de découvrir les meilleurs restaurants de la capitale, notés par nos utilisateurs, notés par VOUS. <br>
				Choisissez un secteur, nous vous proposerons les restaurants les plus proches. Vous pouvez par ailleurs contribuer à l'expérience en proposant de nouvelles adresses, qui seront vérifiées par les autres utilisateurs gourmets. <br>
				</p>
				<input type="button" class="btn btn-success" value="Commencer" @click.prevent="hide()" @click.prevent="map.initMap()">
			</div>`
})

let vm = new Vue({
	el: '#parisBox',
	/*components: {explain},*/

	data: {
		showImgText : true,
		showAbout: false,
		showPartners: false,
		showHome: true,
		bienvenue: ''
	},

	methods: {
		
		hide(){
			this.showImgText == true? this.showImgText = false : this.showImgText = true;
			showHome = true;
			map.initMap();
		},
		showPageHome(){
			if (showHome == true){
				showAbout = false;
				showPartners = false;
			};
		},
		showPageAbout(){
			console.log("clickAbout");
			if (showAbout == true){
				showPartners = false;
				showImgText = false;
			};
		},
		showPagePartners(){
			console.log("clickPartners");
			if (showPartners == true){
				showAbout = false;
				showImgText = false;
			};
		},

	}
})

