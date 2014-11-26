var map;
var infowindow;

function initialize() {
  var pos = new google.maps.LatLng(46.487577733987045, 10.466382026672363);
  var mapOptions = {
	zoom: 5,
	center: pos
  };
  var map = new google.maps.Map(document.getElementById('map-canvas'),
	  mapOptions);

  // get user's geolocation
  if(navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function(position) {
		  pos = new google.maps.LatLng(position.coords.latitude,
										   position.coords.longitude);
		  map.setCenter(pos);
		  var marker = new google.maps.Marker({
		      position: pos,
		      map: map,
		      title: 'your position'
		  });
		  map.setZoom(12);
		}, function() {
		  alert('Please activate GPS');
		});
	} else {
		// Browser doesn't support Geolocation
		alert('Browser doesn\'t support Geolocation!');
  }		  
}


google.maps.event.addDomListener(window, 'load', initialize);