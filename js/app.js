var myFeature = {
    
        
        /*************************
                Google Map
        **************************/
    init: function(){
        myFeature.config = {
            findPix: "lagos, nigeria",
            farmId: 0,
            secretId: 0,
            serverId: 0,
            photoId: 0,
            results: [],
            geocoder: new google.maps.Geocoder(),
            mapOptions: {
                zoom: 15,
                center: new google.maps.LatLng(6.3456, 80),
                mapTypeId: 'roadmap'
            },
            infowindow: new google.maps.InfoWindow(),
            
            url: "https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=6bf279c5f9d9e36bea5b3fb83f7a44f6&tags=lagos,nigeria&has_geo=1&extras=geo&format=json&jsoncallback=?"

        };

        google.maps.event.addDomListener(window, 'load', myFeature.geo);
        $.getJSON(myFeature.config.url, {}, myFeature.favouritePix);
    },
            
    geo: function(){
        myFeature.config.map = new google.maps.Map(document.getElementById('map_canvas'), myFeature.config.mapOptions);
    },
    
    codeLatLng: function(lat, lng) {
                
        var latlng = new google.maps.LatLng(lat, lng);
        
        myFeature.config.geocoder.geocode({'latLng': latlng}, function(results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                if (results[1]) {
                    myFeature.config.map.setZoom(15);
                    myFeature.config.marker = new google.maps.Marker({
                        position: latlng,
                        map: myFeature.config.map
                    });
                    myFeature.config.infowindow.setContent(results[1].formatted_address);
                    myFeature.config.infowindow.open(myFeature.config.map, myFeature.config.marker);
                } 
                    else {
                    alert('No results found');
                }
            } 
            else {
              alert('Geocoder failed due to: ' + status);
            }

        });
    
    },

     /*************************
       Image Loaded by Default
      **************************/
   
    
    favouritePix: function(data){
       
       var lat, lng;
        myFeature.config.results = data.photos.photo;
              
        $.each(myFeature.config.results, function(index, result){

            myFeature.config.photoId = result.id;
            myFeature.config.farmId = result.farm;
            myFeature.config.serverId = result.server;
            myFeature.config.secretId = result.secret;
            lat = result.latitude;
            lng = result.longitude;
            
            if (typeof(myFeature.config.farmId) != 'undefined') {

                $('.jTscroller').append('<a class="location" href="#"><img src="https://farm'+ result.farm +'.staticflickr.com/'+ result.server +'/'+ result.id +'_'+ result.secret +'_q.jpg")"><input id="try" type="hidden" value="'+lat+', '+lng+'"></a>');
            };
        });

        //set up listeners for the location class
        myFeature.setupListeners();


    },

    pixSearch : function(){

        $('.jTscroller .location').remove();
        console.log("Am Alive");
        var lat, lng;

        myFeature.config.findPix = $('#term').val();   
        myFeature.config.url = "https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=6bf279c5f9d9e36bea5b3fb83f7a44f6&tags="+ myFeature.config.findPix +"&has_geo=1&extras=geo&format=json&jsoncallback=?";
        
        myFeature.config.myPix = function(data){
            
            myFeature.config.results = data.photos.photo;
            $.each( myFeature.config.results, function(index, result){
                
                lat = result.latitude;
                lng = result.longitude;
               
               if (typeof(myFeature.config.farmId) != 'undefined') {

                    $('.jTscroller').append('<a class="location" href="#"><img src="https://farm'+ result.farm +'.staticflickr.com/'+ result.server +'/'+ result.id +'_'+ result.secret +'_q.jpg")"><input id="try" type="hidden" value="'+lat+', '+lng+'"></a>');
                };
            });

            //set up listeners for the location class
            myFeature.setupListeners();
                    
        };

        $.getJSON(myFeature.config.url, {}, myFeature.config.myPix);
    },
    
    setupListeners: function(){
        $('#search').click(myFeature.pixSearch);    

        $('.location').click(function(){
            console.log("location clicked");
            var input = $(this).find('input[type="hidden"]').val();
            console.log(input);
            var latlngStr = input.split(',', 2);
            var lat = parseFloat(latlngStr[0]);
            var lng = parseFloat(latlngStr[1]);
                    
            myFeature.codeLatLng( lat, lng);
                // console.log("am a life" + lat, lng);
        });
    }    

           
};

$(document).ready(function(){
    myFeature.init();
});






    
