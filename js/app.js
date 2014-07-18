$("document").ready(function (){


	/*************************
		Google Map
	**************************/

	var geocoder;
	var map;
	var infowindow = new google.maps.InfoWindow();
	var marker;

	function initialize() {
	  geocoder = new google.maps.Geocoder();
		  
		  var latlng = new google.maps.LatLng(0, 90);
		  var mapOptions = {
		    zoom: 3,
		    center: latlng,
		    mapTypeId: 'roadmap'
		  }

		  map = new google.maps.Map(document.getElementById('map_canvas'), mapOptions);
		
	}
	
	function codeLatLng(lat, lng) {
		
		  var latlng = new google.maps.LatLng(lat, lng);
		
		  geocoder.geocode({'latLng': latlng}, function(results, status) {
		    if (status == google.maps.GeocoderStatus.OK) {
		      if (results[1]) {
		        map.setZoom(3);
		        marker = new google.maps.Marker({
		            position: latlng,
		            map: map

		        });

		        infowindow.setContent(results[1].formatted_address);
		        infowindow.open(map, marker);
		      } 
		      else {
		        alert('No results found');
		      }

		    } 
		    else {
		      alert('Geocoder failed due to: ' + status);
		    }

		  });

		}

		google.maps.event.addDomListener(window, 'load', initialize);


	/*************************
	  Image Loaded by Default
	**************************/

	var findPix = 'lagos';
	var results;
	var photoId;
	var farmId;
	var serverId;
	var secretId;

	

		// console.log('ayo');



		var url = "https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=6bf279c5f9d9e36bea5b3fb83f7a44f6&tags="+ findPix +"&has_geo=1&extras=geo&format=json&jsoncallback=?";

		var favouritePix = function(data){
			
			results = data.photos.photo;

			var lat, lng;
			
			$.each(results, function(index, result){

				 photoId = result.id;
				 farmId = result.farm;
				 serverId = result.server;
				 secretId = result.secret;
	              lat = result.latitude;
	              lng = result.longitude;

					if (typeof(farmId) != 'undefined') {

							$('.jTscroller').append('<a href="#" class="location"><img src="https://farm'+ result.farm +'.staticflickr.com/'+ result.server +'/'+ result.id +'_'+ result.secret +'_t.jpg")"><input id="try" type="hidden" value="'+lat+', '+lng+'"></a>');
							
					};
												            
		        });

				$('.location img').click(function(){
					  var input = document.getElementById('try').value;
					  var latlngStr = input.split(',', 2);
					  var lat = parseFloat(latlngStr[0]);
					  var lng = parseFloat(latlngStr[1]);
							
						codeLatLng( lat, lng);
							console.log("am a life");
					});

		};

		
		$.getJSON(url, {}, favouritePix);

	

	
	/**************************
		Search for Pictures
	***************************/

	var pixSearch = function(){
		
		 var findPix = $('#term').val();
		 

		 var url = "https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=6bf279c5f9d9e36bea5b3fb83f7a44f6&tags="+ findPix +"&has_geo=1&extras=geo&format=json&jsoncallback=?";

		var myPix = function(data){
			// console.log(data);
			results = data.photos.photo;

			$.each(results, function(index, result){
	           
	           
				// console.log(result.farm);
				

				$('.jTscroller').append('<img src="https://farm'+ result.farm +'.staticflickr.com/'+ result.server +'/'+ result.id +'_'+ result.secret +'_q.jpg")">');
				

				
	    
	        });
		};

		$.getJSON(url, {}, myPix);

	};

	$('#search').click(pixSearch);


	});






