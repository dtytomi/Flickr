var myApp = {
    
        
        /*************************
                Google Map
        **************************/
    init: function(){
        myApp.config = {
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

        google.maps.event.addDomListener(window, 'load', myApp.geo);
        $.getJSON(myApp.config.url, {}, myApp.favouritePix);
    },
            
    geo: function(){
        myApp.config.map = new google.maps.Map(document.getElementById('map_canvas'), myApp.config.mapOptions);
    },
    
    codeLatLng: function(lat, lng) {
                
        var latlng = new google.maps.LatLng(lat, lng);
        
        myApp.config.geocoder.geocode({'latLng': latlng}, function(results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                if (results[1]) {
                    myApp.config.map.setZoom(15);
                    myApp.config.marker = new google.maps.Marker({
                        position: latlng,
                        map: myApp.config.map
                    });
                    myApp.config.infowindow.setContent(results[1].formatted_address);
                    myApp.config.infowindow.open(myApp.config.map, myApp.config.marker);
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
        myApp.config.results = data.photos.photo;
              
        $.each(myApp.config.results, function(index, result){

            myApp.config.photoId = result.id;
            myApp.config.farmId = result.farm;
            myApp.config.serverId = result.server;
            myApp.config.secretId = result.secret;
            lat = result.latitude;
            lng = result.longitude;
            
            if (typeof(myApp.config.farmId) != 'undefined') {

                $('.jTscroller').append('<a class="location" href="#"><img src="https://farm'+ result.farm +'.staticflickr.com/'+ result.server +'/'+ result.id +'_'+ result.secret +'_q.jpg")"><input id="try" type="hidden" value="'+lat+', '+lng+'"></a>');
            };
        });

        //set up listeners for the location class
        myApp.setupListeners();


    },

    pixSearch : function(){

        $('.jTscroller .location').remove();
        console.log("Am Alive");
        var lat, lng;

        myApp.config.findPix = $('#term').val();   
        myApp.config.url = "https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=6bf279c5f9d9e36bea5b3fb83f7a44f6&tags="+ myApp.config.findPix +"&has_geo=1&extras=geo&format=json&jsoncallback=?";
        
        myApp.config.myPix = function(data){
            
            myApp.config.results = data.photos.photo;
            $.each( myApp.config.results, function(index, result){
                
                lat = result.latitude;
                lng = result.longitude;
               
               if (typeof(myApp.config.farmId) != 'undefined') {

                    $('.jTscroller').append('<a class="location" href="#"><img src="https://farm'+ result.farm +'.staticflickr.com/'+ result.server +'/'+ result.id +'_'+ result.secret +'_q.jpg")"><input id="try" type="hidden" value="'+lat+', '+lng+'"></a>');
                };
            });

            //set up listeners for the location class
            myApp.setupListeners();
                    
        };

        $.getJSON(myApp.config.url, {}, myApp.config.myPix);
    },
    
    setupListeners: function(){
        $('#search').click(myApp.pixSearch);    

        $('.location').click(function(){
            console.log("location clicked");
            var input = $(this).find('input[type="hidden"]').val();
            console.log(input);
            var latlngStr = input.split(',', 2);
            var lat = parseFloat(latlngStr[0]);
            var lng = parseFloat(latlngStr[1]);
                    
            myApp.codeLatLng( lat, lng);
                // console.log("am a life" + lat, lng);
        });
    }    

           
};

$(document).ready(function(){
    myApp.init();
});






    
