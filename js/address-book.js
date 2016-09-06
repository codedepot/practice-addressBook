var map;

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: -34.397, lng: 150.644},
    zoom: 8
  });
}
var geocoder;


function generateCord(address, callback){
  var lat, lng;
  if(geocoder === undefined){
    geocoder = new google.maps.Geocoder();
  }
  geocoder.geocode({'address': address}, function(results, status){
    if(status == "OK"){
      lat = results[0].geometry.location.lat();
      lng = results[0].geometry.location.lng();
      //console.log(lat +", " + lng);
      callback({'lat': lat, 'lng': lng});
    }else{
      console.log(status);
    }
  });
}

function testCall(position){
  console.log("Master caller " + position.lat + ", " + position.lng);
}
