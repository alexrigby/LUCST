import fetchData from "/js/modules/universalFunctions.js";
import { cleanHru, getHru, updateHru } from "/js/modules/hru_dataFunctions.js";
import cleanPlant from "/js/modules/plantFunctions.js";
import cleanLanduse from "/js/modules/landuseFunctions.js";
import   shpToGeoJSON   from "/js/modules/mapFunctions.js"

// hru-data.hru:
// Fetch unclean dataset...
fetchData('/LLYFNI2/Scenarios/Default/TxtInOut/hru-data.hru')
    .then(data => {
        // Clean the dataset...
        const cleanHruData = cleanHru(data);
        // Saving a copy of the dataset
        const cleanHruDataCopy = [...cleanHruData];

        console.log(updateHru(cleanHruDataCopy, 2, 'rnge_lum'))
    });


// landuse.lum:
// Fetch unclean dataset...
fetchData('/LLYFNI2/Scenarios/Default/TxtInOut/landuse.lum')
    .then(data => {
        // Clean the dataset...
        const cleanLanduseData = cleanLanduse(data);
        // Saving a copy of the dataset
        const cleanLanduseDataCopy = [...cleanLanduseData];

        // Do something with the result...
        console.log(cleanLanduseDataCopy);
    });


// plant.ini:
// Fetch unclean dataset...
fetchData('/LLYFNI2/Scenarios/Default/TxtInOut/plant.ini')
    .then(data => {
        // Clean the dataset...
        const cleanPlantData = cleanPlant(data);
        // Saving a copy of the dataset
        const cleanPlantDataCopy = [...cleanPlantData];

        // Do something with the result...
        console.log(cleanPlantDataCopy);
    });




// leaflet.js

// Initialize the map and set its view to chosen coordinates, zoom, default layers
var mymap = L.map('mymap').setView([53.046775, -4.286951], 13, [streets]);
// adding a satelite layer
var satellite = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/satellite-v9',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1IjoiYWxleHJpZ2J5IiwiYSI6ImNra3V6ZHUxdjRkdGIycHF0OWY2MmY1MGoifQ.huw3PRhwLPINPzih4CGrhQ'
});
// adding a streetmap layer
var streets = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1IjoiYWxleHJpZ2J5IiwiYSI6ImNra3V6ZHUxdjRkdGIycHF0OWY2MmY1MGoifQ.huw3PRhwLPINPzih4CGrhQ'
}).addTo(mymap);
//calling function from mapFunctions.js to convert the ziped shape files into geoJSON files  
// only add HRUs2 (1 is 'Actual HRUs')
var shpfile1 = shpToGeoJSON('data/hru2.zip')
var shpfile2= shpToGeoJSON('data/rivs1.zip')

// adding the converted geoJSON files to the map#

shpfile1.addTo(mymap);
shpfile1.once("data:loaded", function () {
  console.log("finished loaded shapefile");
});


shpfile2.addTo(mymap);
shpfile2.once("data:loaded", function () {
  console.log("finished loaded shapefile");
});



// map layer objects 
var baseMaps = {
    "satelliet": satellite,
    "streets": streets
};

var overlayMaps = {
    "HRUs":shpfile1,
    "Rivers":shpfile2 
};


//leaflets.js function to add layers to map with a drop down selection list
L.control.layers(baseMaps, overlayMaps).addTo(mymap);




var selectfeature;
    var selected_features;	
	var latlng_area = [];
	var bounds;



// delete areas
	$("#delete-button").click(function(){
	  selectfeature.removeLastArea();
	});
	$("#delete-button-all").click(function(){
	  selectfeature.removeAllArea();
	});

	// disable select areafeature
	$("#disable-button").click(function(){
	  selectfeature.disable(); 
	});

	// get the layers of type polygon
	$("#get-button-features-polygon").click(function(){
	  selected_features = selectfeature.getFeaturesSelected( 'circle' );
	  selected_features = selectfeature.getFeaturesSelected( 'polygon' );
	selected_features = selectfeature.getFeaturesSelected( 'polyline' );
	  selected_features = selectfeature.getFeaturesSelected( 'rectangle' );
	  selected_features = selectfeature.getFeaturesSelected( 'marker' );
	 });

     // set colors for the selected polygon features
	 $("#set-color").click(function(){
	  if ( selected_features.length != 0 && selected_features.length >= 1 ) {
		for (i=0; i < selected_features.length; i++ ) {
	      selected_features[i].setStyle({fillColor: 'green', fillOpacity: 1 });
		  selected_features[i].setOpacity( 0.4 );
		selected_features[i].setStyle({ weight: 4 });
		}  
	  }	
	});
    
	//getlatlng of area
	$("#get-button-latlng").click(function(){
	  latlng_area = selectfeature.getAreaLatLng( );
	 });
	//showlatlng of area
	$("#show-button-latlng").click(function(){
	  alert(latlng_area);
	 });

	 
	// get the layers
	$("#get-button-features").click(function(){
	  selected_features = selectfeature.getFeaturesSelected( 'all' );
      console.log(selected_features);
	 });

	 // set the weight of the selected features if it is a lline
	 $("#set-line-weight").click(function(){
	  if ( selected_features.length != 0 && selected_features.length >= 1  ) {
		for (i=0; i < selected_features.length; i++ ) {
		  if (  selected_features[i] instanceof L.Polyline && !(selected_features[i] instanceof L.Polygon) && !(selected_features[i] instanceof L.Rectangle ) ){
	        selected_features[i].setStyle({ weight: 4 });
		  }	
		}  
	  }	
	});
	
	// enalbe plugin
	$("#enable-button").click(function(){
	  selectfeature = mymap.selectAreaFeature.enable();
	  
	  selectfeature.options.color = '#663399' ;
	  selectfeature.options.weight = 3 ;
	});