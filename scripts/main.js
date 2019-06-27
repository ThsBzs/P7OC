let map;



let vm = new Vue({
	el: '#parisBox',

	data: {
		shown : true,
		bienvenue: ''
	},

	methods: {
		initMap() {
        	map = new google.maps.Map(document.getElementById('map'), {
          	center: {lat: -34.397, lng: 150.644},
          	zoom: 8
        });
      	},
		hide(){
			this.shown == true? this.shown = false : this.shown = true;
			initMap();
		},

	}
})

